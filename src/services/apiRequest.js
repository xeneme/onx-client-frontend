import axios from 'axios'

export default axios.create({
  baseURL: '/api',
  withCredentials: false,
  headers: {
    Accept: 'applications/json',
    'Content-Type': 'application/json',
    Authorization: localStorage.getItem('auth-token'),
  }
})