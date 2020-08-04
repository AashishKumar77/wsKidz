import React from 'react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import CKEditor from '@ckeditor/ckeditor5-react'
// import CKEditor from 'ckeditor4-react'
import { handleResponse } from '../../helpers/handleResponse'
import { authHeader } from '../../helpers/authHeader'
import ImagesModal from '../Dashboard/Modal/ImagesModal'
class StoryPageForm extends React.Component {
   constructor(props) {
      super(props)
      this.state = {
         id: 0, page_image: "", audio_url: "", page_content: "", page_contentErr: "", pageImagePreview: "", tests: '', rows: 1 ,
         images1:"",images2:"",charCount:"",images1Err:"",images2Err:"",charCountErr:"",items: [],imagesStory:[]
      }
      // this.handleSubmit = this.handleSubmit.bind(this);
   }
   _onChange = (e) => {
      this.setState({ page_image: e.target.files[0], pageImagePreview: URL.createObjectURL(e.target.files[0]) })
   }
   getImages() {
     
      const requestOptions = {
         method: 'GET',
         headers: authHeader(),
      };
      fetch("/story/images/"+this.props.storyId, requestOptions)
         .then(handleResponse)
         .then(data => {
            console.log(data.storypages,"-------")
            this.setState({ imagesStory :data.storypages})
         }, error => {
            console.log(error)
         })
   }
  
   addClick(){
      this.setState(prevState => ({ 
         users: [...prevState.users, { images1:"",images2:"",charCount:"" }]
      }))
    }
    addCharityToState = (item) => {
      this.setState({imagesStory:item})
   }
   validateInput = () => {
      let page_contentErr = ''
      if (!this.state.page_content) {
         page_contentErr = "Page content is required."
      }
      
      if (page_contentErr) {
         this.setState({ page_contentErr })
         return false
      }
      
      return true
   }

   validateInputFileds = () =>{
      let images1Err = '',  images2Err = '' , charCountErr = ''
      if (!this.state.images1 || !this.state.images2 || !this.state.charCount) {
         images1Err = "Page content is required."
      }
      
      if (images1Err) {
         this.setState({ images1Err })
         return false
      }
      
      return true
   }
   // handleSubmit(event) {
   //    alert('A name was submitted: ' + JSON.stringify(this.state.users));
   //    event.preventDefault();
   //  }
   ckEditorHandleChange = (e, editor) => {
      this.setState({ page_content: editor.getData() })
   }
   submitFormAdd = (e) => {
      e.preventDefault()
      
      this.setState({ page_contentErr: '' })
      let isValid = this.validateInput()
      if (isValid) {
        
         if (typeof this.state.page_image !== 'undefined') {
            var images = this.state.page_image
            if (this.state.page_image.length > 0) {
               images = this.state.page_image
            }
         }
         if (typeof this.state.audio_url !== 'undefined') {
            var audio_url = this.state.audio_url
            if (this.state.audio_url.length > 0) {
               audio_url = this.state.audio_url
            }
         }
         
         const formData = new FormData();
         formData.append('page_image', images)
         formData.append('audio_url', audio_url)
         formData.append('StoryId', this.props.storyId)
         formData.append('page_number', this.props.pageLength + 1)
         formData.append('page_content', this.state.page_content)
         formData.append('images1', this.state.images1)
         formData.append('images2', this.state.images2)
         formData.append('charCount', this.state.charCount)
         const requestOptions = {
            method: 'POST',
            headers: authHeader(),
            body: formData
         };
         fetch('/story/page/create', requestOptions).then(handleResponse)
            .then(result => {
               if ((result.storypage)) {
                  this.props.updateState(result.storypage, false)
                  this.setState({ id: 0, page_content: "", audio_url: "", page_image: "" })
               } else {
                  console.log('failure')
               }
            }).catch(err => console.log(err))
      }
   }
   submitFormEdit = (e) => {
      e.preventDefault()
      this.setState({ page_contentErr: '' })
      let isValid = this.validateInput()
      if (isValid) {
         if (typeof this.state.page_image !== 'undefined') {
            var images = this.state.page_image
            if (this.state.page_image.length > 0) {
               images = this.state.page_image
            }
         }
         if (typeof this.state.audio_url !== 'undefined') {
            var audio_url = this.state.audio_url
            if (this.state.audio_url.length > 0) {
               audio_url = this.state.audio_url
            }
         }
         const formData = new FormData();
         formData.append('page_image', images)
         formData.append('audio_url', audio_url)
         formData.append('StoryId', this.props.storyId)
         formData.append('page_id', this.state.id)
         formData.append('page_content', this.state.page_content)
         const requestOptions = {
            method: 'PUT',
            headers: authHeader(),
            body: formData
         };
         fetch('/story/page/edit', requestOptions).then(handleResponse)
            .then(result => {
               if ((result.storypage)) {
                  this.props.updateStateEditMode(result.storypage)
                  this.props.backFormView(false)
                  this.setState({ id: 0, page_content: "", page_image: "", audio_url: "" })
               } else {
                  console.log('failure')
               }
            }).catch(err => console.log(err))
      }
   }
   componentDidMount() {
      if (this.props.storypageOne !== '') {
         if (this.props.formType === "edit") {
            const { id, page_content, page_image, audio_url } = this.props.storypageOne
            this.setState({ id, page_content, page_image, audio_url })
         }
      } else {
         if (this.props.formType === "edit") {
            const { id, page_content, page_image, audio_url } = this.props.storypages
            this.setState({ id, page_content, page_image, audio_url })
         }
      }
      this.getImages()
   }
   addHandleSubmit = (e) =>{
      e.preventDefault()
      this.setState({ images1Err: '' ,images2Err:'' ,charCountErr:''})
      let isValid = this.validateInputFileds()
      console.log(isValid,"isValid")
      const formData = new FormData();
      formData.append('images1', this.state.images1)
      formData.append('images2', this.state.images2)
      formData.append('StoryId', this.props.storyId)
      formData.append('charCount', this.state.charCount)
      const requestOptions = {
         method: 'POST',
         headers: authHeader(),
         body: formData
      };
      fetch('/story/page/createimages', requestOptions).then(handleResponse)
         .then(result => {
            console.log(result,"result")
            if ((result)) {
               // this.props.updateState(result, false)
               this.setState({ id: 0, page_content: "", audio_url: "", page_image: "" })
            } else {
               console.log('failure')
            }
         }).catch(err => console.log(err))

   }
   deleteStoryFromState = (id) => {
      const updatedItems = this.state.imagesStory.filter(item => item.id !== id)
      console.log(updatedItems,"updatedItems")
      this.setState({ imagesStory: updatedItems })
   }
   deleteStoryImage = id => {
      console.log(id,"id")
      let confirmDelete = window.confirm('Are you sure you want to delete this story Image?')
      if (confirmDelete) {
         const requestOptions = {
            method: 'POST',
            headers: { ...authHeader(), 'Content-Type': 'application/json' }
         };
         fetch('/story/delete/image/'+id, requestOptions).then(handleResponse)
            .then(item => {
               console.log(item,"item")
               this.deleteStoryFromState(id)
            }).catch(err => console.log(err))
      }
   }
   render() {
      var contents = ''
      if (this.props.formType === "edit") {
         contents = this.props.storypageOne.page_content ? this.props.storypageOne.page_content : this.props.storypages.page_content
      }
      return (
         <>
            {this.props.formType !== "edit" ? (
               <>
                  <div className="row align-items-center mb-3">
                     <div className="col-12 col-sm-6">
                        <h2 className="question-header">
                           Add Story Page
                        </h2>
                     </div>
                     
                     <div className="col-12 col-sm-6">
                        <div className="d-flex align-items-center justify-content-sm-end">
                        <ImagesModal buttonLabel="ADD Images" storyId ={this.props.storyId} addCharityToState={this.addCharityToState} />
                        {/* <button className="btn btn-primary px-5 pull-right"  >Add </button> */}
                        </div>
                     </div>
                  </div>
                  <br />
               </>
            ) : ''}
            <form onSubmit={this.state.id !== 0 ? this.submitFormEdit : this.submitFormAdd}>

            <div className="upload-input">
                  <div className="input-group">
                     <div className="input-group-prepend">
                    
                     </div>
                     <div className="custom-file">
                        <input onChange={(e) => { this.setState({ audio_url: e.target.files[0] }) }}
                           type="file" accept="audio/*" className="custom-file-input"
                           id="inputGroupFile01" aria-describedby="inputGroupFileAddon01"
                        />
                        <label className="custom-file-label" id="storypagefileLabel" htmlFor="inputGroupFile01">
                           {this.state.audio_url !== '' ? this.state.audio_url.name : 'Upload a audio file'}
                        </label>
                     </div>
                  </div>
               </div>
               <br/>
               <div className={this.state.page_content ? '' : this.state.page_contentErr ? "inputerrors" : ""}>
                  <CKEditor
                     editor={ClassicEditor}
                     // onInit={editor => { console.log(editor) }}
                     // config={{ ckfinder: { uploadUrl: '' } }}
                     config={{
                        toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList']
                     }}
                     data={contents}
                     onChange={this.ckEditorHandleChange}
                  />
               </div>
              <br/>
               <button className="btn btn-primary px-5 pull-right">Save</button>
            </form>
            <br/>
            {this.props.formType !== "edit" ? (
               <>
                  <div className="row align-items-center mb-3">
                     <div className="col-12 col-sm-6">
                        <h2 className="question-header">
                           {/* Add Story Page */}
                        </h2>
                     </div>
                     
                     <div className="col-12 col-sm-6">
                        <div className="d-flex align-items-center justify-content-sm-end">
                        {/* <ImagesModal buttonLabel="ADD Images" storyId ={this.props.storyId} addCharityToState={this.addCharityToState} /> */}
                        {/* <button className="btn btn-primary px-5 pull-right"  >Add </button> */}
                        </div>
                     </div>
                  </div>
                  <br />
               </>
            ) : ''}
            <div className="row">
            <div className="col-lg-12">
            <div className="white-box">
                           <div className="table-responsive">
                           <table className="table">
                                 <thead>
                                    <tr>
                                       <th>Image</th>
                                       <th>Ipad Image</th>
                                       <th>Counts</th>
                                       <th className="text-center">Action</th>
                                    </tr>
                                 </thead>
                                 <tbody>
                                 {this.state.imagesStory.length > 0 ? this.state.imagesStory.map(storyImages => 
                                 (
                                    <tr>
                                       <td style={{ verticalAlign: "middle" }} >
                                       <img src={storyImages.image ? storyImages.image : require('../../images/profile/dummy.jpg')} width={40} alt="img" />
                                       </td>
                                       <td style={{ verticalAlign: "middle" }}>
                                       <img src={storyImages.ipad_image ? storyImages.ipad_image : require('../../images/profile/dummy.jpg')} width={40} alt="img" />
                                       </td>
                                       <td  style={{ verticalAlign: "middle" }}>
                                          {storyImages.count}
                                       </td>
                                       <td>
                                       <button type="button" onClick={() => this.deleteStoryImage(storyImages.id)}
                                                className="btn btn-default btn-circle" >
                                                <i className="fa fa-trash" />
                                             </button>
                                       </td>
                                    </tr>
                                  )) : null} 
                                 </tbody>
                              </table>
                              </div>
                              </div>
               </div>
            </div>
         </>
      )
   }
}

export default StoryPageForm