export const state = () => ({
  names: []
})

export const mutations = {
  setNames (state, names) {
    state.names = [...state.names, ...names]
  }
}

export const actions = {
  getNames: async function ({ dispatch, commit }, { page, limit }) {
    const names = await dispatch('callMiddlewareFunction', { functionName: 'getAllNames', args: { page, limit } }, { root: true })
    commit('setNames', names ? names.data : [])
  },
  searchNames: async function ({ dispatch }, id) {
    const name = await dispatch('callMiddlewareFunction', { functionName: 'getNameById', args: id }, { root: true })
    return name ? [name] : []
  },
  getActiveNameAuctions: async function ({ dispatch }, { page, limit, by, length }) {
    const args = { page, limit, by, length: length > 0 ? length : undefined }
    const auctions = await dispatch('callMiddlewareFunction', { functionName: 'getAllAuctions', args }, { root: true })
    return auctions ? auctions.data : []
  }
}
