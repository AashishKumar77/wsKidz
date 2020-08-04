import React from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { authHeader } from '../../helpers/authHeader'
import { handleResponse } from '../../helpers/handleResponse'

class ImagesForm extends React.Component {
    constructor(props) {
        super(props)
        console.log(this.props,"==============ptros")
   this.state = {
      id: 0,
      images1: '',
      images2: '',
      charCount:'',
      images1Err:'',
      images2Err:'',
      charCountErr:''
   }
}
   validateInput = () => {
      let images1Err = ''
      if (!this.state.images1) {
        images1Err = "Category name is required."
      }
      if (images1Err) {
         this.setState({ images1Err })
         return false
      }
      return true
   }
   submitFormAdd = e => {
      e.preventDefault()
      this.setState({ images1Err: '' })
      let isValid = this.validateInput()
      const formData = new FormData();
      console.log(this.state,"========this.state",this.props.storyId)
      formData.append('images1', this.state.images1)
      formData.append('images2', this.state.images2)
      formData.append('StoryId', this.props.id)
      formData.append('charCount', this.state.charCount)
      if (isValid) {
        const requestOptions = {
            method: 'POST',
            headers: authHeader(),
            body: formData
         };
         fetch('/story/page/createimages', requestOptions).then(handleResponse)
            .then(result => {
               console.log(result,"result")
               if ((result)) {
                this.props.addCharityToState(result.storypages)
                this.props.toggle()
               } else {
                  console.log('failure')
               }
            }).catch(err => console.log(err))
      }
   }

//    submitFormEdit = e => {
//       e.preventDefault()
//       this.setState({ nameErr: '' })
//       let isValid = this.validateInput()
//       if (isValid) {
//          const requestOptions = {
//             method: 'POST',
//             headers: { ...authHeader(), 'Content-Type': 'application/json' },
//             body: JSON.stringify({ category_id: this.state.id, name: this.state.name })
//          };
//          fetch('/story/category/create', requestOptions).then(handleResponse)
//             .then(item => {
//                if (item.category) {
//                   this.props.updateState(item.category)
//                   this.props.toggle()
//                } else {
//                   console.log('failure')
//                }
//             }).catch(err => console.log(err))
//       }
//    }

   componentDidMount() {
      // if item exists, populate the state with proper data
      console.log(this.props,"======")
    //   if (this.props.item) {
        //  const { id, name, icon_url } = this.props.item
        //  this.setState({ id, name, icon_url })
    //   }
   }

   render() {
      return (
        // onSubmit={this.props.item ? this.submitFormEdit : this.submitFormAdd}
         <Form>
            <FormGroup>
               <Label for="name">Image</Label>
               <Input type="file" name="images1" id="name"
                  onChange={(e) => { this.setState({ images1:  e.target.files[0] }) }}
                   />
               <p style={{ color: '#ca3938' }}>{this.state.images1Err}</p>
               </FormGroup>
               <FormGroup>
               <Label for="name">Ipad</Label>
               <Input type="file" name="images2" id="name"
                  onChange={(e) => { this.setState({ images2: e.target.files[0] }) }}
                  />
               <p style={{ color: '#ca3938' }}>{this.state.images2Err}</p>
               </FormGroup>
               <FormGroup>
               <Label for="name">Character Count</Label>
               <Input type="text" name="charCount" id="name"
                  onChange={(e) => { this.setState({ charCount: e.target.value }) }}
                  value={this.state.charCount === null ? '' : this.state.charCount} />
               <p style={{ color: '#ca3938' }}>{this.state.charCountErr}</p>
            </FormGroup>
            <Button type="button" className="btn btn-primary pull-right"
               onClick={this.props.item ? this.submitFormEdit : this.submitFormAdd}>Submit</Button>
         </Form>
      );
   }
}

export default ImagesForm