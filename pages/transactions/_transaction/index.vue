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
    <div v-if="$fetchState.pending">
      Loading....
    </div>
    <FunctionCalls
      v-if="functionCalls.length > 0"
      :function-calls="functionCalls"
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
import FunctionCalls from '../../../partials/functionCalls'
import PageHeader from '../../../components/PageHeader'
import { transformMetaTx, fixContractCreateTx } from '../../../store/utils'

export default {
  name: 'AppTransaction',
  components: {
    GenerationDetails,
    TransactionDetails,
    FunctionCalls,
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
      generation = (await store.dispatch('generations/getGenerationByRange', { start: (txDetails.blockHeight - 1), end: (txDetails.blockHeight + 1) }))
        .find(g => g.height === txDetails.blockHeight)
    }
    height = store.state.height
    if (!height) {
      height = await store.dispatch('height')
    }
    if (txDetails.tx.contractId) {
      txDetails.tokenInfo = await store.dispatch('tokens/getTokenTransactionInfo', { contractId: txDetails.tx.contractId, address: txDetails.tx.callerId, id: txDetails.txIndex })
    }
    if (!txDetails.tx.function) {
      txDetails = fixContractCreateTx(txDetails)
    }

    return { transaction: txDetails, generation, height, loading: false }
  },
  data () {
    return {
      transaction: {},
      generation: {},
      height: 0,
      loading: true,
      functionCalls: []
    }
  },
  async fetch () {
    this.functionCalls = await this.$store.dispatch('transactions/getTransactionFunctionCalls', this.transaction.txIndex)
  }
}
</script>
