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
            title="gas limit"
          >
            {{ transaction.tx.gas }}
          </AppDefinition>
          <AppDefinition
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
              :value="transaction.tx.gasUsed * transaction.tx.gasPrice + transaction.tx.fee"
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
    <div
      v-if="transaction.tokenInfo"
      class="transaction"
    >
      <div class="transaction-main-info">
        <div class="transaction-main-info-inner">
          <nuxt-link :to="`/transactions/${transaction.hash}`">
            <div class="transaction-label">
              <LabelType :title="getTitle(transaction)" />
            </div>
          </nuxt-link>
        </div>
        <div class="transaction-main-info-inner accounts">
          <AccountGroup>
            <Account
              v-if="transaction.tokenInfo.sender"
              :value="transaction.tokenInfo.sender"
              :title="getCallerTitle(transaction)"
              icon
            />
            <Account
              v-if="transaction.tokenInfo.recipient"
              :value="transaction.tokenInfo.recipient"
              :title="getRecipientTitle(transaction)"
              icon
            />
          </AccountGroup>
        </div>
      </div>
      <div
        v-if="transaction.tokenInfo.tokens.length >= 2"
        class="transaction-type-info"
      >
        <div
          v-for="(token, index) of transaction.tokenInfo.tokens"
          :key="`token-${token.contractId}`"
          class="transaction-type-info-item"
        >
          <AppDefinition
            :title="`${index == 0 ? 'From ': 'To '} ${getAmountTitle(transaction)}`"
          >
            {{ token.amount | formatToken(token.decimals, token.symbol) }}
            <br>
            <nuxt-link
              v-if="token.name"
              :to="`/tokens/${token.contractId}`"
            >
              {{ token.name }}
            </nuxt-link>
            <br>
          </AppDefinition>
        </div>
      </div>
      <div
        v-else
        class="transaction-type-info"
      >
        <div

          class="transaction-type-info-item"
        >
          <AppDefinition
            :title="getAmountTitle(transaction)"
          >
            {{ transaction.tokenInfo.tokens[0].amount | formatToken(transaction.tokenInfo.tokens[0].decimals, transaction.tokenInfo.tokens[0].symbol) }}
          </AppDefinition>
        </div>
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
import formatToken from '../../plugins/filters/formatToken'
import { transformTxType } from '../../store/utils'
import AppLoading from '../../components/appLoading.vue'

export default {
  name: 'ContractCallTx',
  components: {
    LabelType,
    AppDefinition,
    FormatAeUnit,
    AccountGroup,
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

        return transaction.tx.function.replaceAll('_', ' ')
      }
      return 'token transfer'
    },
    getCallerTitle (transaction) {
      if (transaction.tx.function && transaction.tx.function.includes('allowance')) {
        return 'Authorized account'
      }

      return 'Sender'
    },
    getRecipientTitle (transaction) {
      if (transaction.tx.function && transaction.tx.function.includes('allowance')) {
        return 'Affected account'
      }

      return 'Recipient'
    },
    getAmountTitle (transaction) {
      if (transaction.tx.function && (transaction.tx.function.includes('allowance') || transaction.tx.function.includes('swap'))) {
        return 'Token'
      }

      return 'Amount'
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
