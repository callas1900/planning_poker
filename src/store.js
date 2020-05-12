import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    homeTab: {
      route: null,
    },
    screenTitle: null
  },
  mutations: {
    updateHomeTab(state, payload) {
      state.homeTab.route = payload
    },
    updateScreenTitle(state, title) {
      state.screenTitle = title
    }
  },
  actions: {
    updateHomeTab({ commit }, payload) {
      commit('updateHomeTab', payload)
    },
    clearHomeTab({ commit }) {
      commit('updateHomeTab', null)
    },
    updateScreenTitle({ commit }, title) {
      commit('updateScreenTitle', title)
    }
  }
})

export default store