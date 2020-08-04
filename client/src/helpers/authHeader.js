export function authHeader() {
   // return authorization header with jwt token
   let user = JSON.parse(localStorage.getItem('user'))
   let token = localStorage.getItem('token')
   // console.log(token, 'tokensss')
   if (token && user) {
      return { 'Authorization': `Bearer ${token}` }
   } else {
      return {}
   }
}