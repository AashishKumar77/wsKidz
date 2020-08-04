import React from 'react'
import { Modal, ModalHeader, ModalBody } from 'reactstrap'

class TermOfUseViewModal extends React.Component {
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
      return (
         <>
            <button type="button" onClick={this.toggle} className="btn btn-default btn-circle">
               <i className="fa fa-eye"></i>
            </button>
            <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
               <ModalHeader toggle={this.toggle} close={closeBtn}
                  cssModule={{ 'modal-title': 'w-100 text-center' }}>Term Of Use</ModalHeader>
               <ModalBody>
                  <div dangerouslySetInnerHTML={{ __html: this.props.data }}></div>
               </ModalBody>
            </Modal>
         </>
      )
   }
}


export default TermOfUseViewModal