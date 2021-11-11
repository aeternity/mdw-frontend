<template>
  <div class="app-token">
    <PageHeader
      title="Tokens"
      :has-crumbs="true"
      :page="{to: '/tokens', name: 'Tokens'}"
      :subpage="{to: `/tokens/${$route.params.token}`, name: 'Token Overview'}"
    />
    <Token :data="tokenInfo" />
    <AppTable details>
      <AppTableHeader>
        <AppTableRow>
          <AppTableCell>Holders:</AppTableCell>
          <AppTableCell>Total Supply: <span>{{ totalSuply | formatToken(tokenInfo.decimals, tokenInfo.symbol) }}</span></AppTableCell>
        </AppTableRow>
      </AppTableHeader>
      <AppTableBody>
        <AppTableRow
          v-for="([address, amount], index) in tokenBalances"
          :key="index"
          extend
        >
          <AppTableCell>
            <Account
              :value="address"
              title=""
              icon
            />
          </AppTableCell>
          <AppTableCell class="amount">
            {{ amount | formatToken(tokenInfo.decimals, tokenInfo.symbol) }}
          </AppTableCell>
        </AppTableRow>
      </AppTableBody>
    </AppTable>
  </div>
</template>

<script>
import AppTable from '../../../components/appTable.vue'
import AppTableBody from '../../../components/appTableBody.vue'
import AppTableCell from '../../../components/appTableCell.vue'
import AppTableRow from '../../../components/appTableRow.vue'
import AppTableHeader from '../../../components/appTableHeader.vue'
import PageHeader from '../../../components/PageHeader'
import Token from '../../../partials/token.vue'
import Account from '../../../components/account.vue'
import formatToken from '../../../plugins/filters/formatToken'

export default {
  name: 'AppToken',
  components: {
    PageHeader,
    Token,
    AppTable,
    AppTableBody,
    AppTableHeader,
    AppTableRow,
    AppTableCell,
    Account
  },
  filters: { formatToken },
  async asyncData ({ store, params: { token } }) {
    const allTokens = await store.dispatch('tokens/getAllTokens')
    const tokenInfo = allTokens.find(t => t.contractId === token)
    const tokenBalances = await store.dispatch('tokens/getTokenBalances', token)
    return { tokenInfo, tokenBalances }
  },
  data () {
    return {
      tokenInfo: {},
      tokenBalances: []
    }
  },
  computed: {
    totalSuply () {
      return this.tokenBalances.reduce((a, b) => a + b[1], 0)
    }
  }
}
</script>

<style lang="scss" scoped>
.app-token {
  .app-table {
    margin-top: 1em;
    .app-table-header {
      font-weight: 700;
      .app-table-cell {
        padding-left: 0.5rem;
      }
    }
    .amount {
      padding: 0.5rem;
    }
  }
}
</style>
