import React from 'react'
import { connect } from 'react-redux'
import { profileAction } from '../../actions/Dashboard/profileAction'

class Dashboard extends React.Component {
   componentDidMount() {
      this.props.getProfile()
   }
   render() {
      return (
         <>
            <div id="wrapper">
               <div id="page-wrapper">
                  <div className="container-fluid">
                     <div className="row bg-title">
                        <div className="col-lg-3 col-md-4 col-sm-4 col-xs-12">
                           <h4 className="page-title">Dashboard</h4>
                        </div>
                     </div>
                     <div className="row">
                        <div className="col-lg-4 col-sm-6 col-xs-12">
                           <div className="white-box analytics-info">
                              <h3 className="box-title">Total Visit</h3>
                              <ul className="list-inline two-part">
                                 <li>
                                    <div id="sparklinedash" />
                                 </li>
                                 <li className="text-right">
                                    <i className="ti-arrow-up text-success" />
                                    <span className="counter text-success">0</span>
                                 </li>
                              </ul>
                           </div>
                        </div>
                        <div className="col-lg-4 col-sm-6 col-xs-12">
                           <div className="white-box analytics-info">
                              <h3 className="box-title">Total Page Views</h3>
                              <ul className="list-inline two-part">
                                 <li>
                                    <div id="sparklinedash2" />
                                 </li>
                                 <li className="text-right">
                                    <i className="ti-arrow-up text-purple" />{" "}
                                    <span className="counter text-purple">0</span>
                                 </li>
                              </ul>
                           </div>
                        </div>
                        <div className="col-lg-4 col-sm-6 col-xs-12">
                           <div className="white-box analytics-info">
                              <h3 className="box-title">Unique Visitor</h3>
                              <ul className="list-inline two-part">
                                 <li>
                                    <div id="sparklinedash3" />
                                 </li>
                                 <li className="text-right">
                                    <i className="ti-arrow-up text-info" />{" "}
                                    <span className="counter text-info">0</span>
                                 </li>
                              </ul>
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

const mapStateToProps = state => {
   const { isLogin } = state.otpReducer
   return { isLogin }
}
const actionCreators = {
   getProfile: profileAction.getProfile
}

export default connect(mapStateToProps, actionCreators)(Dashboard)