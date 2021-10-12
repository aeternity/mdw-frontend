import { fetchJson } from './utils'

export const actions = {
  getAccountDetails: async function ({ rootState: { nodeUrl }, commit }, account) {
    try {
      const acc = await fetchJson(`${nodeUrl.slice(0, -4)}/v3/accounts/${account}`)
      return acc
    } catch (e) {
      commit('catchError', 'Error', { root: true })
      const basicError = {
        id: account,
        balance: 0,
        error: 'Unable to fetch account details'
      }
      if (e.response.status === 500) {
        basicError.error = 'Account not found. If you transfered AE to the account just recently, please give the network some time to sync and recheck again in a few seconds.'
      }
      return basicError
    }
  },

  createFaucetTx: async function ({ rootState: { faucetApi }, commit }, account) {
    try {
      const acc = await fetchJson(`${faucetApi}/${account}`)
      return acc.data
    } catch (e) {
      commit('catchError', 'Error', {
        root: true
      })
      const basicError = {
        id: account,
        balance: 0,
        error: 'Unable to fetch account details'
      }
      if (e.response.status === 425) {
        basicError.error = e.response.data.message
      }
      return basicError
    }
  }
}
