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
            v-if="transaction.tx.ownerId"
            :value="transaction.tx.ownerId"
            title="owner"
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
      <div class="transaction-type-info-item ">
        <AppDefinition
          title="Block Height"
        >
          <nuxt-link :to="`/generations/${transaction.blockHeight}`">
            {{ transaction.blockHeight }}
          </nuxt-link>
        </AppDefinition>
        <AppDefinition
          title="deposit"
        >
          <FormatAeUnit :value="transaction.tx.deposit" />
        </AppDefinition>
        <AppDefinition
          title="gas limit"
        >
          {{ transaction.tx.gas }}
        </AppDefinition>
        <AppDefinition
          v-if="transaction.tx.gasUsed"
          title="gas used"
        >
          {{ transaction.tx.gasUsed }}
        </AppDefinition>
        <AppDefinition
          v-if="transaction.tx.gasPrice"
          title="gas price"
        >
          <FormatAeUnit :value="transaction.tx.gasPrice" />
        </AppDefinition>
        <AppDefinition
          v-if="transaction.tx.returnType"
          title="result"
        >
          <span
            class="status"
            :class="{ok: transaction.tx.returnType === 'ok', revert: transaction.tx.returnType !== 'ok'}"
          >
            {{ transaction.tx.returnType }}
          </span>
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
          <FormatAeUnit
            :value="transaction.tx.fee"
          />
        </AppDefinition>
        <AppDefinition
          v-if="transaction.tx.fee && transaction.tx.gasUsed"
          title="total cost"
        >
          <FormatAeUnit
            :value="transaction.tx.gasUsed * transaction.tx.gasPrice + transaction.tx.deposit + transaction.tx.fee"
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
import Account from '../../components/account'
import LabelType from '../../components/labelType'
import timestampToUTC from '../../plugins/filters/timestampToUTC'
import { transformTxType } from '../../store/utils'
import AccountGroup from '../../components/accountGroup.vue'

export default {
  name: 'ContractCreateTx',
  components: {
    LabelType,
    AppDefinition,
    FormatAeUnit,
    Account,
    AccountGroup
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
