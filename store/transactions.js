import Vue from 'vue'
import { transformMetaTx } from './utils'

export const state = () => ({
  transactions: {},
  lastPage: 0
})

export const mutations = {
  addTransactions (state, transactions) {
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
  getLatest: async function ({ state, rootGetters: { middleware }, commit }, { limit, resetPage = false }) {
    try {
      const page = resetPage ? 1 : state.lastPage + 1
      const transactions = await middleware.getTxBackward({ page, limit })
      commit('addTransactions', transactions.data)
      commit('setLastPage', page)
      return transactions
    } catch (e) {
      commit('catchError', 'Error', { root: true })
    }
  },
  getTxByType: async function ({ rootGetters: { middleware }, commit }, { page, limit, type }) {
    try {
      const transactions = await middleware.getTxBackward({ page, limit, type })
      return transactions
    } catch (e) {
      console.log(e)
      commit('catchError', 'Error', { root: true })
    }
  },
  getTransactionById: async function ({ rootGetters: { middleware }, commit }, id) {
    try {
      const tx = await middleware[id.startsWith('th_') ? 'getTxByHash' : 'getTxByIndex'](id)
      commit('addTransactions', [tx])
      return tx
    } catch (e) {
      console.log(e)
      commit('catchError', 'Error', { root: true })
    }
  },
  getTransactionByAccount: async function ({ rootGetters: { middleware }, commit }, { account, limit, page, txtype }) {
    try {
      const tx = await middleware.getTxBackward({ account, limit, page, type: txtype || undefined })
      return tx
    } catch (e) {
      console.log(e)
      commit('catchError', 'Error', { root: true })
    }
  }
}
