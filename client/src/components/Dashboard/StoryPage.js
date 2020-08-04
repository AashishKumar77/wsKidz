import React from 'react'
import { Link } from 'react-router-dom'
import StoryPageForm from './StoryPageForm'
import StoryPageView from './StoryPageView'
import { handleResponse } from '../../helpers/handleResponse'
import { authHeader } from '../../helpers/authHeader'

class StoryPage extends React.Component {
   state = {
      id: "", page_content: "", page_number: "", page_image: "", audio_url: "", storypages: [], storypageOne: '',
      isOpenStoryPageForm: true , type: "add"
   }
   updateState = (item, isOpenStoryPageForm) => {
      this.setState(prevState => ({
         storypages: [item, ...prevState.storypages], isOpenStoryPageForm: isOpenStoryPageForm
      }))
   }
   updateStateEditMode = (item) => {
      this.setState({ storypageOne: item })
   }
   addStoryPage = () => {
      this.setState({ isOpenStoryPageForm: true, type: "add" })
   }
   // get one story all pages
   findAllStoryPage() {
      const requestOptions = {
         method: 'GET',
         headers: authHeader(),
      };
      fetch("/story/pages/get/" + this.props.match.params.storyId, requestOptions)
         .then(handleResponse)
         .then(data => {
            if (typeof data !== 'undefined') {
               let storypages = data.storypages
               this.setState({ storypages })
            }
         }, error => {
            console.log(error)
         })
   }
   findOneStoryPage = (id) => {
      if (id === 0) {
         this.setState({ id: "", isOpenStoryPageForm: false, type: "" })
         this.state.storypages.shift()
      }
      const requestOptions = {
         method: 'GET',
         headers: authHeader(),
      };
      fetch("/story/page/get/" + id, requestOptions)
         .then(handleResponse)
         .then(data => {
            if (data.storypage !== 'undefined') {
               let storypageOne = data.storypage
               this.setState({ storypageOne, isOpenStoryPageForm: false, type: "" })
            }
         }, error => {
            console.log(error)
         })
   }
   componentDidMount() {
      this.findAllStoryPage()
   }
   render() {
      const { storypages, storypageOne } = this.state
      console.log(this.state,"this")
      return (
         <>
            <div id="page-wrapper">
               <div className="container-fluid">
                  <div className="row bg-title">
                     <div className="col-lg-3 col-md-4 col-sm-4 col-xs-6 col-6">
                        <h4 className="page-title">STORY PAGE</h4>
                     </div>
                     <div className="col-lg-9 col-sm-8 col-md-8 col-xs-6 col-6">
                        <ol className="breadcrumb">
                           <li>
                              <Link to="/dashboard">Dashboard</Link>
                           </li>
                           <li className="active">Story Page</li>
                        </ol>
                     </div>
                  </div>
                  <div className="section-tab">
                     {/* <div className="nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical"> */}
                        {storypages.length > 0 ? storypages.map((storypage, index) => (
                           <a href="/#" key={storypage.id} onClick={() => this.findOneStoryPage(storypage.id)}
                              className={`nav-link ${index === 0 ? 'active' : ''}`}
                              id={index} data-toggle="pill"
                           >Page {index + 1}</a>
                        )) : ''}
                        {/* <button className="btn bg-white text-left w-100" onClick={this.addStoryPage}>
                           + Add another page
                        </button> */}
                     {/* </div> */}
                     {storypages.length > 0 || this.state.isOpenStoryPageForm ? (
                        <div className="tab-content" id="v-pills-tabContent">
                           <div className="more-menu">
                              <i className="fa fa-bars" />
                           </div>
                           <div className="tab-pane fade show active" id="v-pills-page1" role="tabpanel"
                              aria-labelledby="v-pills-page1-tab">
                              <div className="story-view-grid">
                                 {this.state.isOpenStoryPageForm
                                    ? <StoryPageForm updateState={this.updateState} formType={this.state.type}
                                       storyId={this.props.match.params.storyId}
                                       storypages={storypages.length > 0 ? storypages[0] : ''} storypageOne={storypageOne}
                                       pageLength={storypages.length} />
                                    : <StoryPageView updateStateEditMode={this.updateStateEditMode}
                                       addStoryPage={this.addStoryPage} formType={this.state.type}
                                       storypages={storypages.length > 0 ? storypages[0] : ''}
                                       storyId={this.props.match.params.storyId}
                                       storypageOne={storypageOne} pageLength={storypages.length} />}
                              </div>
                           </div>
                        </div>
                     ) : ""}
                  </div>
               </div>
            </div>
         </>
      )
   }
}

export default StoryPage