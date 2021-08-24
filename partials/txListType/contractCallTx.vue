<template>
  <div class="transaction">
    <div class="transaction-main-info">
      <div class="transaction-main-info-inner">
        <nuxt-link :to="`/transactions/${transaction.hash}`">
          <div class="transaction-label">
            <LabelType
              :title="transaction | transformTxType"
              fill="red"
            />
          </div>
        </nuxt-link>
      </div>
      <div class="transaction-main-info-inner accounts">
        <AccountGroup>
          <Account
            v-if="transaction.tx.callerId"
            :value="transaction.tx.callerId"
            title="caller"
            icon
          />
          <Account
            v-if="transaction.tx.contractId"
            :value="transaction.tx.contractId"
            title="contract"
            icon
          />
        </AccountGroup>
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
          title="gas"
        >
          {{ transaction.tx.gas }}
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
          title="Amount"
        >
          <FormatAeUnit :value="transaction.tx.amount" />
        </AppDefinition>
        <AppDefinition
          v-if="transaction.tx.fee"
          title="tx fee"
        >
          <FormatAeUnit :value="transaction.tx.fee" />
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
</template>
<script>
import AppDefinition from '../../components/appDefinition'
import FormatAeUnit from '../../components/formatAeUnit'
import AccountGroup from '../../components/accountGroup'
import Account from '../../components/account'
import LabelType from '../../components/labelType'
import timestampToUTC from '../../plugins/filters/timestampToUTC'
import { transformTxType } from '../../store/utils'

export default {
  name: 'ContractCallTx',
  components: {
    LabelType,
    AppDefinition,
    FormatAeUnit,
    AccountGroup,
    Account
  },
  filters: {
    timestampToUTC,
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
