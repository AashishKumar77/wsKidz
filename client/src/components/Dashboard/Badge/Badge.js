import React from 'react'
import { Link } from 'react-router-dom'
import { authHeader } from '../../../helpers/authHeader'
import { handleResponse } from '../../../helpers/handleResponse'
import DataTable from './DataTable'
import BadgeModal from '../Modal/BadgeModal'


class Badge extends React.Component {
   state = {
      badges: []
   }
   getBadges() {
      const requestOptions = {
         method: 'GET',
         headers: authHeader()
      }
      fetch('/badges/get', requestOptions)
         .then(handleResponse)
         .then(data => {
            if (data.badges.length > 0) {
               let badges = data.badges
               this.setState({ badges })
            }
         }, error => {
            console.log(error)
         })
   }
   addBadgesToState = (badge) => {
      this.setState(prevState => ({
         badges: [badge, ...prevState.badges]
      }))
   }
   updateState = (badge) => {
      const itemIndex = this.state.badges.findIndex(data => data.id === badge.id)
      const newArray = [
         // destructure all items from beginning to the indexed item
         ...this.state.badges.slice(0, itemIndex),
         // add the updated item to the array
         badge,
         // add the rest of the items to the array from the index after the replaced item
         ...this.state.badges.slice(itemIndex + 1)
      ]
      this.setState({ badges: newArray })
   }
   deleteBadgesFromState = (id) => {
      const updatedBadges = this.state.badges.filter(badge => badge.id !== id)
      this.setState({ badges: updatedBadges })
   }
   componentDidMount() {
      this.getBadges()
   }
   render() {
      return (
         <>
            <div id="page-wrapper">
               <div className="container-fluid">
                  <div className="row bg-title">
                     <div className="col-lg-3 col-md-4 col-sm-4 col-xs-12">
                        <h4 className="page-title">BADGES</h4>
                     </div>
                     <div className="col-lg-9 col-sm-8 col-md-8 col-xs-12">
                        <ol className="breadcrumb">
                           <li><Link to="/dashboard">Dashboard</Link></li>
                           <li className="active">Badges</li>
                        </ol>

                     </div>
                  </div>
                  <div className="row">
                     <div className="col-lg-12">
                        <BadgeModal
                           buttonLabel="ADD NEW BADGE"
                           addBadgesToState={this.addBadgesToState} />
                        <div className="clearfix"></div>
                        <DataTable
                           badges={this.state.badges}
                           updateState={this.updateState}
                           deleteBadgesFromState={this.deleteBadgesFromState} />
                     </div>
                  </div>

               </div>
            </div>
         </>
      )
   }
}

export default Badge