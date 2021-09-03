<template>
  <div class="transaction">
    <div class="transaction-main-info">
      <div class="transaction-main-info-inner">
        <div class="transaction-label">
          <LabelType
            :title="transaction | transformTxType"
            fill="OUT"
          />
        </div>
      </div>
      <div class="transaction-main-info-inner accounts">
        <AccountGroup>
          <Account
            v-if="transaction.tx.sender"
            :value="transaction.tx.sender"
            title="Sender"
            icon
          />
          <Account
            v-if="transaction.tx.recipient"
            :value="transaction.tx.recipient"
            title="recipient"
            icon
          />
        </AccountGroup>
        <Account
          v-if="transaction.tx.contractId"
          :value="transaction.tx.contractId"
          title="contract"
          class="contract-id"
          icon
        />
      </div>
    </div>
    <div class="transaction-type-info">
      <div class="transaction-type-info-item">
        <AppDefinition
          title="Block Height"
        >
          <nuxt-link :to="`/generations/${transaction.tx.blockHeight}`">
            {{ transaction.tx.blockHeight }}
          </nuxt-link>
        </AppDefinition>
        <AppDefinition title="Amount">
          {{ transaction.tx.amount | formatToken(transaction.token.decimals, transaction.token.symbol) }}
        </AppDefinition>
      </div>
      <div class="transaction-type-info-item">
        <AppDefinition
          v-if="transaction.tx.microTime"
          title="Time"
          class="tx-time"
        >
          {{ transaction.tx.microTime | timestampToUTC }}
        </AppDefinition>
      </div>
    </div>
  </div>
</template>

<script>
import AppDefinition from '../../components/appDefinition'
import AccountGroup from '../../components/accountGroup'
import Account from '../../components/account'
import LabelType from '../../components/labelType'
import { transformTxType } from '../../store/utils'
import formatToken from '../../plugins/filters/formatToken'
import timestampToUTC from '../../plugins/filters/timestampToUTC'

export default {
  name: 'Aex9SentTx',
  components: {
    AppDefinition,
    AccountGroup,
    Account,
    LabelType
  },
  filters: {
    transformTxType, formatToken, timestampToUTC
  },
  props: {
    transaction: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@aeternity/aepp-components-3/src/styles/variables/colors";

.contract-id {
  border-top: 2px solid $color-neutral-positive-2;
}
.label-type {
  background-color: $color-red !important;
}
</style>
