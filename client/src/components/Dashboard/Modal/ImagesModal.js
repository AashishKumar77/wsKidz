import React from 'react'
import { Modal, ModalHeader, ModalBody } from 'reactstrap'
import ImagesForm from '../ImagesForm'

class ImagesModal extends React.Component {
   constructor(props) {
      super(props)
      this.state = {
         modal: false
      }
   }
   toggle = () => {
      this.setState(prevState => ({
         modal: !prevState.modal
      }))
   }
   render() {
      const closeBtn = <button className="close" onClick={this.toggle}>&times;</button>
      const label = this.props.buttonLabel
      let button, title = ''
      if (label === 'Edit') {
         button = <button type="button" onClick={this.toggle} className="btn btn-default btn-circle">
            <i className="fa fa-pencil"></i>
         </button>
         title = 'UPDATE VALUE TAG'
      } else {
         button = <button
            className="btn btn-primary pull-right m-b-20"
            onClick={this.toggle}>{label}
         </button>
         title = 'ADD Images'

      }
      return (
         <>
            {button}
            <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
               <ModalHeader toggle={this.toggle} close={closeBtn}
                  cssModule={{ 'modal-title': 'w-100 text-center' }}>{title}</ModalHeader>
               <ModalBody>
                  <ImagesForm
                     addCharityToState={this.props.addCharityToState}
                     updateState={this.props.updateState}
                     toggle={this.toggle}
                     item={this.props.item} 
                     id = {this.props.storyId}/>
               </ModalBody>
            </Modal>
         </>
      )
   }
}


export default ImagesModal