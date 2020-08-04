import React from 'react';
import { history } from '../../helpers/history'
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { loginAction } from '../../actions/Login/loginAction';
import { alertActions } from '../../actions/Alert/alertActions';
// import ImageLoader from '../Loader/ImageLoader';

class ForgotPassword extends React.Component {
   constructor(props) {
      super(props)
      let token = localStorage.getItem('token')
      let isLogin = true
      if (token === null) {
         isLogin = false
      }
      this.state = { email: "", emailErr: "", isLogin }
      history.listen((location, action) => {
         this.props.clearAlerts()
      })
   }
   validateEmail(email) {
      const re = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return re.test(email)
   }
   validateInput = () => {
      let emailErr = ''
      if (!this.state.email) {
         emailErr = "Email is required."
      } else if (!this.validateEmail(this.state.email)) {
         emailErr = "Invalid email address."
      }
      if (emailErr) {
         this.setState({ emailErr })
         return false
      }
      return true
   }
   handleSubmit = (e) => {
      e.preventDefault()
      this.setState({ emailErr: '' })
      let isValid = this.validateInput()
      if (isValid) {
         const { email } = this.state
         if (email) {
            this.props.forgotPassword(email)
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
                     <h3 className="box-title m-b-0">Forgot Password</h3>
                     <small>Enter your details below</small>
                     <form className="form-horizontal new-lg-form" onSubmit={this.handleSubmit} id="loginform" >
                        <div className="form-group  m-t-20">
                           <div className="col-xs-12">
                              <label>Email Address</label>
                              <input
                                 type="text" name="email" className="form-control" placeholder="Email address"
                                 onChange={(e) => { this.setState({ email: e.target.value }) }}
                              />
                              <p style={{ color: '#ca3938' }}>{this.state.emailErr}</p>
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
                                 Send
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
                     <div><h3><center>Forgot Password</center></h3></div>
                     <br />
                     {alert.message && <div className={`alert text-center ${alert.type}`}>{alert.message}</div>}
                     <form className="form-horizontal form-material" onSubmit={this.handleSubmit}>
                        <div className="form-group">
                           <div className="col-md-12">
                              <input
                                 type="text" name="email" className="form-control" placeholder="Email address"
                                 onChange={(e) => { this.setState({ email: e.target.value }) }}
                              />
                              <p style={{ color: '#ca3938' }}>{this.state.emailErr}</p>
                           </div>
                        </div>
                        <div className="form-group">
                           <div className="col-sm-12">
                              <button type="submit" className="btn btn-success">Send</button>
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
   const { forgotrequest } = state.forgotPasswordReducer
   const { alert } = state
   return { forgotrequest, alert }
}

const actionCreators = {
   forgotPassword: loginAction.forgotPassword,
   clearAlerts: alertActions.clear
}

export default connect(mapStateToProps, actionCreators)(ForgotPassword)

