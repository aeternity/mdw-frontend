import { transformMetaTx } from './utils'

export const state = () => ({
  transactions: []
})

export const mutations = {
  addTransactions (state, transactions) {
    const transformed = transactions.map((t) =>
      t.tx.type === 'GAMetaTx' ? transformMetaTx(t) : t
    )
    state.transactions.push(...transformed)
  }
}

export const actions = {
  getLatest: async function (
    { rootGetters: { middleware, fetchMiddleware }, commit },
    { limit, page }
  ) {
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
  getTxByType: async function (
    { rootGetters: { middleware, fetchMiddleware }, commit },
    { page, limit, type }
  ) {
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
  getTransactionById: async function (
    { rootGetters: { middleware }, commit },
    id
  ) {
    try {
      const tx = await middleware[id.startsWith('th_') ? 'getTxByHash' : 'getTxByIndex'](id)
      commit('addTransactions', [tx])
      return tx
    } catch (e) {
      console.log(e)
      commit('catchError', 'Error', { root: true })
    }
  },
  getTransactionByAccount: async function (
    { rootGetters: { middleware, fetchMiddleware }, commit },
    { account, limit, page, txtype }
  ) {
    try {
      if (page !== null) {
        const res = await fetchMiddleware(page)
        return res
      }

      const tx = await middleware.getTxBackward({
        account,
        limit,
        type: txtype || undefined
      })
      return tx
    } catch (e) {
      console.log(e)
      commit('catchError', 'Error', { root: true })
      return { data: null, next: false }
    }
  },
  getTransactionFunctionCalls: async function ({ _ }, txi) {
    const { data } = await this.getters.fetchMiddleware(`/contracts/calls/txi/${txi}`)
    return data
  },
  getInternalTransactions: async function ({ rootGetters: { fetchMiddleware } }, { account, gen, page }) {
    if (page) {
      const { data, next } = await fetchMiddleware(page)
      return { data: data.map(t => ({ tx: { type: 'InternalTx' }, ...t })), next }
    }
    let queryStr
    if (gen) {
      queryStr = `gen/${gen}`
    }
    if (account) {
      queryStr = `backward?account=${account}`
    }
    const { data, next } = await fetchMiddleware(`/transfers/${queryStr}`)
    return { data: data.map(t => ({ tx: { type: 'InternalTx' }, ...t })), next }
  }
}
