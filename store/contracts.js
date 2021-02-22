import Vue from 'vue'

export const state = () => ({
  contracts: []
})

export const mutations = {
  setContracts (state, contracts) {
    for (let contract of contracts) {
      Vue.set(state.contracts, contract.hash, contract)
    }
  }
}

export const actions = {
  getContracts: async function ({ rootState: { middleware }, commit }, { page, limit }) {
    try {
      const contracts = await middleware.getTxBackward({ typeGroup: 'contract', page, limit })
      commit('setContracts', contracts.data)
      return contracts.data
    } catch (e) {
      console.log(e)
      commit('catchError', 'Error', { root: true })
      return []
    }
  },

  getContractCreateTx: async function ({ rootState: { middleware }, commit }, { contract, page, limit }) {
    try {
      const contractTx = await middleware.getTxBackward({ type: 'contract_create', page, limit, contract })
      return contractTx.data
    } catch (e) {
      console.log(e)
      commit('catchError', 'Error', { root: true })
      return { transactions: [] }
    }
  },
  getContractCalls: async function ({ rootState: { middleware }, commit }, { contract, page, limit }) {
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
