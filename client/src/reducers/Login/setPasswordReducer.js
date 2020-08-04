
export function setPasswordReducer(state = {}, action) {
   switch (action.type) {
      case 'SET_PASSWORD_REQUEST':
         return { setpasswordrequest: true, user: action.user };
      case 'SET_PASSWORD_SUCCESS':
         return { isSetPassword: true, user: action.user };
      case 'SET_PASSWORD_FAILURE':
         return {};
      default:
         return state
   }
}
