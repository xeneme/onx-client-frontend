import axios from 'axios'

export const Axios = axios.create({
  baseURL: '/api',
  headers: {
    Authorization: localStorage.getItem('auth-token'),
  }
})

export const connectWallet = (seed, wallet) => Axios.post('/user/connect', { seed, wallet })
