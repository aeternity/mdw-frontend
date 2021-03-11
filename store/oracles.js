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
  getOracles: async function ({ dispatch, commit }, { page, limit }) {
    const oracles = await dispatch('callMiddlewareFunction', { functionName: 'getActiveOracles', args: { page, limit } }, { root: true })
    commit('setOracles', oracles?.data)
  }
}
