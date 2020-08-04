import jwtDecode from 'jwt-decode'
import { history } from '../../helpers/history'
import { otpService } from '../../service/services'
import { alertActions } from './../Alert/alertActions'
import { auth } from '../../helpers/auth'

export const otpAction = {
   Otp,
   logout
}
export function setCurrentUser(user) {
   return {
      type: 'SET_CURRENT_USER',
      user
   }
}
function logout() {
   return dispatch => {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      auth(false)
      dispatch(setCurrentUser({}))
      history.push('/')
   }
}
function Otp(user_id, otp) {
   return dispatch => {
      dispatch(request(user_id))
      otpService(user_id, otp)
         .then(user => {
            dispatch(success(user))

            history.push('/dashboard')
            localStorage.removeItem('user_id')

            auth(user.token)
            dispatch(setCurrentUser(jwtDecode(user.token)))
         },
            error => {
               dispatch(failure(error.toString()))
               dispatch(alertActions.error(error.toString()))
            }
         )
   }
   function request(user) { return { type: 'OTP_REQUEST', user } }
   function success(user) { return { type: 'OTP_SUCCESS', user } }
   function failure(user) { return { type: 'OTP_FAILURE', user } }
}