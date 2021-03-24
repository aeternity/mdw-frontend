<template>
  <div>
    <client-only>
      <div
        v-if="generations.length"
        class="generations-wrapper"
      >
        <PageHeader
          :is-main="false"
          title="Generations"
        />
        <List>
          <Generation
            v-for="(generation, number) in generations.slice(0,5)"
            :key="number"
            class="generation-link"
            :data="generation"
          />
        </List>
      </div>
      <div
        class="transactions-wrapper"
      >
        <PageHeader
          :is-main="false"
          title="Transactions"
        />
        <List>
          <TXListItem
            v-for="(transaction, index) in transactions.reverse().slice(0,5)"
            :key="index"
            :data="transaction"
          />
        </List>
      </div>
    </client-only>
  </div>
</template>
<script>
import Generation from '../partials/generation'
import List from '../components/list'
import TXListItem from '../partials/txListItem'
import PageHeader from '../components/PageHeader'
import { mapState } from 'vuex'

export default {
  name: 'AppDashboard',
  components: {
    Generation,
    List,
    TXListItem,
    PageHeader
  },
  layout: 'default',
  computed: {
    ...mapState('generations', {
      generations (state) {
        return Object.values(state.generations).reverse()
      }
    }),
    ...mapState('transactions', {
      transactions (state) {
        return Object.values(state.transactions)
      }
    })
  },
  async mounted () {
    this.$store.dispatch('setupWebSocket')
    if (!Object.keys(this.$store.state.generations.generations).length) {
      this.$store.dispatch('generations/getLatest')
    }
    if (!Object.keys(this.$store.state.transactions.transactions).length) {
      await this.$store.dispatch('height')
      this.$store.dispatch('transactions/getLatest', { limit: 10 })
    }
  }
}
</script>
