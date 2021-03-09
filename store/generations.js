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
  getLatestGenerations: async function ({ state, rootState: { height }, dispatch }, maxBlocks) {
    const range = calculateBlocksToFetch(height, state.lastFetchedGen, maxBlocks)
    return dispatch('getGenerationByRange', range)
  },
  getGenerationByRange: async function ({ dispatch, commit }, { start, end }) {
    const generations = await dispatch('callMiddlewareFunction', { functionName: 'getBlocks', args: `${start}-${end}` }, { root: true })
    commit('setGenerations', generations?.data)
    commit('setLastFetched', start)
    return generations?.data
  },
  getGenerationByHash: async function ({ dispatch }, keyHash) {
    const generation = await dispatch('callMiddlewareFunction', { functionName: 'getBlockByHash', args: keyHash }, { root: true })
    return generation && dispatch('getGenerationByRange', { start: generation.height, end: generation.height })
  },
  updateMicroBlock: async function ({ state, commit, dispatch }, mb) {
    if (!state.hashToHeight[mb.prevKeyHash]) {
      await dispatch('getGenerationByHash', mb.prevKeyHash)
    } else {
      commit('setMicroBlockGen', mb)
    }
  },
  updateTx: async function ({ state, commit, dispatch }, tx) {
    if (!state.generations[tx.blockHeight]) {
      await dispatch('getGenerationByRange', { start: tx.blockHeight, end: tx.blockHeight })
    }
    if (!state.generations[tx.blockHeight]['microBlocks'][tx.blockHash]) {
      const generation = await dispatch('callMiddlewareFunction', { functionName: 'getBlocks', args: `${tx.blockHeight}` }, { root: true })
      commit('setMicroBlockGen', Object.values(generation.data[0].microBlocks).find(mb => mb.hash === tx.blockHash))
    }
    commit('setTxGen', tx)
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
