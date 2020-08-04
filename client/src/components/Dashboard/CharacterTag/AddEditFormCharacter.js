import React from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { authHeader } from '../../../helpers/authHeader'
import { handleResponse } from '../../../helpers/handleResponse'

class AddEditFormCharacter extends React.Component {
   state = {
      id: 0,
      name: '',
      icon_url: '',
      nameErr: ''
   }
   validateInput = () => {
      let nameErr = ''
      if (!this.state.name) {
         nameErr = "Character tag title is required."
      }
      if (nameErr) {
         this.setState({ nameErr })
         return false
      }
      return true
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
         const requestOptions = {
            method: 'POST',
            headers: authHeader(),
            body: formData
         };
         fetch('/charactertag/create', requestOptions).then(handleResponse)
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
         const requestOptions = {
            method: 'POST',
            headers: authHeader(),
            body: formData //JSON.stringify({ name, icon_url, tag_id })
         };
         fetch('/charactertag/create', requestOptions).then(handleResponse)
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
         const { id, name, icon_url } = this.props.item
         this.setState({ id, name, icon_url })
      }
   }

   render() {
      return (
         <Form onSubmit={this.props.item ? this.submitFormEdit : this.submitFormAdd}>
            <FormGroup>
               <Label for="icon_url">Character Tag Icon</Label>
               <Input type="file" name="icon_url" id="icon_url"
                  onChange={(e) => { this.setState({ icon_url: e.target.files[0] }) }} />
            </FormGroup>
            <FormGroup>
               <Label for="name">Character Tag Title</Label>
               <Input type="text" name="name" id="name"
                  onChange={(e) => { this.setState({ name: e.target.value }) }}
                  value={this.state.name === null ? '' : this.state.name} />
               <p style={{ color: '#ca3938' }}>{this.state.nameErr}</p>
            </FormGroup>
            <Button className="btn btn-primary pull-right">Submit</Button>
         </Form>
      );
   }
}

export default AddEditFormCharacter