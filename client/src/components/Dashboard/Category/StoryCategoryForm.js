import React from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { authHeader } from '../../../helpers/authHeader'
import { handleResponse } from '../../../helpers/handleResponse'

class StoryCategoryForm extends React.Component {
   state = {
      id: 0,
      name: '',
      nameErr: ''
   }
   validateInput = () => {
      let nameErr = ''
      if (!this.state.name) {
         nameErr = "Category name is required."
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
         const requestOptions = {
            method: 'POST',
            headers: { ...authHeader(), 'Content-Type': 'application/json' },
            body: JSON.stringify({ category_id: 0, name: this.state.name })
         };
         fetch('/story/category/create', requestOptions).then(handleResponse)
            .then(item => {
               if ((item.category)) {
                  this.props.addCharityToState(item.category)
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
         const requestOptions = {
            method: 'POST',
            headers: { ...authHeader(), 'Content-Type': 'application/json' },
            body: JSON.stringify({ category_id: this.state.id, name: this.state.name })
         };
         fetch('/story/category/create', requestOptions).then(handleResponse)
            .then(item => {
               if (item.category) {
                  this.props.updateState(item.category)
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
               <Label for="name">Category Name</Label>
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

export default StoryCategoryForm