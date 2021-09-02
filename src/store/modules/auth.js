import router from '../../router'

import { io } from "socket.io-client";
import axios from 'axios'

const demo = {
  token: 'some token',
  profile: {
    about: undefined,
    supportPin: 78237,
    twoFa: true,
    pic: 'https://i.ibb.co/wNZW3Jd/ETH.jpg',
    email: 'some.long.email@mail.com',
    private: true,
    role: {
      name: 'user',
      settings: {
        commission: 1,
        withdrawErrorMessage:
          'Your external wallet has not been verified. Become a stacking participant or make at least one minimum deposit. For more information, contact chat support.',
        withdrawEmailConfirmation: false,
        withdrawEmailErrorMessage:
          'The withdrawal request has been successfully created. To approve withdrawals, you need to click on the link that is sent to your email.',
      },
    },
    firstName: 'Mike',
    lastName: 'Wazofski',
    wallets: {
      bitcoin: {
        balance: 2.0511199987,
        address: '3MHa3bNAjryesgS2FbGRv9J7bF6USds6xA',
        price: 18994.54,
        chartPoints:
          '0,38 1,38 1,38 2,38 3,38 3,40 4,40 5,41 6,40 6,43 7,40 8,39 8,38 9,37 10,36 10,36 11,37 12,38 13,37 13,38 14,38 15,38 15,39 16,40 17,38 18,36 18,36 19,35 20,35 20,35 21,35 22,33 22,29 23,25 24,25 25,27 25,40 26,42 27,36 27,35 28,35 29,35 30,36 30,39 31,36 32,36 32,38 33,42 34,44 34,46 35,43 36,42 37,41 37,42 38,42 39,42 39,41 40,41 41,39 42,37 42,38 43,37 44,37 44,37 45,36 46,37 46,38 47,38 48,38 49,37 49,37 50,37 51,38 51,38 52,38 53,38 54,36 54,35 55,35 56,34 56,34 57,34 58,35 59,35 59,33 60,33 61,34 61,35 62,36 63,36 63,39 64,38 65,37 66,37 66,38 67,36 68,36 68,35 69,36 70,36 71,34 71,33 72,32 73,32 73,32 74,32 75,33 75,32 76,32 77,32 78,31 78,31 79,32 80,32 80,32 81,33 82,32 83,30 83,28 84,27 85,29 85,30 86,32 87,32 87,32 88,32 89,33 90,34 90,33 91,34 92,35 92,32 93,33 94,33 95,33 95,30 96,29 97,29 97,29 98,30 99,31 100,30 100,32 101,36 102,37 102,36 103,35 104,36 104,38 105,37 106,37 107,37 107,37 108,40 109,37 109,37 110,37 111,39 112,39 112,38 113,39 114,42 114,41 115,42 116,43 116,42 117,42 118,40 119,40 119,42 120,42 121,44 121,42 122,44 123,42 124,43 124,48 125,50 126,45 126,44 127,43 128,43 128,42 129,42 130,42 131,41 131,40 132,41 133,41 133,41 134,40 135,40 136,40 136,41 137,40 138,42 138,41 139,43 140,44 140,46 141,47 142,44 143,43 143,41 144,40 145,39 145,37 146,39 147,39 148,39 148,40 149,39 150,41 150,42 151,42 152,42 153,42 153,42 154,39 155,39 155,39 156,40 157,40 157,41 158,38 159,37 160,36 160,35 161,34 162,34 162,33 163,32 164,32 165,37 165,34 166,34 167,35 167,36 168,37 169,37 169,39 170,37 171,36 172,38 172,38 173,37 174,37 174,37 175,39 176,49 177,62 177,59 178,60 179,60 179,59 180,54 181,57 181,57 182,58 183,56 184,56 184,55 185,55 186,56 186,60 187,60 188,55 189,60 189,60 190,65 191,69 191,66 192,68 193,75 193,70 194,66 195,65 196,63 196,62 197,59 198,62 198,60 199,59 ',
      },
      ethereum: {
        balance: 0.01,
        address: '0x623545549dc77894e688C9ee44E79979AD797325',
        price: 591.13,
        chartPoints:
          '0,38 1,38 1,38 2,37 3,37 3,38 4,39 5,40 6,40 6,42 7,40 8,38 8,36 9,36 10,35 11,35 11,36 12,37 13,37 13,39 14,39 15,39 16,39 16,40 17,40 18,39 18,38 19,37 20,36 20,36 21,36 22,34 23,32 23,29 24,25 25,25 25,28 26,40 27,40 28,36 28,34 29,32 30,32 30,36 31,36 32,33 33,33 33,34 34,36 35,39 35,40 36,38 37,36 38,35 38,36 39,36 40,38 40,36 41,35 42,34 43,33 43,34 44,34 45,34 45,34 46,33 47,33 48,34 48,34 49,35 50,34 50,36 51,36 52,37 53,37 53,38 54,37 55,37 55,36 56,36 57,35 58,35 58,35 59,35 60,36 60,35 61,35 62,35 62,34 63,35 64,36 65,38 65,37 66,38 67,38 67,38 68,36 69,36 70,35 70,35 71,35 72,34 72,33 73,33 74,32 75,33 75,33 76,33 77,33 77,32 78,32 79,32 80,32 80,33 81,33 82,33 82,34 83,33 84,31 85,29 85,29 86,30 87,29 87,31 88,31 89,30 90,30 90,31 91,31 92,31 92,34 93,33 94,32 95,33 95,34 96,32 97,29 97,29 98,29 99,29 100,30 100,30 101,31 102,33 102,35 103,34 104,34 104,34 105,36 106,36 107,36 107,36 108,35 109,36 109,36 110,36 111,36 112,39 112,40 113,39 114,40 114,43 115,44 116,44 117,46 117,46 118,44 119,42 119,44 120,48 121,45 122,45 122,45 123,45 124,48 124,50 125,47 126,45 127,45 127,45 128,44 129,44 129,44 130,44 131,44 132,44 132,45 133,45 134,43 134,43 135,43 136,43 137,44 137,43 138,44 139,44 139,45 140,46 141,48 141,48 142,46 143,45 144,44 144,44 145,43 146,42 146,43 147,42 148,43 149,43 149,43 150,43 151,45 151,46 152,46 153,46 154,47 154,47 155,44 156,44 156,44 157,44 158,46 159,46 159,44 160,41 161,39 161,38 162,37 163,37 164,36 164,36 165,37 166,39 166,38 167,38 168,39 169,40 169,40 170,40 171,41 171,40 172,41 173,42 174,41 174,41 175,41 176,42 176,49 177,61 178,61 179,62 179,63 180,63 181,60 181,62 182,60 183,61 183,60 184,58 185,57 186,57 186,61 187,63 188,61 188,62 189,63 190,65 191,68 191,69 192,69 193,75 193,73 194,69 195,69 196,67 196,66 197,64 198,65 198,65 199,62 ',
      },
      litecoin: {
        balance: 0,
        address: 'MQqp1kZYNe1ceFnjHnededb6Crke5nqyDx',
        price: 85.23,
        chartPoints:
          '0,38 1,37 1,37 2,36 3,35 3,37 4,39 5,40 6,39 6,40 7,37 8,35 9,36 9,34 10,34 11,35 11,36 12,36 13,37 14,39 14,39 15,39 16,40 17,40 17,39 18,37 19,37 19,37 20,36 21,35 22,33 22,29 23,25 24,25 25,29 25,40 26,44 27,38 27,39 28,36 29,38 30,39 30,40 31,38 32,39 32,40 33,41 34,42 35,42 35,40 36,39 37,40 38,40 38,40 39,40 40,39 40,40 41,39 42,41 43,40 43,41 44,40 45,40 46,41 46,41 47,41 48,41 48,41 49,42 50,42 51,43 51,42 52,43 53,43 53,42 54,42 55,42 56,41 56,41 57,41 58,41 59,41 59,40 60,41 61,40 61,40 62,41 63,41 64,43 64,44 65,45 66,45 67,45 67,44 68,43 69,43 69,41 70,40 71,38 72,37 72,38 73,38 74,38 75,38 75,38 76,37 77,37 77,37 78,38 79,38 80,40 80,40 81,41 82,41 82,39 83,38 84,36 85,36 85,37 86,37 87,38 88,37 88,37 89,37 90,38 90,37 91,38 92,40 93,40 93,40 94,40 95,39 96,36 96,34 97,34 98,34 98,35 99,35 100,35 101,38 101,40 102,40 103,40 103,41 104,40 105,40 106,40 106,41 107,41 108,40 109,40 109,41 110,41 111,42 111,42 112,43 113,46 114,46 114,46 115,47 116,47 117,46 117,46 118,44 119,46 119,49 120,50 121,50 122,52 122,50 123,51 124,54 125,54 125,48 126,47 127,47 127,47 128,47 129,47 130,47 130,47 131,47 132,47 132,47 133,46 134,46 135,46 135,46 136,47 137,47 138,49 138,49 139,49 140,50 140,52 141,53 142,50 143,50 143,49 144,47 145,47 146,46 146,46 147,47 148,47 148,49 149,48 150,48 151,49 151,49 152,50 153,50 153,51 154,51 155,49 156,49 156,50 157,50 158,52 159,52 159,49 160,49 161,47 161,46 162,43 163,42 164,42 164,42 165,41 166,41 167,42 167,42 168,43 169,44 169,46 170,45 171,45 172,46 172,47 173,46 174,46 175,47 175,47 176,54 177,62 177,63 178,64 179,65 180,65 180,60 181,61 182,62 182,61 183,59 184,59 185,59 185,61 186,62 187,64 188,63 188,61 189,63 190,64 190,67 191,69 192,69 193,75 193,72 194,69 195,69 196,67 196,65 197,65 198,65 198,65 199,65 ',
      },
    },
    newMessages: 0,
    transactions: [
      {
        at: 1606068180000,
        amount: 0.01,
        currency: 'Ethereum',
        name: 'Transfer',
        status: 'completed',
        type: 'received',
      },
      {
        at: 1606068399549,
        amount: 2,
        currency: 'Bitcoin',
        name: 'Transfer',
        status: 'completed',
        type: 'received',
      },
      {
        at: 1606068399549,
        amount: 2.8409,
        currency: 'Bitcoin',
        name: 'Transfer',
        status: 'completed',
        type: 'received',
      },
      {
        at: 1606068802608,
        amount: 0.01,
        currency: 'Bitcoin',
        name: 'Transfer',
        status: 'completed',
        type: 'received',
      },
      {
        at: 1606068805903,
        amount: 0.01,
        currency: 'Bitcoin',
        name: 'Transfer',
        status: 'completed',
        type: 'received',
      },
      {
        at: 1606068809284,
        amount: 0.01,
        currency: 'Bitcoin',
        name: 'Transfer',
        status: 'completed',
        type: 'received',
      },
      {
        at: 1606068812326,
        amount: 0.01,
        currency: 'Bitcoin',
        name: 'Transfer',
        status: 'completed',
        type: 'received',
      },
      {
        at: 1606068815694,
        amount: 0.01,
        currency: 'Bitcoin',
        name: 'Transfer',
        status: 'completed',
        type: 'received',
      },
      {
        at: 1606068819051,
        amount: 0.01,
        currency: 'Bitcoin',
        name: 'Transfer',
        status: 'completed',
        type: 'received',
      },
      {
        at: 1606068802350,
        exp: 1606070002350,
        address: 'SOME DEPOSIT ADDRESS',
        name: 'Deposit',
        amount: 0.01,
        network: 'BTC',
        status: 'completed',
      },
      {
        at: 1606068805645,
        exp: 1606070005645,
        address: 'SOME DEPOSIT ADDRESS',
        name: 'Deposit',
        amount: 0.01,
        network: 'BTC',
        status: 'completed',
      },
      {
        at: 1606068809030,
        exp: 1606070009030,
        address: 'SOME DEPOSIT ADDRESS',
        name: 'Deposit',
        amount: 0.01,
        network: 'BTC',
        status: 'completed',
      },
      {
        at: 1606068812062,
        exp: 1606070012062,
        address: 'SOME DEPOSIT ADDRESS',
        name: 'Deposit',
        amount: 0.01,
        network: 'BTC',
        status: 'completed',
      },
      {
        at: 1606068815437,
        exp: 1606070015437,
        address: 'SOME DEPOSIT ADDRESS',
        name: 'Deposit',
        amount: 0.01,
        network: 'BTC',
        status: 'completed',
      },
      {
        at: 1606068818796,
        exp: 1606070018796,
        address: 'SOME DEPOSIT ADDRESS',
        name: 'Deposit',
        amount: 0.01,
        network: 'BTC',
        status: 'completed',
      },
    ],
    settings: { commission: 1 },
    popup: null,
    id: 'some id',
    generalChat: true,
    at: 1570076351325
  },
  messages: [
    {
      text: 'hey',
      at: +new Date(),
      yours: true,
    },
    {
      text: 'hey',
      at: +new Date(),
      yours: true,
    },
    {
      text: 'hey',
      at: +new Date(),
      yours: true,
    },
    {
      text: 'hey',
      at: +new Date(),
      yours: true,
    },
  ],
}

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
    messages: [],
    ...(process.env.NODE_ENV == 'development' ? demo : {})
  },
  actions: {
    logout: ({ state }, { redirect, ghostToken }) => {
      state.token = null
      state.profile = null

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
      if (this.socket?.connected) return

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

      if (token) localStorage.setItem('auth-token', token)
      if (profile) state.profile = profile
    },
    CONNECT(state) {
      state.socket?.disconnect()

      state.socket = io('/', {
        query: `lobby=${state.profile?.lobby || 'total'}&user=${state.profile?.id || 'total'}`
      })

      // state.socket.on('connect', () => {
      // state.socketConnected = true
      // })
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
