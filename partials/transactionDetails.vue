<template>
  <div class="transaction-details">
    <AppPanel>
      <AppTable details>
        <AppTableBody>
          <AppTableRow extend>
            <AppTableCell extend>
              <TxlistItem :data="data" />
            </AppTableCell>
          </AppTableRow>
          <AppTableRow extend>
            <AppTableCell extend>
              <AppDefinition
                type="list"
                title="Hash"
              >
                <FormatAddress
                  :value="data.hash"
                  length="full"
                  icon
                />
              </AppDefinition>
            </AppTableCell>
          </AppTableRow>
          <AppTableRow
            v-if="data.callinfo && data.callinfo.log"
            extend
          >
            <AppTableCell extend>
              <AppDefinition
                type="list"
                title="log"
              >
                {{ data.callinfo.log }}
              </AppDefinition>
            </AppTableCell>
          </AppTableRow>
          <AppTableRow
            v-if="data.ttl"
            extend
          >
            <AppTableCell extend>
              <AppDefinition
                type="list"
                title="Ttl"
              >
                {{ data.tx.ttl }}
              </AppDefinition>
            </AppTableCell>
          </AppTableRow>
          <AppTableRow
            v-if="data.nonce"
            extend
          >
            <AppTableCell extend>
              <AppDefinition
                type="list"
                title="Nonce"
              >
                {{ data.tx.nonce }}
              </AppDefinition>
            </AppTableCell>
          </AppTableRow>
          <AppTableRow
            v-if="data.signatures"
            extend
          >
            <AppTableCell extend>
              <AppDefinition
                type="list"
                title="Signatures"
              >
                <FormatAddress
                  v-for="(sig, index) in data.signatures"
                  :key="index"
                  :value="sig"
                  length="full"
                />
              </AppDefinition>
            </AppTableCell>
          </AppTableRow>
          <AppTableRow
            v-if="payload"
            extend
          >
            <AppTableCell extend>
              <AppDefinition
                type="list"
                title="Payload"
              >
                {{ payload }}
              </AppDefinition>
            </AppTableCell>
          </AppTableRow>
          <AppTableRow
            v-if="data.gaId"
            extend
          >
            <AppTableCell extend>
              <AppDefinition
                type="list"
                title="ga id"
              >
                {{ data.gaId }}
              </AppDefinition>
            </AppTableCell>
          </AppTableRow>
          <AppTableRow
            v-if="data.gas"
            extend
          >
            <AppTableCell extend>
              <AppDefinition
                type="list"
                title="Gas"
              >
                {{ data.gas }}
              </AppDefinition>
            </AppTableCell>
          </AppTableRow>
          <AppTableRow
            v-if="data.gasPrice"
            extend
          >
            <AppTableCell extend>
              <AppDefinition
                type="list"
                title="Gas Price"
              >
                {{ data.gasPrice }}
              </AppDefinition>
            </AppTableCell>
          </AppTableRow>
          <AppTableRow
            v-if="data.authData"
            extend
          >
            <AppTableCell extend>
              <AppDefinition
                type="list"
                title="Auth Data"
              >
                {{ data.authData }}
              </AppDefinition>
            </AppTableCell>
          </AppTableRow>
          <AppTableRow
            v-if="data.tx.authFun"
            extend
          >
            <AppTableCell extend>
              <AppDefinition
                type="list"
                title="Auth Function"
              >
                {{ data.tx.authFun }}
              </AppDefinition>
            </AppTableCell>
          </AppTableRow>
          <AppTableRow
            v-if="data.tx.callData"
            extend
          >
            <AppTableCell extend>
              <AppDefinition
                type="list"
                title="Call Data"
              >
                {{ data.tx.callData }}
              </AppDefinition>
            </AppTableCell>
          </AppTableRow>
          <AppTableRow
            v-if="data.tx.code"
            extend
          >
            <AppTableCell extend>
              <AppDefinition
                type="list"
                title="Bytecode"
              >
                <AppTableAccordion type="hide">
                  {{ data.tx.code }}
                  <div
                    v-copy-to-clipboard="data.tx.code"
                    v-remove-spaces-on-copy
                    class="copy-to-clipboard"
                  >
                    Copy Bytecode to clipboard&nbsp;<AppIcon name="copy" />
                  </div>
                </AppTableAccordion>
              </AppDefinition>
            </AppTableCell>
          </AppTableRow>
          <AppTableRow
            v-if="data.tx.vmVersion"
            extend
          >
            <AppTableCell extend>
              <AppDefinition
                type="list"
                title="VM Version"
              >
                {{ data.tx.vmVersion }}
              </AppDefinition>
            </AppTableCell>
          </AppTableRow>
          <AppTableRow
            v-if="data.tx.abiVersion"
            extend
          >
            <AppTableCell extend>
              <AppDefinition
                type="list"
                title="ABI Version"
              >
                {{ data.tx.abiVersion }}
              </AppDefinition>
            </AppTableCell>
          </AppTableRow>
          <AppTableRow extend>
            <AppTableCell extend>
              <AppDefinition
                type="list"
                title="Version"
              >
                {{ data.tx.version }}
              </AppDefinition>
            </AppTableCell>
          </AppTableRow>
          <AppTableRow
            v-if="data.tx.function"
            extend
          >
            <AppTableCell extend>
              <AppDefinition
                type="list"
                title="Method"
              >
                {{ data.tx.function }}
              </AppDefinition>
            </AppTableCell>
          </AppTableRow>
          <AppTableRow
            v-if="data.tx.arguments"
            extend
          >
            <AppTableCell extend>
              <AppDefinition
                type="list"
                title="Arguments"
              >
                <p
                  v-for="({type, value}, index) in data.tx.arguments"
                  :key="index"
                  class="argument"
                >
                  {{ type }}: <span>{{ value }}</span>
                </p>
              </AppDefinition>
            </AppTableCell>
          </AppTableRow>
          <AppTableRow
            v-if="data.tx && data.tx.return"
            extend
          >
            <AppTableCell extend>
              <AppDefinition
                type="list"
                title="Return"
              >
                <p
                  v-if="typeof data.tx.return === 'string'"
                  class="argument"
                >
                  {{ data.tx.return }}
                </p>
                <p
                  v-else
                  class="argument"
                >
                  {{ data.tx.return.value && data.tx.return.type + ': ' }}<span>{{ data.tx.return.value ? data.tx.return.value : '–' }}</span>
                </p>
              </AppDefinition>
            </AppTableCell>
          </AppTableRow>
          <AppTableRow
            v-if="data.result"
            extend
          >
            <AppTableCell extend>
              <AppDefinition
                type="list"
                title="Return Value (Decoded)"
              >
                {{ data.result }}
              </AppDefinition>
            </AppTableCell>
          </AppTableRow>
        </AppTableBody>
      </AppTable>
    </AppPanel>
  </div>
</template>

<script>
import AppTable from '../components/appTable'
import AppTableRow from '../components/appTableRow'
import AppTableCell from '../components/appTableCell'
import AppTableBody from '../components/appTableBody'
import AppDefinition from '../components/appDefinition'
import AppPanel from '../components/appPanel'
import AppTableAccordion from '../components/appTableAccordion.vue'
import AppIcon from '../components/appIcon.vue'
import FormatAddress from '../components/formatAddress'
import TxlistItem from './txListItem'
import { decodeBase64Check } from '../plugins/filters/decodeBase64'

export default {
  name: 'TransactionDetails',
  components: {
    AppTable,
    AppTableRow,
    AppTableCell,
    AppTableBody,
    AppDefinition,
    AppPanel,
    AppTableAccordion,
    AppIcon,
    FormatAddress,
    TxlistItem
  },
  props: {
    data: {
      type: Object,
      default: undefined
    }
  },
  computed: {
    payload () {
      if (this.data.tx.payload) {
        return decodeBase64Check(this.data.tx.payload.substring(3))
      }
      return ''
    }
  }
}
</script>

<style scoped lang="scss">
  @import "~@aeternity/aepp-components-3/src/styles/variables/colors";
  @import "~@aeternity/aepp-components-3/src/styles/placeholders/typography";
  .argument {
    margin: 0;
    span {
      font-weight: 700;
    }
  }
  .transaction-details {
    margin-bottom: 2rem;
  }
  .block-height-wrapper {
    display: flex;
    flex-direction: column;
    @media (min-width: 550px) {
      flex-direction: row;
      align-items: center;
    }
  }
    .copy-to-clipboard {
    display: flex;
    justify-content: center;
    margin-top: 4px;
    cursor: pointer;
    font-weight: bold;
    &:hover {
      text-decoration: underline;
      color: #FF0D6A;
    }
    & .app-icon {
      margin-left: .3rem;
    }
    &.v-copied-to-clipboard:before {
      @extend %face-mono-base;
      content: 'copied to clipboard';
      display: flex;
      justify-content: center;
      align-items: center;
      font-weight: 500;
      color: $color-neutral-negative-3;
      background: rgba($color-neutral-positive-1, 0.9);
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;
    }
  }
</style>
