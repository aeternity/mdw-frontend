import { fetchJson } from './utils'

export const actions = {
  getAccountDetails: async function ({ rootState: { nodeUrl }, commit }, account) {
    try {
      const acc = await fetchJson(`${nodeUrl.slice(0, -4)}/v2/accounts/${account}`)
      return acc
    } catch (e) {
      const basicError = {
        id: account,
        balance: 0,
        error: 'Unable to fetch account details'
      }
      if (e.response.status === 500) {
        basicError.error = 'Account not found'
      }
      return basicError
    }
  },

  createFaucetTx: async function ({ rootState: { faucetApi }, commit }, account) {
    try {
      const acc = await fetchJson(`${faucetApi}/${account}`)
      return acc.data
    } catch (e) {
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
