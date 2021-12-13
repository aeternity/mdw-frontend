<template>
  <div class="transaction">
    <div class="transaction-main-info">
      <div class="transaction-main-info-inner">
        <div class="transaction-label">
          <LabelType
            :title="transaction | transformTxType"
            fill="red"
          />
        </div>
      </div>
      <div class="transaction-main-info-inner accounts">
        <Account
          v-if="transaction.accountId"
          :value="transaction.accountId"
          title="Account"
          icon
        />
      </div>
    </div>
    <div class="transaction-type-info">
      <div class="transaction-type-info-item">
        <AppDefinition
          title="Block Height"
        >
          <nuxt-link :to="`/generations/${transaction.height}`">
            {{ transaction.height }}
          </nuxt-link>
        </AppDefinition>
        <AppDefinition
          v-if="transaction.amount"
          title="Amount"
        >
          <FormatAeUnit
            :value="transaction.amount"
          />
        </AppDefinition>
      </div>
      <div class="transaction-type-info-item">
        <AppDefinition
          v-if="transaction.kind"
          title="Type"
        >
          {{ transaction.kind }}
        </AppDefinition>
        <AppDefinition
          v-if="transaction.refTxi"
          title="Tx Refference"
        >
          {{ transaction.refTxi }}
        </AppDefinition>
      </div>
    </div>
  </div>
</template>

<script>
import AppDefinition from '../../components/appDefinition'
import FormatAeUnit from '../../components/formatAeUnit'
import Account from '../../components/account'
import LabelType from '../../components/labelType'
import { transformTxType } from '../../store/utils'

export default {
  name: 'InternalTx',
  components: {
    LabelType,
    AppDefinition,
    FormatAeUnit,
    Account
  },
  filters: {
    transformTxType
  },
  props: {
    transaction: {
      type: Object,
      required: true
    }
  }
}
</script>
