import React from 'react';
import { history } from '../../helpers/history'
import { Redirect, Link } from 'react-router-dom'
import { connect } from 'react-redux';
import { loginAction } from '../../actions/Login/loginAction';
import { alertActions } from '../../actions/Alert/alertActions';
// import ImageLoader from '../Loader/ImageLoader';

class ResetPassword extends React.Component {
   constructor(props) {
      super(props)
      let token = localStorage.getItem('token')
      let isLogin = true
      if (token === null) {
         isLogin = false
      }
      this.state = {
         otp: "", password: "", confirm_password: "",
         otpErr: "", passwordErr: "", cpasswordErr: "", isLogin
      }
      history.listen((location, action) => {
         this.props.clearAlerts()
      })
   }
   validateInput = () => {
      let otpErr, passwordErr, cpasswordErr = ''
      if (!this.state.otp) {
         otpErr = "Otp field is required."
      }
      if (!this.state.password) {
         passwordErr = "New password field is required."
      } else if (this.state.password.length < 6) {
         passwordErr = "New password must be 6 characters long."
      }
      if (!this.state.confirm_password) {
         cpasswordErr = "Confirm password field is required."
      } else if (this.state.password.length < 6) {
         cpasswordErr = "Confirm password must be 6 characters long."
      }
      if (otpErr || passwordErr || cpasswordErr) {
         this.setState({ otpErr, passwordErr, cpasswordErr })
         return false
      }
      return true
   }
   handleSubmit = (e) => {
      e.preventDefault()
      this.setState({ otpErr: '', passwordErr: '', cpasswordErr: '' })
      let isValid = this.validateInput()
      if (isValid) {
         let userId = localStorage.getItem("user_id")
         const { otp, password, confirm_password } = this.state
         if (userId && otp && password && confirm_password) {
            this.props.setPassword(userId, otp, password, confirm_password)
         }
      }
   }

   render() {
      if (this.state.isLogin) {
         return <Redirect to="/dashboard" />
      }
      const { alert } = this.props
      return (
         <>
            <section id="wrapper" className="new-login-register">
               <div className="lg-info-panel">
                  <div className="inner-panel">
                     <div className="lg-content">
                        <img src={require('../../images/img/logo.png')} alt="logo" width={100} />
                        <h2>Wise Kid</h2>
                     </div>
                  </div>
               </div>
               <div className="new-login-box">
                  <div className="white-box">
                     {alert.message && <div className={`alert text-center ${alert.type}`}>{alert.message}</div>}
                     <h3 className="box-title m-b-0">Set Password</h3>
                     <small>Enter your details below</small>
                     <form className="form-horizontal new-lg-form" onSubmit={this.handleSubmit} id="loginform" >
                        <div className="form-group  m-t-20">
                           <div className="col-xs-12">
                              <label>Enter Otp</label>
                              <input
                                 type="text" name="otp" placeholder="Enter otp"
                                 className="form-control"
                                 onChange={(e) => { this.setState({ otp: e.target.value }) }}
                              />
                              <p style={{ color: '#ca3938' }}>{this.state.otpErr}</p>
                           </div>
                        </div>

                        <div className="form-group">
                           <div className="col-xs-12">
                              <label>New Password</label>
                              <input
                                 type="password" name="password" placeholder="New password"
                                 className="form-control"
                                 onChange={(e) => { this.setState({ password: e.target.value }) }}
                              />
                              <p style={{ color: '#ca3938' }}>{this.state.passwordErr}</p>
                           </div>
                        </div>
                        <div className="form-group">
                           <div className="col-xs-12">
                              <label>Confirm Password</label>
                              <input
                                 type="password" name="confirm_password" placeholder="Confirm Password"
                                 className="form-control"
                                 onChange={(e) => { this.setState({ confirm_password: e.target.value }) }}
                              />
                              <p style={{ color: '#ca3938' }}>{this.state.cpasswordErr}</p>
                           </div>
                        </div>

                        <div className="form-group">
                           <div className="col-md-12">
                              <div className="checkbox checkbox-info pull-left p-t-0">
                                 <input id="checkbox-signup" type="checkbox" />
                                 {/* <label htmlFor="checkbox-signup"> Remember me </label> */}
                              </div>
                              {/* <a
                                 href="javascript:void(0)"
                                 id="to-recover"
                                 className="text-dark pull-right"
                              >
                                 <i className="fa fa-lock m-r-5" />      Forgot pwd?</a> */}
                              <Link to="/" id="to-recover" className="text-dark pull-right">
                                 Back to login?</Link>
                           </div>
                        </div>
                        <div className="form-group text-center m-t-20">
                           <div className="col-xs-12">
                              <button
                                 className="btn btn-primary btn-lg btn-block btn-rounded text-uppercase waves-effect waves-light"
                                 type="submit"
                              >
                                 Save
            </button>
                           </div>
                        </div>
                     </form>
                  </div>
               </div>
            </section>
            {/* <div className="container">
               <div className="row" id="login">
                  <div className="col-md-12">
                     <div><h3><center>Set New Password</center></h3></div>
                     <br />
                     {alert.message && <div className={`alert text-center ${alert.type}`}>{alert.message}</div>}
                     <form className="form-horizontal form-material" onSubmit={this.handleSubmit}>
                        <div className="form-group">
                           <div className="col-md-12">
                              <input
                                 type="text" name="otp" placeholder="Enter otp"
                                 className="form-control"
                                 onChange={(e) => { this.setState({ otp: e.target.value }) }}
                              />
                              <p style={{ color: '#ca3938' }}>{this.state.otpErr}</p>
                           </div>
                        </div>
                        <div className="form-group">
                           <div className="col-md-12">
                              <input
                                 type="password" name="password" placeholder="New password"
                                 className="form-control"
                                 onChange={(e) => { this.setState({ password: e.target.value }) }}
                              />
                              <p style={{ color: '#ca3938' }}>{this.state.passwordErr}</p>
                           </div>
                        </div>
                        <div className="form-group">
                           <div className="col-md-12">
                              <input
                                 type="password" name="confirm_password" placeholder="Confirm Password"
                                 className="form-control"
                                 onChange={(e) => { this.setState({ confirm_password: e.target.value }) }}
                              />
                              <p style={{ color: '#ca3938' }}>{this.state.cpasswordErr}</p>
                           </div>
                        </div>
                        <div className="form-group">
                           <div className="col-sm-12">
                              <button type="submit" className="btn btn-success">Save</button>
                              <Link to="/" className="pull-right">Back to login?</Link>
                           </div>
                        </div>
                     </form>
                  </div>
               </div>
            </div> */}
         </>
      );
   }
}


const mapStateToProps = state => {
   const { setpasswordrequest } = state.setPasswordReducer
   const { alert } = state
   return { setpasswordrequest, alert }
}

const actionCreators = {
   setPassword: loginAction.setPassword,
   clearAlerts: alertActions.clear
}

export default connect(mapStateToProps, actionCreators)(ResetPassword)
