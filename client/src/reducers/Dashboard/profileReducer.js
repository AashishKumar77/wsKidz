const initialState = {
   profile: {},
   getRequesting: false,
   updateRequesting: false,
   error: null
}

export function profileReducer(state = initialState, action) {
   switch (action.type) {
      case 'GET_PROFILE_REQUEST':
         return { getRequesting: true };
      case 'GET_PROFILE_SUCCESS':
         return { getRequesting: true, profile: action.user };
      case 'GET_PROFILE_FAILURE':
         return { error: action.error };
      case 'UPDATE_PROFILE_REQUEST':
         return { updateRequesting: true, user: action.user };
      case 'UPDATE_PROFILE_SUCCESS':
         return { updateRequesting: true, profile: action.user };
      case 'UPDATE_PROFILE_FAILURE':
         return { error: action.error };
      default:
         return state
   }
}

