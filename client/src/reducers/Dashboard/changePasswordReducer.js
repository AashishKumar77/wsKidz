

export function changePasswordReducer(state = {}, action) {
   switch (action.type) {
      case 'CHANGE_PASSWORD_REQUEST':
         return { isRequesting: true, user: action.user };
      case 'CHANGE_PASSWORD_SUCCESS':
         return { isRequesting: true, user: action.user };
      case 'CHANGE_PASSWORD_FAILURE':
         return {};
      default:
         return state
   }
}
