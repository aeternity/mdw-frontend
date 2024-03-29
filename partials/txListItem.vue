<template>
  <Component
    :is="data.tx.type"
    v-if="data.tx.type"
    :transaction="data"
    :address="address"
  />
</template>

<script>
import SpendTx from './txListType/spendTx.vue'
import OracleRegisterTx from './txListType/oracleRegisterTx.vue'
import OracleExtendTx from './txListType/oracleExtendTx.vue'
import OracleRespondTx from './txListType/oracleRespondTx.vue'
import OracleQueryTx from './txListType/oracleQueryTx.vue'
import NameClaimTx from './txListType/nameClaimTx.vue'
import NamePreclaimTx from './txListType/namePreclaimTx.vue'
import NameTransferTx from './txListType/nameTransferTx.vue'
import NameUpdateTx from './txListType/nameUpdateTx.vue'
import NameRevokeTx from './txListType/nameRevokeTx.vue'
import ContractCallTx from './txListType/contractCallTx.vue'
import PayingForTx from './txListType/payingForTx.vue'
import ContractCreateTx from './txListType/contractCreateTx.vue'
import GAAttachTx from './txListType/gaAttachTx.vue'
import Aex9ReceivedTx from './txListType/aex9ReceivedTx.vue'
import Aex9SentTx from './txListType/aex9SentTx.vue'
import InternalTx from './txListType/internalTx.vue'

export default {
  name: 'TXListItem',
  components: {
    SpendTx,
    OracleRegisterTx,
    OracleExtendTx,
    OracleRespondTx,
    OracleQueryTx,
    NameClaimTx,
    NamePreclaimTx,
    NameRevokeTx,
    NameTransferTx,
    NameUpdateTx,
    ContractCallTx,
    ContractCreateTx,
    GAAttachTx,
    Aex9ReceivedTx,
    Aex9SentTx,
    InternalTx,
    PayingForTx
  },
  props: {
    data: {
      type: Object,
      required: true
    },
    address: {
      type: String,
      required: false,
      default: ''
    }
  }
}
</script>

<style scoped lang="scss">
@import '~@aeternity/aepp-components-3/src/styles/variables/colors';
.contract-call ::v-deep .transaction,
.transaction ::v-deep {
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  padding: 0.6rem 0.6rem 0 0;
  border-radius: 0.4rem;
  box-shadow: 0 0 16px 0 rgba(27, 68, 121, 0.1);
  margin-bottom: 1rem;
  width: 100%;
  @media (min-width: 550px) {
    flex-direction: row;
    border-radius: 0;
    box-shadow: none;
    margin-bottom: 0;
  }

  .transaction-main-info {
    display: flex;
    margin-bottom: 0.6rem;
    flex-direction: row;
    width: 100%;
    @media (min-width: 550px) {
      width: 60%;
      justify-content: space-between;
    }
    @media (min-width: 1600px) {
      width: 65%;
    }

    &-inner {
      width: 50%;
      &:not(:first-child) {
        border-left: 2px solid $color-neutral-positive-2;
      }
      @media (min-width: 550px) {
        width: 30%;
        &:not(:first-child) {
          border-left: none;
        }
      }

      .name {
        margin-left: 43px;
      }
    }

    .accounts {
      width: 50%;
      @media (min-width: 550px) {
        width: 70%;
      }
    }
  }

  .transaction-type-info {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    @media (min-width: 550px) {
      width: 40%;
      flex-direction: row;
    }
    @media (min-width: 1600px) {
      width: 35%;
    }

    .transaction-type-info-item {
      display: flex;
      flex-direction: row;
      width: 100%;
      border-top: 2px solid $color-neutral-positive-2;
      padding: 0.6rem 0;
      margin-bottom: 0.6rem;
      @media (min-width: 550px) {
        border-top: none;
        width: 50%;
        flex-direction: column;
        border-left: 2px solid $color-neutral-positive-2;
      }

      .block {
        &:not(:first-child) {
          border-left: 2px solid $color-neutral-positive-2;
          border-top: none;
        }
        @media (min-width: 550px) {
          &:not(:first-child) {
            border-left: none;
            border-top: 2px solid $color-neutral-positive-2;
          }
        }
      }
      .tx-time .app-definition-content {
        word-break: keep-all;
      }
    }
  }
}

@media (min-width: 550px) {
  .contract-call ::v-deep .transaction:not(:last-child),
  .contract-call:not(:last-child) ::v-deep .transaction,
  .transaction:not(:last-child) {
    border-bottom: 2px solid $color-neutral-positive-2;
  }
}
</style>
