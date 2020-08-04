import { authHeader } from '../helpers/authHeader'
import { handleResponse } from '../helpers/handleResponse'

export const loginService = (email, password) => {
   const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
   };
   return fetch("/login", requestOptions)
      .then(handleResponse)
      .then(data => {
         localStorage.setItem('user_id', data._id)
         return data
      })
}

export const otpService = (user_id, otp) => {
   const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id, otp })
   };
   return fetch("/verify/otp", requestOptions)
      .then(handleResponse)
      .then(data => {
         const token = data.token
         localStorage.setItem('user', JSON.stringify(data.user))
         localStorage.setItem('token', token)
         return data
      })
}
export const getProfileService = () => {
   const requestOptions = {
      method: 'GET',
      headers: { ...authHeader(), 'Content-Type': 'application/json' },
      // body: JSON.stringify({  })
   };
   return fetch("/profile/get", requestOptions)
      .then(handleResponse)
      .then(data => {
         return data
      })
}
export const updateProfileService = (images, name) => {
   const formData = new FormData();
   formData.append('image', images)
   formData.append('name', name)
   const requestOptions = {
      method: 'PUT',
      headers: authHeader(),
      body: formData
   };
   return fetch("/update/profile", requestOptions)
      .then(handleResponse)
      .then(data => {
         return data
      })
}
export const forgotPasswordService = (email) => {
   const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
   };
   return fetch("/forgot/password", requestOptions)
      .then(handleResponse)
      .then(data => {
         localStorage.setItem('user_id', data.user_id)
         return data
      })
}
export const setPasswordService = (user_id, otp, password, confirm_password) => {
   const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id, otp, password, confirm_password })
   };
   return fetch("/reset/forgot/password", requestOptions)
      .then(handleResponse)
      .then(data => {
         localStorage.removeItem('user_id')
         return data
      })
}



export const changePasswordService = (old_password, new_password, confirm_password) => {
   const requestOptions = {
      method: 'PUT',
      headers: { ...authHeader(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ old_password, new_password, confirm_password })
   };
   return fetch("/change/password", requestOptions)
      .then(handleResponse)
      .then(data => {
         return data
      })
}

export const valueTagGetService = () => {
   const requestOptions = {
      method: 'GET',
      headers: authHeader(),
   };
   return fetch("/valuetags", requestOptions)
      .then(handleResponse)
      .then(data => {
         return data
      })
}
export const characterTagGetService = () => {
   const requestOptions = {
      method: 'GET',
      headers: authHeader(),
   };
   return fetch("/charactertags", requestOptions)
      .then(handleResponse)
      .then(data => {
         return data
      })
}
export const valueTagAddService = (name, icon_url, tag_id) => {
   const formData = new FormData();
   formData.append('icon_url', icon_url)
   formData.append('name', name)
   formData.append('tag_id', tag_id)
   const requestOptions = {
      method: 'POST',
      headers: authHeader(),
      body: formData //JSON.stringify({ name, icon_url, tag_id })
   };
   return fetch("/valuetag/create", requestOptions).then(handleResponse)
}
export const characterTagAddService = (name, icon_url, tag_id) => {
   const formData = new FormData();
   formData.append('icon_url', icon_url)
   formData.append('name', name)
   formData.append('tag_id', tag_id)
   const requestOptions = {
      method: 'POST',
      headers: authHeader(),
      body: formData
   };
   return fetch("/charactertag/create", requestOptions).then(handleResponse)
}