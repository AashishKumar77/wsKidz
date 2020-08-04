import { combineReducers } from 'redux'

import { loginReducer } from './Login/loginReducer'
import { otpReducer } from './Login/otpReducer'
import { alert } from './Alert/alertReducer'
import { forgotPasswordReducer } from './Login/forgotPasswordReducer'
import { setPasswordReducer } from './Login/setPasswordReducer'
import { changePasswordReducer } from './Dashboard/changePasswordReducer'
import { profileReducer } from './Dashboard/profileReducer'
import { auth } from './Login/authReducer'

const rootReducer = combineReducers({
  loginReducer,
  auth,
  otpReducer,
  alert,
  forgotPasswordReducer,
  setPasswordReducer,
  profileReducer,
  changePasswordReducer
})

export default rootReducer