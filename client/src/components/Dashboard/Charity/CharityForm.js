import React from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { authHeader } from '../../../helpers/authHeader'
import { handleResponse } from '../../../helpers/handleResponse'

class CharityForm extends React.Component {
   state = {
      id: 0,
      name: '',
      short_description: '',
      long_description: '',
      image: '',
      nameErr: '',
      shortDescriptionErr: '',
      longDescriptionErr: '',
      short_chars_limit: 100,
      long_chars_limit: 500,
   }
   validateInput = () => {
      let nameErr, shortDescriptionErr, longDescriptionErr = ''
      if (!this.state.name) {
         nameErr = "Charity title is required."
      }
      if (!this.state.short_description) {
         shortDescriptionErr = "Charity short description is required."
      } else if (this.state.short_description.length > 100) {
         shortDescriptionErr = "Short description character length only 100."
      }
      if (this.state.long_description.length > 500) {
         longDescriptionErr = "Long description character length only 500."
      }
      if (nameErr || shortDescriptionErr || longDescriptionErr) {
         this.setState({ nameErr, shortDescriptionErr, longDescriptionErr })
         return false
      }
      return true
   }
   handleWordCount = (e) => {
      const short_chars_counts = e.target.value.length
      const left_short_chars_limit = 100 - short_chars_counts
      this.setState({ short_chars_limit: left_short_chars_limit })
   }
   handleWordCountLongDesc = (e) => {
      const long_chars_counts = e.target.value.length
      const left_long_chars_limit = 500 - long_chars_counts
      this.setState({ long_chars_limit: left_long_chars_limit })
   }
   submitFormAdd = e => {
      e.preventDefault()
      this.setState({ nameErr: '', shortDescriptionErr: '', longDescriptionErr: '' })
      let isValid = this.validateInput()
      if (isValid) {
         const formData = new FormData();
         formData.append('image', this.state.image)
         formData.append('charity_id', 0)
         formData.append('name', this.state.name)
         formData.append('short_description', this.state.short_description)
         formData.append('long_description', this.state.long_description)
         const requestOptions = {
            method: 'POST',
            headers: authHeader(),
            body: formData
         };
         fetch('/charity/create', requestOptions).then(handleResponse)
            .then(item => {
               if ((item.charity)) {
                  this.props.addCharityToState(item.charity)
                  this.props.toggle()
               } else {
                  console.log('failure')
               }
            }).catch(err => console.log(err))
      }
   }

   submitFormEdit = e => {
      e.preventDefault()
      this.setState({ nameErr: '', shortDescriptionErr: '', longDescriptionErr: '' })
      let isValid = this.validateInput()
      if (isValid) {
         if (typeof this.state.image !== 'undefined') {
            var images = this.state.image
            if (this.state.image.length > 0) {
               images = this.state.image
            }
         }
         const formData = new FormData();
         formData.append('image', images)
         formData.append('charity_id', this.state.id)
         formData.append('name', this.state.name)
         formData.append('short_description', this.state.short_description)
         formData.append('long_description', this.state.long_description)
         const requestOptions = {
            method: 'POST',
            headers: authHeader(),
            body: formData //JSON.stringify({ name, icon_url, tag_id })
         };
         fetch('/charity/create', requestOptions).then(handleResponse)
            .then(item => {
               if (item.charity) {
                  this.props.updateState(item.charity)
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
         const { id, name, short_description, long_description, image } = this.props.item
         this.setState({ id, name, short_description, long_description, image })
      }
   }

   render() {
      return (
         <Form onSubmit={this.props.item ? this.submitFormEdit : this.submitFormAdd}>
            <FormGroup>
               <Label for="image">Charity Icon</Label>
               <Input type="file" name="image" id="image"
                  onChange={(e) => { this.setState({ image: e.target.files[0] }) }} />
            </FormGroup>
            <FormGroup>
               <Label for="name">Charity Title</Label>
               <Input type="text" name="name" id="name" onChange={(e) => { this.setState({ name: e.target.value }) }}
                  value={this.state.name === null ? '' : this.state.name} />
               <p style={{ color: '#ca3938' }}>{this.state.nameErr}</p>
            </FormGroup>
            <FormGroup>
               <Label for="last">Charity Short Description</Label>
               <Input type="textarea" name="short_description" id="exampleTextArea"
                  maxLength="100"
                  onChange={(e) => { this.setState({ short_description: e.target.value }) }}
                  value={this.state.short_description === null ? '' : this.state.short_description}
                  onKeyUp={this.handleWordCount} />
               <p style={{ "textAlign": "left" }}>
                  <span style={{ color: '#ca3938' }}>{this.state.shortDescriptionErr}</span>
                  <span style={{ "float": "right", "fontSize": "smaller", "color": "#97999f" }}>
                     Short description text left {this.state.short_description === '' ? this.state.short_chars_limit : 100 - this.state.short_description.length}
                  </span>
               </p>
            </FormGroup>
            <FormGroup>
               <Label for="last">Charity Long Description</Label>
               <Input type="textarea" name="long_description" id="exampleTextArea"
                  maxLength="500"
                  onChange={(e) => { this.setState({ long_description: e.target.value }) }}
                  value={this.state.long_description === null ? '' : this.state.long_description}
                  onKeyUp={this.handleWordCountLongDesc} />
               <p style={{ "textAlign": "left" }}>
                  <span style={{ color: '#ca3938' }}>{this.state.longDescriptionErr}</span>
                  <span style={{ "float": "right", "fontSize": "smaller", "color": "#97999f" }}>
                     Long description text left {this.state.long_description === '' ? this.state.long_chars_limit : 500 - this.state.long_description.length}
                  </span>
               </p>
            </FormGroup>
            <Button className="btn btn-primary pull-right">Submit</Button>
         </Form>
      );
   }
}

export default CharityForm