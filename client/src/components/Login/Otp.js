import React from 'react';
import { history } from '../../helpers/history'
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { otpAction } from '../../actions/Login/otpAction';
import { alertActions } from '../../actions/Alert/alertActions';

class Otp extends React.Component {
   constructor(props) {
      super(props)
      let token = localStorage.getItem('token')
      let isLogin = true
      if (token === null) {
         isLogin = false
      }
      this.state = { otp: "", otpErr: "", isLogin }
      history.listen((location, action) => {
         this.props.clearAlerts()
      })
   }
   validateInput = () => {
      let otpErr = ''
      if (!this.state.otp) {
         otpErr = "Otp is required."
      } else if (this.state.otp.length < 6) {
         otpErr = "Otp must be 6 characters long."
      }
      if (otpErr) {
         this.setState({ otpErr })
         return false
      }
      return true
   }
   handleSubmit = (e) => {
      e.preventDefault()
      this.setState({ otpErr: '' })
      let isValid = this.validateInput()
      if (isValid) {
         const { otp } = this.state
         if (otp) {
            let user_id = localStorage.getItem('user_id')
            this.props.Otp(user_id, otp)
         }
      }
   }

   render() {
      if (this.state.isLogin) {
         return <Redirect to="/dashboard" />
      }
      const { alert } = this.props
      return (
         <div>
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
                     <h3 className="box-title m-b-0">Two-factor authentication</h3>
                     <small>Enter your details below</small>
                     <form className="form-horizontal new-lg-form" onSubmit={this.handleSubmit} id="loginform" >
                        <div className="form-group">
                           <div className="col-xs-12">
                              <label>Authenticate code</label>
                              <input
                                 type="text" name="otp" className="form-control" placeholder="Authenticate code"
                                 onChange={(e) => { this.setState({ otp: e.target.value }) }}
                              />
                              <p style={{ color: '#ca3938' }}>{this.state.otpErr}</p>
                           </div>
                        </div>
                        <div className="form-group">
                           <div className="col-md-12">
                              <div className="checkbox checkbox-info pull-left p-t-0">
                                 <input id="checkbox-signup" type="checkbox" />

                              </div>
                           </div>
                        </div>
                        <div className="form-group text-center m-t-20">
                           <div className="col-xs-12">
                              <button
                                 className="btn btn-primary btn-lg btn-block btn-rounded text-uppercase waves-effect waves-light"
                                 type="submit"
                              >
                                 Verify
                              </button>
                           </div>
                        </div>
                     </form>
                  </div>
               </div>
            </section>
         </div>
      );
   }
}

const mapStateToProps = state => {
   const { verifying } = state.otpReducer
   const { alert } = state
   return { verifying, alert }
}

const actionCreators = {
   Otp: otpAction.Otp,
   clearAlerts: alertActions.clear
}

export default connect(mapStateToProps, actionCreators)(Otp)

