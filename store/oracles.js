import Vue from 'vue'
import axios from 'axios'

export const state = () => ({
  oracles: {}
})

export const mutations = {
  setOracles (state, oracles) {
    oracles.forEach(oracle => Vue.set(state.oracles, oracle.oracle, oracle))
  }
}

export const actions = {
  getOracles: async function ({ rootState: { nodeUrl }, commit }, { page, limit }) {
    try {
      const url = `${nodeUrl}/oracles/active?limit=${limit}&page=${page}`
      const oracles = await axios.get(url)
      console.info('MDW 🔗 ' + url)
      commit('setOracles', oracles.data.data)
      return oracles.data.data
    } catch (e) {
      console.log(e)
      commit('catchError', 'Error', { root: true })
    }
  },
  getAllQueries: async function ({ rootState: { nodeUrl }, commit }, { oracleId, page, limit }) {
    try {
      const url = `${nodeUrl}/middleware/oracles/${oracleId}?limit=${limit}&page=${page}`
      const queries = await axios.get(url)
      console.info('MDW 🔗 ' + url)
      return queries.data
    } catch (e) {
      console.log(e)
      commit('catchError', 'Error', { root: true })
    }
  }
}
