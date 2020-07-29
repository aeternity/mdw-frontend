import Vue from 'vue'
import axios from 'axios'
import { transformMetaTx } from './utils'

export const state = () => ({
  transactions: {},
  lastPage: 0
})

export const mutations = {
  setTransactions (state, transactions) {
    for (let i = 0; i < transactions.length; i++) {
      let transaction = transactions[i]
      if (transaction.tx.type === 'GAMetaTx') {
        transaction = transformMetaTx(transaction)
      }
      if (!state.transactions.hasOwnProperty(transaction.hash)) {
        Vue.set(state.transactions, transaction.hash, transaction)
      }
    }
  },
  setLastPage (state, page) {
    state.lastPage = page
  }
}

export const actions = {
  getLatestTransactions: async function ({ state, rootState: { nodeUrl, height }, commit }, { limit }) {
    try {
      const page = state.lastPage + 1
      const url = `${nodeUrl}/txs/backward?limit=${limit}&page=${page}`
      const transactions = await axios.get(url)
      console.info('MDW 🔗 ' + url)
      commit('setTransactions', transactions.data.data)
      commit('setLastPage', page)
      return transactions.data.data
    } catch (e) {
      commit('catchError', 'Error', { root: true })
    }
  },
  getTxByType: async function ({ rootState: { nodeUrl, height }, commit }, { page, limit, type }) {
    try {
      const url = `${nodeUrl}/txs/backward?type=${type}&limit=${limit}&page=${page}`
      const transactions = await axios.get(url)
      console.info('MDW 🔗 ' + url)
      return transactions.data.data
    } catch (e) {
      console.log(e)
      commit('catchError', 'Error', { root: true })
    }
  },
  getTransactionByHash: async function ({ rootState: { nodeUrl }, commit }, hash) {
    try {
      const url = `${nodeUrl}/tx/${hash}`
      const tx = await axios.get(url)
      console.info('MDW 🔗 ' + url)
      commit('setTransactions', [tx.data])
      return tx.data
    } catch (e) {
      console.log(e)
      commit('catchError', 'Error', { root: true })
    }
  },
  getTransactionByAccount: async function ({ rootState: { nodeUrl }, commit }, { account, limit, page, txtype }) {
    try {
      let url = `${nodeUrl}/middleware/transactions/account/${account}?page=${page}&limit=${limit}`
      if (txtype) {
        url += `&txtype=${txtype}`
      }
      const tx = await axios.get(url)
      console.info('MDW 🔗 ' + url)
      return tx.data
    } catch (e) {
      console.log(e)
      commit('catchError', 'Error', { root: true })
    }
  },
  nuxtServerInit ({ dispatch }, context) {
    return (
      dispatch('getLatestTransactions', { limit: 10 })
    )
  }
}
