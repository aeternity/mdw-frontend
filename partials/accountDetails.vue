<template>
  <!-- <p>{{ account }}</p> -->
  <AppPanel class="account-details">
    <div class="account-details-id">
      <Account
        :value="account.id"
        title="Address"
        icon
      />
      <AppDefinition title="Account type">
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
        v-if="tokensBalance.length > 0"
        title="tokens"
      >
        <p
          v-for="(token, index) in tokensBalance"
          :key="index"
          class="token"
        >
          {{ token.amount | formatToken(token.decimals, token.symbol) }}
        </p>
      </AppDefinition>
    </div>
  </AppPanel>
</template>

<script>
import Account from '../components/account.vue'
import AppDefinition from '../components/appDefinition.vue'
import AppPanel from '../components/appPanel.vue'
import FormatAeUnit from '../components/formatAeUnit.vue'
import formatToken from '../plugins/filters/formatToken'

export default {
  name: 'AccountDetails',
  components: { AppDefinition,
    FormatAeUnit,
    Account,
    AppPanel },
  filters: { formatToken },
  props: {
    account: { type: Object, required: true },
    tokensBalance: { type: Array, default: () => [] } }
}
</script>

<style lang="scss" scoped>
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
  }
  .account-details-info {
    border-top: 2px solid #EDF3F7;

    .token {
      margin: 0;
    }

    @media (min-width: 550px) {
      width: 40%;
      flex-direction: row;
      border-top: none;
      border-left: 2px solid #EDF3F7;
    }
    @media (min-width: 1600px) {
      width: 35%;
    }
  }
}
</style>
