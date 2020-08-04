import React from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { SketchPicker } from 'react-color'
import { authHeader } from '../../../helpers/authHeader'
import { handleResponse } from '../../../helpers/handleResponse'

class AddEditFormValue extends React.Component {
   state = {
      id: 0, name: '', icon_url: '', nameErr: '', color: '#fff',
      keywords: []
   }
   removeKeyword = (index) => {
      const newKeyword = [...this.state.keywords]
      newKeyword.splice(index, 1)
      this.setState({ keywords: newKeyword })
   }
   addKeywords = (e) => {
      const val = e.target.value;
      if (e.key === 'Enter' && val) {
         if (this.state.keywords.find(keyword => keyword.toLowerCase() === val.toLowerCase())) {
            return
         }
         this.setState({ keywords: [...this.state.keywords, val] })
         e.target.value = ''
      }
      // else if (e.key === 'Backspace' && !val) {
      //    this.removeKeyword(this.state.keywords.length - 1)
      // }
   }
   validateInput = () => {
      let nameErr = ''
      if (!this.state.name) {
         nameErr = "Value tag title is required."
      }
      if (nameErr) {
         this.setState({ nameErr })
         return false
      }
      return true
   }
   handleChangeComplete = (color) => {
      this.setState({ color: color.hex });
   }
   submitFormAdd = e => {
      e.preventDefault()
      this.setState({ nameErr: '' })
      let isValid = this.validateInput()
      if (isValid) {
         const formData = new FormData();
         formData.append('icon_url', this.state.icon_url)
         formData.append('tag_id', 0)
         formData.append('name', this.state.name)
         formData.append('keywords', this.state.keywords)
         formData.append('color', this.state.color)
         const requestOptions = {
            method: 'POST',
            headers: authHeader(),
            body: formData
         };
         fetch('/valuetag/create', requestOptions).then(handleResponse)
            .then(item => {
               if ((item.tags)) {
                  this.props.addCharityToState(item.tags)
                  this.props.toggle()
               } else {
                  console.log('failure')
               }
            }).catch(err => console.log(err))
      }
   }
   submitFormEdit = e => {
      e.preventDefault()
      this.setState({ nameErr: '' })
      let isValid = this.validateInput()
      if (isValid) {
         if (typeof this.state.icon_url !== 'undefined') {
            var images = this.state.icon_url
            if (this.state.icon_url.length > 0) {
               images = this.state.icon_url
            }
         }
         const formData = new FormData();
         formData.append('icon_url', images)
         formData.append('tag_id', this.state.id)
         formData.append('name', this.state.name)
         formData.append('keywords', this.state.keywords)
         formData.append('color', this.state.color)
         const requestOptions = {
            method: 'POST',
            headers: authHeader(),
            body: formData
         };
         fetch('/valuetag/create', requestOptions).then(handleResponse)
            .then(item => {
               if (item.tags) {
                  this.props.updateState(item.tags)
                  this.props.toggle()
               } else {
                  console.log('failure')
               }
            }).catch(err => console.log(err))
      }
   }

   componentDidMount() {
      // if item exists, populate the state with proper data
      if (this.props.item) {
         const { id, name, color, icon_url, keywords } = this.props.item
         //string to array, remove comma and remove space in member_id
         var str = keywords
         var strrep = str.replace(/\,/g, " ")
         let arr = strrep.split(" ")
         arr = arr.filter((strFilter) => {
            return /\S/.test(strFilter)
         })
         this.setState({ id, name, color, icon_url, keywords: arr })
      }
   }

   render() {
      const { keywords } = this.state
      return (
         <Form>
            <FormGroup>
               <Label for="icon_url">Value Tag Icon</Label>
               <Input type="file" name="icon_url" id="icon_url"
                  onChange={(e) => { this.setState({ icon_url: e.target.files[0] }) }} />
            </FormGroup>
            <FormGroup>
               <Label for="name">Value Tag Title</Label>
               <Input type="text" name="name" id="name" onChange={(e) => { this.setState({ name: e.target.value }) }}
                  value={this.state.name === null ? '' : this.state.name} />
               <p style={{ color: '#ca3938' }}>{this.state.nameErr}</p>
            </FormGroup>

            <FormGroup>
               <Label for="name">Value Tag Keyword</Label>
               <div className="tags-input">
                  <ul id="tags">
                     {keywords.map((keyword, index) => (
                        <li key={index} className="tag">
                           <span className='tag-title'>{keyword}</span>
                           <span className="tag-close-icon" onClick={() => { this.removeKeyword(index) }}>
                              <i class="fa fa-times" aria-hidden="true"></i>
                           </span>
                        </li>
                     ))}
                  </ul>
                  <Input type="text" name="keywords" id="keywords" onKeyUp={this.addKeywords}
                     // value={this.state.keywords === null ? '' : this.state.keywords}
                     autoComplete="off" placeholder="Press enter to add keyword" />
               </div>
            </FormGroup>

            <FormGroup>
               <Label for="color">Value Tag Color</Label>
               <Input type="text" name="color" id="color"
                  value={this.state.color === null ? '' : this.state.color}
                  onChange={(e) => { this.setState({ color: e.target.value }) }}
               />
            </FormGroup>
            <SketchPicker
               color={this.state.color}
               onChangeComplete={this.handleChangeComplete}
            />
            <Button type="button" className="btn btn-primary pull-right"
               onClick={this.props.item ? this.submitFormEdit : this.submitFormAdd}>Submit</Button>
         </Form >
      );
   }
}

export default AddEditFormValue