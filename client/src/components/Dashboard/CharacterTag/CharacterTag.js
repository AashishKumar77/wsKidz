import React from 'react'
import { Link } from 'react-router-dom'
import { handleResponse } from '../../../helpers/handleResponse'
import { authHeader } from '../../../helpers/authHeader'
import CharacterTagModal from '../Modal/CharacterTagModal'
import CharacterTagDataTable from './CharacterTagDataTable'

class CharacterTag extends React.Component {
   state = {
      items: []
   }
   getValueTag() {
      const requestOptions = {
         method: 'GET',
         headers: authHeader(),
      };
      fetch("/charactertags", requestOptions)
         .then(handleResponse)
         .then(data => {
            if (typeof data !== 'undefined') {
               let items = data.tags
               this.setState({ items })
            }
         }, error => {
            console.log(error)
         })
   }
   addCharityToState = (item) => {
      this.setState(prevState => ({
         items: [item, ...prevState.items]
      }))
   }
   updateState = (item) => {
      const itemIndex = this.state.items.findIndex(data => data.id === item.id)
      const newArray = [
         // destructure all items from beginning to the indexed item
         ...this.state.items.slice(0, itemIndex),
         // add the updated item to the array
         item,
         // add the rest of the items to the array from the index after the replaced item
         ...this.state.items.slice(itemIndex + 1)
      ]
      this.setState({ items: newArray })
   }
   deleteItemFromState = (id) => {
      const updatedItems = this.state.items.filter(item => item.id !== id)
      this.setState({ items: updatedItems })
   }
   componentDidMount() {
      this.getValueTag()
   }
   render() {
      return (
         <>
            <div id="page-wrapper">
               <div className="container-fluid">
                  <div className="row bg-title">
                     <div className="col-lg-3 col-md-4 col-sm-4 col-xs-12">
                        <h4 className="page-title">CHARACTER TAGS</h4>
                     </div>
                     <div className="col-lg-9 col-sm-8 col-md-8 col-xs-12">
                        <ol className="breadcrumb">
                           <li><Link to="/dashboard">Dashboard</Link></li>
                           <li className="active">Character Tags</li>
                        </ol>

                     </div>
                  </div>
                  <div className="row">
                     <div className="col-lg-12">
                        <CharacterTagModal
                           buttonLabel="ADD CHARACTER TAG"
                           addCharityToState={this.addCharityToState} />
                        <div className="clearfix"></div>
                        <CharacterTagDataTable
                           items={this.state.items}
                           updateState={this.updateState}
                           deleteItemFromState={this.deleteItemFromState} />
                     </div>
                  </div>

               </div>
            </div>
         </>
      )
   }
}

export default CharacterTag