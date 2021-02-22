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
            v-if="transaction.tx.accountId"
            :value="transaction.tx.accountId"
            title="account"
            icon
          />
          <Account
            v-if="transaction.tx.recipientId"
            :value="transaction.tx.recipientId"
            title="recipient"
            icon
          />
        </AccountGroup>
        <Account
          v-if="transaction.tx.nameId"
          :value="transaction.tx.nameId"
          title="name"
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
      </div>
      <div class="transaction-type-info-item">
        <AppDefinition
          v-if="transaction.tx.fee"
          title="Tx fee"
        >
          <FormatAeUnit
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
  name: 'NameTransferTx',
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
