

export function forgotPasswordReducer(state = {}, action) {
   switch (action.type) {
      case 'FORGOT_PASSWORD_REQUEST':
         return { forgotrequest: true, user: action.user };
      case 'FORGOT_PASSWORD_SUCCESS':
         return { isforgot: true, user: action.user };
      case 'FORGOT_PASSWORD_FAILURE':
         return {};
      default:
         return state
   }
}
