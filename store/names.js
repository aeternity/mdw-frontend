import { fetchMiddleware } from './utils'

export const state = () => ({
  names: [],
  nextPageUrl: ''
})

export const mutations = {
  addNames (state, names) {
    state.names = [...state.names, ...names.data]
    state.nextPageUrl = names.next
  }
}

export const actions = {
  getLatest: async function ({ rootGetters: { middleware }, state: { nextPageUrl }, commit }, { page, limit }) {
    try {
      if (nextPageUrl) return
      const names = await middleware.getAllNames({ page, limit })
      commit('addNames', names)
    } catch (e) {
      console.log(e)
      commit('catchError', 'Error', { root: true })
    }
  },
  getMore: async function ({ state: { nextPageUrl }, commit }) {
    if (!nextPageUrl) return
    const names = await fetchMiddleware(nextPageUrl)
    commit('addNames', names)
  },
  searchNames: async function ({ rootGetters: { middleware }, commit }, id) {
    try {
      const name = await middleware.getNameById(id)
      return [name]
    } catch (e) {
      console.log(e)
      commit('catchError', 'Error', { root: true })
      return []
    }
  },
  getActiveNameAuctions: async function ({ rootGetters: { middleware }, commit }, { page, limit, by, length }) {
    try {
      const auctions = await middleware.getAllAuctions({ page, limit, by, length: length > 0 ? length : undefined })
      return auctions.data
    } catch (e) {
      console.log(e)
      commit('catchError', 'Error', { root: true })
      return []
    }
  }
}
