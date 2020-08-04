import React from 'react'
import { handleResponse } from '../../helpers/handleResponse'
import { authHeader } from '../../helpers/authHeader'

class StoryQAForm extends React.Component {
   state = {
      id: 0, question_type: 0, question_text: "", question_typeErr: "", question_textErr: "",
      answer_text: "", answer_text1: "", answer_text2: "", answer_text3: "",
      answerId: 0, answerId1: 0, answerId2: 0, answerId3: 0,
      answer_textErr: "", answer_text1Err: "", answer_text2Err: "", answer_text3Err: "", answers: []
   }
   validateInput = () => {
      let question_typeErr, question_textErr, answer_textErr, answer_text1Err, answer_text2Err, answer_text3Err = ''
      if (!this.state.question_type) {
         question_typeErr = "Question type is required."
      }
      if (!this.state.question_text) {
         question_textErr = "Question title is required."
      }
      if (parseInt(this.state.question_type) === 1) {
         if (!this.state.answer_text) {
            answer_textErr = "Required"
         }
         if (!this.state.answer_text1) {
            answer_text1Err = "Required"
         }
         if (!this.state.answer_text2) {
            answer_text2Err = "Required"
         }
         if (!this.state.answer_text3) {
            answer_text3Err = "Required"
         }
      }
      if (question_typeErr || question_textErr || answer_textErr || answer_text1Err || answer_text2Err || answer_text3Err) {
         this.setState({ question_typeErr, question_textErr, answer_textErr, answer_text1Err, answer_text2Err, answer_text3Err })
         return false
      }
      return true
   }
   submitFormAdd = (e) => {
      e.preventDefault()
      this.setState({ question_typeErr: '', question_textErr: '', answer_textErr: '', answer_text1Err: '', answer_text2Err: '', answer_text3Err: '' })
      let isValid = this.validateInput()
      if (isValid) {
         let mcqObj = [
            { answerId: 0, answer_text: this.state.answer_text }, { answerId: 0, answer_text: this.state.answer_text1 },
            { answerId: 0, answer_text: this.state.answer_text2 }, { answerId: 0, answer_text: this.state.answer_text3 }
         ]
         let data = {
            'storyQuestionsId': this.state.id,
            'StoryId': this.props.storyId,
            'question_type': parseInt(this.state.question_type),
            'question_text': this.state.question_text,
            'answers': mcqObj
         }
         const requestOptions = {
            method: 'POST',
            headers: { ...authHeader(), 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
         };
         fetch('/story/question/create', requestOptions).then(handleResponse)
            .then(result => {
               if ((result.storyQuestion)) {
                  this.props.updateState(result.storyQuestion, false)
                  this.setState({ id: 0, question_type: 0, question_text: "", answerId: 0 })
               } else {
                  console.log('failure')
               }
            }).catch(err => console.log(err))
      }
   }
   submitFormEdit = (e) => {
      e.preventDefault()
      this.setState({ question_typeErr: '', question_textErr: '', answer_textErr: '', answer_text1Err: '', answer_text2Err: '', answer_text3Err: '' })
      let isValid = this.validateInput()
      if (isValid) {
         let mcqObj = [
            { answerId: this.state.answerId, answer_text: this.state.answer_text }, { answerId: this.state.answerId1, answer_text: this.state.answer_text1 },
            { answerId: this.state.answerId2, answer_text: this.state.answer_text2 }, { answerId: this.state.answerId3, answer_text: this.state.answer_text3 }
         ]
         let data = {
            'storyQuestionsId': this.state.id,
            'StoryId': this.props.storyId,
            'question_type': parseInt(this.state.question_type),
            'question_text': this.state.question_text,
            'answers': mcqObj
         }
         const requestOptions = {
            method: 'POST',
            headers: { ...authHeader(), 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
         };
         fetch('/story/question/create', requestOptions).then(handleResponse)
            .then(result => {
               if ((result.storyQuestion)) {
                  this.props.updateStateEditMode(result.storyQuestion)
                  this.props.backFormView(false)
                  this.setState({ id: 0, question_type: 0, question_text: "", answerId: 0 })
               } else {
                  console.log('failure')
               }
            }).catch(err => console.log(err))
      }
   }
   componentDidMount() {
      if (this.props.storyOneQuestion !== '') {
         if (this.props.formType === "edit") {
            const { id, question_type, question_text } = this.props.storyOneQuestion
            if (this.props.storyOneQuestion.answers.length > 0) {
               this.setState({
                  answers: this.props.storyOneQuestion.answers,
                  answer_text: this.props.storyOneQuestion.answers[0].answer_text,
                  answer_text1: this.props.storyOneQuestion.answers[1].answer_text,
                  answer_text2: this.props.storyOneQuestion.answers[2].answer_text,
                  answer_text3: this.props.storyOneQuestion.answers[3].answer_text,
                  answerId: this.props.storyOneQuestion.answers[0].id,
                  answerId1: this.props.storyOneQuestion.answers[1].id,
                  answerId2: this.props.storyOneQuestion.answers[2].id,
                  answerId3: this.props.storyOneQuestion.answers[3].id,
               })
            }
            this.setState({ id, question_type, question_text })
         }
      } else {
         if (this.props.formType === "edit") {
            const { id, question_type, question_text } = this.props.data
            if (this.props.data.answers.length > 0) {
               this.setState({
                  answers: this.props.data.answers,
                  answer_text: this.props.data.answers[0].answer_text,
                  answer_text1: this.props.data.answers[1].answer_text,
                  answer_text2: this.props.data.answers[2].answer_text,
                  answer_text3: this.props.data.answers[3].answer_text,
                  answerId: this.props.data.answers[0].id,
                  answerId1: this.props.data.answers[1].id,
                  answerId2: this.props.data.answers[2].id,
                  answerId3: this.props.data.answers[3].id,
               })
            }
            this.setState({ id, question_type, question_text })
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
            <form onSubmit={this.state.id !== 0 ? this.submitFormEdit : this.submitFormAdd}>
               <div className="row">
                  <div className="col-md-12">
                     <div className="upload-input dropdown-input">
                        <label className="font-weight-normal">Question Type</label>
                        <div className="drop-icon">
                           <select value={this.state.question_type} style={{ color: "#808080" }}
                              onChange={(e) => { this.setState({ question_type: e.target.value }) }}
                              className={this.state.question_type ? '' : this.state.question_typeErr ? "inputerrors" : ""}>
                              <option value="" hidden>Select Question Type</option>
                              <option value="1">MCQ</option>
                              <option value="2">Free Text</option>
                              <option value="3">No Answer</option>
                           </select>
                        </div>
                     </div>
                  </div>
                  <div className="col-md-12">
                     <div className="upload-input">
                        <label className="font-weight-normal">Question Title</label>
                        <input type="text" placeholder="Question Title"
                           className={this.state.question_text ? '' : this.state.question_textErr ? "inputerrors" : ""}
                           value={this.state.question_text === null ? '' : this.state.question_text}
                           onChange={(e) => { this.setState({ question_text: e.target.value }) }} />
                     </div>
                  </div>
                  <div className="col-md-12" style={{ display: parseInt(this.state.question_type) === 1 ? "block" : "none" }}>
                     <div className="upload-input">
                        <label className="font-weight-normal">Fill The Answer</label>
                        <div className="d-flex position-relative answer-grid-n">
                           <div className="radio-box">
                              <input type="radio" name="answer" />
                           </div>
                           <input type="text" onChange={(e) => { this.setState({ answer_text: e.target.value }) }}
                              value={this.state.answer_text === null ? '' : this.state.answer_text}
                              className={this.state.answer_text ? '' : this.state.answer_textErr ? "inputerrors" : ""} />
                        </div>
                        <div className="d-flex position-relative answer-grid-n">
                           <div className="radio-box">
                              <input type="radio" name="answer" />
                           </div>
                           <input type="text" onChange={(e) => { this.setState({ answer_text1: e.target.value }) }}
                              value={this.state.answer_text1 === null ? '' : this.state.answer_text1}
                              className={this.state.answer_text1 ? '' : this.state.answer_text1Err ? "inputerrors" : ""} />
                        </div>
                        <div className="d-flex position-relative answer-grid-n">
                           <div className="radio-box">
                              <input type="radio" name="answer" />
                           </div>
                           <input type="text" onChange={(e) => { this.setState({ answer_text2: e.target.value }) }}
                              value={this.state.answer_text2 === null ? '' : this.state.answer_text2}
                              className={this.state.answer_text2 ? '' : this.state.answer_text2Err ? "inputerrors" : ""} />
                        </div>
                        <div className="d-flex position-relative answer-grid-n">
                           <div className="radio-box">
                              <input type="radio" name="answer" />
                           </div>
                           <input type="text" onChange={(e) => { this.setState({ answer_text3: e.target.value }) }}
                              value={this.state.answer_text3 === null ? '' : this.state.answer_text3}
                              className={this.state.answer_text3 ? '' : this.state.answer_text3Err ? "inputerrors" : ""} />
                        </div>
                     </div>
                  </div>
               </div>
               <button className="btn btn-primary px-5 pull-right">Save</button>
            </form>
         </>
      )
   }
}

export default StoryQAForm