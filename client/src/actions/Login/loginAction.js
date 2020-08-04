import { history } from '../../helpers/history'
import { loginService } from '../../service/services'
import { forgotPasswordService } from '../../service/services'
import { setPasswordService } from '../../service/services'
import { alertActions } from './../Alert/alertActions'


export const loginAction = {
   login,
   forgotPassword,
   setPassword
}

function login(email, password) {
   return dispatch => {
      dispatch(request(email))
      loginService(email, password)
         .then(user => {
            dispatch(success(user))
            history.push('/verify-otp')
         },
            error => {
               dispatch(failure(error.toString()))
               dispatch(alertActions.error(error.toString()))
            }
         )
   }
   function request(user) { return { type: 'LOGIN_REQUEST', user } }
   function success(user) { return { type: 'LOGIN_SUCCESS', user } }
   function failure(user) { return { type: 'LOGIN_FAILURE', user } }
}


function forgotPassword(email) {
   return dispatch => {
      dispatch(request(email))
      forgotPasswordService(email)
         .then(user => {
            dispatch(success(user))
            history.push('/set-password')
         },
            error => {
               dispatch(failure(error.toString()))
               dispatch(alertActions.error(error.toString()))
            }
         )
   }
   function request(user) { return { type: 'FORGOT_PASSWORD_REQUEST', user } }
   function success(user) { return { type: 'FORGOT_PASSWORD_SUCCESS', user } }
   function failure(user) { return { type: 'FORGOT_PASSWORD_FAILURE', user } }
}
function setPassword(user_id, otp, password, confirm_password) {
   return dispatch => {
      dispatch(request(otp))
      setPasswordService(user_id, otp, password, confirm_password)
         .then(user => {
            dispatch(success(user))
            history.push('/')
         },
            error => {
               dispatch(failure(error.toString()))
               dispatch(alertActions.error(error.toString()))
            }
         )
   }
   function request(user) { return { type: 'SET_PASSWORD_REQUEST', user } }
   function success(user) { return { type: 'SET_PASSWORD_SUCCESS', user } }
   function failure(user) { return { type: 'SET_PASSWORD_FAILURE', user } }
}