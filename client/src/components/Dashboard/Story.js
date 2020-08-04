import React from 'react'
import { Link } from 'react-router-dom'
import AddStory from './AddStory'
import { handleResponse } from '../../helpers/handleResponse'
import { authHeader } from '../../helpers/authHeader'

class Story extends React.Component {
   state = {
      synopsis_content: '', stories: [], isEditing: false, story: '',
   }
   handleChange = (e) => {
      const { name, value } = e.target
      this.setState({ [name]: value })
   }
   ckEditorHandleChange = (e, editor) => {
      const data = editor.getData()
      this.setState({ synopsis_content: data })
   }
   getStories() {
      const requestOptions = {
         method: 'GET',
         headers: authHeader(),
      };
      fetch("/story/get", requestOptions)
         .then(handleResponse)
         .then(data => {
            if (typeof data !== 'undefined') {
               let stories = data.stories
               this.setState({ stories })
            }
         }, error => {
            console.log(error)
         })
   }
   updateState = (item) => {
      const itemIndex = this.state.stories.findIndex(data => data.id === item.id)
      const newArray = [
         // destructure all stories from beginning to the indexed item
         ...this.state.stories.slice(0, itemIndex),
         // add the updated item to the array
         item,
         // add the rest of the stories to the array from the index after the replaced item
         ...this.state.stories.slice(itemIndex + 1)
      ]
      this.setState({ stories: newArray })
   }
   deleteStoryFromState = (id) => {
      const updatedItems = this.state.stories.filter(item => item.id !== id)
      this.setState({ stories: updatedItems })
   }
   deleteStory = id => {
      let confirmDelete = window.confirm('Are you sure you want to delete this story?')
      if (confirmDelete) {
         const requestOptions = {
            method: 'DELETE',
            headers: { ...authHeader(), 'Content-Type': 'application/json' }
         };
         fetch('/story/delete/' + id + ' ', requestOptions).then(handleResponse)
            .then(item => {
               this.deleteStoryFromState(id)
            }).catch(err => console.log(err))
      }
   }
   activeInactiveStory = id => {
      const requestOptions = {
         method: 'PUT',
         headers: { ...authHeader(), 'Content-Type': 'application/json' }
      };
      fetch('/story/active/inactive/' + id + ' ', requestOptions)
         .then(handleResponse)
         .then(item => {
            this.updateState(item.status)
         }).catch(err => console.log(err))
   }
   onOffAudioFlag = id => {
      const requestOptions = {
         method: 'PUT',
         headers: { ...authHeader(), 'Content-Type': 'application/json' }
      };
      fetch('/story/audioflag/on/off/' + id + ' ', requestOptions)
         .then(handleResponse)
         .then(item => {
            this.updateState(item.audio_flag)
         }).catch(err => console.log(err))
   }
   onOffLocked = id => {
      const requestOptions = {
         method: 'PUT',
         headers: { ...authHeader(), 'Content-Type': 'application/json' }
      };
      fetch('/story/locked/on/off/' + id + ' ', requestOptions)
         .then(handleResponse)
         .then(item => {
            this.updateState(item.locked)
         }).catch(err => console.log(err))
   }
   componentDidMount() {
      this.getStories()
   }
   editing = (dd) => {
      this.setState({ isEditing: false })
   }
   render() {
      const { stories } = this.state
      if (this.state.isEditing) {
         return <AddStory updateState={this.updateState} editing={this.editing} story={this.state.story} />
      }
      return (
         <>
            <div id="page-wrapper">
               <div className="container-fluid">
                  <div className="row bg-title">
                     <div className="col-lg-3 col-md-4 col-sm-4 col-xs-6 col-6">
                        <h4 className="page-title">STORY</h4>
                     </div>
                     <div className="col-lg-9 col-sm-8 col-md-8 col-xs-6 col-6">
                        <ol className="breadcrumb">
                           <li>
                              <a href="/#">Dashboard</a>
                           </li>
                           <li className="active">Story</li>
                        </ol>
                     </div>
                  </div>
                  <div className="row">
                     <div className="col-lg-12">
                        <Link to="/add-story">
                           <button className="btn btn-primary pull-right m-b-20 ">
                              Add Story
                           </button>
                        </Link>
                        <div className="clearfix" />
                        <div className="white-box">
                           <div className="table-responsive">
                              <table className="table">
                                 <thead>
                                    <tr>
                                       <th>Image</th>
                                       <th>Title</th>
                                       <th>Points</th>
                                       <th>Pages</th>
                                       <th className="text-center">Status</th>
                                       <th className="text-center">Audio Flag</th>
                                       <th className="text-center">Locked</th>
                                       <th className="text-center">Action</th>
                                    </tr>
                                 </thead>
                                 <tbody>
                                    {stories.length > 0 ? stories.map(story => (
                                       <tr key={story.id}>
                                          <td style={{ verticalAlign: "middle" }}>
                                             <img src={story.synopsis_image ? story.synopsis_image : require('../../images/profile/dummy.jpg')} width={40} alt="img" />
                                          </td>
                                          <td style={{ verticalAlign: "middle" }}>{story.title}</td>
                                          <td style={{ verticalAlign: "middle" }}>{story.points}</td>
                                          <td style={{ verticalAlign: "middle" }}>0</td>
                                          <td style={{ verticalAlign: "middle" }} className="text-center">
                                             {
                                                story.status === 1
                                                   ? (<div className="label label-table label-success"
                                                      onClick={() => this.activeInactiveStory(story.id)}
                                                      style={{ cursor: 'pointer' }}>Active</div>)
                                                   : (<div className="label label-table label-danger"
                                                      onClick={() => this.activeInactiveStory(story.id)}
                                                      style={{ cursor: 'pointer' }}>Inactive</div>)
                                             }
                                          </td>
                                          <td style={{ verticalAlign: "middle" }} className="text-center">
                                             <div className="custom-toggle">
                                                <label className="switch">
                                                   <input type="checkbox"
                                                      onChange={() => this.onOffAudioFlag(story.id)}
                                                      checked={story.audio_flag === true ? true : false} />
                                                   <span className="slider round" />
                                                </label>
                                             </div>
                                          </td>
                                          <td style={{ verticalAlign: "middle" }} className="text-center">
                                             <div className="custom-toggle">
                                                <label className="switch">
                                                   <input type="checkbox"
                                                      onChange={() => this.onOffLocked(story.id)}
                                                      checked={story.locked === true ? true : false} />
                                                   <span className="slider round" />
                                                </label>
                                             </div>
                                          </td>
                                          <td style={{ verticalAlign: "middle" }} className="text-center">
                                             <button type="button" className="btn btn-default btn-circle"
                                                onClick={(e) => this.setState({ isEditing: !this.state.isEditing, story: story })}>
                                                <i className="fa fa-pencil" />
                                             </button>
                                             {" "}
                                             <button type="button" onClick={() => this.deleteStory(story.id)}
                                                className="btn btn-default btn-circle" >
                                                <i className="fa fa-trash" />
                                             </button>
                                             {" "}
                                             <Link to={`/story-question-answer/${story.id}`} style={{ color: "#000" }} className="btn btn-default btn-circle">
                                                <i className="fa fa-question" aria-hidden="true" />
                                             </Link>
                                             {" "}
                                             <Link to={`/story-page/${story.id}`} style={{ color: "#000" }} className="btn btn-default btn-circle">
                                                <i className="fa fa-list-ul" aria-hidden="true" />
                                             </Link>
                                          </td>
                                       </tr>
                                    )) : null}
                                 </tbody>
                              </table>
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

export default Story