export const state = () => ({
  oracles: [],
  nextPageUrl: ''
})

export const mutations = {
  addOracles (state, oracles) {
    state.oracles = [...state.oracles, ...oracles.data]
    state.nextPageUrl = oracles.next
  }
}

export const actions = {
  getLatest: async function ({ rootGetters: { middleware }, commit }) {
    try {
      if (state.nextPageUrl) return
      const oracles = await middleware.getActiveOracles()
      commit('addOracles', oracles)
    } catch (e) {
      console.log(e)
      commit('catchError', 'Error', { root: true })
    }
  },
  getMore: async function ({ rootGetters: { fetchMiddleware }, state: { nextPageUrl }, commit }) {
    if (!nextPageUrl) return
    const oracles = await fetchMiddleware(nextPageUrl)
    commit('addOracles', oracles)
  }
}
