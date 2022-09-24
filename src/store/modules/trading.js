export default {
  namespaced: true,
  state: {
    ws: null,
    history: null,
    orderBook: [],
    range: '1D',
    symbol: 'BTC'
  },
  mutations: {
    SET_WEBSOCKET(state, value) {
      state.ws = value
    },
    SET_HISTORY(state, value) {
      state.history = value
      state.orderBook = []
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
    clearOrderBook({ state }) {
      state.orderBook = []
    },
    placeOrder({ state, }, symbol) {
      if (!state.history) return

      let history = state.history

      let { close: price } = history[history.length - 1]

      const randAmountMap = {
        'BTC': {
          min: 0.003,
          mid: 0.08,
          max: 0.23,
          zeros: 6
        },
        'LTC': {
          min: 0.05,
          mid: 4,
          max: 12.5,
          zeros: 5
        },
        'ETH': {
          min: 0.002,
          mid: 2,
          max: 5.2,
          zeros: 5
        },
        'XRP': {
          min: 4,
          mid: 80,
          max: 500,
          zeros: 1
        },
      }

      let amount = (Math.random() * Math.random()) / 10
      let { min, mid, max, zeros } = randAmountMap[symbol]

      if (Math.random() > 0.8) amount = min + Math.random() * mid
      else amount = min + Math.random() * max

      let order = {
        action: Math.random() > 0.5 ? 'sell' : 'buy',
        price,
        amount: +amount.toFixed(zeros),
        ts: +new Date(),
      }

      state.orderBook.unshift(order)
      if (state.orderBook.length > 100) state.orderBook.pop()
    },
    startOrderBook({ state, dispatch }) {
      const start = () => {
        dispatch('placeOrder', state.symbol)
        setTimeout(start, (Math.random() * 1350) + 150)
      }
      start()
    },
    setSymbol({ commit, /*dispatch*/ }, payload) {
      commit('SET_SYMBOL', payload)
      // dispatch('disconnect')
      // dispatch('connect')
    },
    setRange({ commit, /*dispatch*/ }, payload) {
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