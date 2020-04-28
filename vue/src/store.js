import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    snackbar: {
      visible: false,
      text: '',
      timeout: 4000,
    },
    mutations: {
      updateSnackbar(state, payload) {
        state.snackbar.text = payload.text
        state.snackbar.visible = true
      }
    },
    actions: {
      updateSnackbar({ commit }, payload) {
        commit('updateSnackbar', payload)
      }
    }
  }
})

export default store