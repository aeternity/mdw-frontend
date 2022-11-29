import camelcaseKeysDeep from 'camelcase-keys-deep'
import { initMiddleware, fetchNode, fetchMiddleware } from './utils'

export const state = () => ({
  nodeStatus: {},
  nodeUrl: process.env.NUXT_APP_NODE_URL || process.env.nodeURL,
  middlewareURL: process.env.NUXT_APP_MDW_URL || process.env.middlewareURL,
  wsUrl: process.env.NUXT_APP_NODE_WS || process.env.middlewareWS,
  networkName: process.env.NUXT_APP_NETWORK_NAME || process.env.networkName,
  otherDeployments: process.env.NUXT_APP_OTHER_DEPLOYMENTS || process.env.otherDeployments,
  enableFaucet: process.env.NUXT_APP_ENABLE_FAUCET === 'true' || process.env.enableFaucet,
  faucetApi: process.env.NUXT_APP_FAUCET_API || process.env.faucetAPI,
  apiDocs: process.env.NUXT_APP_API_DOCS || process.env.APIDocs,
  version: process.env.npm_package_version || process.env.version,
  error: '',
  height: 0,
  status: {},
  ws: null,
  wsConnected: false,
  filterOptions: [
    'All',
    'spend',
    'paying_for',
    'oracle_extend',
    'oracle_query',
    'oracle_register',
    'oracle_response',
    'name_claim',
    'name_preclaim',
    'name_revoke',
    'name_transfer',
    'name_update',
    'ga_attach',
    'ga_meta',
    'contract_call',
    'contract_create',
    'aex9_sent',
    'aex9_received',
    'internal_transfers'
  ]
})

export const getters = {
  middleware: state => initMiddleware(state), // mdw swagger
  fetchMiddleware: state => (path) => fetchMiddleware(path, state.middlewareURL), // direct call to mdw
  fetchNode: state => (path) => fetchNode(path, state.nodeUrl)
}

export const mutations = {
  /**
   * setNodeStatus
   * @param {Object} state
   * @param nodeStatus
   */
  setNodeStatus (state, nodeStatus) {
    Object.assign(state, { nodeStatus })
  },
  /**
   * changeNetwork
   * @param state
   * @param middlewareURL
   */
  changeNetworkUrl (state, middlewareURL) {
    state.middlewareURL = middlewareURL
  },
  /**
   * catchError
   * @param state
   * @param error
   */
  catchError (state, error) {
    state.error = error
  },
  /**
   * clearError
   * @param state
   */
  clearError (state) {
    state.error = ''
  },
  /**
   * setHeight mutates the
   * state property height
   * @param {Object} state
   * @param {Number} height
   */
  setHeight (state, height) {
    Object.assign(state, { height })
  },
  setStatus (state, status) {
    state.status = status
  },
  createWsClient (state) {
    state.ws = new WebSocket(state.wsUrl)
  },
  setWsConnectionStatus (state, status) {
    state.wsConnected = status
  }
}

export const actions = {
  async height ({ rootGetters: { fetchNode }, commit }) {
    try {
      const { height } = await fetchNode('/key-blocks/current/height')
      commit('setHeight', height)
      return height
    } catch (e) {
      commit('catchError', 'Error', { root: true })
    }
  },
  async status ({ rootGetters: { middleware }, commit }) {
    try {
      const status = await middleware.getStatus()
      commit('setStatus', status)
    } catch (e) {
      commit('catchError', 'Error', { root: true })
    }
  },
  setupWebSocket ({ state, commit, dispatch }) {
    if (process.client && !state.wsConnected) {
      commit('createWsClient')
      state.ws.onopen = () => {
        handleWsOpen(state.ws, commit, dispatch)
      }
      state.ws.onerror = e => {
        commit('catchError', e)
        commit('setWsConnectionStatus', false)
        handleWsOpen(state.ws, commit, dispatch)
      }
      state.ws.onclose = e => {
        commit('setWsConnectionStatus', false)
        handleWsOpen(state.ws, commit, dispatch)
      }
    }
  }
}

function handleWsOpen (socket, commit, dispatch) {
  commit('setWsConnectionStatus', true)
  socket.send('{"op":"Subscribe", "payload": "KeyBlocks"}')
  socket.send('{"op":"Subscribe", "payload": "MicroBlocks"}')
  socket.send('{"op":"Subscribe", "payload": "Transactions"}')
  socket.onmessage = e => {
    processWsData(e.data, commit, dispatch)
  }
}

function processWsData (data, commit, dispatch) {
  if (data.includes('payload')) {
    data = camelcaseKeysDeep(JSON.parse(data).payload)
    if (data.tx) {
      commit('transactions/addTransactions', [data])
      dispatch('generations/updateTx', data)
    } else if (data.beneficiary) {
      commit('generations/addGenerations', [data])
      if (state.height < data.height) {
        commit('setHeight', data.height, {
          root: true
        })
      }
    } else if (data.pofHash) {
      dispatch('generations/updateMicroBlock', data)
    }
  }
}
