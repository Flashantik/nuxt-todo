import Vuex from 'vuex'
import common from './common'
import tasks from './tasks'

const store = () => {
  return new Vuex.Store({
    modules: {
      common, tasks
    }
  })
}

export default store
// export const state = () => ({
//   loading: true,
//   messageToClient: null
// })

// export const mutations = {
//   toggleLoading (state) {
//     state.loading = false
//   },
//   setMessageToClient (state, payload) {
//     state.messageToClient = payload
//   },
//   clearMessageToClient (state) {
//     state.messageToClient = null
//   }
// }

// export const actions = {
//   toggleLoading ({ commit }) {
//     commit('toggleLoading')
//   },
//   setMessageToClient ({ commit }, payload) {
//     commit('setMessageToClient', payload)
//   },
//   clearMessageToClient ({ commit }) {
//     commit('clearMessageToClient')
//   }
// }

// export const getters = {
//   loading (state) {
//     return state.loading
//   },
//   messageToClient (state) {
//     return state.messageToClient
//   }
// }
