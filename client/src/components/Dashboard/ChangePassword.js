import React from 'react'
import { Modal, ModalHeader, ModalBody } from 'reactstrap'
import { connect } from 'react-redux'
import { alertActions } from '../../actions/Alert/alertActions'
import { profileAction } from '../../actions/Dashboard/profileAction'

class ChangePassword extends React.Component {
   constructor(props) {
      super(props)
      this.state = {
         old_password: '', new_password: '', confirm_password: '', modal: false,
         oldPassErr: '', newPassErr: '', confPassErr: ''
      }
   }

   toggle = () => {
      if (!this.state.modal) {
         // reset the error and success messages on close
         this.props.clearAlerts()
         this.setState({
            old_password: '', new_password: '', confirm_password: '',
            oldPassErr: '', newPassErr: '', confPassErr: ''
         })
      }
      this.setState(prevState => ({
         modal: !prevState.modal
      }))
   }

   validateInput = () => {
      let oldPassErr, newPassErr, confPassErr = ''
      if (!this.state.old_password) {
         oldPassErr = "Old password field is required."
      }
      if (!this.state.new_password) {
         newPassErr = "New password field is required."
      } else if (this.state.new_password.length < 6) {
         newPassErr = "New password must be 6 characters long."
      }
      if (!this.state.confirm_password) {
         confPassErr = "Confirm password field is required."
      } else if (this.state.confirm_password.length < 6) {
         confPassErr = "Confirm password must be 6 characters long."
      }
      if (oldPassErr || newPassErr || confPassErr) {
         this.setState({ oldPassErr, newPassErr, confPassErr })
         return false
      }
      return true
   }
   handleSubmit = (e) => {
      e.preventDefault()
      this.setState({ oldPassErr: '', newPassErr: '', confPassErr: '' })
      let isValid = this.validateInput()
      if (isValid) {
         const { old_password, new_password, confirm_password } = this.state
         if (old_password && new_password && confirm_password) {
            this.props.changePassword(old_password, new_password, confirm_password, this.toggle)
         }
      }

   }
   render() {
      const { alert } = this.props
      const closeBtn = <button className="close" onClick={this.toggle}>&times;</button>
      return (
         <>
            {/* <span className="dropdown-item" > */}
            <li className="dropdown-item" onClick={this.toggle}>{this.props.buttonLabel}</li>
            <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className} >
               <ModalHeader toggle={this.toggle} close={closeBtn}
                  cssModule={{ 'modal-title': 'w-100 text-center' }}>Change Password</ModalHeader>
               <ModalBody>

                  <div className="row">
                     <div className="col-md-12 col-xs-12">
                        <div className="white-box">
                           {alert.message && <div className={`alert text-center ${alert.type}`}>{alert.message}</div>}
                           <form className="form-horizontal new-lg-form" onSubmit={this.handleSubmit}>
                              <div className="form-group m-t-20">
                                 <div className="col-xs-12">
                                    <label>Old Password</label>
                                    <input
                                       type="password" name="old_password" placeholder="Enter old password"
                                       className="form-control"
                                       onChange={(e) => { this.setState({ old_password: e.target.value }) }}
                                    />
                                    <p style={{ color: '#ca3938' }}>{this.state.oldPassErr}</p>
                                 </div>
                              </div>
                              <div className="form-group">
                                 <div className="col-xs-12">
                                    <label>New Password</label>
                                    <input
                                       type="password" name="new_password" placeholder="Enter new password"
                                       className="form-control"
                                       onChange={(e) => { this.setState({ new_password: e.target.value }) }}
                                    />
                                    <p style={{ color: '#ca3938' }}>{this.state.newPassErr}</p>
                                 </div>
                              </div>
                              <div className="form-group">
                                 <div className="col-xs-12">
                                    <label>Confirm Password</label>
                                    <input
                                       type="password" name="confirm_password" placeholder="Enter confirm password"
                                       className="form-control"
                                       onChange={(e) => { this.setState({ confirm_password: e.target.value }) }}
                                    />
                                    <p style={{ color: '#ca3938' }}>{this.state.confPassErr}</p>
                                 </div>
                              </div>
                              <div className="form-group text-center m-t-20">
                                 <div className="col-xs-12">
                                    <button
                                       className="btn btn-primary btn-rounded text-uppercase pull-right"
                                       type="submit"
                                    >Change</button>
                                 </div>
                              </div>
                           </form>
                        </div>
                     </div>
                  </div>

               </ModalBody>
            </Modal>
         </>
      )
   }
}

const mapStateToProps = state => {
   const { isRequesting } = state.changePasswordReducer
   const { alert } = state
   return { isRequesting, alert }
}
const actionCreators = {
   changePassword: profileAction.changePassword,
   clearAlerts: alertActions.clear
}


export default connect(mapStateToProps, actionCreators)(ChangePassword)