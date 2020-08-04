import React from 'react'
import StoryQAForm from './StoryQAForm'

class StoryQAView extends React.Component {
   state = {
      isOpenStoryQAForm: false, type: ""
   }
   openFAQform = () => {
      this.setState({ isOpenStoryQAForm: true, type: "edit" })
   }
   backFormView = () => {
      this.setState({ isOpenStoryQAForm: false, type: "" })
   }
   render() {
      var status = ""
      var answers = []
      if (this.props.storyOneQuestion || this.props.data) {
         if (this.props.storyOneQuestion !== '') {
            // after click on question
            status = this.props.storyOneQuestion.status
            answers = this.props.storyOneQuestion.answers
         } else {
            // first time get status
            status = this.props.data !== '' ? this.props.data.status : ''
            answers = this.props.data !== '' ? this.props.data.answers : ''
         }
      }
      var question_type = ""
      if (this.props.storyOneQuestion !== '') {
         if (this.props.storyOneQuestion.question_type === 1) {
            question_type = "MCQ"
         } else if (this.props.storyOneQuestion.question_type === 2) {
            question_type = "Free Text"
         } else if (this.props.storyOneQuestion.question_type === 3) {
            question_type = "No Answer"
         }
      } else {
         if (this.props.data.question_type === 1) {
            question_type = "MCQ"
         } else if (this.props.data.question_type === 2) {
            question_type = "Free Text"
         } else if (this.props.data.question_type === 3) {
            question_type = "No Answer"
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
                           <button className="btn btn-primary btn-circle mr-2" onClick={this.backFormView}>
                              <i className="fa fa-arrow-left"></i>
                           </button>
                        ) : ""}
                  </div>
               </div>
            </div>
            <hr />
            {this.state.isOpenStoryQAForm ? <StoryQAForm
               updateStateEditMode={this.props.updateStateEditMode}
               backFormView={this.backFormView}
               formType={this.state.type}
               storyId={this.props.storyId}
               data={this.props.data !== '' ? this.props.data : ''}
               storyOneQuestion={this.props.storyOneQuestion}
            />
               : (
                  <div className="qa-box">
                     <h2>
                        <span className="question-mark">?</span>
                        {question_type ? question_type : ""}?
                     </h2>
                     <p>
                        {this.props.storyOneQuestion !== '' ? this.props.storyOneQuestion.question_text : this.props.data.question_text}
                     </p>
                     {/* <label className="font-weight-normal"> Answer </label> */}
                     <ul className="list-icons">
                        {answers.length > 0 ? answers.map((answer, index) => (
                           <li key={answer.id}><i className="fa fa-circle text-danger"></i> {answer.answer_text}</li>
                        )) : null}
                     </ul>
                  </div>

               )}
         </>
      )
   }
}

export default StoryQAView