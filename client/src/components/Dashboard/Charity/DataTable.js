import React, { Component } from 'react'
import moment from 'moment';
import CharityModal from '../Modal/CharityModal'
import { authHeader } from '../../../helpers/authHeader'
import { handleResponse } from '../../../helpers/handleResponse'


class DataTable extends Component {
   deleteItem = id => {
      let confirmDelete = window.confirm('Are you sure you want to delete this charity?')
      if (confirmDelete) {
         const requestOptions = {
            method: 'DELETE',
            headers: { ...authHeader(), 'Content-Type': 'application/json' }
         };
         fetch('/charity/delete/' + id + ' ', requestOptions).then(handleResponse)
            .then(item => {
               this.props.deleteItemFromState(id)
            }).catch(err => console.log(err))
      }
   }
   activeInactiveTag = id => {
      const requestOptions = {
         method: 'PUT',
         headers: { ...authHeader(), 'Content-Type': 'application/json' }
      };
      fetch('/charity/active/inactive/' + id + ' ', requestOptions)
         .then(handleResponse)
         .then(item => {
            this.props.updateState(item.status)
         }).catch(err => console.log(err))
   }
   render() {
      const { items } = this.props
      return (
         <>
            <div className="white-box">
               <div className="table-responsive">
                  <table className="table">
                     <thead>
                        <tr>
                           <th>Charity Icon</th>
                           <th>Charity Title</th>
                           <th>Short Description</th>
                           <th>Date</th>
                           <th width="15%">Status</th>
                           <th>Actions</th>
                        </tr>
                     </thead>
                     <tbody>
                        {typeof items !== 'undefined' ? items.map((tag, index) => (
                           <tr key={tag.id}>
                              <td>
                                 <img src={tag.image ? tag.image : require('../../../images/profile/dummy.jpg')}
                                    alt="tags" width="40" />
                              </td>
                              <td>{tag.name}</td>
                              <td>{tag.short_description}</td>
                              <td>
                                 <span className="text-muted">
                                    <i className="fa fa-clock-o"></i> {moment(tag.createdAt).format('LL')}
                                 </span>
                              </td>
                              <td>
                                 {
                                    tag.status === 1
                                       ? (<div className="label label-table label-success" onClick={() => this.activeInactiveTag(tag.id)}
                                          style={{ cursor: 'pointer' }}>Active</div>)
                                       : (<div className="label label-table label-danger" onClick={() => this.activeInactiveTag(tag.id)}
                                          style={{ cursor: 'pointer' }}>Inactive</div>)
                                 }
                              </td>
                              <td>
                                 <CharityModal
                                    buttonLabel="Edit"
                                    item={tag}
                                    updateState={this.props.updateState} />
                                 {' '}
                                 <button type="button" onClick={() => this.deleteItem(tag.id)} className="btn btn-default btn-circle">
                                    <i className="fa fa-trash"></i>
                                 </button>
                              </td>
                           </tr>
                        )) : ''}
                     </tbody>
                  </table>
               </div>
            </div>
         </>
      )
   }
}

export default DataTable