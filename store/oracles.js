import Vue from 'vue'

export const state = () => ({
  oracles: {}
})

export const mutations = {
  setOracles (state, oracles) {
    for (let oracle of oracles) {
      Vue.set(state.oracles, oracle.oracle, oracle)
    }
  }
}

export const actions = {
  getOracles: async function ({ rootGetters: { middleware }, commit }, { page, limit }) {
    try {
      const oracles = await middleware.getActiveOracles({ page, limit })
      commit('setOracles', oracles.data)
    } catch (e) {
      console.log(e)
      commit('catchError', 'Error', { root: true })
    }
  }
}
