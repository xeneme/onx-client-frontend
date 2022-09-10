import Vue from 'vue'
import VueRouter from 'vue-router'

import store from '../store'

import { setTerms, connectToTrade, authorize, checkRef } from './functions'

Vue.use(VueRouter)

import routes from './routes'

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})


router.beforeEach((to, from, next) => {
  const betweenNested = to.path != from.path && to.path.split('/')[1].toString() == from.path.split('/')[1]

  if (to.name == 'Terms') {
    setTerms()
  } else if (to.name == 'Trading') {
    store.dispatch('trading/disconnect')
  } else if (to.name != 'Main') {
    document.body.style.overflowY = 'auto'
  } else {
    if (Vue.prototype.$isDesktop) document.body.style.overflowY = 'hidden'
  }

  if (to.path === '/reset' && to.query.token) {
    store.commit('auth/RESET_PASSWORD', to.query.token)
    router.push({ path: '/' })
  }

  if (to.name == 'TradeGuard' && !store.getters['guard/CONTRACT']) {
    connectToTrade(from, to, next, router)
  } else if (!betweenNested) {
    store.dispatch('preloader/startBeforeLoading').then(next)
  } else {
    next()
  }

  if (to.query.ref) {
    checkRef(to.query.ref)
  }
})

router.beforeResolve((to, from, next) => {
  if (to.name == 'TradeGuard' && !store.getters['guard/CONTRACT']) {
    router.push({ path: '/wallet' })
  } else if (store.getters['auth/profile']) {
    next()
  } else {
    const token = localStorage.getItem('auth-token')

    if (!token) {
      if (!store.state.auth.isDemo) {
        if (['Profile', 'Wallet', 'ReferralRace'].includes(to.name)) {
          router.push({ path: '/' })
          store.commit('popups/SIGN_IN', true)
        }

        localStorage.removeItem('auth-token')
      }

      next()
    } else {
      authorize(to, next, router)
    }
  }

  // if (to.name == 'Trading') {
    // store.dispatch('trading/connect')
  // }

  store.dispatch('auth/afterLogout')

  document.body.scrollTop = 0
})

router.afterEach((to) => {
  let host = store.getters.host
  let title = to.name != 'Main' ? host + ' - ' + to.name : host
  store.commit('SET_TITLE', title)

  if (!['Trading', 'TradeGuard'].includes(to.name)) {
    store.dispatch('preloader/startAfterLoading')
  }
})

export default router
