export default {
  state: {
    tasks: [],
    doneTasks: []
  },
  mutations: {
    setTasks (state, payload) {
      state.tasks = payload
    },
    setDoneTasks (state, payload) {
      state.doneTasks = payload
    },
    pushDoneTasks (state, payload) {
      state.doneTasks.push(payload)
    }
  },
  actions: {
    setTasks ({ commit }, payload) {
      commit('setTasks', payload)
    },
    setDoneTasks ({ commit }, payload) {
      commit('setDoneTasks', payload)
    },
    pushDoneTasks ({ commit }, payload) {
      commit('pushDoneTasks', payload)
    }
  },
  getters: {
    getTasks (state) {
      return state.tasks
    },
    getDoneTasks (state) {
      return state.doneTasks
    }
  }
}
