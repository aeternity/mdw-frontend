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
    <List v-if="internalTransfers.length >0">
      <TXListItem
        v-for="(item, index) in internalTransfers"
        :key="index"
        :data="item"
      />
    </List>
    <LoadMoreButton
      v-if="nextInternal"
      :loading="loading"
      @update="fetchInternalTransfers"
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
import LoadMoreButton from '../../../components/loadMoreButton'
import List from '../../../components/list'
import TXListItem from '../../../partials/txListItem'
import { transformMetaTx } from '../../../store/utils'

export default {
  name: 'AppGenerationDetails',
  components: {
    PageHeader,
    GenerationDetails,
    MicroBlocks,
    MicroBlock,
    LoadMoreButton,
    List,
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
      generation: null,
      internalTransfers: [],
      nextInternal: null,
      loading: false
    }
  },
  async fetch () {
    await this.fetchInternalTransfers()
  },
  methods: {
    checkTxMeta (transaction) {
      return transaction.tx.type === 'GAMetaTx' ? transformMetaTx(transaction) : transaction
    },
    async fetchInternalTransfers () {
      this.loading = true
      const { data, next } = await this.$store.dispatch('transactions/getInternalTransactions', { gen: this.generation.height, page: this.nextInternal })
      this.nextInternal = next
      this.internalTransfers = [...this.internalTransfers, ...data]
      this.loading = false
    }
  }
}
</script>

<style lang="scss" scoped>
.list {
  margin-top: 2rem;
}
</style>
