import { fetchMiddleware } from './utils'

export const state = () => ({
  contracts: [],
  nextPageUrl: ''
})

export const mutations = {
  addContracts (state, contracts) {
    state.contracts.push(...contracts.data)
    state.nextPageUrl = contracts.next
  }
}

export const actions = {
  getLatest: async function ({ rootGetters: { middleware }, state, commit }) {
    try {
      if (state.nextPageUrl) return
      const contracts = await middleware.getTxBackward({ typeGroup: 'contract' })
      commit('addContracts', contracts)
      return contracts.data
    } catch (e) {
      console.log(e)
      commit('catchError', 'Error', { root: true })
      return []
    }
  },
  getMore: async function ({ state: { nextPageUrl }, commit }) {
    const contracts = await fetchMiddleware(nextPageUrl)
    commit('addContracts', contracts)
  },

  getContractCreateTx: async function ({ rootGetters: { middleware }, commit }, { contract, page, limit }) {
    try {
      const contractTx = await middleware.getTxBackward({ type: 'contract_create', page, limit, contract })
      return contractTx.data
    } catch (e) {
      console.log(e)
      commit('catchError', 'Error', { root: true })
      return { transactions: [] }
    }
  },
  getContractCalls: async function ({ rootGetters: { middleware }, commit }, { contract, page, limit }) {
    try {
      const contractCalls = await middleware.getTxBackward({ type: 'contract_call', page, limit, contract })
      return contractCalls.data
    } catch (e) {
      console.log(e)
      commit('catchError', 'Error', { root: true })
      return []
    }
  }
}
