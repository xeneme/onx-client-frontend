export default {
  namespaced: true,
  state: {
    firstVisit: true,
    isLoading: false,
    beforeDelay: 50,
    afterDelay: 200,
  },
  mutations: {
    PAGE_IS_LOADING: (state, value) => {
      state.isLoading = value
    },
    MARK_VISITED: state => {
      state.firstVisit = false
    },
  },
  actions: {
    startBeforeLoading({ commit, state }) {
      commit('PAGE_IS_LOADING', true)

      return new Promise(resolve =>
        setTimeout(() => {
          resolve()
        }, state.beforeDelay + +!(!state.firstVisit || localStorage.getItem('auth-token')) * 1000),
      )
    },
    startAfterLoading({ commit, state }) {
      return new Promise(resolve => {
        setTimeout(() => {
          // commit('MARK_VISITED')
          commit('PAGE_IS_LOADING', false)
          resolve()
        }, state.afterDelay + +!(!state.firstVisit || localStorage.getItem('auth-token')) * 1000)
      })
    },
  },
  getters: {
    PAGE_IS_LOADING: state => state.isLoading,
    VISITED: state => !state.firstVisit || !!localStorage.getItem('auth-token'),
  },
}
