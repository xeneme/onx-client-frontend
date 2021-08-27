import Vue from 'vue'
import Vuex from 'vuex'

import { createLogger } from 'vuex'

import modules from './modules'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    host: '',
    title: '',
  },
  mutations: {
    SET_HOST(state, value) {
      state.host = value
      state.title = value
    },
    SET_TITLE(state, value) {
      state.title = value
    },
  },
  getters: {
    host: state => state.host,
    title: state => state.title
  },
  modules,
  plugins: [...(process.env.NODE_ENV == 'development' ? [createLogger()] : [])]
})
