import Vue from 'vue'
import { fetchMiddleware, fetchJson } from './utils'
import * as transactionTokenInfoResolvers from './utils/transaction-token-info-resolvers'

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

  getTokenTransactionInfo: async function (
    { state: { tokens }, dispatch },
    { transaction }
  ) {
    if (!transaction.tx.function) return null

    let _function = String(transaction.tx.function)
      .replaceAll('_', ' ')
      .split(' ')
      .map((text, index) =>
        index === 0 ? text : text.charAt(0).toUpperCase() + text.slice(1)
      )
      .join('')

    if (!transactionTokenInfoResolvers[_function]) {
      console.error(`${_function} resolver is not implemented.`)
      return null
    }

    let allTokens = tokens
    if (!tokens.length) {
      allTokens = await dispatch('getAllTokens')
    }

    let tokenInfo = await transactionTokenInfoResolvers[_function](transaction, allTokens)

    return tokenInfo
  },
  getAex9Transactions: async function (
    { state: { tokens }, dispatch },
    { address, incoming = false }
  ) {
    let allTokens = tokens
    if (!tokens.length) {
      allTokens = await dispatch('getAllTokens')
    }
    const transactions = await dispatch('getAex9Transfers', {
      address,
      incoming
    })
    return transactions.map((tx) => {
      const token = allTokens.find((t) => t.contractId === tx.contractId)
      return {
        tx: { ...tx, type: incoming ? 'Aex9ReceivedTx' : 'Aex9SentTx' },
        token: {
          decimals: 18,
          ...token
        }
      }
    })
  },
  getAex9Transfers: async function (
    { state: { transfers }, commit },
    { address, incoming = false }
  ) {
    let addressTransfers = transfers[incoming ? 'to' : 'from'][address]
    if (!addressTransfers) {
      addressTransfers = await fetchMiddleware(
        `aex9/transfers/${incoming ? 'to' : 'from'}/${address}`
      )
      commit('setTransfers', { address, incoming, transfers: addressTransfers })
    }
    return addressTransfers
  },
  getAccountBalance: async function ({ state: { tokens } }, { address }) {
    try {
      const balance = await fetchMiddleware(`aex9/balances/account/${address}`)
      if (balance.hasOwnProperty('error')) {
        return []
      }
      return balance.map((b) => {
        const tokenInfo = tokens.find((t) => t.contractId === b.contractId)
        return {
          ...b,
          decimals: tokenInfo.decimals,
          symbol: tokenInfo.symbol,
          name: tokenInfo.name
        }
      })
    } catch (error) {
      return null
    }
  },
  getTokenBalances: async function ({ rootState: { nodeUrl } }, contractId) {
    const tokenBalances = await fetchJson(
      `${nodeUrl}/aex9/balances/${contractId}`
    )
    return Object.entries(tokenBalances.amounts)
  }
}
