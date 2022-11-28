<template>
  <div :class="['contract-call', { transfer: !!transaction.tokenInfo }]">
    <div class="transaction">
      <div class="transaction-main-info">
        <div class="transaction-main-info-inner">
          <nuxt-link :to="`/transactions/${transaction.hash}`">
            <div class="transaction-label">
              <LabelType
                :title="transaction | transformTxType"
              />
            </div>
          </nuxt-link>
        </div>
        <div class="transaction-main-info-inner accounts">
          <Account
            v-if="transaction.tx.payerId"
            :value="transaction.tx.payerId"
            title="payer"
            icon
          />
        </div>
      </div>
      <div class="transaction-type-info">
        <div class="transaction-type-info-item">
          <AppDefinition
            title="Block Height"
          >
            <nuxt-link :to="`/generations/${transaction.blockHeight}`">
              {{ transaction.blockHeight }}
            </nuxt-link>
          </AppDefinition>
          <AppDefinition
            v-if="transaction.tx.gas"
            title="gas limit"
          >
            {{ transaction.tx.gas }}
          </AppDefinition>
          <AppDefinition
            v-if="transaction.tx.gasUsed && transaction._status !== 'mined'"
            title="gas used"
          >
            <span v-if="transaction._status == 'mined'">
              <app-loading tooltip-text="Waiting for mdw sync" />
            </span>
            <span v-else>
              {{ transaction.tx.gasUsed }}
            </span>
          </AppDefinition>
          <AppDefinition
            v-if="transaction.tx.gasPrice"
            title="gas price"
          >
            <FormatAeUnit :value="transaction.tx.gasPrice" />
          </AppDefinition>
        </div>
        <div class="transaction-type-info-item">
          <AppDefinition
            v-if="transaction.tx.fee"
            title="tx fee"
          >
            <FormatAeUnit :value="transaction.tx.fee" />
          </AppDefinition>
          <AppDefinition
            v-if="transaction.tx.fee || transaction._status == 'mined'"
            title="total cost"
          >
            <span v-if="transaction._status == 'mined'">
              <app-loading tooltip-text="Waiting for mdw sync" />
            </span>
            <FormatAeUnit
              v-else
              :value="transaction.tx.fee"
            />
          </AppDefinition>
          <AppDefinition
            v-if="transaction.tx.nonce"
            title="nonce"
          >
            {{ transaction.tx.nonce }}
          </AppDefinition>
          <AppDefinition
            v-if="transaction.microTime"
            title="Time"
            class="tx-time"
          >
            {{ transaction.microTime | timestampToUTC }}
          </AppDefinition>
        </div>
      </div>
    </div>
    <GaAttachTx
      v-if="transaction.tx.tx && transaction.tx.tx.tx.type == 'GAAttachTx'"
      :transaction="{
        ...transaction,
        tx: {
          ...transaction.tx.tx.tx
        }
      }"
    />
  </div>
</template>
<script>
import GaAttachTx from './gaAttachTx'
import AppDefinition from '../../components/appDefinition'
import FormatAeUnit from '../../components/formatAeUnit'
import Account from '../../components/account'
import LabelType from '../../components/labelType'
import timestampToUTC from '../../plugins/filters/timestampToUTC'
import formatToken from '../../plugins/filters/formatToken'
import { transformTxType } from '../../store/utils'
import AppLoading from '../../components/appLoading.vue'

export default {
  name: 'PayingForTx',
  components: {
    GaAttachTx,
    LabelType,
    AppDefinition,
    FormatAeUnit,
    Account,
    AppLoading
  },
  filters: {
    timestampToUTC,
    transformTxType,
    formatToken
  },
  props: {
    transaction: {
      type: Object,
      required: true
    }
  },
  methods: {
    getTitle (transaction) {
      if (transaction.tx.function) {
        if (transaction.tx.function.includes('swap')) {
          return 'Swap'
        }

        return transaction.tx.function.replace(/_ae/g, '').replace(/_/g, ' ')
      }
      return 'token transfer'
    },
    getAmount (token) {
      return formatToken(token.amount, token.decimals, token.symbol)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@aeternity/aepp-components-3/src/styles/variables/colors";
.status {
  text-transform: uppercase;
  &.ok {
    color: $color-alternative;
  }
  &.revert {
    color: $color-red;
  }
}
.contract-call.transfer {
  border-left: 2px #14CCB7 solid;

  .transaction:nth-child(2) .transaction-main-info .transaction-main-info-inner .label-type {
    background-color: rgba(0, 24, 51, 0.35);
    padding-left: 24px;
  }
}
</style>
