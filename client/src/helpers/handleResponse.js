// import { history } from './history'
// import { otpAction } from '../actions/Login/otpAction'

export const handleResponse = (response) => {
   return response.text().then(text => {
      const data = text && JSON.parse(text)
      if (!response.ok) {
         if (response.status === 403) {
            // console.log('403')
            // auto logout if 403 response returned from api (when token in expired)
            localStorage.removeItem("token")
            localStorage.removeItem("user")
            // history.push('/')
            window.location.reload()
            // return (dispatch) => { return dispatch(otpAction.logout()) }
         }
         const error = (data && data.message) || response.statusText
         return Promise.reject(error)
      }
      return data
   })
}