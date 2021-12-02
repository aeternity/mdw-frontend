import { fetchMiddleware, transformMetaTx } from './utils'

export const state = () => ({
  transactions: []
})

export const mutations = {
  addTransactions (state, transactions) {
    const transformed = transactions.map(t => t.tx.type === 'GAMetaTx' ? transformMetaTx(t) : t)
    state.transactions = [...transactions, transformed]
  }
}

export const actions = {
  getLatest: async function ({ state, rootGetters: { middleware }, commit }, { limit, page }) {
    try {
      if (page !== null) {
        const res = await fetchMiddleware(page)
        commit('addTransactions', res.data)
        return res
      }
      const transactions = await middleware.getTxBackward({ limit })
      commit('addTransactions', transactions.data)
      return transactions
    } catch (e) {
      commit('catchError', 'Error', { root: true })
    }
  },
  getTxByType: async function ({ rootGetters: { middleware }, commit }, { page, limit, type }) {
    try {
      if (page !== null) {
        const res = await fetchMiddleware(page)
        return res
      }

      const transactions = await middleware.getTxBackward({ limit, type })
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
      if (page !== null) {
        const res = await fetchMiddleware(page)
        return res
      }

      const tx = await middleware.getTxBackward({ account, limit, type: txtype || undefined })
      return tx
    } catch (e) {
      console.log(e)
      commit('catchError', 'Error', { root: true })
      return { data: null, next: false }
    }
  }
}
