import React from 'react'
import StoryPageForm from './StoryPageForm'

class StoryPageView extends React.Component {
   state = {
      isOpenStoryPageForm: false, type: ""
   }
   openStoryPageForm = () => {
      this.setState({ isOpenStoryPageForm: true, type: "edit" })
   }
   backFormView = () => {
      this.setState({ isOpenStoryPageForm: false, type: "" })
   }
   render() {
      var status, page_image, audio_url = ""
      if (this.props.storypageOne || this.props.storypages) {
         if (this.props.storypageOne !== '') {
            // after click on question
            status = this.props.storypageOne.status
            page_image = this.props.storypageOne.page_image
            audio_url = this.props.storypageOne.audio_url
         } else {
            // first time get status
            status = this.props.storypages !== '' ? this.props.storypages.status : ''
            page_image = this.props.storypages !== '' ? this.props.storypages.page_image : ''
            audio_url = this.props.storypages !== '' ? this.props.storypages.audio_url : ''
         }
      }
      console.log(this.state.isOpenStoryPageForm , "hi")
      return (
         <>
            <div className="row mb-4 align-items-center">
               <div className="col-12 col-sm-6">
                  <h2 className="question-header">
                     {this.state.type === "edit" ? "Edit Page" : "Page"}
                  </h2>
               </div>
               <div className="col-12 col-sm-6 d-flex align-items-center justify-content-sm-end">
                  {this.props.storypages !== '' ? this.state.type !== "edit" ? (
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
                        <button type="button" className="btn btn-primary btn-circle mr-2" onClick={this.openStoryPageForm}>
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
            <hr />
            {this.state.isOpenStoryPageForm ? <StoryPageForm
               updateStateEditMode={this.props.updateStateEditMode}
               backFormView={this.backFormView}
               formType={this.state.type}
               storyId={this.props.storyId}
               storypages={this.props.storypages !== '' ? this.props.storypages : ''}
               storypageOne={this.props.storypageOne}
               pageLength={this.props.pageLength} />
               : (
                  <>
                     <div className="story-img">
                        {page_image ? (
                           <img src={page_image ? page_image : require("../../images/profile/dummy.jpg")} alt="img" />
                        ) : ""}
                     </div>
                     <h2>
                        <strong>
                           <i className="fa fa-headphones" aria-hidden="true" /> Audio URL :
                        </strong>
                        {" "} {audio_url !== '' ? audio_url : ""}
                     </h2>
                     {this.props.storypageOne !== ''
                        ? (<div dangerouslySetInnerHTML={{ __html: this.props.storypageOne.page_content }}></div>)
                        : (<div dangerouslySetInnerHTML={{ __html: this.props.storypages.page_content }}></div>)}
                  </>
               )}
         </>
      )
   }
}

export default StoryPageView