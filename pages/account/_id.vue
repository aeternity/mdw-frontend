<template>
  <div class="app-transactions">
    <PageHeader
      title="Account"
      :has-crumbs="true"
      :page="{to: `/account/${$route.params.id}`, name: `${$route.params.id}`}"
    />
    <AccountDetails
      :account="accountDetails"
      :tokens-balance="tokensBalance"
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
          v-for="(tx, index) of transactions"
          :key="index"
          :data="tx"
          :address="`${$route.params.id}`"
        />
      </List>
      <LoadMoreButton
        v-if="nextPage"
        :loading="loading"
        @update="loadMore"
      />
    </div>
    <div v-if="loading">
      Loading....
    </div>
    <div v-if="!loading && transactions.length === 0">
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
import AccountDetails from '../../partials/accountDetails'

export default {
  name: 'AccountTransactions',
  components: {
    List,
    TXListItem,
    PageHeader,
    LoadMoreButton,
    Multiselect,
    AccountDetails
  },
  async asyncData ({ store, params, query }) {
    let value = null
    let transactions = []
    let nextPage = false
    let page = null
    if (query.txtype) {
      if (store.state.filterOptions.indexOf(query.txtype) > 0) {
        value = query.txtype
      }
    }
    await store.dispatch('tokens/getAllTokens')
    await store.dispatch('tokens/getAex9Transfers', { address: params.id })

    if (value === 'aex9_sent' || value === 'aex9_received') {
      const aex9Transactions = await store.dispatch('tokens/getAex9Transactions', { address: params.id, incoming: false })
      transactions = aex9Transactions
    } else if (value === 'internal_transfers') {
      const { data, next } = await this.$store.dispatch('transactions/getInternalTransactions', { account: params.id, page })
      transactions = data
      nextPage = !!next
      page = next
    } else {
      const { data, next } = await store.dispatch('transactions/getTransactionByAccount', { account: params.id, page, limit: 10, txtype: value })
      page = next
      if (data) {
        const transformed = data.map(t => t.tx.type === 'GAMetaTx' ? transformMetaTx(t) : t)
        transactions = await Promise.all(transformed.map(async (txDetails) => {
          if (txDetails.tx.contractId && txDetails.tx.callerId) {
            txDetails.tokenInfo = await store.dispatch('tokens/getTokenTransactionInfo', { contractId: txDetails.tx.contractId, address: txDetails.tx.callerId, id: txDetails.txIndex })

            if (txDetails.tx.function === 'create_allowance' || txDetails.tx.function === 'change_allowance') {
              if (txDetails.tokenInfo && !txDetails.tokenInfo.recipient) {
                const loadContract = await store.dispatch('contracts/getContractCalls', { contract: txDetails.tx.contractId, page: null, limit: 10 })
                let recipient = null
                try {
                  loadContract.data.forEach(ct => {
                    if (ct.tx.function === 'change_allowance' && ct.tx.arguments && !recipient) {
                      ct.tx.arguments.forEach(arg => {
                        if (arg.type === 'address') {
                          recipient = arg.value
                        }
                      })
                    }
                  })
                } catch (error) {

                }
                txDetails.tokenInfo.recipient = recipient

                console.info('===========')
                console.info('txDetails::', txDetails)
                console.info('===========')
              }
            }
          }
          return txDetails
        }))
      }
      nextPage = !!next
    }
    const accountDetails = await store.dispatch('account/getAccountDetails', params.id)
    const tokensBalance = await store.dispatch('tokens/getAccountBalance', { address: params.id })
    value = value || 'All'
    return { address: params.id, transactions, page, value, loading: false, accountDetails, nextPage, tokensBalance }
  },
  data () {
    return {
      account: {
        id: this.$route.params.id
      },
      accountDetails: {},
      tokensBalance: [],
      transactions: [],
      page: null,
      loading: true,
      value: 'All',
      options: this.$store.state.filterOptions,
      nextPage: false
    }
  },
  methods: {
    async loadMore () {
      this.loading = true
      const txtype = this.value === 'All' ? null : this.value
      if (this.value === 'aex9_sent' || this.value === 'aex9_received') {
        this.transactions = await this.$store.dispatch('tokens/getAex9Transactions', { address: this.account.id, incoming: this.value === 'aex9_received' })
      } else if (this.value === 'internal_transfers') {
        const { data, next } = await this.$store.dispatch('transactions/getInternalTransactions', { account: this.account.id, page: this.page })
        this.transactions = [...this.transactions, ...data]
        this.nextPage = !!next
        this.page = next
      } else {
        const { data, next } = await this.$store.dispatch('transactions/getTransactionByAccount', { account: this.account.id, page: this.page, limit: 10, txtype })
        if (data) {
          const transformed = data.map(t => t.tx.type === 'GAMetaTx' ? transformMetaTx(t) : t)
          const result = await Promise.all(transformed.map(async (txDetails) => {
            if (txDetails.tx.contractId && txDetails.tx.callerId) {
              txDetails.tokenInfo = await this.$store.dispatch('tokens/getTokenTransactionInfo', { contractId: txDetails.tx.contractId, address: txDetails.tx.callerId, id: txDetails.txIndex })
            }
            return txDetails
          }))
          this.transactions = [...this.transactions, ...result]
        }
        this.nextPage = !!next
        this.page = next
      }
      this.loading = false
    },
    async processInput () {
      this.loading = true
      this.page = null
      this.transactions = []
      this.nextPage = false
      await this.loadMore()
      this.loading = false
    }
  }
}
</script>
