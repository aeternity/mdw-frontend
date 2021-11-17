<template>
  <div class="app-token">
    <PageHeader
      title="Tokens"
      :has-crumbs="true"
      :page="{to: '/tokens', name: 'Tokens'}"
      :subpage="{to: `/tokens/${$route.params.token}`, name: 'Token Overview'}"
    />
    <Token :data="tokenInfo" />
    <div class="filter">
      <multiselect
        v-model="show"
        :options="options"
        :allow-empty="false"
        :loading="loading"
      />
    </div>
    <AppTable
      v-if="show === 'holders'"
      details
    >
      <AppTableHeader>
        <AppTableRow>
          <AppTableCell>Total Supply:</AppTableCell>
          <AppTableCell>{{ totalSuply | formatToken(tokenInfo.decimals, tokenInfo.symbol) }}</AppTableCell>
        </AppTableRow>
      </AppTableHeader>
      <AppTableBody>
        <AppTableRow
          v-for="([address, amount], index) in tokenBalances"
          :key="index"
          extend
        >
          <AppTableCell class="holder-acc">
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
    <template v-if="show === 'transactions'">
      <div
        v-if="transactions.length > 0"
        class="transactions"
      >
        <table>
          <thead>
            <th
              scope="col"
              class="address-col"
            >
              Tx Hash
            </th>
            <th
              scope="col"
              class="address-col"
            >
              From
            </th>
            <th
              scope="col"
              class="address-col"
            >
              To
            </th>
            <th scope="col">
              Method
            </th>
            <th
              scope="col"
              class="quantity-col"
            >
              Quantity
            </th>
            <th scope="col">
              Date
            </th>
          </thead>
          <tbody>
            <tr
              v-for="(transaction, index) in transactions"
              :key="index"
            >
              <td>
                <FormatAddress
                  :value="transaction.hash"
                  length="responsive"
                />
              </td>
              <td>
                <FormatAddress
                  :value="transaction.tx.callerId"
                  length="responsive"
                />
              </td>
              <td>
                <FormatAddress
                  :value="transaction.tx.arguments.find(a=>a.type === 'address').value"
                  length="responsive"
                />
              </td>
              <td class="function">
                {{ transaction.tx.function }}<span
                  class="status"
                  :class="{ok: transaction.tx.returnType === 'ok', revert: transaction.tx.returnType !== 'ok'}"
                >
                  {{ transaction.tx.returnType }}
                </span>
              </td>
              <td>
                {{ transaction.tx.arguments.find(a=>a.type === 'int').value | formatToken(tokenInfo.decimals) }}
              </td>
              <td>
                {{ transaction.microTime && new Date(transaction.microTime).toLocaleDateString("en-US") }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <LoadMoreButton
        v-if="nextPage"
        :loading="loading"
        @update="loadmore"
      />
      <p v-if="transactions.length === 0 && !loading">
        No transactions yet
      </p>
    </template>
    <div v-if="loading">
      Loading....
    </div>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect'
import AppTable from '../../../components/appTable.vue'
import AppTableBody from '../../../components/appTableBody.vue'
import AppTableCell from '../../../components/appTableCell.vue'
import AppTableRow from '../../../components/appTableRow.vue'
import AppTableHeader from '../../../components/appTableHeader.vue'
import PageHeader from '../../../components/PageHeader'
import Account from '../../../components/account.vue'
import FormatAddress from '../../../components/formatAddress.vue'
import LoadMoreButton from '../../../components/loadMoreButton'
import Token from '../../../partials/token.vue'
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
    Account,
    FormatAddress,
    LoadMoreButton,
    Multiselect
  },
  filters: { formatToken },
  async asyncData ({ store, params: { token } }) {
    const allTokens = await store.dispatch('tokens/getAllTokens')
    const tokenInfo = allTokens.find(t => t.contractId === token)
    const tokenBalances = await store.dispatch('tokens/getTokenBalances', token)
    const { data, next } = await store.dispatch('contracts/getContractCalls', { contract: token, page: 1, limit: 25 })
    const transactions = data.filter(({ tx }) => tx.function === 'transfer' || tx.function === 'mint')
    return { token, tokenInfo, tokenBalances, transactions, loading: false, page: 2, nextPage: !!next }
  },
  data () {
    return {
      token: '',
      tokenInfo: {},
      tokenBalances: [],
      transactions: [],
      loading: true,
      page: 1,
      nextPage: false,
      show: 'transactions',
      options: ['transactions', 'holders']
    }
  },
  computed: {
    totalSuply () {
      return this.tokenBalances.reduce((a, b) => a + b[1], 0)
    }
  },
  methods: {
    async loadmore () {
      this.loading = true
      const { data, next } = await this.$store.dispatch('contracts/getContractCalls', { contract: this.token, page: this.page, limit: 25 })
      this.transactions = [...this.transactions, ...data]
      this.nextPage = !!next
      this.page += 1
      this.loading = false
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@aeternity/aepp-components-3/src/styles/placeholders/typography";
@import "~@aeternity/aepp-components-3/src/styles/variables/colors";

.app-token {
  width: 100%;
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
      @extend %face-mono-s;
    }
  }

  .holder-acc {
    .account {
      flex-direction: row;
    }
  }
}

.transactions {
  font-size: 14px;

  table {
    width: 100%;
    margin-top: 1em;
    border-collapse: collapse;

    tr:hover {
      background-color: #fff;
    }

    th {
      text-align: left;
      background-color: #fff;
      font-weight: 700;
      border-bottom: 2px solid $color-neutral-positive-2;
      padding: .6rem 0 .6rem .5rem;
      font-size: 16px;

      &.address-col {
        min-width: 120px;
      }
      &.quantity-col {
        min-width: 90px;
      }

      &:not(:first-child) {
        border-left: 2px solid $color-neutral-positive-2;
      }

    }
    tr {
      border-bottom: 1px solid $color-neutral-positive-2;
    }
    td {
      @extend %face-mono-s;
      font-size: 14px;
      &:not(:first-child) {
        border-left: 1px solid $color-neutral-positive-2;
      }
    }
    .function {
      white-space: nowrap;
    }
  }
  .status {
    text-transform: uppercase;
    &.ok {
      color: $color-alternative;
    }
    &.revert {
      color: $color-red;
    }
  }

  @media (max-width: 1023px) {
    overflow-x: auto;
  }
}

.load-more-button-wrapper ::v-deep {
  min-height: 30px;
  margin-top: 1rem;

  button {
    height: 28px;
  }
}
</style>
