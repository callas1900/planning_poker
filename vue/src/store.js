import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    homeTab: {
      route: null,
    },
  },
  mutations: {
    updateHomeTab(state, payload) {
      state.homeTab.route = payload
    }
  },
  actions: {
    updateHomeTab({ commit }, payload) {
      commit('updateHomeTab', payload)
    },
    clearHomeTab({ commit }) {
      commit('updateHomeTab', null)
    }
  }
})

export default store