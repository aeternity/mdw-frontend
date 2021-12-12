<template>
  <div class="app-transactions">
    <PageHeader
      title="Transactions"
      :has-crumbs="true"
      :page="{to: '/transactions', name: 'Transactions'}"
    />
    <div class="filter">
      <multiselect
        v-model="value"
        :options="options"
        :allow-empty="false"
        :loading="loading"
        placeholder="Select transaction type...."
        @input="processInput"
      />
    </div>
    <div v-if="transactions.length > 0">
      <List>
        <TXListItem
          v-for="(item, index) in transactions"
          :key="index"
          :data="item"
        />
      </List>
      <LoadMoreButton
        v-if="nextPage"
        :loading="loading"
        @update="loadmore"
      />
    </div>
    <div v-if="loading">
      Loading....
    </div>
    <div v-if="!loading && transactions.length == 0">
      No matching transactions found for the selected type.
    </div>
  </div>
</template>

<script>
import List from '../../components/list'
import TXListItem from '../../partials/txListItem'
import PageHeader from '../../components/PageHeader'
import LoadMoreButton from '../../components/loadMoreButton'
import Multiselect from 'vue-multiselect'
import { transformMetaTx } from '../../store/utils'

export default {
  name: 'AppTransactions',
  components: {
    List,
    TXListItem,
    PageHeader,
    LoadMoreButton,
    Multiselect
  },
  async asyncData ({ store, query }) {
    const options = store.state.filterOptions.filter(option => option !== 'aex9_sent' && option !== 'aex9_received' && option !== 'internal_transfers')
    const type = options.includes(query.txtype) ? query.txtype : null
    const { data, next } = type ? await store.dispatch('transactions/getTxByType', {
      page: null,
      limit: 10,
      type
    }) : await store.dispatch(
      'transactions/getLatest',
      { limit: 10, page: null }
    )
    const transactions = data.map(t => t.tx.type === 'GAMetaTx' ? transformMetaTx(t) : t)
    return { transactions, loading: false, nextPage: !!next, options, page: next, value: type || 'All' }
  },
  data () {
    return {
      page: null,
      loading: true,
      value: 'All',
      transactions: {},
      options: [],
      nextPage: false
    }
  },
  watchQuery: ['txtype'],
  methods: {
    async loadmore () {
      this.loading = true
      if (this.value === 'All') {
        await this.getAllTx()
      } else {
        await this.getTxByType()
      }
      this.loading = false
      this.$route.query.txtype = this.value
    },
    async getAllTx () {
      const { data, next } = await this.$store.dispatch(
        'transactions/getLatest',
        { limit: 10, page: this.page }
      )
      const result = data.map(t => t.tx.type === 'GAMetaTx' ? transformMetaTx(t) : t)
      this.transactions = [...this.transactions, ...result]
      this.nextPage = !!next
      this.page = next
    },
    async getTxByType () {
      const { data, next } = await this.$store.dispatch('transactions/getTxByType', {
        page: this.page,
        limit: 10,
        type: this.value
      })
      const result = data.map(t => t.tx.type === 'GAMetaTx' ? transformMetaTx(t) : t)
      this.transactions = [...this.transactions, ...result]
      this.nextPage = !!next
      this.page = next
    },
    async processInput () {
      this.page = null
      this.transactions = []
      this.$router.push({ query: this.value === 'All' ? null : { txtype: this.value } })
      await this.loadmore()
    }
  }
}
</script>
