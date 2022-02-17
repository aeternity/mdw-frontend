<template>
  <!-- <p>{{ account }}</p> -->
  <AppPanel class="account-details">
    <div class="account-details-id">
      <Account
        :value="account.id"
        title="Address"
        icon
      />
      <AppDefinition
        v-if="account.error"
        title="Account type"
      >
        <div class="error">
          unknown
          <AppIcon name="info" />
          <div class="tooltiptext">
            The account has never been seen in the network.
          </div>
        </div>
      </AppDefinition>
      <AppDefinition
        v-if="account.kind"
        title="Account type"
      >
        {{ account.kind }}
      </AppDefinition>
      <Account
        v-if="account['contract_id']"
        :value="account['contract_id']"
        title="Contract ID"
        icon
      />
    </div>
    <div class="account-details-info">
      <AppDefinition
        title="Balance"
      >
        <FormatAeUnit :value="account.balance" />
      </AppDefinition>
      <AppDefinition
        v-if="account['auth_fun']"
        title="Authentication function"
      >
        {{ account['auth_fun'] }}
      </AppDefinition>
      <AppDefinition
        v-if="tokensBalance && Array.isArray(tokensBalance) && tokensBalance.length > 0"
        title="tokens"
      >
        <div class="show-zero">
          <button
            class="show-btn"
            :class="{active: !showZeros}"
            @click="showZeros = !showZeros"
          >
            <AppIcon name="check" />
          </button>
          Hide empty balances
        </div>
        <div
          class="tokens-balances"
        >
          <p
            v-for="(token, index) in showZeros? tokensBalance : tokensWithBalance"
            :key="index"
            class="token"
          >
            <nuxt-link :to="`/tokens/${token.contractId}`">
              {{ token.amount | formatToken(token.decimals, token.symbol) }}
            </nuxt-link>
          </p>
        </div>
      </AppDefinition>
      <AppDefinition
        v-else
        title="tokens"
      >
        <div class="show-error">
          Loading Tokens Failed
        </div>
      </AppDefinition>
    </div>
  </AppPanel>
</template>

<script>
import Account from '../components/account.vue'
import AppDefinition from '../components/appDefinition.vue'
import AppIcon from '../components/appIcon.vue'
import AppPanel from '../components/appPanel.vue'
import FormatAeUnit from '../components/formatAeUnit.vue'
import formatToken from '../plugins/filters/formatToken'

export default {
  name: 'AccountDetails',
  components: { AppDefinition,
    FormatAeUnit,
    Account,
    AppPanel,
    AppIcon
  },
  filters: { formatToken },
  props: {
    account: { type: Object, required: true },
    tokensBalance: { type: Array, default: () => [] } },
  data () {
    return {
      showZeros: false
    }
  },
  computed: {
    tokensWithBalance () {
      return this.tokensBalance.filter(t => t.amount)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@aeternity/aepp-components-3/src/styles/variables/colors';

.account-details {
  display: flex;
  flex-direction: column;
  padding: 0.6rem;

  @media (min-width: 550px) {
    flex-direction: row;
  }
  .account-details-id {
    width: 100%;
    @media (min-width: 550px) {
      width: 60%;
      justify-content: space-between;
    }
      @media (min-width: 1600px) {
      width: 65%;
    }
    .error {
      color: $color-red;
      display: flex;
      align-items: center;
      position: relative;
      .app-icon {
        margin-left: 0.2rem;
        cursor: pointer;
      }

      .tooltiptext {
        visibility: hidden;
        width: 200px;
        word-break: unset;
        background-color: $color-neutral;
        font-size: 12px;
        color: #fff;
        text-align: center;
        border-radius: 6px;
        position: absolute;
        left: 101%;
        top: -2px;
        z-index: 1;
      }

      &:hover {
        .tooltiptext {
          visibility: visible;
        }
      }
    }
  }
  .account-details-info {
    border-top: 2px solid $color-neutral-positive-2;
    .show-error {
      color: #FF0D6A;
      margin-top: 0.2rem;
    }
    .show-zero {
      display: inline-flex;
      align-items: center;
      margin-top: 0.2rem;
      .show-btn {
        border: none;
        background: none;
        padding: 0.1rem;
        display: inline-flex;
        align-items: center;
        border-radius: 50%;
        color: rgba($color-black, 0.4);
        background: rgba($color-black, 0.1);
        cursor: pointer;
        margin-right: .4rem;

        .app-icon {
          width: 1.2rem;
          height: 1.2rem;
        }

        &.active {
          color: rgba($color-primary, 0.4);
          background: rgba($color-primary, 0.1);
        }
      }
    }

    .tokens-balances {
      max-height: 220px;
      overflow-y: auto;
    }

    .token {
      margin: 0;
    }

    @media (min-width: 550px) {
      width: 40%;
      flex-direction: row;
      border-top: none;
      border-left: 2px solid $color-neutral-positive-2;
    }
    @media (min-width: 1600px) {
      width: 35%;
    }
  }
}
</style>
