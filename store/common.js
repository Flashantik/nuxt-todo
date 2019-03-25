export default {
  state: {
    loading: true,
    messageToClient: null
  },
  mutations: {
    setLoading (state, payload) {
      state.loading = payload
    },
    setMessageToClient (state, payload) {
      state.messageToClient = payload
    },
    clearMessageToClient (state) {
      state.messageToClient = null
    }
  },
  actions: {
    setLoading ({ commit }, payload) {
      commit('setLoading', payload)
    },
    setMessageToClient ({ commit }, payload) {
      commit('clearMessageToClient')
      setTimeout(function () {
        commit('setMessageToClient', payload)
      }, 200)
    },
    clearMessageToClient ({ commit }) {
      commit('clearMessageToClient')
    }
  },
  getters: {
    loading (state) {
      return state.loading
    },
    messageToClient (state) {
      return state.messageToClient
    }
  }
}
