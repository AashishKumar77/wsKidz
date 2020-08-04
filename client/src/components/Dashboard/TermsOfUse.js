import React from 'react'
import moment from 'moment'
import { Link } from 'react-router-dom'
import { handleResponse } from '../../helpers/handleResponse'
import { authHeader } from '../../helpers/authHeader'
import TermOfUseViewModal from './Modal/TermOfUseViewModal'

class TermsOfUse extends React.Component {
   state = {
      terms: []
   }
   deleteItem = id => {
      let confirmDelete = window.confirm('Are you sure you want to delete this terms of use?')
      if (confirmDelete) {
         const requestOptions = {
            method: 'DELETE',
            headers: { ...authHeader(), 'Content-Type': 'application/json' }
         };
         fetch('/terms-of-use/delete/' + id + ' ', requestOptions).then(handleResponse)
            .then(item => {
               this.deleteItemFromState(id)
            }).catch(err => console.log(err))
      }
   }
   getTermsOfUse() {
      const requestOptions = {
         method: 'GET',
         headers: authHeader(),
      };
      fetch("/terms-of-use/get", requestOptions)
         .then(handleResponse)
         .then(data => {
            if (typeof data !== 'undefined' && data.terms.length > 0) {
               let terms = data.terms
               this.setState({ terms })
            }
         }, error => {
            console.log(error)
         })
   }
   //remove item form tr td 
   deleteItemFromState = (id) => {
      const updatedTerms = this.state.terms.filter(term => term.id !== id)
      this.setState({ terms: updatedTerms })
   }
   componentDidMount() {
      this.getTermsOfUse()
   }

   render() {
      return (
         <>
            <div id="wrapper">
               <div id="page-wrapper">
                  <div className="container-fluid">
                     <div className="row bg-title">
                        <div className="col-lg-3 col-md-4 col-sm-4 col-xs-12">
                           <h4 className="page-title">Terms of use</h4>
                        </div>
                        <div className="col-lg-9 col-sm-8 col-md-8 col-xs-12">
                           <ol className="breadcrumb">
                              <li><Link to="/dashboard">Dashboard</Link></li>
                              <li className="active">TermsOfUse</li>
                           </ol>

                        </div>
                     </div>
                     <div className="row">
                        <div className="col-lg-12">
                           <Link className="btn btn-primary pull-right m-b-20" to="/terms-of-use-create">
                              ADD TERMSOFUSE
                              </Link>
                           <div className="clearfix"></div>
                        </div>
                     </div>
                     <div className="row">
                        <div className="col-md-12 col-lg-12 col-sm-12">
                           <div className="white-box">
                              <div className="table-responsive">
                                 <div className="white-box">
                                    <div className="table-responsive">
                                       <table className="table">
                                          <thead>
                                             <tr>
                                                <th>Version</th>
                                                <th>Date</th>
                                                <th>Actions</th>
                                             </tr>
                                          </thead>
                                          <tbody>
                                             {this.state.terms.map((term) => (
                                                <tr key={term.id}>
                                                   <td>
                                                      {term.version}
                                                   </td>
                                                   <td>
                                                      <i className="fa fa-clock-o"></i> {moment(term.createdAt).format('LL')}
                                                   </td>
                                                   <td>
                                                      <TermOfUseViewModal data={term.term_conditions} />
                                                      {" "}
                                                      <button type="button" onClick={() => this.deleteItem(term.id)} className="btn btn-default btn-circle">
                                                         <i className="fa fa-trash"></i>
                                                      </button>
                                                   </td>
                                                </tr>
                                             ))}
                                          </tbody>
                                       </table>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>

                  </div>
               </div>
            </div>
         </>
      )
   }
}


export default TermsOfUse

