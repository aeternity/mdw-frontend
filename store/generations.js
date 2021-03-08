import Vue from 'vue'

export const state = () => ({
  generations: {},
  hashToHeight: {},
  lastFetchedGen: 0
})

export const mutations = {
  setGenerations (state, generations) {
    for (let i of Object.keys(generations)) {
      const generation = generations[i]
      if (!generation.microBlocks) {
        generation.microBlocks = {}
      }
      Vue.set(state.hashToHeight, generation.hash, generation.height)
      Vue.set(state.generations, generation.height, generation)
    }
  },
  setLastFetched (state, last) {
    state.lastFetchedGen = last
  },
  setMicroBlockGen (state, mb) {
    const height = state.hashToHeight[mb.prevKeyHash]
    if (!mb.transactions) {
      mb.transactions = {}
    }
    state.generations[height]['microBlocks'][mb.hash] = mb
  },
  setTxGen (state, tx) {
    state.generations[tx.blockHeight]['microBlocks'][tx.blockHash]['transactions'][tx.hash] = tx
  }
}

export const actions = {
  getLatestGenerations: async function ({ state, rootState: { height }, commit, dispatch }, maxBlocks) {
    try {
      const range = calculateBlocksToFetch(height, state.lastFetchedGen, maxBlocks)
      return await dispatch('getGenerationByRange', range)
    } catch (e) {
      console.log(e)
      commit('catchError', 'Error', { root: true })
    }
  },
  getGenerationByRange: async function ({ rootGetters: { middleware }, commit }, { start, end }) {
    try {
      const generations = await middleware.getBlocks(`${start}-${end}`)
      commit('setGenerations', generations.data)
      commit('setLastFetched', start)
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
        commit('setMicroBlockGen', mb)
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
        commit('setMicroBlockGen', Object.values(generation.microBlocks).find(mb => mb.hash === tx.blockHash))
      }
      commit('setTxGen', tx)
    } catch (e) {
      console.log(e)
      commit('catchError', 'Error', {
        root: true
      })
    }
  },
  nuxtServerInit ({ dispatch }, context) {
    return (
      dispatch('getLatestGenerations', 10)
    )
  }
}

function calculateBlocksToFetch (height, lastFetchedGen, maxBlocks) {
  let start = 0
  let end = 0
  if (!lastFetchedGen) {
    start = height - maxBlocks
    end = height
  } else {
    start = lastFetchedGen - maxBlocks - 1
    end = lastFetchedGen - 1
  }
  return { start, end }
}
