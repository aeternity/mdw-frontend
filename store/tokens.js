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
    { transaction }
  ) {
    let tokenInfo = {
      sender: transaction.tx.callerId
    }
    let contracts = []

    let allTokens = tokens
    if (!tokens.length) {
      allTokens = await dispatch('getAllTokens')
    }

    if (typeof transaction.tx.return === 'object' && transaction.tx.return.type === 'list') {
      transaction.tx.return.value.forEach((arg, index) => {
        if (arg.type === 'int') {
          contracts[index] = {
            amount: arg.value
          }
        }
      })
    }

    transaction.tx.arguments.forEach((arg, index) => {
      // swap contrats
      if (transaction.tx.function && transaction.tx.function.includes('swap')) {
        if (arg.type === 'list' && Array.isArray(arg.value)) {
          arg.value.forEach((_arg, i) => {
            if (_arg.type === 'contract' && contracts[i]) {
              contracts[i].contractId = _arg.value
            } else {
              contracts[i] = {
                contractId: _arg.value
              }
            }
          })
        }
      } else { // allowance
        if (arg.type === 'int') {
          contracts = [
            {
              contractId: transaction.tx.contractId,
              amount: arg.value
            }
          ]
        }

        if (arg.type === 'address') {
          tokenInfo.recipient = arg.value
        }
      }
    })

    let _tokens = []
    for (const contract of contracts) {
      if (contract && contract.contractId) {
        let _token = allTokens.find((t) => t.contractId === contract.contractId)
        if (_token) {
          _tokens.push({
            ...contract,
            ..._token
          })
        } else {
          // when the token not found default to AE
          _tokens.push({
            ...contract,
            decimals: 18,
            name: null,
            symbol: 'AE'
          })
        }
      }
    }

    let getAex9Transfers = (
      await dispatch('getAex9Transfers', {
        address: transaction.tx.callerId
      })
    ).find((b) => b.callTxi === transaction.txIndex)

    if (!getAex9Transfers) {
      getAex9Transfers = (
        await dispatch('getAex9Transfers', {
          address: transaction.tx.callerId,
          incoming: true
        })
      ).find((b) => b.callTxi === transaction.txIndex)
    }

    tokenInfo = {
      ...tokenInfo,
      ...getAex9Transfers,
      tokens: _tokens
    }

    console.info('=============')
    console.info('tokenInfo :: ', tokenInfo)
    console.info('=============')

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
    const tokenBalances = await fetchJson(
      `${nodeUrl}/aex9/balances/${contractId}`
    )
    return Object.entries(tokenBalances.amounts)
  }
}
