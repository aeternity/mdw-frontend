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
  getLatest: async function ({ rootGetters: { middleware, fetchMiddleware }, commit }, { limit, sortby, filterby, search }) {
    try {
      if (search && search.length) {
        let data = await fetchMiddleware(`/names/search/${search}`)

        if (filterby === 'active') {
          data = data.filter(item => item.active)
        }
        if (filterby === 'expired') {
          data = data.filter(item => !item.active)
        }
        if (filterby === 'inauction') {
          data = data.filter(item => !!item.auction)
        }

        commit('setNames', { data, nextPageUrl: null })
      } else {
        let result = { data: [], next: null }

        if (!filterby) {
          result = await middleware.getAllNames({ limit, ...sortby })
        }

        if (filterby === 'active') {
          result = await middleware.getActiveNames({ limit, ...sortby })
        }

        if (filterby === 'expired') {
          result = await middleware.getInActiveNames({ limit, ...sortby })
        }

        if (filterby === 'inauction') {
          result = await middleware.getAllAuctions({ limit, ...sortby })
        }

        commit('setNames', result)
      }
    } catch (e) {
      console.log(e)
      commit('catchError', 'Error', { root: true })
    }
  },
  getMore: async function ({ rootGetters: { fetchMiddleware }, state: { nextPageUrl }, commit }) {
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
  getActiveNameAuctions: async function ({ rootGetters: { middleware, fetchMiddleware }, commit }, { page, limit, by, length }) {
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
