import React from 'react'
import { Link } from 'react-router-dom'
import FAQForm from './FAQForm'
import FAQView from './FAQView'
import { handleResponse } from '../../helpers/handleResponse'
import { authHeader } from '../../helpers/authHeader'

class FAQ extends React.Component {
   state = {
      id: "", faq_questions: "", faq_answers: "", faqData: [], faqDataOne: '', isOpenFAQForm: false, type: ""
   }
   updateState = (item, isOpenFAQForm) => {
      this.setState(prevState => ({
         faqData: [item, ...prevState.faqData], isOpenFAQForm: isOpenFAQForm
      }))
   }
   updateStateEditMode = (item) => {
      this.setState({ faqDataOne: item })
   }
   addFAQ = () => {
      this.setState({ id: 0, isOpenFAQForm: true, type: "add" })
   }
   findAllFAQ() {
      const requestOptions = {
         method: 'GET',
         headers: authHeader(),
      };
      fetch("/faq/get", requestOptions)
         .then(handleResponse)
         .then(data => {
            if (typeof data !== 'undefined') {
               let faqData = data.faq
               this.setState({ faqData })
            }
         }, error => {
            console.log(error)
         })
   }
   findOneQuestion = (id) => {
      if (id === 0) {
         this.setState({ id: "", isOpenFAQForm: false, type: "" })
         this.state.faqData.shift()
      }
      const requestOptions = {
         method: 'GET',
         headers: authHeader(),
      };
      fetch("/faq/get/" + id, requestOptions)
         .then(handleResponse)
         .then(data => {
            if (data.faq !== 'undefined') {
               let faqDataOne = data.faq
               this.setState({ faqDataOne, isOpenFAQForm: false, type: "" })
            }
         }, error => {
            console.log(error)
         })
   }
   componentDidMount() {
      this.findAllFAQ()
   }
   render() {
      const { faqData, faqDataOne } = this.state
      return (
         <>
            <div id="page-wrapper">
               <div className="container-fluid">
                  <div className="row bg-title">
                     <div className="col-lg-3 col-md-4 col-sm-4 col-xs-6 col-6">
                        <h4 className="page-title">FAQ</h4>
                     </div>
                     <div className="col-lg-9 col-sm-8 col-md-8 col-xs-6 col-6">
                        <ol className="breadcrumb">
                           <li>
                              <Link to="/dashboard">Dashboard</Link>
                           </li>
                           <li className="active">FAQ</li>
                        </ol>
                     </div>
                  </div>
                  <div className="section-tab">
                     <div className="nav flex-column nav-pills" id="v-pills-tab"
                        role="tablist" aria-orientation="vertical" >
                        {faqData.length > 0 ? faqData.map((faq, index) => (
                           <a href="/#" key={faq.id} onClick={() => this.findOneQuestion(faq.id)}
                              className={`nav-link ${index === 0 ? 'active' : ''}`}
                              id={index} data-toggle="pill"
                           >
                              Question {index + 1}
                           </a>
                        )) : ""}
                        <button className="btn bg-white text-left w-100" onClick={this.addFAQ}>
                           + Add another question
                        </button>
                     </div>
                     {faqData.length > 0 || this.state.isOpenFAQForm ? (
                        <div className="tab-content" id="v-pills-tabContent">
                           <div className="more-menu">
                              <i className="fa fa-bars" />
                           </div>
                           <div className="tab-pane fade show active" id="v-pills-Question1"
                              role="tabpanel" aria-labelledby="v-pills-Question1-tab" >
                              <div className="story-view-grid">
                                 {this.state.isOpenFAQForm
                                    ? <FAQForm updateState={this.updateState} formType={this.state.type}
                                       data={faqData.length > 0 ? faqData[0] : ''} faqDataOne={faqDataOne} />
                                    : <FAQView updateStateEditMode={this.updateStateEditMode}
                                       addFAQ={this.addFAQ} formType={this.state.type}
                                       data={faqData.length > 0 ? faqData[0] : ''}
                                       faqDataOne={faqDataOne} />}
                              </div>
                           </div>
                        </div>
                     ) : ''}
                  </div>
               </div>
            </div>
         </>
      )
   }
}


export default FAQ