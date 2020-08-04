import { changePasswordService, getProfileService, updateProfileService } from '../../service/services'
import { alertActions } from './../Alert/alertActions'


export const profileAction = {
   getProfile,
   updateProfile,
   changePassword
}
function getProfile() {
   return dispatch => {
      dispatch(request())
      getProfileService()
         .then(user => {
            dispatch(success(user.profile))
         },
            error => {
               dispatch(failure(error.toString()))
               dispatch(alertActions.error(error.toString()))
            }
         )
   }
   function request() { return { type: 'GET_PROFILE_REQUEST' } }
   function success(user) { return { type: 'GET_PROFILE_SUCCESS', user } }
   function failure(error) { return { type: 'GET_PROFILE_FAILURE', error } }
}
function updateProfile(images, name) {
   return dispatch => {
      dispatch(request(name))
      updateProfileService(images, name)
         .then(user => {
            dispatch(success(user.profile))
         },
            error => {
               dispatch(failure(error.toString()))
               dispatch(alertActions.error(error.toString()))
            }
         )
   }
   function request(user) { return { type: 'UPDATE_PROFILE_REQUEST', user } }
   function success(user) { return { type: 'UPDATE_PROFILE_SUCCESS', user } }
   function failure(error) { return { type: 'UPDATE_PROFILE_FAILURE', error } }
}
function changePassword(old_password, new_password, confirm_password, toggle) {
   return dispatch => {
      dispatch(request(old_password))
      changePasswordService(old_password, new_password, confirm_password)
         .then(user => {
            dispatch(success(user))
            toggle()
         },
            error => {
               dispatch(failure(error.toString()))
               dispatch(alertActions.error(error.toString()))
            }
         )
   }
   function request(user) { return { type: 'CHANGE_REQUEST', user } }
   function success(user) { return { type: 'CHANGE_SUCCESS', user } }
   function failure(user) { return { type: 'CHANGE_FAILURE', user } }
}
