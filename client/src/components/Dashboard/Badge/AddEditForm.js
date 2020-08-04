import React from 'react'
import { Button, Form, FormGroup, Label, Input } from 'reactstrap'
import { authHeader } from '../../../helpers/authHeader'
import { handleResponse } from '../../../helpers/handleResponse'

class AddEditForm extends React.Component {
   state = {
      id: 0,
      name: '',
      points: '',
      icon_url: '',
      nameErr: '',
      pointErr: ''
   }
   validateInput = () => {
      let nameErr, pointErr = ''
      if (!this.state.name) {
         nameErr = "Badge title is required."
      }
      if (!this.state.points) {
         pointErr = "Badge point is required."
      }
      if (nameErr || pointErr) {
         this.setState({ nameErr, pointErr })
         return false
      }
      return true
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
   submitFormAdd = e => {
      e.preventDefault()
      this.setState({ nameErr: '', pointErr: '' })
      let isValid = this.validateInput()
      if (isValid) {
         const formData = new FormData();
         formData.append('icon_url', this.state.icon_url)
         formData.append('badge_id', 0)
         formData.append('name', this.state.name)
         formData.append('points', this.state.points)
         const requestOptions = {
            method: 'POST',
            headers: authHeader(),
            body: formData
         };
         fetch('/badge/create', requestOptions).then(handleResponse)
            .then(data => {
               if ((data.badge)) {
                  this.props.addBadgesToState(data.badge)
                  this.props.toggle()
               } else {
                  console.log('failure')
               }
            }).catch(err => console.log(err))
      }
   }
   submitFormEdit = e => {
      e.preventDefault()
      this.setState({ nameErr: '', pointErr: '' })
      let isValid = this.validateInput()
      if (isValid) {
         if (typeof this.state.icon_url !== 'undefined' && this.state.icon_url !== null) {
            var images = this.state.icon_url
            if (this.state.icon_url.length > 0) {
               images = this.state.icon_url
            }
         }
         const formData = new FormData();
         formData.append('icon_url', images)
         formData.append('badge_id', this.state.id)
         formData.append('name', this.state.name)
         formData.append('points', this.state.points)
         const requestOptions = {
            method: 'POST',
            headers: authHeader(),
            body: formData //JSON.stringify({ name, icon_url, tag_id })
         };
         fetch('/badge/create', requestOptions).then(handleResponse)
            .then(data => {
               if (data.badge) {
                  this.props.updateState(data.badge)
                  this.props.toggle()
               } else {
                  console.log('failure')
               }
            }).catch(err => console.log(err))
      }
   }
   componentDidMount() {
      // if item exists, populate the state with proper data
      if (this.props.badge) {
         const { id, name, icon_url, points } = this.props.badge
         this.setState({ id, name, icon_url, points })
      }
   }
   render() {
      return (
         <Form onSubmit={this.props.badge ? this.submitFormEdit : this.submitFormAdd}>
            <FormGroup>
               <Label for="icon_url">Badge Icon</Label>
               <Input type="file" name="icon_url" id="icon_url"
                  onChange={(e) => { this.setState({ icon_url: e.target.files[0] }) }} />
            </FormGroup>
            <FormGroup>
               <Label for="name">Badge Title</Label>
               <Input type="text" name="name" id="name"
                  onChange={(e) => { this.setState({ name: e.target.value }) }}
                  value={this.state.name === null ? '' : this.state.name}
               />
               <p style={{ color: '#ca3938' }}>{this.state.nameErr}</p>
            </FormGroup>
            <FormGroup>
               <Label for="point">Badge Point</Label>
               <Input type="text" name="points" id="points"
                  onChange={(e) => { this.setState({ points: e.target.value }) }}
                  value={this.state.points === null ? '' : this.state.points}
                  onKeyPress={this.validNumber}
               />
               <p style={{ color: '#ca3938' }}>{this.state.pointErr}</p>
            </FormGroup>
            <Button className="btn btn-primary pull-right">Submit</Button>
         </Form>
      )
   }
}

export default AddEditForm