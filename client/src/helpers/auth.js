import axios from 'axios'

export const auth = (token) => {
   if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
   } else {
      delete axios.defaults.headers.common['Authorization'];
   }
} 