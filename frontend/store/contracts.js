import Vue from 'vue'
import axios from 'axios'

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
  getContracts: async function ({ rootState: { nodeUrl }, commit }, { page, limit }) {
    try {
      const url = `${nodeUrl}/txs/backward?type_group=contract&limit=${limit}&page=${page}`
      const contracts = await axios.get(url)
      console.info('MDW 🔗 ' + url)
      commit('setContracts', contracts.data.data)
      return contracts.data.data
    } catch (e) {
      console.log(e)
      commit('catchError', 'Error', { root: true })
      return []
    }
  },

  getContractTx: async function ({ rootState: { nodeUrl }, commit }, { contract, page, limit }) {
    try {
      const url = `${nodeUrl}/txs/backward?contract=${contract}&limit=${limit}&page=${page}`
      const contractTx = await axios.get(url)
      console.info('MDW 🔗 ' + url)
      return contractTx.data.data
    } catch (e) {
      console.log(e)
      commit('catchError', 'Error', { root: true })
      return { transactions: [] }
    }
  },
  getContractCalls: async function ({ rootState: { nodeUrl }, commit }, { contract, page, limit }) {
    try {
      const url = `${nodeUrl}/txs/backward?contract=${contract}&type=contract_call&limit=${limit}&page=${page}`
      const contractCalls = await axios.get(url)
      console.info('MDW 🔗 ' + url)
      return contractCalls.data.data
    } catch (e) {
      console.log(e)
      commit('catchError', 'Error', { root: true })
      return []
    }
  }
}
