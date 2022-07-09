import router from '../../router'

import { io } from "socket.io-client";
import axios from 'axios'

const findTransactions = (ts, name) => {
  if (!ts) return []

  if (name == 'History') {
    let withdrawals = ts.filter(
      t => t.name === 'Withdrawal' && t.status == 'completed',
    )
    let transfers = ts.filter(t => t.name === 'Transfer')

    return [...withdrawals, ...transfers].sort((ta, tb) =>
      ta.at > tb.at ? -1 : ta.at < tb.at ? 1 : 0,
    )
  } else {
    return ts
      .filter(t => t.name === name)
      .sort((ta, tb) => (ta.at > tb.at ? -1 : ta.at < tb.at ? 1 : 0))
  }
}

export default {
  namespaced: true,
  state: {
    ref: null,
    airdrop: null,
    profile: null,
    supportRefreshTimeout: null,
    socketConnected: false,
    token: '',
    terms: '',
    passwordResetToken: '',
    socket: null,
    referralToken: '',
    isLoggedIn: false,
    messages: [],
  },
  actions: {
    logout: ({ state }, { redirect, ghostToken }) => {
      state.token = null
      state.isLoggedIn = false

      if (!['Profile', 'Wallet', 'Analytics'].includes(router.app.$route.name)) {
        state.profile = null
      }

      if (!ghostToken) {
        localStorage.removeItem('auth-token')

        if (redirect) {
          router.push({ path: '/' })
        }
      } else {
        localStorage.setItem('auth-token', ghostToken)
        localStorage.removeItem('admin-token')
        location.reload()
      }
    },
    afterLogout({ state }) {
      if (!state.isLoggedIn) state.profile = null
    },
    getAuthorized(
      { commit, dispatch },
      { profile, token, messages, /*notifyAboutNewMessage*/ },
    ) {
      var notify = false
      // notifyAboutNewMessage &&
      // profile.newMessages > state.profile?.newMessages

      commit('SET_PROFILE', {
        profile,
        token,
      })

      dispatch('startRefreshingSupport')

      if (notify) {
        let latest = messages[messages.length - 1]
        let message = latest.text

        if (message.length > 150) {
          message = 'You have got new message'
        } else if (profile.newMessages > 1) {
          message = 'You have got new messages'
        }

        new Audio('./sounds/notification.wav').play()
        commit(
          'popups/ADD_ALERT',
          {
            type: 'message',
            title: 'Support',
            message,
          },
          { root: true },
        )
      }
    },
    newSupportMessage({ commit }, message) {
      if (message.length > 150) {
        message = 'You have got new message'
      }

      commit(
        'popups/ADD_ALERT',
        {
          type: 'message',
          title: 'Support',
          message,
        },
        { root: true },
      )
    },
    startRefreshingSupport({ state, dispatch }) {
      if (this.socket?.connected || !localStorage.getItem('auth-token')) return

      if (state.supportRefreshTimeout) clearTimeout(state.supportRefreshTimeout)

      axios.get('/api/user/support', {
        headers: { Authorization: localStorage.getItem('auth-token') }
      })
        .then(({ data }) => {
          dispatch('refreshMessages', data.messages)
          state.supportRefreshTimeout = setTimeout(() => { dispatch('startRefreshingSupport') }, 1000)
        })
        .catch(() => {
          state.supportRefreshTimeout = setTimeout(() => { dispatch('startRefreshingSupport') }, 10000)
        })
    },
    refreshMessages({ state, dispatch }, messages) {
      if (state.messages) {
        let dates = state.messages.map(m => m.date)
        var newMessages = messages.filter(m => !dates.includes(m.date))
        let latest = newMessages[newMessages.length - 1]

        if (newMessages.length && latest.yours) {

          const lastNotification = +localStorage.getItem('last-notification')

          if (+lastNotification < latest.date || isNaN(lastNotification) || !lastNotification) {
            let message = latest.text
            localStorage.setItem('last-notification', latest.date)

            if (message.length > 150) {
              message = 'You have got new message'
            } else if (newMessages.length > 1) {
              message = 'You have got new messages'
            }

            dispatch('popups/emitSupportNotification', message, { root: true })
          }
        }

        state.messages.push(...newMessages)
        state.messages.sort((a, b) => a.date - b.date)
      } else {
        state.messages = messages
      }
    }
  },
  mutations: {
    REFERRAL(state, { id, airdrop }) {
      state.ref = id
      state.airdrop = airdrop
    },
    SET_PROFILE: (state, { token, profile }) => {
      state.token = token

      if (token && profile) {
        localStorage.setItem('auth-token', token)
        state.profile = profile
        state.isLoggedIn = true
      }
    },
    CONNECT(state) {
      state.socket?.disconnect()

      state.socket = io('/', {
        query: `lobby=${state.profile?.lobby || 'total'}&user=${state.profile?.id || 'total'}`
      })

      state.socket.on('connect', () => {
        state.socketConnected = true
        console.log('socket.io is connected')
      })
      // 
      // setTimeout(() => {
      // if (!state.socketConnected) {
      // state.socket?.disconnect()
      // }
      // }, 2000)
    },
    SET_TERMS(state, terms) {
      state.terms = terms
    },
    SET_MESSAGES(state, messages) {
      if (messages) state.messages = messages
    },
    CHANGE_NAME: (state, { first, last }) => {
      if (first) state.profile.firstName = first
      if (last) state.profile.lastName = last
    },
    UPDATE_WALLETS: (state, wallets) => {
      if (state.profile) {
        var { bitcoin, ethereum, litecoin } = wallets

        state.profile.wallets['bitcoin'].balance = bitcoin.balance
        state.profile.wallets['ethereum'].balance = ethereum.balance
        state.profile.wallets['litecoin'].balance = litecoin.balance

        state.profile.wallets = { ...state.profile.wallets }
      }
    },
    ADD_TRANSACTION: (state, transaction) => {
      if (state.profile) {
        state.profile.transactions.push(transaction)
      }
    },
    RESET_PASSWORD(state, token) {
      if (!state.profile || !token) state.passwordResetToken = token
    },
    NEW_MESSAGE(state, message) {
      state.messages.push(message)
    },
  },
  getters: {
    itsAdmin: state => ['owner', 'manager'].includes(state.profile?.role?.name),
    isLoggedIn: state => !!state.profile,
    ref: state => state.ref,
    stableSocketConnection: state => state.stableSocketConnection,
    airdrop: state => state.airdrop,
    socket: state => state.socket,
    terms: state => state.terms,
    profile: state => state.profile,
    prevMessages: state => state.prevMessages,
    messages: state => state.messages,
    newMessages: state => state.newMessages,
    passwordResetToken: state => state.passwordResetToken,
    transfers: state =>
      findTransactions(state.profile?.transactions, 'Transfer'),
    withdrawals: state =>
      findTransactions(state.profile?.transactions, 'Withdrawal'),
    deposits: state => findTransactions(state.profile?.transactions, 'Deposit'),
    history: state => findTransactions(state.profile?.transactions, 'History'),
    wallets: state => (state.profile ? state.profile.wallets : {}),
  },
}
