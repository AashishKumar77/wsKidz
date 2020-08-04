import React from 'react'
import { handleResponse } from '../../helpers/handleResponse'
import { authHeader } from '../../helpers/authHeader'

class FAQForm extends React.Component {
   state = {
      id: 0, faq_questions: "", faq_answers: "", questionErr: "", answerErr: "", item: '', isOpenFAQForm: false, type: ""
   }
   validateInput = () => {
      let questionErr, answerErr = ''
      if (!this.state.faq_questions) {
         questionErr = "Question field is required."
      }
      if (!this.state.faq_answers) {
         answerErr = "Answer field is required."
      }
      if (questionErr || answerErr) {
         this.setState({ questionErr, answerErr })
         return false
      }
      return true
   }
   submitFormAdd = (e) => {
      e.preventDefault()
      this.setState({ questionErr: '', answerErr: '' })
      let isValid = this.validateInput()
      if (isValid) {
         let data = {
            'faq_id': this.state.id,
            'faq_questions': this.state.faq_questions,
            'faq_answers': this.state.faq_answers
         }
         const requestOptions = {
            method: 'POST',
            headers: { ...authHeader(), 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
         };
         fetch('/faq/create', requestOptions).then(handleResponse)
            .then(result => {
               if ((result.faq)) {
                  this.props.updateState(result.faq, false)
                  this.setState({ id: 0, faq_questions: "", faq_answers: "" })
               } else {
                  console.log('failure')
               }
            }).catch(err => console.log(err))
      }
   }
   submitFormEdit = (e) => {
      e.preventDefault()
      this.setState({ questionErr: '', answerErr: '' })
      let isValid = this.validateInput()
      if (isValid) {
         let data = {
            'faq_id': this.state.id,
            'faq_questions': this.state.faq_questions,
            'faq_answers': this.state.faq_answers
         }
         const requestOptions = {
            method: 'POST',
            headers: { ...authHeader(), 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
         };
         fetch('/faq/create', requestOptions).then(handleResponse)
            .then(result => {
               if ((result.faq)) {
                  this.props.updateStateEditMode(result.faq)
                  this.props.backFAQview(false)
                  this.setState({ id: 0, faq_questions: "", faq_answers: "" })
               } else {
                  console.log('failure')
               }
            }).catch(err => console.log(err))
      }
   }
   componentDidMount() {
      if (this.props.faqDataOne !== '') {
         if (this.props.formType === "edit") {
            const { id, faq_questions, faq_answers } = this.props.faqDataOne
            this.setState({ id, faq_questions, faq_answers })
            // for open form
            this.setState({ item: this.props.faqDataOne })
         }
      } else {
         if (this.props.formType === "edit" && this.props.formType === "edit") {
            const { id, faq_questions, faq_answers } = this.props.data
            this.setState({ id, faq_questions, faq_answers })
            // for open form
            this.setState({ item: this.props.data })
         }
      }
   }
   render() {
      return (
         <>
            {this.props.formType !== "edit" ? (
               <>
                  <div className="row align-items-center mb-3">
                     <div className="col-12 col-sm-6">
                        <h2 className="question-header">
                           Add Question
                        </h2>
                     </div>
                     <div className="col-12 col-sm-6">
                        <div className="d-flex align-items-center justify-content-sm-end">

                        </div>
                     </div>
                  </div>
                  <hr />
               </>
            ) : ''}
            <form onSubmit={this.state.item ? this.submitFormEdit : this.submitFormAdd}>
               <div className="upload-input">
                  <input type="text" name="faq_questions" placeholder="Write question here... "
                     className={this.state.questionErr ? 'inputerrors' : ''}
                     value={this.state.faq_questions === null ? '' : this.state.faq_questions}
                     onChange={(e) => { this.setState({ faq_questions: e.target.value }) }} />
               </div>
               <div className="upload-input">
                  <textarea name="faq_answers" placeholder="Write answer here..."
                     className={this.state.answerErr ? 'inputerrors' : ''}
                     value={this.state.faq_answers === null ? '' : this.state.faq_answers}
                     onChange={(e) => { this.setState({ faq_answers: e.target.value }) }} />
               </div>
               <button className="btn btn-primary px-5 pull-right">Save</button>
            </form>
         </>
      )
   }
}

export default FAQForm