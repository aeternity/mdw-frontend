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
  getContracts: async function ({ dispatch, commit }, { page, limit }) {
    const args = { typeGroup: 'contract', page, limit }
    const contracts = await dispatch('callMiddlewareFunction', { functionName: 'getTxBackward', args }, { root: true })
    commit('setContracts', contracts ? contracts.data : [])
    return contracts ? contracts.data : []
  },

  getContractCreateTx: async function ({ dispatch }, { contract, page, limit }) {
    const args = { type: 'contract_create', page, limit, contract }
    const contractTx = await dispatch('callMiddlewareFunction', { functionName: 'getTxBackward', args }, { root: true })
    return contractTx ? contractTx.data : { transactions: [] }
  },
  getContractCalls: async function ({ dispatch }, { contract, page, limit }) {
    const args = { type: 'contract_call', page, limit, contract }
    const contractTx = await dispatch('callMiddlewareFunction', { functionName: 'getTxBackward', args }, { root: true })
    return contractTx ? contractTx.data : []
  }
}
