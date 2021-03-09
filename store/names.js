export const state = () => ({
  names: []
})

export const mutations = {
  setNames (state, names) {
    state.names = [...state.names, ...names]
  }
}

export const actions = {
  getNames: async function ({ rootGetters: { middleware }, commit }, { page, limit }) {
    try {
      const names = await middleware.getAllNames({ page, limit })
      commit('setNames', names.data)
    } catch (e) {
      console.log(e)
      commit('catchError', 'Error', { root: true })
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
