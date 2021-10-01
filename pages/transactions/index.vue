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
    <div v-if="Object.keys(transactions).length > 0">
      <List>
        <TXListItem
          v-for="(item, index) in Object.values(transactions)"
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
    <div v-if="!loading && Object.keys(transactions).length == 0">
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
  async asyncData ({ store, route }) {
    const type = route.query?.txtype || undefined
    const { data, next } = await store.dispatch('transactions/getTxByType', {
      page: 1,
      limit: 10,
      type
    })
    data.forEach(element => {
      element = element.tx.type === 'GAMetaTx' ? transformMetaTx(element) : element
    })
    return { transactions: data, loading: false, nextPage: !!next }
  },
  data () {
    return {
      typePage: 2,
      loading: true,
      value: 'All',
      transactions: {},
      options: this.$store.state.filterOptions.filter(option => option !== 'aex9_sent' && option !== 'aex9_received'),
      nextPage: false
    }
  },
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
        { limit: 10 }
      )
      data.forEach(element => {
        element = element.tx.type === 'GAMetaTx' ? transformMetaTx(element) : element
        this.transactions = { ...this.transactions, [element.hash]: element }
      })
      this.nextPage = !!next
    },
    async getTxByType () {
      const { data, next } = await this.$store.dispatch('transactions/getTxByType', {
        page: this.typePage,
        limit: 10,
        type: this.value
      })
      data.forEach(element => {
        element = element.tx.type === 'GAMetaTx' ? transformMetaTx(element) : element
        this.transactions = { ...this.transactions, [element.hash]: element }
      })
      this.nextPage = !!next
      this.typePage += 1
    },
    async processInput () {
      if (this.value === 'All') {
        this.tranasction = {}
        this.transactions = this.$store.state.transactions.transactions
      } else {
        this.loading = true
        this.typePage = 1
        this.transactions = {}
        await this.loadmore()
        this.loading = false
      }
    }
  }
}
</script>
