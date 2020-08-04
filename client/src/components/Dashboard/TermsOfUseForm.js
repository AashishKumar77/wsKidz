import React from 'react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import CKEditor from '@ckeditor/ckeditor5-react'
// import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment'

import { history } from '../../helpers/history'
import { handleResponse } from '../../helpers/handleResponse'
import { authHeader } from '../../helpers/authHeader'

// ClassicEditor
//    .create(document.querySelector('#editor'), {
//       plugins: [Alignment, ... ],
//       toolbar: ['alignment', ... ]
//    })
//    .then(editor => {
//       window.editor = editor;
//    })
//    .catch(error => {
//       console.error('There was a problem initializing the editor.', error);
//    })

// ClassicEditor.create().then(editor => {
//    console.log(Array.from(editor.ui.componentFactory.names()), 'ck');
// })

class TermsOfUseForm extends React.Component {
   state = {
      version: 0,
      term_conditions: '',
      versionErr: '',
      term_conditionsErr: ''
   }
   handleChange = (e) => {
      const { name, value } = e.target
      this.setState({ [name]: value })
   }
   ckEditorHandleChange = (e, editor) => {
      const data = editor.getData()
      this.setState({ term_conditions: data })
   }
   validateInput = () => {
      let versionErr, term_conditionsErr = ''
      if (!this.state.version) {
         versionErr = "Version is required."
      }
      if (!this.state.term_conditions) {
         term_conditionsErr = "Terms of use text is required."
      }
      if (versionErr || term_conditionsErr) {
         this.setState({ versionErr, term_conditionsErr })
         return false
      }
      return true
   }
   validNumberWithDOt = eve => {
      var theEvent = eve || window.event;
      var key = theEvent.keyCode || theEvent.which;
      key = String.fromCharCode(key);
      var regex = /[0-9]|\./;
      if (!regex.test(key)) {
         theEvent.returnValue = false;
         if (theEvent.preventDefault) theEvent.preventDefault();
      }
   }
   handleSubmit = (e) => {
      e.preventDefault()
      this.setState({ versionErr: '', term_conditionsErr: '' })
      let isValid = this.validateInput()
      if (isValid) {
         const { version, term_conditions } = this.state
         const requestOptions = {
            method: 'POST',
            headers: { ...authHeader(), 'Content-Type': 'application/json' },
            body: JSON.stringify({ version, term_conditions })
         };
         fetch('/terms-of-use/create', requestOptions).then(handleResponse)
            .then(item => {
               if (item) {
                  // this.props.addCharityToState(item.tags)
                  history.push('/terms-of-use')
               } else {
                  console.log('failure')
               }
            }).catch(err => console.log(err))
      }
   }
   render() {
      // console.log(this.state.term_conditions)
      return (
         <>
            <div id="wrapper">
               <div id="page-wrapper">
                  <div className="container-fluid">
                     <div className="row bg-title">
                        <div className="col-lg-3 col-md-4 col-sm-4 col-xs-12">
                           <h4 className="page-title">Terms of use</h4>
                        </div>
                     </div>
                     <div className="row">
                        <div className="col-md-12 col-lg-12 col-sm-12">
                           <div className="white-box">
                              <div className="table-responsive">
                                 <div className="col-md-12">
                                    <form className="form-horizontal form-material" onSubmit={this.handleSubmit}>
                                       <div className="form-group">
                                          <div className="col-md-6">
                                             <input
                                                type="text" name="version" placeholder="Version"
                                                className="form-control"
                                                onChange={this.handleChange}
                                                onKeyPress={this.validNumberWithDOt}
                                             />
                                             <p style={{ color: '#ca3938' }}>{this.state.versionErr}</p>
                                          </div>
                                       </div>
                                       <div className="form-group">
                                          <div className="col-md-12">
                                             <CKEditor
                                                editor={ClassicEditor}
                                                onInit={editor => {
                                                   // console.log(editor)
                                                }}
                                                config={{
                                                   ckfinder: {
                                                      uploadUrl: ''
                                                   }
                                                }}
                                                onChange={this.ckEditorHandleChange}
                                             />
                                             <p style={{ color: '#ca3938' }}>{this.state.term_conditionsErr}</p>
                                          </div>
                                       </div>
                                       <div className="form-group">
                                          <div className="col-sm-12">
                                             <button type="submit" className="btn btn-primary pull-right">Save</button>
                                          </div>
                                       </div>
                                    </form>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>

                  </div>
               </div>
            </div>
         </>
      )
   }
}


export default TermsOfUseForm

