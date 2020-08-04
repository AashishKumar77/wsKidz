import React from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { Link, withRouter } from 'react-router-dom'
import { otpAction } from '../../actions/Login/otpAction'
import { profileAction } from '../../actions/Dashboard/profileAction'
import ChangePassword from '../Dashboard/ChangePassword'

class Header extends React.Component {
   state = {
      profile: {}
   }
   componentDidMount() {
      if (this.props.auth.isAuthenticated) {
         this.props.getProfile()
      }
   }
   logout(e) {
      e.preventDefault();
      this.props.logout();
   }
   static getDerivedStateFromProps(props, state) {
      if (props.profile !== state.profile) {
         return {
            profile: props.profile
         };
      }
      return null;
   }
   render() {
      const { auth } = this.props
      const { profile } = this.state
      const userLinks = (
         <>
            <nav className="navbar navbar-default navbar-static-top m-b-0">
               <div className="navbar-header">
                  <div className="top-left-part">
                     <Link className="logo" to="/dashboard">
                        <b>
                           <img
                              src={require("../../images/img/admin-logo.png")}
                              alt="home"
                              className="dark-logo"
                           />
                           <img
                              src={require("../../images/img/admin-logo-dark.png")}
                              alt="home"
                              className="light-logo"
                           />
                        </b>
                        <span className="hidden-xs">
                           <img
                              src={require("../../images/img/admin-text.png")}
                              alt="home"
                              className="dark-logo"
                           />
                           <img
                              src={require("../../images/img/admin-text-dark.png")}
                              alt="home"
                              className="light-logo"
                           />
                        </span>
                     </Link>
                  </div>
                  <ul className="nav navbar-top-links navbar-right pull-right">
                     <li>
                        <a className="menu-btn nav-toggler open-close waves-effect waves-light hidden-md hidden-lg"
                           href="/#" >
                           <i className="fa fa-bars" />
                        </a>
                     </li>
                     <div className="dropdown profile-pic">
                        <img
                           src={typeof profile !== 'undefined' ? profile.image
                              ? profile.image : require("../../images/profile/dummy.jpg") : ""}
                           alt="img"
                           width={36}
                           className="img-circle"
                        />
                        <button
                           className="btn btn-primary dropdown-toggle"
                           type="button"
                           id="dropdownMenuButton"
                           data-toggle="dropdown"
                           aria-haspopup="true"
                           aria-expanded="false"
                        ></button>
                        <ul className="dropdown-menu profile-dropdown"
                           aria-labelledby="dropdownMenuButton" >
                           <h2> <span>Welcome </span> {typeof profile !== 'undefined' ? profile.name : ""}</h2>
                           <li className="dropdown-item">
                              <Link to="/profile" className={`dropdown-item ${this.props.location.pathname === '/profile' ? 'active' : ''}`}>
                                 Profile
                           </Link>
                           </li>
                           <ChangePassword buttonLabel="Change Password" />
                           <li
                              className="dropdown-item" onClick={this.logout.bind(this)}
                              style={{ color: "#3b7cc2", fontWeight: 500 }}                           >
                              {" "}
                           Logout
                           </li>
                        </ul>
                     </div>
                  </ul>
               </div>
            </nav>
            <div className="navbar-default sidebar" role="navigation">
               <div className="sidebar-nav slimscrollsidebar">
                  <div className="sidebar-head">
                     <h3>
                        <span className="fa-fw open-close">
                           <i className="ti-close ti-menu" />
                        </span>
                        <span className="hide-menu">Navigation</span>
                     </h3>
                  </div>
                  <ul className="nav" id="side-menu">
                     <li style={{ padding: "70px 0 0" }}>
                        <Link to="/dashboard" className={`waves-effect ${this.props.location.pathname === '/dashboard' ? 'active' : ''}`}>
                           <i className="fa fa-pie-chart fa-fw" aria-hidden="true"></i>
                              Dashboard
                        </Link>
                     </li>
                     <li>
                        <Link to="/story-category" className={`waves-effect ${this.props.location.pathname === '/story-category' ? 'active' : ''}`}>
                           <i className="fa fa-tasks fa-fw" aria-hidden="true"></i>
                              Category
                        </Link>
                     </li>
                     <li>
                        <Link to="/value-tags" className={`waves-effect ${this.props.location.pathname === '/value-tags' ? 'active' : ''}`}>
                           <i className="fa fa-tags fa-fw" aria-hidden="true"></i>
                              Value tags
                        </Link>
                     </li>
                     <li>
                        <Link to="/character-tags" className={`waves-effect ${this.props.location.pathname === '/character-tags' ? 'active' : ''}`}>
                           <i className="fa fa-font fa-fw" aria-hidden="true" ></i>
                              Character tags
                        </Link>
                     </li>
                     <li>
                        <Link to="/badge" className={`waves-effect ${this.props.location.pathname === '/badge' ? 'active' : ''}`}>
                           <i className="fa fa-certificate fa-fw" aria-hidden="true"></i>
                              Badges
                        </Link>
                     </li>
                     <li>
                        <Link to="/charity" className={`waves-effect ${this.props.location.pathname === '/charity' ? 'active' : ''}`}>
                           <i className="fa fa-heart fa-fw" aria-hidden="true"></i>
                              Charities
                        </Link>
                     </li>
                     <li>
                        <Link to="/story" className={`waves-effect ${this.props.location.pathname === '/story' ? 'active' : ''}`}>
                           <i className="fa fa-newspaper-o fa-fw" aria-hidden="true"></i>
                              Story
                        </Link>
                     </li>
                     <li>
                        <Link to="/terms-of-use" className={`waves-effect ${this.props.location.pathname === '/terms-of-use' ? 'active' : ''}`}>
                           <i className="fa fa-info fa-fw" aria-hidden="true"></i>
                              TermsOfUse
                        </Link>
                     </li>
                     <li>
                        <Link to="/faq" className={`waves-effect ${this.props.location.pathname === '/faq' ? 'active' : ''}`}>
                           <i className="fa fa-question-circle fa-fw" aria-hidden="true"></i>
                              FAQ
                        </Link>
                     </li>
                     <li>
                        <Link to="/AddfaqSection" className={`waves-effect ${this.props.location.pathname === '/faq' ? 'active' : ''}`}>
                           <i className="fa fa-question-circle fa-fw" aria-hidden="true"></i>
                              Add Faq Section
                        </Link>
                     </li>
                  </ul>
               </div>
            </div>

         </>
      )
      const guestLinks = (
         <>
            {/* <nav className="navbar navbar-default navbar-static-top m-b-0">
               <div className="navbar-header">
                  <ul className="nav navbar-top-links navbar-right pull-right">
                     <li>
                        <a className="nav-toggler open-close waves-effect waves-light hidden-md hidden-lg" href="/#">

                        </a>
                     </li>
                     <li>
                        <a className="profile-pic" href="/#">{""}</a>
                     </li>
                  </ul>
               </div>
            </nav> */}
         </>
      )
      return (
         <React.Fragment>
            {auth.isAuthenticated ? userLinks : guestLinks}
         </React.Fragment>
      )
   }
}
const mapStateToProps = (state) => {
   const { auth } = state
   const { profile } = state.profileReducer
   return { auth, profile }
}
const actionCreators = {
   logout: otpAction.logout,
   getProfile: profileAction.getProfile,
}

export default compose(
   withRouter,
   connect(mapStateToProps, actionCreators)
)(Header)
