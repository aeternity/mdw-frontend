<template>
  <div class="app-transactions">
    <PageHeader
      title="Contracts Transactions"
      :has-crumbs="true"
      :page="{to: '/Contracts', name: 'Contracts'}"
      :subpage="{to: `/contracts/transactions/${$route.params.id}`, name: 'Contract Transactions'}"
    />
    <div
      v-if="!loading && transactions.length > 0"
    >
      <TransactionDetails
        v-for="tx of transactions"
        :key="tx.hash"
        :data="tx"
      />
      <LoadMoreButton @update="loadMore" />
    </div>
    <div v-if="loading">
      Loading....
    </div>
    <div v-if="!loading && transactions.length == 0">
      Contract not found.
      Please check the contract address and try again.
    </div>
  </div>
</template>

<script>

import PageHeader from '../../../components/PageHeader'
import TransactionDetails from '../../../partials/transactionDetails'
import LoadMoreButton from '../../../components/loadMoreButton'

export default {
  name: 'ContractsTransactions',
  components: {
    TransactionDetails,
    LoadMoreButton,
    PageHeader
  },
  async asyncData ({ store, params }) {
    let createTransactions = await store.dispatch('contracts/getContractCreateTx', { contract: params.id, page: 1, limit: 10 })
    const calls = await store.dispatch('contracts/getContractCalls', { contract: params.id, page: 1, limit: 10 })
    let transactions = []
    if (createTransactions && calls) {
      transactions = [...createTransactions, ...calls]
    }
    return { contract: params.id, transactions, loading: false, page: 2 }
  },
  data () {
    return {
      contract: '',
      transactions: [],
      loading: true,
      page: 1
    }
  },
  methods: {
    async loadMore () {
      const transactions = await this.$store.dispatch('contracts/getContractCalls', { contract: this.contract, page: this.page, limit: 10 })
      this.transactions = [...this.transactions, ...transactions]
      this.page += 1
    }
  }
}
</script>
