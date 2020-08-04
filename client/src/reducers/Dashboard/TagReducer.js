export function TagReducer(state = {}, action) {
   switch (action.type) {
      case 'GETALL_REQUEST':
         return { loading: true };
      case 'GETALL_SUCCESS':
         return { items: action.users };
      case 'GETALL_FAILURE':
         return { error: action.error };
      default:
         return state
   }
}