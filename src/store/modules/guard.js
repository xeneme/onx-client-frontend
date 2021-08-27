export default {
  namespaced: true,
  state: {
    pin: null,
    contract: null,
    // contract: {
    //   //  REMOVE LATER
    //   timestamp: 8932489,
    //   title: 'Test title',
    //   pin: '0342',
    //   messages: [],
    //   status: 'waiting for payment',
    //   amount: 0.72,
    //   symbol: 'ETH',
    //   buyer: 1,
    // },
    connecting: false,
  },
  mutations: {
    SET_PIN: (state, pin) => {
      state.pin = pin
    },
    RESET_READY: (state) => {
      state.contract.ready = false
    },
    SET_CONTRACT: (state, contract) => {
      state.contract = contract
    },
    CONNECTING: (state, payload) => {
      state.connecting = payload
    }
  },
  actions: {},
  getters: {
    PIN: state => state.pin,
    CONTRACT: state => state.contract,
    connectingToContract: state => state.connecting,
  },
}
