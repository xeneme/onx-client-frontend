import store from '../store'
import { Axios } from '../api'

export const authorize = (to, next, router) => {
  Axios
    .get('/auth', {
      headers: {
        Authorization: localStorage.getItem('auth-token'),
        route: to.name,
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    })
    .then(({ data }) => {
      store.dispatch('auth/getAuthorized', {
        ...data,
        notifyAboutNewMessage: false,
      })

      next()
    })
    .catch(() => {
      if (!store.state.auth.isDemo) {
        // REMOVE ON PRODUCTION
        if (['Profile', 'Wallet'].includes(to.name)) {
          router.push({ path: '/' })
          store.commit('popups/SIGN_IN', true)
        }

        localStorage.removeItem('auth-token')
      }

      next()
    })
}
export const setTerms = () => {
  Axios
    .get('/user/terms', {
      headers: {
        Authorization: localStorage.getItem('auth-token'),
      },
    })
    .then(response => {
      store.commit('auth/SET_TERMS', response.data)
    })
    .catch(() => { })
}
export const checkRef = ref => {
  Axios
    .get('/auth/check-ref/?ref=' + ref, {
    })
    .then(response => {
      if (!response.data.airdrop) { store.commit('popups/SIGN_UP', true) }
      store.commit('auth/REFERRAL', response.data)
    })
    .catch(() => { })
}
export const connectToTrade = (from, to, next, router) => {
  Axios
    .post('/trade-guard/connect', {
      pin: to.query.pin,
    })
    .then(response => {
      store.commit('guard/SET_CONTRACT', response.data)
      if (to.name != from.name) {
        store.dispatch('preloader/startBeforeLoading').then(next)
      }
    })
    .catch(() => {
      router.push({ path: '/wallet' })
    })
}