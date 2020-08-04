import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { SketchPicker } from 'react-color'
import { Multiselect } from 'multiselect-react-dropdown'
import { handleResponse } from '../../helpers/handleResponse'
import { authHeader } from '../../helpers/authHeader'


const requestOptions = {
   method: 'GET',
   headers: authHeader(),
};
class AddStory extends React.Component {
   constructor(props) {
      super(props)
      this.state = {
         id: 0, StoryCategoryId: 0, title: "", video_url: "", synopsis_audio_url: "", audio_flag: false, button_color: '',
         points: "", search_keywords: [], locked: false, synopsis_image: "",ipad_image: "", synopsis_imagePreview: "", catalogue_image: "", tablet_image: "",
         synopsis_content: "", StoryValueTags: [], StoryCharacterTags: [],
         selectedVal: [], selectedValChar: [],
         titleErr: "", StoryCategoryIdErr: "", pointsErr: "", button_colorErr: "", synopsis_contentErr: "",
         synopsis_imageErr: "",synopsis_imageIpadErr: "", synopsis_audio_urlErr: "",
         catalogue_imageErr: "",catalogue_imageTabletErr: "", displayColorPicker: false,
         StoryValueTagsData: [], StoryCharacterTagsData: [], valueTags: [], characterTags: [], categories: []
      }
   }
   getValueTag() {
      fetch("/valuetags/get", requestOptions)
         .then(handleResponse)
         .then(data => {
            if (typeof data !== 'undefined') {
               let valueTags = data.tags
               this.setState({ valueTags })
            }
         }, error => {
            console.log(error)
         })
   }
   getCharacterTag() {
      fetch("/charactertags/get", requestOptions)
         .then(handleResponse)
         .then(data => {
            if (typeof data !== 'undefined') {
               let characterTags = data.tags
               this.setState({ characterTags })
            }
         }, error => {
            console.log(error)
         })
   }
   getCategory() {
      fetch("/category/get", requestOptions)
         .then(handleResponse)
         .then(data => {
            if (typeof data !== 'undefined') {
               let categories = data.categories
               this.setState({ categories })
            }
         }, error => {
            console.log(error)
         })
   }
   _onChangeIpad = (e) => {
      
      this.setState({ ipad_image: e.target.files[0], synopsis_imagePreview_ipad: URL.createObjectURL(e.target.files[0]) })
   }
   _onChange = (e) => {
      this.setState({ synopsis_image: e.target.files[0], synopsis_imagePreview: URL.createObjectURL(e.target.files[0]) })
   }
   _onChangeCatalogue = (e) => {
      this.setState({ catalogue_image: e.target.files[0], catalogue_imagePreview: URL.createObjectURL(e.target.files[0]) })
   }
   _onChangeCatalogueTablet = (e) => {
      this.setState({ tablet_image: e.target.files[0], catalogue_imagePreview_tablet: URL.createObjectURL(e.target.files[0]) })
   }
   validNumber = eve => {
      let points = eve.target.value;
      if (eve.which === 0) {
         return true;
      } else {
         if (eve.which === '.') {
            eve.preventDefault();
         }
         if ((eve.which !== 46 || points !== -1) && (eve.which < 48 || eve.which > 57)) {
            if (eve.which !== 8) {
               eve.preventDefault();
            }
         }
         this.setState({ [eve.target.name]: points })
      }
   }
   removeKeyword = (index) => {
      const newKeyword = [...this.state.search_keywords]
      newKeyword.splice(index, 1)
      this.setState({ search_keywords: newKeyword })
   }
   addKeywords = (e) => {
      const val = e.target.value;
      if (e.key === 'Enter' && val) {
         if (this.state.search_keywords.find(keyword => keyword.toLowerCase() === val.toLowerCase())) {
            return
         }
         this.setState({ search_keywords: [...this.state.search_keywords, val] })
         e.target.value = ''
      }
      // else if (e.key === 'Backspace' && !val) {
      //    this.removeKeyword(this.state.search_keywords.length - 1)
      // }
   }
   appendKeyword = (id) => {
      fetch("/auto/search/keywords/" + id + "", requestOptions)
         .then(handleResponse)
         .then(data => {
            if (typeof data !== 'undefined') {
               let result = data.keywords
               //string to array, remove comma and remove space in member_id
               var str = result.keywords
               var strrep = str.replace(/\,/g, " ")
               let arr = strrep.split(" ")
               arr = arr.filter((strFilter) => {
                  return /\S/.test(strFilter)
               })
               let search_keywords = this.state.search_keywords
               search_keywords.push(arr.join())
               this.setState({ search_keywords })
            }
         }, error => {
            console.log(error)
         })
   }
   // onSelected get value for valueTags
   onSelectValueTag = (selectedList, selectedItem) => {
      if (typeof selectedList !== 'undefined' && selectedList.length > 0) {
         this.appendKeyword(selectedItem.id)
         var StoryValueTagsData = this.state.StoryValueTagsData
         StoryValueTagsData.push(selectedItem.id)
         this.setState({ StoryValueTagsData })
      }
   }
   // onSelected value remove for valueTags
   onRemoveValueTag = (selectedList, removedItem) => {
      if (typeof removedItem !== 'undefined' && removedItem !== null) {
         var StoryValueTagsData = this.state.StoryValueTagsData
         let index1 = StoryValueTagsData.indexOf(removedItem.id)
         if (index1 > -1) {
            StoryValueTagsData.splice(index1, 1)
         }
         this.setState({ StoryValueTagsData })
      }
   }
   // onSelected get value for characterTags
   onSelect = (selectedList, selectedItem) => {
      if (typeof selectedList !== 'undefined' && selectedList.length > 0) {
         var StoryCharacterTagsData = this.state.StoryCharacterTagsData
         StoryCharacterTagsData.push(selectedItem.id)
         this.setState({ StoryCharacterTagsData })
      }
   }
   // onSelected value remove for characterTags
   onRemove = (selectedList, removedItem) => {
      if (typeof removedItem !== 'undefined' && removedItem !== null) {
         var StoryCharacterTagsData = this.state.StoryCharacterTagsData
         let index = StoryCharacterTagsData.indexOf(removedItem.id)
         if (index > -1) {
            StoryCharacterTagsData.splice(index, 1)
         }
         this.setState({ StoryCharacterTagsData })
      }
   }
   buttonColorClick = () => {
      this.setState({ displayColorPicker: !this.state.displayColorPicker })
   }
   buttonColorClose = () => {
      this.setState({ displayColorPicker: false })
   }
   handleChange = (color) => {
      this.setState({ button_color: color.hex })
   }
   validateInput = () => {
      let titleErr, pointsErr, StoryCategoryIdErr, button_colorErr, synopsis_imageErr, catalogue_imageErr, synopsis_imageIpadErr, catalogue_imageTabletErr,synopsis_contentErr, synopsis_audio_urlErr = ''
      if (!this.state.title) {
         titleErr = "Title field is required."
      }
      if (this.state.StoryCategoryId === 0) {
         StoryCategoryIdErr = "Story category id is required."
      }
      if (!this.state.synopsis_content) {
         synopsis_contentErr = "Synopsis content is required."
      }
      if (!this.state.points) {
         pointsErr = "Point field is required."
      }
      if (!this.state.button_color) {
         button_colorErr = "Button color is required."
      }
      if (!this.state.synopsis_image) {
         synopsis_imageErr = "Synopsis image is required"
      }
      if (!this.state.ipad_image) {
         synopsis_imageIpadErr = "Synopsis image (Ipad) is required"
      }
      if (!this.state.catalogue_image) {
         catalogue_imageErr = "Catalogue image is required"
      }
      if (!this.state.tablet_image) {
         catalogue_imageTabletErr = "Catalogue image (tablet) is required"
      }
      if (this.state.audio_flag === true) {
         if (!this.state.synopsis_audio_url) {
            synopsis_audio_urlErr = "Synopsis audio url is required"
         }
      }
      if (titleErr || StoryCategoryIdErr || pointsErr || button_colorErr || synopsis_contentErr || catalogue_imageErr || synopsis_audio_urlErr || synopsis_imageErr || catalogue_imageTabletErr || synopsis_imageIpadErr) {
         this.setState({ titleErr, StoryCategoryIdErr, pointsErr, button_colorErr, synopsis_contentErr, catalogue_imageErr, synopsis_audio_urlErr, synopsis_imageErr,synopsis_imageIpadErr,catalogue_imageTabletErr })
         return false
      }
      return true
   }
   addHandleSubmit = (e) => {
      e.preventDefault()
      this.setState({ titleErr: '', StoryCategoryIdErr: '', pointsErr: '', button_colorErr: '', synopsis_contentErr: '', catalogue_imageErr: '', synopsis_audio_urlErr: '', synopsis_imageErr: '', catalogue_imageTabletErr: '' ,  synopsis_imageIpadErr: ''})
      let isValid = this.validateInput()
      if (isValid) {
         const formData = new FormData();
         formData.append('video_url', this.state.video_url)
         formData.append('synopsis_audio_url', this.state.synopsis_audio_url)
         formData.append('synopsis_image', this.state.synopsis_image)
         formData.append('catalogue_image', this.state.catalogue_image)
         formData.append('ipad_image', this.state.ipad_image)
         formData.append('tablet_image', this.state.tablet_image)
         formData.append('StoryCategoryId', this.state.StoryCategoryId)
         formData.append('ValueTagId', this.state.StoryValueTagsData.join())
         formData.append('CharacterTagId', this.state.StoryCharacterTagsData.join())
         formData.append('title', this.state.title)
         formData.append('audio_flag', this.state.audio_flag)
         formData.append('search_keywords', this.state.search_keywords)
         formData.append('button_color', this.state.button_color)
         formData.append('points', this.state.points)
         formData.append('synopsis_content', this.state.synopsis_content)
         formData.append('locked', this.state.locked)
         const requestOptions = {
            method: 'POST',
            headers: authHeader(),
            body: formData
         };
         
         fetch('/story/create', requestOptions).then(handleResponse)
            .then(item => {
               if ((item.story)) {
                  this.props.history.push('/story')
               } else {
                  console.log('failure')
               }
            }).catch(err => console.log(err))
      }
   }
   editHandleSubmit = (e) => {
      e.preventDefault()
      console.log('hiiii-------------------')
      this.setState({ titleErr: '', StoryCategoryIdErr: '', pointsErr: '', button_colorErr: '', synopsis_contentErr: '', catalogue_imageErr: '', synopsis_audio_urlErr: '', synopsis_imageErr: '',synopsis_imageIpadErr: '',catalogue_imageTabletErr: ''  })
      let isValid = this.validateInput()
      console.log(isValid,"isValid")
      // if (isValid) {
        
         var images = ''
         if (typeof this.state.synopsis_image !== 'undefined' && this.state.synopsis_image !== null) {
            images = this.state.synopsis_image
            if (this.state.synopsis_image.length > 0) {
               images = this.state.synopsis_image
            }
         }
         var images3 = ''
         if (typeof this.state.ipad_image !== 'undefined' && this.state.ipad_image !== null) {
            images3 = this.state.ipad_image
            if (this.state.ipad_image.length > 0) {
               images3 = this.state.ipad_image
            }
         }
         console.log(images3,"images3")
         var images2 = ''
         if (typeof this.state.catalogue_image !== 'undefined' && this.state.catalogue_image !== null) {
            images2 = this.state.catalogue_image
            if (this.state.catalogue_image.length > 0) {
               images2 = this.state.catalogue_image
            }
         }
         var images4 = ''
         if (typeof this.state.tablet_image !== 'undefined' && this.state.tablet_image !== null) {
            images4 = this.state.tablet_image
            if (this.state.tablet_image.length > 0) {
               images4 = this.state.tablet_image
            }
         }
         var video = ''
         if (typeof this.state.video_url !== 'undefined' && this.state.video_url !== null) {
            video = this.state.video_url
            if (this.state.video_url.length > 0) {
               video = this.state.video_url
            }
         }
         var audio = ''
         if (typeof this.state.synopsis_audio_url !== 'undefined' && this.state.synopsis_audio_url !== null) {
            audio = this.state.synopsis_audio_url
            if (this.state.synopsis_audio_url.length > 0) {
               audio = this.state.synopsis_audio_url
            }
         }
         console.log(images4,"000000000")
         const formData = new FormData();
         formData.append('story_id', this.state.id)
         formData.append('video_url', video)
         formData.append('synopsis_audio_url', audio)
         formData.append('synopsis_image', images)
         formData.append('catalogue_image', images2)
         formData.append('ipad_image', images3)
         formData.append('tablet_image', images4)
         formData.append('StoryCategoryId', this.state.StoryCategoryId)
         formData.append('ValueTagId', this.state.StoryValueTagsData.join())
         formData.append('CharacterTagId', this.state.StoryCharacterTagsData.join())
         formData.append('title', this.state.title)
         formData.append('audio_flag', this.state.audio_flag)
         formData.append('search_keywords', this.state.search_keywords)
         formData.append('button_color', this.state.button_color)
         formData.append('points', this.state.points)
         formData.append('synopsis_content', this.state.synopsis_content)
         formData.append('locked', this.state.locked)
         const requestOptions = {
            method: 'PUT',
            headers: authHeader(),
            body: formData
         };
         console.log(requestOptions,"requestOptions")
         fetch('/story/edit', requestOptions).then(handleResponse)
            .then(item => {
               if ((item.story)) {
                  this.props.editing(false)
                  this.props.updateState(item.story)
               } else {
                  console.log('failure')
               }
            }).catch(err => console.log(err))
      // }

   }
   componentDidMount() {
      this.getValueTag()
      this.getCharacterTag()
      this.getCategory()
      // if story exists, populate the state with proper data
      if (this.props.story) {
        
         const { id, StoryCategoryId, title, video_url, synopsis_audio_url, audio_flag, button_color, points, locked, synopsis_image, catalogue_image,ipad_image, tablet_image, synopsis_content, StoryValueTags, StoryCharacterTags, search_keywords } = this.props.story
         
         //  { id, name, color, icon_url } = this.props.story
         this.setState({ id, StoryCategoryId, title, video_url, synopsis_audio_url, audio_flag, button_color, points, locked, synopsis_image, catalogue_image,ipad_image, tablet_image, synopsis_content, StoryValueTags, StoryCharacterTags, search_keywords })
         if (this.props.story.StoryValueTags.length > 0) {
            let selectedVal = this.state.selectedVal
            this.props.story.StoryValueTags.forEach((dd) => {
               selectedVal.push(dd.ValueTag)
            })
            this.setState({ selectedVal })
         }
         let StoryValueTagsData = this.state.StoryValueTagsData
         this.state.selectedVal.forEach((ids) => {
            StoryValueTagsData.push(ids.id)
         })
         if (this.state.StoryValueTagsData.length > 0) {
            this.setState({ StoryValueTagsData })
         }
         // character tags
         if (this.props.story.StoryCharacterTags.length > 0) {
            let selectedValChar = this.state.selectedValChar
            this.props.story.StoryCharacterTags.forEach((dd) => {
               selectedValChar.push(dd.CharacterTag)
            })
            this.setState({ selectedValChar })
         }
         let StoryCharacterTagsData = this.state.StoryCharacterTagsData
         this.state.selectedValChar.forEach((ids) => {
            StoryCharacterTagsData.push(ids.id)
         })
         if (this.state.StoryCharacterTagsData.length > 0) {
            this.setState({ StoryCharacterTagsData })
         }
         //string to array, remove comma and remove space in member_id
         var str = search_keywords
         if(str.length > 0){
            var strrep = str.replace(/\,/g, " ")
            let arr = strrep.split(" ")
            arr = arr.filter((strFilter) => {
               return /\S/.test(strFilter)
            })
            this.setState({ search_keywords: arr })
         }else{
           
         this.setState({ search_keywords: [] })
         }
         
      }
   }
   render() {
      const { valueTags, characterTags, categories } = this.state
      const popover = {
         position: 'absolute', zIndex: '2',
      }
      const cover = {
         position: 'fixed', top: '0px', right: '0px', bottom: '0px', left: '0px',
      }
      const { search_keywords } = this.state
      console.log(search_keywords,"search_keywords")
      return (
         <>
            <div id="page-wrapper">
               <div className="container-fluid">
                  <div className="row bg-title">
                     <div className="col-lg-3 col-md-4 col-sm-4 col-xs-6 col-6">
                        <h4 className="page-title">{this.props.editing ? 'EDIT STORY' : 'ADD STORY'}</h4>
                     </div>
                     <div className="col-lg-9 col-sm-8 col-md-8 col-xs-6 col-6">
                        <ol className="breadcrumb">
                           <li>
                              <Link to="/dashboard">Dashboard</Link>
                           </li>
                           <li className="active">{this.props.editing ? 'Edit Story' : 'Add Story'}</li>
                        </ol>
                     </div>
                  </div>
                  <div className="add-story-form">
                     <form>
                        <div className="row">
                           <div className="col-md-6">
                              <div className="upload-input">
                                 <label className="font-weight-normal">Story Title</label>
                                 <input type="text" name="title" className={this.state.title ? '' : this.state.titleErr ? "inputerrors" : ""}
                                    value={this.state.title === null ? '' : this.state.title}
                                    placeholder={this.state.titleErr}
                                    onChange={(e) => { this.setState({ title: e.target.value }) }} />
                              </div>
                           </div>
                           <div className="col-md-6">
                              <div className="upload-input dropdown-input">
                                 <label className="font-weight-normal">Category</label>
                                 <div className="drop-icon">
                                    <select value={this.state.StoryCategoryId} style={{ color: "grey" }} name="StoryCategoryId"
                                       className={this.state.StoryCategoryId ? '' : this.state.StoryCategoryIdErr ? "inputerrors" : ""}
                                       onChange={(e) => { this.setState({ StoryCategoryId: e.target.value }) }}>
                                       <option value="0" hidden>Select</option>
                                       {categories.length > 0 ? categories.map((category) => (
                                          <option key={category.id}
                                             value={category.id}>{category.name}</option>
                                       )) : ''}
                                    </select>
                                 </div>
                              </div>
                           </div>
                           <div className="col-md-6">
                              <div style={{ marginBottom: "15px" }}>
                                 <label className="font-weight-normal">Character Tags</label>
                                 <Multiselect displayValue="name"
                                    selectedValues={this.state.selectedValChar.length > 0 ? this.state.selectedValChar : ''}
                                    options={characterTags}
                                    onSelect={this.onSelect}
                                    onRemove={this.onRemove} />
                              </div>
                           </div>
                           <div className="col-md-6">
                              <div style={{ marginBottom: "15px" }}>
                                 <label className="font-weight-normal">Value Tags</label>
                                 <Multiselect displayValue="name"
                                    selectedValues={this.state.selectedVal.length > 0 ? this.state.selectedVal : ''}
                                    options={valueTags}
                                    onSelect={this.onSelectValueTag}
                                    onRemove={this.onRemoveValueTag}
                                 />
                              </div>
                           </div>
                           <div className="col-md-6">
                              <div className="upload-input">
                                 <label className="font-weight-normal">Video URL</label>
                                 <div className="input-group">
                                    <div className="input-group-prepend">

                                    </div>
                                    <div className="custom-file">
                                       <input type="file" name="video_url" onChange={(e) => { this.setState({ video_url: e.target.files[0] }) }}
                                          accept="video/*" className="custom-file-input"
                                          id="inputGroupFile01" aria-describedby="inputGroupFileAddon01"
                                       />
                                       <label className="custom-file-label" id="videoLabel" htmlFor="inputGroupFile01">
                                          {this.state.video_url !== '' &&this.state.video_url && this.state.video_url.name!==undefined ? this.state.video_url.name : 'Upload a video file'}
                                       </label>
                                    </div>
                                 </div>
                              </div>
                           </div>
                           <div className="col-md-6">
                              <label className="font-weight-normal">Search Keywords</label>
                              <div className="tags-input">
                                 <ul id="tags">
                                    {search_keywords.map((keyword, index) => (
                                       <li key={index} className="tag">
                                          <span className='tag-title'>{keyword}</span>
                                          <span className="tag-close-icon" onClick={() => { this.removeKeyword(index) }}>
                                             <i className="fa fa-times" aria-hidden="true"></i>
                                          </span>
                                       </li>
                                    ))}
                                 </ul>
                                 <input type="text" name="search_keywords" autoComplete="off"
                                    placeholder="Press enter to add keyword" onKeyUp={this.addKeywords} />
                              </div>
                           </div>
                           <div className="col-md-6">
                              <div className="upload-input">
                                 <label className="font-weight-normal">Points</label>
                                 <input type="text" name="points" onKeyPress={this.validNumber}
                                    onChange={(e) => { this.setState({ points: e.target.value }) }}
                                    value={this.state.points === null ? '' : this.state.points}
                                    className={this.state.points ? '' : this.state.pointsErr ? "inputerrors" : ""}
                                    placeholder={this.state.pointsErr} />
                              </div>
                           </div>
                           <div className="col-md-6">
                              <div className="upload-input">
                                 <label className="font-weight-normal">Button Color</label>
                                 <input type="text" readOnly
                                    style={{ backgroundColor: this.state.button_color }} name="button_color"
                                    value={this.state.button_color === null ? '' : this.state.button_color}
                                    className={this.state.button_color ? '' : this.state.button_colorErr ? "inputerrors" : ""}
                                    placeholder={this.state.button_color ? '' : this.state.button_colorErr}
                                    onClick={this.buttonColorClick} />

                                 {this.state.displayColorPicker ? <div style={popover}>
                                    <div style={cover} onClick={this.buttonColorClose} />
                                    <SketchPicker color={this.state.button_color} onChange={this.handleChange} />
                                 </div> : null}
                              </div>
                           </div>
                           <div className="col-md-6 mb-3">
                              <div className="upload-input">
                                 <label className="font-weight-normal">Synopsis Image</label>
                              </div>
                              {this.state.synopsis_imagePreview || this.state.synopsis_image ? (
                                 <>
                                    <div className="story-add-img">
                                       <img src={this.state.synopsis_imagePreview ? this.state.synopsis_imagePreview : this.state.synopsis_image} alt="" width={130} />
                                       <div className="upload-image-box-t">
                                          <input type="file" name="synopsis_image" onChange={this._onChange} />
                                          <i className="" aria-hidden="true" /> Change image
                                       </div>
                                    </div>
                                 </>) : (
                                    <>
                                       <div className={`upload-image-box ${this.state.synopsis_image ? '' : this.state.synopsis_imageErr ? "inputerrors" : ""}`}>
                                          <div className="upload-image-box-t">
                                             <input type="file" name="synopsis_image" onChange={this._onChange} />
                                             <i className="fa fa-cloud-upload" aria-hidden="true" /> Upload or drag image
                                          </div>
                                       </div>
                                    </>)}
                           </div>
                            {
                               /**
                                * =====Iphone 
                                */
                            }
                         <div className="col-md-6 mb-3">
                              <div className="upload-input">
                                 <label className="font-weight-normal">Synopsis Image (Ipad)</label>
                              </div>
                              {this.state.synopsis_imagePreview_ipad || this.state.ipad_image ? (
                                 <>
                                    <div className="story-add-img">
                                       <img src={this.state.synopsis_imagePreview_ipad ? this.state.synopsis_imagePreview_ipad : this.state.ipad_image} alt="" width={130} />
                                       <div className="upload-image-box-t">
                                          <input type="file" name="ipad_image" onChange={this._onChangeIpad} />
                                          <i className="" aria-hidden="true" /> Change image
                                       </div>
                                    </div>
                                 </>) : (
                                    <>
                                       <div className={`upload-image-box ${this.state.ipad_image ? '' : this.state.synopsis_imageIpadErr ? "inputerrors" : ""}`}>
                                          <div className="upload-image-box-t">
                                             <input type="file" name="ipad_image" onChange={this._onChangeIpad} />
                                             <i className="fa fa-cloud-upload" aria-hidden="true" /> Upload or drag image
                                          </div>
                                       </div>
                                    </>)}
                           </div>







                           <div className="col-md-6 mb-3">
                              <div className="upload-input">
                                 <label className="font-weight-normal">Catalogue Image</label>
                              </div>
                              {this.state.catalogue_imagePreview || this.state.catalogue_image ? (
                                 <>
                                    <div className="story-add-img">
                                       <img src={this.state.catalogue_imagePreview ? this.state.catalogue_imagePreview : this.state.catalogue_image} alt="" width={130} />
                                       <div className="upload-image-box-t">
                                          <input type="file" name="catalogue_image" onChange={this._onChangeCatalogue} />
                                          <i className="" aria-hidden="true" /> Change image
                                       </div>
                                    </div>
                                 </>
                              ) : (
                                    <>
                                       <div className={`upload-image-box ${this.state.catalogue_image ? '' : this.state.catalogue_imageErr ? "inputerrors" : ""}`}>
                                          <div className="upload-image-box-t">
                                             <input type="file" name="catalogue_image"
                                                onChange={this._onChangeCatalogue}
                                             />
                                             <i className="fa fa-cloud-upload" aria-hidden="true" /> Upload or drag image
                                          </div>
                                       </div>
                                    </>
                                 )}
                           </div>

                           <div className="col-md-6 mb-3">
                              <div className="upload-input">
                                 <label className="font-weight-normal">Catalogue Image (Tablet)</label>
                              </div>
                              {this.state.catalogue_imagePreview_tablet || this.state.tablet_image ? (
                                 <>
                                    <div className="story-add-img">
                                       <img src={this.state.catalogue_imagePreview_tablet ? this.state.catalogue_imagePreview_tablet : this.state.tablet_image} alt="" width={130} />
                                       <div className="upload-image-box-t">
                                          <input type="file" name="tablet_image" onChange={this._onChangeCatalogueTablet} />
                                          <i className="" aria-hidden="true" /> Change image
                                       </div>
                                    </div>
                                 </>
                              ) : (
                                    <>
                                       <div className={`upload-image-box ${this.state.tablet_image ? '' : this.state.catalogue_imageTabletErr ? "inputerrors" : ""}`}>
                                          <div className="upload-image-box-t">
                                             <input type="file" name="tablet_image"
                                                onChange={this._onChangeCatalogueTablet}
                                             />
                                             <i className="fa fa-cloud-upload" aria-hidden="true" /> Upload or drag image
                                          </div>
                                       </div>
                                    </>
                                 )}
                           </div>


                           <div className="col-md-6">
                              <div className="upload-input">
                                 <label className="font-weight-normal">Synopsis Content</label>
                                 <textarea name="synopsis_content"
                                    value={this.state.synopsis_content === null ? '' : this.state.synopsis_content}
                                    className={this.state.synopsis_content ? '' : this.state.synopsis_contentErr ? "inputerrors" : ""}
                                    placeholder={this.state.synopsis_contentErr}
                                    onChange={(e) => { this.setState({ synopsis_content: e.target.value }) }} />
                              </div>
                           </div>
                           <div className="col-md-6 align-items-center d-flex">
                              <div className="d-flex mt-3">
                                 <div className="custom-toggle mr-5">
                                    Audio Flag
                                       <label className="switch ml-1">
                                       <input type="checkbox" name="audio_flag" checked={this.state.audio_flag ? true : false}
                                          onChange={(e) => { this.setState({ audio_flag: e.target.checked }) }} />
                                       <span className="slider round" />
                                    </label>
                                 </div>
                                 <div className="custom-toggle">
                                    Locked
                                    <label className="switch ml-1">
                                       <input type="checkbox" name="locked" checked={this.state.locked ? true : false}
                                          onChange={(e) => { this.setState({ locked: e.target.checked }) }} />
                                       <span className="slider round" />
                                    </label>
                                 </div>
                              </div>
                           </div>
                           <div className="col-md-6">
                              <div className="upload-input">
                                 <label className="font-weight-normal">Synopsis Audio URL</label>
                                 <div className="input-group">
                                    <div className="input-group-prepend">

                                    </div>
                                    <div className="custom-file">
                                       <input onChange={(e) => { this.setState({ synopsis_audio_url: e.target.files[0] }) }}
                                          type="file" accept="audio/*" className="custom-file-input"
                                          id="inputGroupFile01" aria-describedby="inputGroupFileAddon01"
                                       />
                                       <label className={`custom-file-label ${this.state.synopsis_audio_url ? '' : this.state.synopsis_audio_urlErr ? "inputerrors" : ""} `}
                                          id="fileLabel" htmlFor="inputGroupFile01">
                                          {this.state.synopsis_audio_url !== ''&&this.state.synopsis_audio_url && this.state.synopsis_audio_url.name!==undefined ? this.state.synopsis_audio_url.name : 'Upload a audio file'}
                                       </label>
                                    </div>
                                 </div>
                              </div>
                           </div>
                           <div className="col-md-6">
                              <div className="upload-input">
                                 <button type="button" className="btn btn-primary px-5 pull-right" style={{ marginTop: "29px" }}
                                    onClick={this.props.story ? this.editHandleSubmit : this.addHandleSubmit}>Save</button>
                              </div>
                           </div>
                        </div>
                     </form>
                  </div>
               </div>
            </div>
         </>
      )
   }
}

// const mapStateToProps = (state) => {
//    console.log(state,"state")
//    const { auth } = state
//    // return { auth }
// } connect(mapStateToProps)(

export default AddStory