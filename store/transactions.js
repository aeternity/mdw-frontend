import Vue from 'vue'
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
  getLatestTransactions: async function ({ state, dispatch, commit }, { limit }) {
    const page = state.lastPage + 1
    const transactions = await dispatch('callMiddlewareFunction', { functionName: 'getTxBackward', args: { page, limit } }, { root: true })
    commit('setTransactions', transactions?.data)
    if (transactions) commit('setLastPage', page)
    return transactions?.data
  },
  getTxByType: async function ({ dispatch }, args) {
    return (await dispatch('callMiddlewareFunction', { functionName: 'getTxBackward', args }, { root: true }))?.data
  },
  getTransactionById: async function ({ dispatch, commit }, id) {
    const functionName = id.startsWith('th_') ? 'getTxByHash' : 'getTxByIndex'
    const transaction = await dispatch('callMiddlewareFunction', { functionName, args: id }, { root: true })
    commit('setTransactions', transaction ? [transaction] : [])
    return transaction
  },
  getTransactionByAccount: async function ({ dispatch }, { type = undefined, ...args }) {
    return (await dispatch('callMiddlewareFunction', { functionName: 'getTxBackward', args: { type, ...args } }, { root: true }))?.data
  }
}
