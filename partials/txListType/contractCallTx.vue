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
      v-if="transaction.tokenInfo && transaction.tx.returnType === 'ok'"
      class="transaction"
    >
      <div class="transaction-main-info">
        <div class="transaction-main-info-inner">
          <nuxt-link :to="`/transactions/${transaction.hash}`">
            <div class="transaction-label">
              <LabelType title="token transfer" />
            </div>
          </nuxt-link>
        </div>
        <div class="transaction-main-info-inner accounts">
          <AccountGroup>
            <Account
              v-if="transaction.tx.callerId"
              :value="transaction.tx.callerId"
              title="sender"
              icon
            />
            <Account
              v-if="transaction.tokenInfo.recipient"
              :value="transaction.tokenInfo.recipient"
              title="recipient"
              icon
            />
          </AccountGroup>
        </div>
      </div>
      <div class="transaction-type-info">
        <div class="transaction-type-info-item">
          <AppDefinition title="Amount">
            {{ transaction.tokenInfo.amount | formatToken(transaction.tokenInfo.decimals, transaction.tokenInfo.symbol) }}
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
