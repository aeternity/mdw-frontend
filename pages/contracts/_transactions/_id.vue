<template>
  <div class="app-transactions">
    <PageHeader
      title="Contracts Transactions"
      :has-crumbs="true"
      :page="{ to: '/Contracts', name: 'Contracts' }"
      :subpage="{
        to: `/contracts/transactions/${$route.params.id}`,
        name: 'Contract Transactions',
      }"
    />
    <div v-if="!loading && transactions.length > 0">
      <TransactionDetails
        v-for="tx of transactions"
        :key="tx.hash"
        :data="tx"
      />
      <LoadMoreButton
        v-if="nextPage"
        :loading="loadingMore"
        @update="loadMore"
      />
    </div>
    <div v-if="loading || loadingMore">
      Loading....
    </div>
    <div v-if="!loading && transactions.length === 0">
      Contract not found. Please check the contract address and try again.
      <br>
      If you deployed the contract just a short time ago, please give the
      network some time to sync and recheck again in a few seconds.
    </div>
  </div>
</template>

<script>
import PageHeader from '../../../components/PageHeader'
import TransactionDetails from '../../../partials/transactionDetails'
import LoadMoreButton from '../../../components/loadMoreButton'
import { fixContractCreateTx } from '../../../store/utils'

export default {
  name: 'ContractsTransactions',
  components: {
    TransactionDetails,
    LoadMoreButton,
    PageHeader
  },
  async asyncData ({ store, params, error }) {
    let createTransactions = await store.dispatch(
      'contracts/getContractCreateTx',
      { contract: params.id, limit: 10 }
    )
    const { data, next } = await store.dispatch(
      'contracts/getContractCalls',
      { contract: params.id, page: null, limit: 10 }
    )
    let transactions = []
    if (createTransactions && data) {
      transactions = [...createTransactions.map(fixContractCreateTx), ...data]
    } else {
      return error({
        message: `Contract not found. If you deployed the contract just a short time ago, please give the network some time to sync and recheck again in a few seconds.`,
        statusCode: 400
      })
    }
    return {
      contract: params.id,
      transactions,
      loading: false,
      page: next,
      nextPage: !!next
    }
  },
  data () {
    return {
      contract: '',
      transactions: [],
      loading: true,
      loadingMore: false,
      page: null,
      nextPage: false
    }
  },
  methods: {
    async loadMore () {
      this.loadingMore = true
      const { data, next } = await this.$store.dispatch(
        'contracts/getContractCalls',
        { contract: this.contract, page: this.page, limit: 10 }
      )
      this.transactions = [...this.transactions, ...data]
      this.nextPage = !!next
      this.page = next
      this.loadingMore = false
    }
  }
}
</script>
