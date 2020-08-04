import React from 'react'
import FAQForm from './FAQForm'

class FAQView extends React.Component {
   state = {
      isOpenFAQForm: false, type: "", status: ""
   }
   openFAQform = () => {
      this.setState({ isOpenFAQForm: true, type: "edit" })
   }
   backFAQview = () => {
      this.setState({ isOpenFAQForm: false, type: "" })
   }
   render() {
      var status = ""
      if (this.props.faqDataOne || this.props.data) {
         if (this.props.faqDataOne !== '') {
            // after click on question
            status = this.props.faqDataOne.status
         } else {
            // first time get status
            status = this.props.data !== '' ? this.props.data.status : ''
         }
      }
      return (
         <>
            <div className="row align-items-center mb-3">
               <div className="col-12 col-sm-6">
                  <h2 className="question-header">
                     {this.state.type === "edit" ? "Edit Question" : "Question"}
                  </h2>
               </div>
               <div className="col-12 col-sm-6">
                  <div className="d-flex align-items-center justify-content-sm-end">
                     {this.props.data !== '' ? this.state.type !== "edit" ? (
                        <>
                           <div className="custom-toggle mr-4">
                              Status{" "}
                              <label className="switch">
                                 <input type="checkbox"
                                    onChange={(e) => { this.setState({ status: e.target.checked }) }}
                                    checked={status === 1 ? true : false} />
                                 <span className="slider round"></span>
                              </label>
                           </div>
                           <button type="button" className="btn btn-primary btn-circle mr-2" onClick={this.openFAQform}>
                              <i className="fa fa-pencil"></i>
                           </button>
                        </>
                     ) : (
                           <button className="btn btn-primary btn-circle mr-2" onClick={this.backFAQview}>
                              <i className="fa fa-arrow-left"></i>
                           </button>
                        ) : ""}
                  </div>
               </div>
            </div>
            <hr />
            {this.state.isOpenFAQForm ? <FAQForm
               updateStateEditMode={this.props.updateStateEditMode}
               formType={this.state.type}
               backFAQview={this.backFAQview}
               data={this.props.data !== '' ? this.props.data : ''}
               faqDataOne={this.props.faqDataOne} />
               : (
                  <div className="qa-box">
                     <h2>
                        <span className="question-mark">?</span>
                        {this.props.faqDataOne !== '' ? this.props.faqDataOne.faq_questions : this.props.data.faq_questions}?
                     </h2>
                     <p>
                        {this.props.faqDataOne !== '' ? this.props.faqDataOne.faq_answers : this.props.data.faq_answers}
                     </p>
                  </div>

               )}
         </>
      )
   }
}


export default FAQView