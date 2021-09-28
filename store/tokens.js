import Vue from 'vue'
import { fetchMiddleware } from './utils'

export const state = () => ({
  tokens: [],
  transfers: {
    from: {},
    to: {}
  }
})

export const mutations = {
  setTokens (state, tokens) {
    state.tokens = tokens
  },
  setTransfers (state, { address, incoming, transfers }) {
    Vue.set(state.transfers[incoming ? 'to' : 'from'], address, transfers)
  }
}

export const actions = {
  getAllTokens: async function ({ state, commit }) {
    if (state.tokens.length) {
      return state.tokens
    }
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
      return { ...(await dispatch('getAex9Transfers', { address })).find(b => b.callTxi === id), ...token }
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
    const transactions = await dispatch('getAex9Transfers', { address, incoming })
    return transactions.map(tx => {
      const token = allTokens.find(t => t.contractId === tx.contractId)
      return { tx: { ...tx, type: incoming ? 'Aex9ReceivedTx' : 'Aex9SentTx' }, token }
    })
  },
  getAex9Transfers: async function ({ state: { transfers }, commit }, { address, incoming = false }) {
    let addressTransfers = transfers[incoming ? 'to' : 'from'][address]
    if (!addressTransfers) {
      addressTransfers = await fetchMiddleware(`aex9/transfers/${incoming ? 'to' : 'from'}/${address}`)
      commit('setTransfers', { address, incoming, transfers: addressTransfers })
    }
    return addressTransfers
  }
}
