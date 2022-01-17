import { fetchMiddleware } from './utils'

export const state = () => ({
  names: [],
  nextPageUrl: ''
})

export const mutations = {
  setNames (state, names) {
    state.names = [...names.data]
    state.nextPageUrl = names.next
  },
  addNames (state, names) {
    state.names = [...state.names, ...names.data]
    state.nextPageUrl = names.next
  }
}

export const actions = {
  getLatest: async function ({ rootGetters: { middleware }, state: { nextPageUrl }, commit }, { limit, sortby, search }) {
    try {
      if (search && search.length) {
        const data = await fetchMiddleware(`names/search/${search}`)
        commit('setNames', { data, nextPageUrl: null })
      } else {
        const data = await middleware.getAllNames({ limit, ...sortby })
        commit('setNames', data)
      }
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
      if (page !== null) {
        const res = await fetchMiddleware(page)
        return res
      }

      const auctions = await middleware.getAllAuctions({ limit, by, length: length > 0 ? length : undefined })
      return auctions
    } catch (e) {
      console.log(e)
      commit('catchError', 'Error', { root: true })
      return []
    }
  }
}
