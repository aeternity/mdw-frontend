<template>
  <div class="app-transaction">
    <div class="transaction-header">
      <PageHeader
        title="Transactions"
        :has-crumbs="true"
        :page="{ to: '/transactions', name: 'Transactions' }"
        :subpage="{
          to: `/transactions/${$route.params.transaction}`,
          name: 'Transaction Overview',
        }"
      />
      <div :class="`chip ${status}`">
        <div class="chip-status">
          Status:
        </div>
        <div class="chip-text">
          {{ status }}
        </div>
      </div>
    </div>
    <TransactionDetails
      v-if="transaction.tx"
      :status="loading"
      :data="transaction"
    />
    <div v-if="$fetchState.pending">
      Loading....
    </div>
    <FunctionCalls
      v-if="functionCalls && functionCalls.length > 0"
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
import { transformMetaTx, fixContractCreateTx, fetchNode } from '../../../store/utils'

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
    let status = 'synced'
    txDetails = store.state.transactions.transactions?.[transaction]
    if (!txDetails) {
      txDetails = await store.dispatch(
        'transactions/getTransactionById',
        transaction
      )
    }
    if (!txDetails) {
      txDetails = await fetchNode(`transactions/${transaction}`)

      if (txDetails) {
        status = txDetails.block_height < 0 ? 'pending' : 'mined'
      } else {
        status = 'unknown'
      }
      return { transaction: { ...txDetails, _status: status } ?? {}, status, loading: false }
    }

    try {
      if (txDetails.tx.type === 'GAMetaTx') {
        txDetails = transformMetaTx(txDetails)
      }

      if (!txDetails.tx.function) {
        txDetails = fixContractCreateTx(txDetails)
      }
    } catch (error) {

    }

    return { transaction: { ...txDetails, _status: status }, status, loading: false }
  },
  data () {
    return {
      transaction: {},
      generation: {},
      height: 0,
      loading: true,
      functionCalls: [],
      /**
       * unknown (not seen on the node, ever) // red
       * pending (in mempool but not included in microblock yet) // orange
       * mined (included in microblock) // light - green
       * synced (in microblock and indexed by mdw) green
       */
      status: 'unknown'
    }
  },
  async fetch () {
    this.functionCalls = await this.$store.dispatch(
      'transactions/getTransactionFunctionCalls',
      this.transaction.txIndex
    )
  },
  async mounted () {
    if (this.transaction.tx) {
      this.loadTransactionData()
    }

    if (this.status !== 'synced') {
      this.$ws()
        .listen('Transactions', (payload) => {
          if (payload.hash === this.$route.params.transaction) {
            this.transaction = {
              ...payload
            }
            this.status = payload.block_height < 0 ? 'pending' : 'mined'
            this.reloadTranasaction()
          }
        })
        .listen('KeyBlocks', (payload) => {
          this.status = 'synced'
          this.reloadTranasaction()
        })
    }
  },
  methods: {
    async reloadTranasaction () {
      let transaction = await this.$store.dispatch(
        'transactions/getTransactionById',
        this.$route.params.transaction
      )
      if (transaction) {
        try {
          if (transaction.tx.type === 'GAMetaTx') {
            transaction = transformMetaTx(transaction)
          }

          if (!transaction.tx.function) {
            transaction = fixContractCreateTx(transaction)
          }
        } catch (error) {

        }

        this.transaction = {
          ...transaction
        }

        this.loadTransactionData()
      }
    },
    async loadTransactionData () {
      this.loading = true
      this.generation = (
        await this.$store.dispatch('generations/getGenerationByRange', {
          start: this.transaction.blockHeight - 1,
          end: this.transaction.blockHeight + 1
        })
      ).find((g) => g.height === this.transaction.blockHeight)

      this.height = await this.$store.dispatch('height')

      if (this.transaction.tx.contractId) {
        let tokenInfo = await this.$store.dispatch(
          'tokens/getTokenTransactionInfo',
          {
            contractId: this.transaction.tx.contractId,
            address: this.transaction.tx.callerId,
            id: this.transaction.txIndex,
            _function: this.transaction.tx.function
          }
        )

        this.transaction = {
          tokenInfo,
          ...this.transaction
        }
      }
    }
  }
}
</script>
<style scoped lang="scss">

.transaction-header, .chip {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
}
.transaction-header {
  width: 100%;
}

.chip {
  text-transform: capitalize;
  font-weight: bold;
  font-size: 16px;
  max-height: 20px;
  .chip-status {
    height: 35px;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
    padding: 9px 14px;
    color: white;
  }
  .chip-text {
    height: 35px;
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
    padding: 8px 15px;
    border: 2px solid #15803d;
  }

  &.unknown {
    .chip-status {
      background-color: #4b5563;
    }
    .chip-text {
      color: #4b5563;
      border-color:#4b5563;
    }
  }

  &.pending {
    .chip-status {
      background-color: #ea580c;
    }
    .chip-text {
      color: #ea580c;
      border-color:#ea580c;
    }
  }

  &.mined {
    .chip-status {
      background-color: #0d9488;
    }
    .chip-text {
      color: #0d9488;
      border-color:#0d9488;
    }
  }

  &.synced {
    .chip-status {
      background-color: #15803d;
    }
    .chip-text {
      color: #15803d;
      border-color:#15803d;
    }
  }
}
</style>
