import React from 'react'
import { Link } from 'react-router-dom'
import StoryQAForm from './StoryQAForm'
import StoryQAView from './StoryQAView'
import { handleResponse } from '../../helpers/handleResponse'
import { authHeader } from '../../helpers/authHeader'

class StoryQA extends React.Component {
   state = {
      id: "", storyQuestions: [], storyOneQuestion: "", isOpenStoryQAForm: false
   }
   addQA = () => {
      this.setState({ isOpenStoryQAForm: true, type: "add" })
   }
   updateState = (item, isOpenStoryQAForm) => {
      this.setState(prevState => ({
         storyQuestions: [item, ...prevState.storyQuestions], isOpenStoryQAForm: isOpenStoryQAForm
      }))
   }
   updateStateEditMode = (item) => {
      this.setState({ storyOneQuestion: item })
   }
   // get one story all QA
   findAllStoryQA() {
      const requestOptions = {
         method: 'GET',
         headers: authHeader(),
      };
      fetch("/story/questions/get/" + this.props.match.params.storyId, requestOptions)
         .then(handleResponse)
         .then(data => {
            if (typeof data !== 'undefined') {
               let storyQuestions = data.storyQuestions
               this.setState({ storyQuestions })
            }
         }, error => {
            console.log(error)
         })
   }
   findOneQuestion = (id) => {
      if (id === 0) {
         this.setState({ id: "", isOpenStoryQAForm: false, type: "" })
         this.state.storyQuestions.shift()
      }
      const requestOptions = {
         method: 'GET',
         headers: authHeader(),
      };
      fetch("/story/question/get/" + id, requestOptions)
         .then(handleResponse)
         .then(data => {
            if (data.storyQuestion !== 'undefined') {
               let storyOneQuestion = data.storyQuestion
               this.setState({ storyOneQuestion, isOpenStoryQAForm: false, type: "" })
            }
         }, error => {
            console.log(error)
         })
   }
   componentDidMount() {
      this.findAllStoryQA()
   }
   render() {
      const { storyQuestions, storyOneQuestion } = this.state
      return (
         <>
            <div id="page-wrapper">
               <div className="container-fluid">
                  <div className="row bg-title">
                     <div className="col-lg-3 col-md-4 col-sm-4 col-xs-6 col-6">
                        <h4 className="page-title">STORY QUESTION ANSWER</h4>
                     </div>
                     <div className="col-lg-9 col-sm-8 col-md-8 col-xs-6 col-6">
                        <ol className="breadcrumb">
                           <li>
                              <Link to="/dashboard">Dashboard</Link>
                           </li>
                           <li className="active">Story Question Answer</li>
                        </ol>
                     </div>
                  </div>
                  <div className="section-tab">
                     <div className="nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                        {storyQuestions.length > 0 ? storyQuestions.map((storyQuestion, index) => (
                           <a href="/#" key={storyQuestion.id} className={`nav-link ${index === 0 ? 'active' : ''}`}
                              id={index} data-toggle="pill"
                              onClick={() => this.findOneQuestion(storyQuestion.id)}
                           > Question {index + 1} </a>
                        )) : ''}
                        <button className="btn bg-white text-left w-100" onClick={this.addQA}>
                           + Add another question
                        </button>
                     </div>
                     {storyQuestions.length > 0 || this.state.isOpenStoryQAForm ? (
                        <div className="tab-content" id="v-pills-tabContent">
                           <div className="more-menu">
                              <i className="fa fa-bars" />
                           </div>
                           <div className="tab-pane fade show active" id="v-pills-Question1" role="tabpanel"
                              aria-labelledby="v-pills-Question1-tab">
                              <div className="story-view-grid">
                                 {this.state.isOpenStoryQAForm
                                    ? <StoryQAForm updateState={this.updateState} formType={this.state.type}
                                       data={storyQuestions.length > 0 ? storyQuestions[0] : ''} storyOneQuestion={storyOneQuestion}
                                       storyId={this.props.match.params.storyId} />
                                    : <StoryQAView formType={this.state.type} addQA={this.addQA}
                                       updateStateEditMode={this.updateStateEditMode}
                                       data={storyQuestions.length > 0 ? storyQuestions[0] : ''}
                                       storyOneQuestion={storyOneQuestion}
                                       storyId={this.props.match.params.storyId} />}
                              </div>
                           </div>
                        </div>
                     ) : ''}
                  </div>
               </div>
               {/* <footer className="footer text-center"> 2020 © Wizekid Admin </footer> */}
            </div>
         </>
      )
   }
}

export default StoryQA