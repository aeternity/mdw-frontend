import Vue from 'vue'
import { fetchMiddleware, fetchJson } from './utils'

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
    { contractId, address, id, _function }
  ) {
    let allTokens = tokens
    if (!tokens.length) {
      allTokens = await dispatch('getAllTokens')
    }
    const token = allTokens.find((t) => t.contractId === contractId)
    if (!token) return null
    try {
      let tokenInfo = {
        ...(await dispatch('getAex9Transfers', { address })).find(
          (b) => b.callTxi === id
        ),
        ...token
      }

      // Get the recepiet address
      if (!tokenInfo.recipient && _function) {
        const loadContract = await dispatch('contracts/getContractCalls', { contract: contractId, page: null, limit: 10 }, { root: true })
        let recipient = null
        let amount = tokenInfo.amount

        try {
          loadContract.data.forEach(ct => {
            if (ct.tx.function === _function && ct.tx.arguments && !recipient) {
              ct.tx.arguments.forEach(arg => {
                if (arg.type === 'address') {
                  recipient = arg.value
                }

                if (arg.type === 'int') {
                  amount = arg.value
                }
              })
            }
          })
        } catch (error) {

        }
        tokenInfo.recipient = recipient
        tokenInfo.amount = amount
      }

      return tokenInfo
    } catch (e) {
      console.log(e)
      return {}
    }
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
        token
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
  },
  getTokenBalances: async function ({ rootState: { nodeUrl } }, contractId) {
    const tokenBalances = await fetchJson(`${nodeUrl}/aex9/balances/${contractId}`)
    return Object.entries(tokenBalances.amounts)
  }
}
