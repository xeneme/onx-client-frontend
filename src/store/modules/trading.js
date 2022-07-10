export default {
  namespaced: true,
  state: {
    ws: null,
    history: null,
    orderBook: null,
    range: '1D',
    symbol: 'BTC'
  },
  mutations: {
    SET_WEBSOCKET(state, value) {
      state.ws = value
    },
    SET_HISTORY(state, value) {
      state.history = value
    },
    SET_ORDER_BOOK(state, value) {
      state.orderBook = value
    },
    SET_RANGE(state, value) {
      state.range = value
    },
    SET_SYMBOL(state, value) {
      state.symbol = value
    },
  },
  actions: {
    setSymbol({ commit, dispatch }, payload) {
      commit('SET_SYMBOL', payload)
      // dispatch('disconnect')
      // dispatch('connect')
    },
    setRange({ commit, dispatch }, payload) {
      commit('SET_RANGE', payload)
      // dispatch('disconnect')
      // dispatch('connect')
    },
    connect({ state, commit }) {
      state.ws = new WebSocket(`wss://${window.location.hostname}/trading?range=${state.range}&symbol=${state.symbol}`);

      state.ws.onopen = () => {
        console.log("WS is connected");
      };

      state.ws.onmessage = (message) => {
        try {
          let data = JSON.parse(message.data)

          if (data.orders) {
            commit('SET_ORDER_BOOK', data.orders.reverse())
          } else {
            commit('SET_HISTORY', data)
          }

        } catch {
          console.log('failed to set market history')
        }
      };
    },
    disconnect({ state }) {
      state.ws?.close()
    }
  },
  getters: {
    history: state => state.history
  }
}