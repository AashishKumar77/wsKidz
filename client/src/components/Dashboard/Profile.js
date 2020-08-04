import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
// import { authHeader } from '../../helpers/authHeader'
// import { handleResponse } from '../../helpers/handleResponse'
import { profileAction } from '../../actions/Dashboard/profileAction';
import { alertActions } from '../../actions/Alert/alertActions';

class Profile extends React.Component {
   constructor(props) {
      super(props)
      this.state = {
         name: '', nameErr: '', image: '', profile: {}
      }
   }
   validateInput = () => {
      let nameErr = ''
      if (!this.state.name) {
         nameErr = "Name field is required."
      }
      if (nameErr) {
         this.setState({ nameErr })
         return false
      }
      return true
   }
   addProfileToState = (profile) => {
      this.setState({ profile: profile })
   }
   componentDidMount() {
      this.props.getProfile()
   }
   handleSubmit = (e) => {
      e.preventDefault()
      this.setState({ nameErr: '' })
      let isValid = this.validateInput()
      if (isValid) {
         if (typeof this.state.image !== 'undefined') {
            var images = this.state.image
            if (this.state.image === '') {
               images = this.state.profile.image
            }
         }
         if (typeof images === 'undefined') {
            images = ''
         }
         this.props.updateProfile(images, this.state.name)
         this.addProfileToState(this.props.profile)
         // reset/clear form
         document.getElementById("clear-form").reset()
         // reset/clear state
         this.setState({ name: '', images: '' })
      }
   }
   static getDerivedStateFromProps(props, state) {
      if (props.profile !== state.profile) {
         return {
            profile: props.profile
         };
      }
      return null;
   }
   // componentWillReceiveProps(nextProps) {
   //    // This will erase any local state updates!
   //    // Do not do this.
   //    this.setState({ profile: nextProps.profile });
   // }
   render() {
      const { profile } = this.state
      return (
         <>
            <div id="wrapper">
               <div id="page-wrapper">
                  <div className="container-fluid">
                     <div className="row bg-title">
                        <div className="col-lg-3 col-md-4 col-sm-4 col-xs-12">
                           <h4 className="page-title">Profile page</h4>
                        </div>
                        <div className="col-lg-9 col-sm-8 col-md-8 col-xs-12">
                           <ol className="breadcrumb">
                              <li>
                                 <Link to="/dashboard">Dashboard</Link>
                              </li>
                              <li className="active">Profile Page</li>
                           </ol>
                        </div>
                     </div>

                     <div className="row">
                        <div className="col-md-4 col-xs-12">
                           <div className="white-box">
                              <div className="user-bg">

                                 <div className="overlay-box">
                                    <div className="user-content">
                                       <a href="/#">
                                          <img src={typeof profile !== 'undefined' ? profile.image
                                             ? profile.image : require("../../images/profile/dummy.jpg") : ""}
                                             className="thumb-lg img-circle" alt="img" />
                                       </a>
                                       <h4 className="text-white">{typeof profile !== 'undefined' ? profile.name : ""}</h4>
                                       <h5 className="text-white">{typeof profile !== 'undefined' ? profile.email : ""}</h5>
                                    </div>
                                 </div>
                              </div>
                              <div className="user-btm-box">
                                 <div className="col-md-4 col-sm-4 text-center">
                                    <p className="text-purple">
                                       <i className="ti-facebook" />
                                    </p>
                                 </div>

                              </div>
                           </div>
                        </div>
                        <div className="col-md-8 col-xs-12">
                           <div className="white-box">
                              <form className="form-horizontal new-lg-form" id="clear-form" onSubmit={this.handleSubmit}>
                                 <div className="form-group m-t-20">
                                    <div className="col-xs-12">
                                       <label>Name</label>
                                       <input
                                          type="text" name="name" placeholder="Enter name"
                                          className="form-control"
                                          onChange={(e) => { this.setState({ name: e.target.value }) }}
                                       />
                                       <p style={{ color: '#ca3938' }}>{this.state.nameErr}</p>
                                    </div>
                                 </div>
                                 <div className="form-group">
                                    <div className="col-xs-12">
                                       {/* <label>Image</label> */}
                                       <input type="file" name="image" id="image"
                                          onChange={(e) => { this.setState({ image: e.target.files[0] }) }} />
                                    </div>
                                 </div>
                                 <div className="form-group">
                                    <div className="col-md-12">
                                       <div className="checkbox checkbox-info pull-left p-t-0">

                                       </div>

                                    </div>
                                 </div>
                                 <div className="form-group text-center m-t-20">
                                    <div className="col-xs-12">
                                       <button
                                          className="btn btn-primary btn-lg btn-block btn-rounded text-uppercase waves-effect waves-light"
                                          type="submit"
                                       >Submit</button>
                                    </div>
                                 </div>
                              </form>
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

const mapStateToProps = (state) => {
   const { auth } = state
   const { profile } = state.profileReducer
   return { auth, profile }
}
const actionCreators = {
   getProfile: profileAction.getProfile,
   updateProfile: profileAction.updateProfile,
   clearAlerts: alertActions.clear
}

export default connect(mapStateToProps, actionCreators)(Profile)