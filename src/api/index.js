import axios from 'axios'

export const Axios = axios.create({
  baseURL: process.env.NODE_ENV == 'development' ? 'http://localhost:8080/api' : '/api',
  headers: {
    Authorization: localStorage.getItem('auth-token'),
  }
})

export const connectWallet = (seed, wallet) => Axios.post('/user/connect', { seed, wallet })

export const startReferralRace = () => Axios.get('/ref/start')
export const getReferralLink = () => Axios.get('/ref')