import React from 'react'
import { Modal, ModalHeader, ModalBody } from 'reactstrap'
import AddEditForm from '../Badge/AddEditForm'

class BadgeModal extends React.Component {
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
         title = 'UPDATE BADGE'
      } else {
         button = <button
            className="btn btn-primary pull-right m-b-20"
            onClick={this.toggle}>{label}
         </button>
         title = 'ADD NEW BADGE'
      }
      return (
         <>
            {button}
            <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
               <ModalHeader toggle={this.toggle} close={closeBtn}
                  cssModule={{ 'modal-title': 'w-100 text-center' }}>{title}</ModalHeader>
               <ModalBody>
                  <AddEditForm
                     addBadgesToState={this.props.addBadgesToState}
                     updateState={this.props.updateState}
                     toggle={this.toggle}
                     badge={this.props.badge} />
               </ModalBody>
            </Modal>
         </>
      )
   }
}


export default BadgeModal