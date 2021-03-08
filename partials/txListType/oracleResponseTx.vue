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
            v-if="transaction.tx.oracleId"
            :value="transaction.tx.oracleId"
            title="oracle"
            icon
          />
          <Account
            v-if="transaction.tx.query_id"
            :value="transaction.tx.query_id"
            title="Query id"
            icon
          />
          <Account
            v-if="transaction.tx.recipientId"
            :value="transaction.tx.recipientId"
            title="recipient"
            icon
          />
        </AccountGroup>
      </div>
    </div>
    <div class="transaction-type-info">
      <div class="transaction-type-info-item">
        <AppDefinition
          v-if="transaction.tx.response"
          title="response"
        >
          {{ response }}
        </AppDefinition>
      </div>
      <div class="transaction-type-info-item">
        <AppDefinition
          title="Block Height"
        >
          <nuxt-link :to="`/generations/${transaction.blockHeight}`">
            {{ transaction.blockHeight }}
          </nuxt-link>
        </AppDefinition>
        <AppDefinition
          v-if="transaction.tx.fee"
          title="tx fee"
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
import { transformTxType } from '../../store/utils'
import decodeBase64 from '../../plugins/filters/decodeBase64'

export default {
  name: 'OracleResponseTx',
  components: {
    LabelType,
    AppDefinition,
    FormatAeUnit,
    AccountGroup,
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
  },
  computed: {
    response () {
      return decodeBase64(this.transaction.tx.response)
    }
  }
}
</script>
