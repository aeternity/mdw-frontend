<template>
  <div class="app-generation-details">
    <PageHeader
      title="Generation Details"
      :has-crumbs="true"
      :has-nav="true"
      :page="{to: '/generations', name: 'Generations'}"
      :subpage="{to: `/generations/${$route.params.generation}`, name: 'Generation Details'}"
      :prev="prev"
      :next="next"
    />
    <GenerationDetails
      v-if="generation"
      :data="generation"
      :dynamic-data="height"
    />
    <MicroBlocks>
      <MicroBlock
        v-for="(microBlock, number) in generation.microBlocks"
        :key="number"
        :data="microBlock"
      >
        <TXListItem
          v-for="(transaction, index) in microBlock.transactions"
          :key="index"
          :data="checkTxMeta(transaction)"
        />
      </MicroBlock>
    </MicroBlocks>
  </div>
</template>

<script>

import GenerationDetails from '../../../partials/generationDetails'
import MicroBlocks from '../../../partials/microBlocks'
import MicroBlock from '../../../partials/microBlock'
import PageHeader from '../../../components/PageHeader'
import TXListItem from '../../../partials/txListItem'
import { transformMetaTx } from '../../../store/utils'

export default {
  name: 'AppGenerationDetails',
  components: {
    PageHeader,
    GenerationDetails,
    MicroBlocks,
    MicroBlock,
    TXListItem
  },
  async asyncData ({ store, params, error }) {
    let generation = null
    if (isNaN(params.generation)) {
      return error({
        message: 'Invalid Generation/Key block',
        statusCode: 400
      })
    }
    const current = Math.abs(Number(params.generation))
    const height = await store.dispatch('height')
    if (current > height && !store.state.generations.generations?.[current]) {
      return error({
        message: `Requested height is greater than the current height. Current Height is ${height}`,
        statusCode: 400
      })
    } else if (store.state.generations.generations?.[current]) {
      generation = store.state.generations.generations[current]
    } else {
      const generations = await store.dispatch('generations/getGenerationByRange', { start: current - 1, end: current + 1 })
      generation = generations.find(g => g.height === current)
    }
    const prev = current < 1 ? '' : `/generations/${current - 1}`
    const next = height === current ? '' : `/generations/${current + 1}`
    return { generation, prev, next, height }
  },
  data () {
    return {
      height: 0,
      prev: '',
      next: '',
      generation: null
    }
  },
  methods: {
    checkTxMeta (transaction) {
      return transaction.tx.type === 'GAMetaTx' ? transformMetaTx(transaction) : transaction
    }
  }
}
</script>
