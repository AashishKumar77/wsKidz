// let user = JSON.parse(localStorage.getItem('user'))

const initialState = {
   userOtp: {},
   isLogin: true,
}
// const initialState = user ? { isLogin: true, user } : {}

export function otpReducer(state = initialState, action) {
   switch (action.type) {
      case 'OTP_REQUEST':
         return { verifying: true };
      case 'OTP_SUCCESS':
         return { isLogin: true, userOtp: action.user };
         
      case 'OTP_FAILURE':
         return {};
      case 'LOGOUT':
         return {};
      default:
         return state
   }
}