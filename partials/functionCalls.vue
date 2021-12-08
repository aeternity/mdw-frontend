<template>
  <AppPanel class="function-calls">
    <AppTable
      v-for="(call, index) in functionCalls"
      :key="index"
      details
    >
      <AppTableBody>
        <AppTableRow extend>
          <AppTableCell
            class="function-call-header"
          >
            <div>
              <LabelType title="Function Call" />
            </div>
            <div class="accounts">
              <Account
                v-if="call.internalTx.accountId"
                :value="call.internalTx.accountId"
                title="Caller"
                icon
              />
              <Account
                v-if="call.internalTx.senderId"
                :value="call.internalTx.senderId"
                title="Sender"
                icon
              />
              <Account
                v-if="call.internalTx.recipientId"
                :value="call.internalTx.recipientId"
                title="Recipient"
                icon
              />
              <Account
                v-if="call.internalTx.oracleId"
                :value="call.internalTx.oracleId"
                title="Oracle"
                icon
              />
            </div>
          </AppTableCell>
          <AppTableCell class="function-name">
            <AppDefinition
              title="Function"
            >
              {{ call.function }}
            </AppDefinition>
            <AppDefinition
              v-if="call.internalTx.amount"
              title="Amount"
            >
              <FormatAeUnit :value="call.internalTx.amount" />
            </AppDefinition>
            <AppDefinition
              v-if="call.internalTx.queryFee"
              title="Query Fee"
            >
              <FormatAeUnit :value="call.internalTx.queryFee" />
            </AppDefinition>
          </AppTableCell>
        </AppTableRow>
        <AppTableRow
          v-if="call.internalTx.queryId"
          extend
        >
          <AppTableCell extend>
            <AppDefinition
              type="list"
              title="Query ID"
            >
              {{ call.internalTx.queryId }}
            </AppDefinition>
          </AppTableCell>
        </AppTableRow>
        <AppTableRow
          v-if="call.internalTx.query"
          extend
        >
          <AppTableCell extend>
            <AppDefinition
              type="list"
              title="Query"
            >
              {{ call.internalTx.query }}
            </AppDefinition>
          </AppTableCell>
        </AppTableRow>
        <AppTableRow
          v-if="call.internalTx.queryTtl"
          extend
        >
          <AppTableCell extend>
            <AppDefinition
              type="list"
              title="Query TTL"
            >
              {{ call.internalTx.queryTtl.type }} : {{ call.internalTx.queryTtl.value }}
            </AppDefinition>
          </AppTableCell>
        </AppTableRow>
        <AppTableRow
          v-if="call.internalTx.response"
          extend
        >
          <AppTableCell extend>
            <AppDefinition
              type="list"
              title="Response"
            >
              {{ decode(call.internalTx.response.slice(1)) }}
            </AppDefinition>
          </AppTableCell>
        </AppTableRow>
        <AppTableRow
          v-if="call.internalTx.responseTtl"
          extend
        >
          <AppTableCell extend>
            <AppDefinition
              type="list"
              title="Response TTL"
            >
              {{ call.internalTx.responseTtl.type }} : {{ call.internalTx.responseTtl.value }}
            </AppDefinition>
          </AppTableCell>
        </AppTableRow>
        <AppTableRow
          v-if="call.internalTx.name && call.internalTx.nameId"
          extend
        >
          <AppTableCell extend>
            <AppDefinition
              type="list"
              title="Name"
            >
              <nuxt-link :to="`/names/${call.internalTx.nameId}`">
                <span class="name">{{ call.internalTx.name }}</span>
              </nuxt-link>
            </AppDefinition>
          </AppTableCell>
        </AppTableRow>
        <AppTableRow
          v-if="call.internalTx.hasOwnProperty('nameTtl')"
          extend
        >
          <AppTableCell extend>
            <AppDefinition
              type="list"
              title="Name TTL"
            >
              {{ call.internalTx.nameTtl }}
            </AppDefinition>
          </AppTableCell>
        </AppTableRow>
        <AppTableRow
          v-if="call.internalTx.pointers"
          extend
        >
          <AppTableCell extend>
            <AppDefinition
              type="list"
              title="Pointers"
            >
              <Account
                v-for="pointer in call.internalTx.pointers"
                :key="pointer.id"
                class="name-pointer"
                :value="pointer.id"
                :title="pointer.key"
                icon
              />
            </AppDefinition>
          </AppTableCell>
        </AppTableRow>
      </AppTableBody>
    </AppTable>
  </AppPanel>
</template>

<script>
import AppPanel from '../components/appPanel'
import AppTable from '../components/appTable'
import AppTableBody from '../components/appTableBody'
import AppTableRow from '../components/appTableRow'
import AppTableCell from '../components/appTableCell'
import AppDefinition from '../components/appDefinition'
import Account from '../components/account'
import LabelType from '../components/labelType'
import FormatAeUnit from '../components/formatAeUnit'
import decodeBase64 from '../plugins/filters/decodeBase64'

export default {
  name: 'FunctionCalls',
  components: {
    AppPanel,
    AppTable,
    AppTableBody,
    AppTableRow,
    AppTableCell,
    AppDefinition,
    Account,
    LabelType,
    FormatAeUnit
  },
  props: {
    functionCalls: { type: Array, required: true }
  },
  methods: {
    decode (response) {
      return decodeBase64(Buffer.from(response)).toString()
    }
  }
}
</script>

<style scoped lang="scss">
.function-calls {
  margin-bottom: 2rem;

  .function-call-header {
    display: flex;
    flex-direction: row;
    width: 100%;
    @media (min-width: 550px) {
      width: 60%;
      justify-content: space-between;
    }
    @media (min-width: 1600px) {
      width: 65%;
    }

    .accounts {
      width: 50%;
      @media (min-width: 550px) {
        width: 70%;
      }
    }
  }
  .function-name {
    display: flex;
    flex-direction: column;
    width: 100%;
    @media (min-width: 550px) {
      width: 40%;
      justify-content: space-between;
    }
      @media (min-width: 1600px) {
      width: 35%;
    }
  }

  .name {
    font-size: 1.2em;
  }

  .name-pointer::v-deep{
    padding-bottom: 0.1rem;
    div {
      &.app-definition-title {
        text-transform: unset;
      }
      &.app-definition-title,
      &.app-definition-content {
        padding: 0 !important;
      }
      text-align: left !important;
    }
  }
}
</style>
