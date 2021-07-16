<template>
  <div class="app-transaction">
    <PageHeader
      title="Transactions"
      :has-crumbs="true"
      :page="{to: '/transactions', name: 'Transactions'}"
      :subpage="{to: `/transactions/${$route.params.transaction}`, name: 'Transaction Overview'}"
    />
    <TransactionDetails
      :status="loading"
      :data="transaction"
    />
    <GenerationDetails
      v-if="generation && height"
      :data="generation"
      :dynamic-data="height"
      :status="loading"
    />
  </div>
</template>

<script>
import GenerationDetails from '../../../partials/generationDetails'
import TransactionDetails from '../../../partials/transactionDetails'
import PageHeader from '../../../components/PageHeader'
import { transformMetaTx } from '../../../store/utils'

export default {
  name: 'AppTransaction',
  components: {
    GenerationDetails,
    TransactionDetails,
    PageHeader
  },
  async asyncData ({ store, params: { transaction }, error }) {
    let txDetails = null
    let generation = null
    let height = null
    txDetails = store.state.transactions.transactions?.[transaction]
    if (!txDetails) {
      txDetails = await store.dispatch('transactions/getTransactionById', transaction)
    }
    if (!txDetails) {
      return error({
        message: `Transaction not found. If you have sent it only a short time ago, please give the network some time to sync and recheck again in a few seconds.`,
        statusCode: 400
      })
    }
    if (txDetails.tx.type === 'GAMetaTx') {
      txDetails = transformMetaTx(txDetails)
    }
    generation = store.state.generations.generations?.[txDetails.blockHeight]
    if (!generation) {
      generation = (await store.dispatch('generations/getGenerationByRange', { start: (txDetails.blockHeight - 1), end: (txDetails.blockHeight + 1) }))[txDetails.blockHeight]
    }
    if (!store.state.height) {
      height = await store.dispatch('height')
    }
    return { transaction: txDetails, generation, height, loading: false }
  },
  data () {
    return {
      transation: {},
      generation: {},
      height: 0,
      loading: true
    }
  }
}
</script>
