export default {
  namespaced: true,
  state: {
    analyticsCurrency: 'bitcoin'
  },
  mutations: {
    SET_ANALYTICS_CURRENCY(state, value) {
      state.analyticsCurrency = value
    }
  },
  actions: {},
  getters: {},
}
