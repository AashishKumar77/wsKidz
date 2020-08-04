import { history } from '../../helpers/history'
import { valueTagGetService } from '../../service/services'
import { characterTagGetService } from '../../service/services'
import { characterTagAddService } from '../../service/services'
import { valueTagAddService } from '../../service/services'

export const TagAction = {
   getValueTags,
   getCharacterTags,
   addValueTag
};


function getValueTags() {
   return dispatch => {
      dispatch(request());
      valueTagGetService()
         .then(
            users => dispatch(success(users)),
            error => dispatch(failure(error))
         );
   };

   function request() { return { type: 'GETALL_REQUEST' } }
   function success(users) { return { type: 'GETALL_SUCCESS', users } }
   function failure(error) { return { type: 'GETALL_FAILURE', error } }
}

function getCharacterTags() {
   return dispatch => {
      dispatch(request());
      characterTagGetService()
         .then(
            users => dispatch(success(users)),
            error => dispatch(failure(error))
         );
   };

   function request() { return { type: 'GETALL_REQUEST' } }
   function success(users) { return { type: 'GETALL_SUCCESS', users } }
   function failure(error) { return { type: 'GETALL_FAILURE', error } }
}

function addValueTag(name, icon_url, tag_id, type) {
   if (type === 'tags') {
      return dispatch => {
         dispatch(request(tag_id));
         valueTagAddService(name, icon_url, tag_id)
            .then(data => {
               dispatch(success(data))
               history.push('/value-tags')
            },
               error => {
                  dispatch(failure(error))
               }
            )
      }
   } else if (type === 'character') {
      return dispatch => {
         dispatch(request(tag_id));
         characterTagAddService(name, icon_url, tag_id)
            .then(data => {
               dispatch(success(data))
               history.push('/character-tags')
            },
               error => {
                  dispatch(failure(error))
               }
            )
      }
   }
   function request() { return { type: 'ADD_REQUEST' } }
   function success(users) { return { type: 'ADD_SUCCESS', users } }
   function failure(error) { return { type: 'ADD_FAILURE', error } }
}

// function addCharacterTag(name, tag_id) {
//    return dispatch => {
//       dispatch(request(tag_id));
//       characterTagAddService(name, tag_id)
//          .then(
//             users => dispatch(success(users)),
//             error => dispatch(failure(error))
//          )
//    }
//    function request() { return { type: 'ADD_REQUEST' } }
//    function success(users) { return { type: 'ADD_SUCCESS', users } }
//    function failure(error) { return { type: 'ADD_FAILURE', error } }
// }