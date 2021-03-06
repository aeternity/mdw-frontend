<template>
  <div class="oracle">
    <div class="container-first">
      <div class="container-first-inner">
        <div>
          <LabelType
            title="Oracle Query"
            fill="green"
          />
        </div>
        <Account
          v-if="data.query_id"
          :value="data.query_id"
          title="Oracle Query Id"
          icon
        />
      </div>
      <div class="containter-first-inner">
        <Account
          v-if="data.request"
          :value="data.request.oracleId"
          length="full"
          title="Oracle Id"
          icon
        />
      </div>
    </div>
    <div class="container-last">
      <div class="container-last-wrapper">
        <AppDefinition
          class="container-last-inner"
          title="Query"
        >
          <nuxt-link
            v-if="data.request && data.request.hash"
            :to="`/transactions/${data.request.hash}`"
          >
            {{ request }}
          </nuxt-link>
          <div v-else>
            {{ request }}
          </div>
        </AppDefinition>
      </div>
      <div class="container-last-wrapper">
        <AppDefinition
          class="container-last-inner"
          title="Response"
        >
          <nuxt-link
            v-if="data.response && data.response.hash"
            :to="`/transactions/${data.response.hash}`"
          >
            {{ response }}
          </nuxt-link>
          <div v-else>
            {{ response }}
          </div>
        </AppDefinition>
      </div>
    </div>
  </div>
</template>
<script>
import Account from '../components/account'
import LabelType from '../components/labelType'
import AppDefinition from '../components/appDefinition'
import decodeBase64 from '../plugins/filters/decodeBase64'

export default {
  name: 'OracleQuery',
  components: {
    LabelType,
    Account,
    AppDefinition
  },
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  computed: {
    request () {
      return this.data.request ? decodeBase64(this.data.request.query) : '-'
    },
    response () {
      if (this.data.response) {
        return decodeBase64(this.data.response.response)
      }
      return '-'
    }
  }
}
</script>

<style scoped lang="scss">
  @import "../node_modules/@aeternity/aepp-components-3/src/styles/variables/colors";
  .oracle {
    background-color: #FFFFFF;
    display: flex;
    flex-direction: column;
    padding: .6rem .6rem .6rem 0;
    border-radius: .4rem;
    box-shadow: 0 0 16px 0 rgba(27,68,121,0.10);
    margin-bottom: 1rem;
    @media (min-width: 550px) {
      flex-direction: row;
      border-radius: 0;
      box-shadow: none;
      margin-bottom: 0;
      border-bottom: 2px solid $color-neutral-positive-2;
    }
  }
  .container-first {
    display: flex;
    flex-direction: row;
    margin-bottom: .6rem;
    @media (min-width: 550px) {
      width: 50%;
      flex-direction: column;
      justify-content: space-between;
    }
    @media (min-width: 1600px) {
      width: 50%;
      flex-direction: row;
      justify-content: flex-start;
    }
    &-inner {
      width: 50%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      @media (min-width: 550px) {
        width: 100%;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
      }
      @media (min-width: 1600px) {
        width: auto;
      }
      &:last-child {
        border-left: 2px solid $color-neutral-positive-2;
        @media (min-width: 550px) {
          border-left: none;
        }
        @media (min-width: 1600px) {
          margin-left: 2rem;
        }
      }
    }
  }
  .container-last {
    display: flex;
    align-items: baseline;
    flex-direction: column;
    @media (min-width: 550px) {
      width: 50%;
      border-left: 2px solid $color-neutral-positive-2;
    }
    @media (min-width: 1600px) {
      flex-direction: row;
      border-left: none;
    }
    &-wrapper {
      display: flex;
      width: 100%;
      border-top: 2px solid $color-neutral-positive-2;
      padding: .6rem 0;
      height: 100%;
      &:last-child {
        padding-bottom: 0;
      }
      @media (min-width: 550px) {
        border-top: none;
        padding: 0;
        &:first-child {
          border-bottom: 2px solid $color-neutral-positive-2;
        }
      }
      @media (min-width: 1600px) {
        &:first-child {
          border-bottom: none;
        }
      }
    }
    &-inner {
      width: 100%;
      &:nth-child(2n) {
        border-left: 2px solid $color-neutral-positive-2;
      }
      @media (min-width: 550px) {
        &:nth-child(2n) {
          border-left: 2px solid $color-neutral-positive-2;
        }
      }
      @media (min-width: 1600px) {
        &:nth-child(1n) {
          border-left: 2px solid $color-neutral-positive-2;
        }
      }
    }
  }
  .name-value {
    font-size: 1.2em;
    padding-left: 3%;
  }
</style>
