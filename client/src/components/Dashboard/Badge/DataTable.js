import React from 'react'
import moment from 'moment'
import { handleResponse } from '../../../helpers/handleResponse'
import { authHeader } from '../../../helpers/authHeader'
import BadgeModal from '../Modal/BadgeModal'

class DataTable extends React.Component {
   deleteBadge = id => {
      let confirmDelete = window.confirm('Are you sure you want to delete this badge?')
      if (confirmDelete) {
         const requestOptions = {
            method: 'DELETE',
            headers: { ...authHeader(), 'Content-Type': 'application/json' }
         }
         fetch('/badge/delete/' + id + '', requestOptions)
            .then(handleResponse)
            .then(data => {
               this.props.deleteBadgesFromState(id)
            }).catch(err => console.log(err))
      }
   }
   activeInactiveTag = id => {
      const requestOptions = {
         method: 'PUT',
         headers: { ...authHeader(), 'Content-Type': 'application/json' }
      };
      fetch('/badge/active/inactive/' + id + ' ', requestOptions)
         .then(handleResponse)
         .then(item => {
            this.props.updateState(item.status)
         }).catch(err => console.log(err))
   }
   render() {
      const { badges } = this.props
      return (
         <>
            <div className="white-box">
               <div className="table-responsive">
                  <table className="table">
                     <thead>
                        <tr>
                           <th>Badge Icon</th>
                           <th>Badge Title</th>
                           <th>Badge Point</th>
                           <th>Date</th>
                           <th width="15%">Status</th>
                           <th>Actions</th>
                        </tr>
                     </thead>
                     <tbody>
                        {badges.map((badge) => (
                           <tr key={badge.id}>
                              <td>
                                 <img src={badge.icon_url ? badge.icon_url : require('../../../images/profile/dummy.jpg')}
                                    alt="badge" width="40" height="40" />
                              </td>
                              <td>{badge.name}</td>
                              <td>{badge.points}</td>
                              <td>
                                 <span className="text-muted">
                                    <i className="fa fa-clock-o"></i> {moment(badge.createdAt).format('LL')}
                                 </span>
                              </td>
                              <td>
                                 {
                                    badge.status === 1
                                       ? (<div className="label label-table label-success"
                                          onClick={() => this.activeInactiveTag(badge.id)}
                                          style={{ cursor: 'pointer' }}>Active</div>)
                                       : (<div className="label label-table label-danger"
                                          onClick={() => this.activeInactiveTag(badge.id)}
                                          style={{ cursor: 'pointer' }}>Inactive</div>)
                                 }
                              </td>
                              <td>
                                 <BadgeModal
                                    buttonLabel="Edit"
                                    badge={badge}
                                    updateState={this.props.updateState} />
                                 {' '}
                                 <button type="button" onClick={() => this.deleteBadge(badge.id)} className="btn btn-default btn-circle">
                                    <i className="fa fa-trash"></i>
                                 </button>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
         </>
      )
   }
}

export default DataTable