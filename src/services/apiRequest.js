import axios from 'axios'

export default axios.create({
  baseURL: process.env.NODE_ENV == 'development' ? 'http://localhost:8080/api' : '/api',
  withCredentials: false,
  headers: {
    Accept: 'applications/json',
    'Content-Type': 'application/json',
    Authorization: localStorage.getItem('auth-token'),
  }
})