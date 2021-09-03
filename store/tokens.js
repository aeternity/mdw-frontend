import { fetchMiddleware } from './utils'

export const state = () => ({
  tokens: []
})

export const mutations = {
  setTokens (state, tokens) {
    state.tokens = tokens
  }
}

export const actions = {
  getAllTokens: async function ({ commit }) {
    try {
      const tokens = await fetchMiddleware('aex9/by_name')
      commit('setTokens', tokens)
      return tokens
    } catch (e) {
      console.log(e)
      return []
    }
  },
  getTokenTransactionInfo: async function ({ state: { tokens }, dispatch }, { contractId, address, id }) {
    let allTokens = tokens
    if (!tokens.length) {
      allTokens = await dispatch('getAllTokens')
    }
    const token = allTokens.find(t => t.contractId === contractId)
    if (!token) return null
    try {
      return { ...(await fetchMiddleware(`aex9/transfers/from/${address}`)).find(b => b.callTxi === id), ...token }
    } catch (e) {
      console.log(e)
      return {}
    }
  },
  getAex9Transactions: async function ({ state: { tokens }, dispatch }, { address, incoming = false }) {
    let allTokens = tokens
    if (!tokens.length) {
      allTokens = await dispatch('getAllTokens')
    }
    const transactions = await fetchMiddleware(`aex9/transfers/${incoming ? 'to' : 'from'}/${address}`)
    return transactions.map(tx => {
      const token = allTokens.find(t => t.contractId === tx.contractId)
      return { tx: { ...tx, type: incoming ? 'Aex9ReceivedTx' : 'Aex9SentTx' }, token }
    })
  }
}
