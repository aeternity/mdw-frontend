import Vue from 'vue'

export const state = () => ({
  generations: {},
  hashToHeight: {},
  nextPageUrl: ''
})

export const mutations = {
  addGenerations (state, generations) {
    for (let i of Object.keys(generations)) {
      const generation = generations[i]
      if (!generation.microBlocks) {
        generation.microBlocks = {}
      }
      Vue.set(state.hashToHeight, generation.hash, generation.height)
      Vue.set(state.generations, generation.height, generation)
    }
  },
  setNextPageUrl (state, nextPageUrl) {
    state.nextPageUrl = nextPageUrl
  },
  addMicroBlockGen (state, mb) {
    const height = state.hashToHeight[mb.prevKeyHash]
    if (!mb.transactions) {
      mb.transactions = {}
    }
    state.generations[height]['microBlocks'][mb.hash] = mb
  },
  addTxGen (state, tx) {
    state.generations[tx.blockHeight]['microBlocks'][tx.blockHash]['transactions'][tx.hash] = tx
  }
}

export const actions = {
  getLatest: async function ({ rootGetters: { middleware }, state: { nextPageUrl }, commit }) {
    try {
      if (nextPageUrl) return
      const generations = await middleware.getGenerationsBackward()
      commit('addGenerations', generations.data)
      commit('setNextPageUrl', generations.next)
    } catch (e) {
      console.log(e)
      commit('catchError', 'Error', { root: true })
    }
  },
  getMore: async function ({ rootGetters: { fetchMiddleware }, state: { nextPageUrl }, commit }) {
    const generations = await fetchMiddleware(nextPageUrl)
    commit('addGenerations', generations.data)
    commit('setNextPageUrl', generations.next)
  },
  getGenerationByRange: async function ({ rootGetters: { middleware }, commit }, { start, end }) {
    try {
      const generations = await middleware.getBlocks(`${start}-${end}`)
      commit('addGenerations', generations.data)
      return generations.data
    } catch (e) {
      console.log(e)
      commit('catchError', 'Error', { root: true })
    }
  },
  getGenerationByHash: async function ({ rootGetters: { middleware }, commit, dispatch }, keyHash) {
    try {
      const generation = await middleware.getBlockByHash(keyHash)
      return await dispatch('getGenerationByRange', { start: generation.height, end: generation.height })
    } catch (e) {
      console.log(e)
      commit('catchError', 'Error', {
        root: true
      })
    }
  },
  updateMicroBlock: async function ({ state, commit, dispatch }, mb) {
    try {
      if (!state.hashToHeight[mb.prevKeyHash]) {
        await dispatch('getGenerationByHash', mb.prevKeyHash)
      } else {
        commit('addMicroBlockGen', mb)
      }
    } catch (e) {
      console.log(e)
      commit('catchError', 'Error', {
        root: true
      })
    }
  },
  updateTx: async function ({ state, rootGetters: { middleware }, commit, dispatch }, tx) {
    try {
      if (!state.generations[tx.blockHeight]) {
        await dispatch('getGenerationByRange', { start: tx.blockHeight, end: tx.blockHeight })
      }
      if (!state.generations[tx.blockHeight]['microBlocks'][tx.blockHash]) {
        const generation = (await middleware.getBlocks(`${tx.blockHeight}`)).data[0]
        commit('addMicroBlockGen', Object.values(generation.microBlocks).find(mb => mb.hash === tx.blockHash))
      }
      commit('addTxGen', tx)
    } catch (e) {
      console.log(e)
      commit('catchError', 'Error', {
        root: true
      })
    }
  }
}
