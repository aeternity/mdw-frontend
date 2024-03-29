<template>
  <div class="name">
    <div class="container-first">
      <div class="container-first-inner">
        <nuxt-link :to="`/transactions/${data.info.claims[0]}`">
          <LabelType
            title="Name"
            fill="green"
          />
        </nuxt-link>
        <nuxt-link :to="`/transactions/${data.info.claims[0]}`">
          <div class="name-value">
            {{ data.name }}
          </div>
        </nuxt-link>
      </div>
      <div class="container-first-inner">
        <Account
          :value="data.info.ownership.current"
          title="Owner"
          icon
        />
      </div>
    </div>
    <div class="container-last">
      <div class="container-last-wrapper">
        <AppDefinition
          title="Block Height"
          class="container-last-inner"
        >
          <nuxt-link :to="`/generations/${data.info.activeFrom}`">
            {{ data.info.activeFrom }}
          </nuxt-link>
        </AppDefinition>
        <AppDefinition
          class="container-last-inner"
          :title="expired ? 'Expired At' : 'Expires At'"
        >
          {{ data.info.expireHeight }}
          <small v-if="expiresAt">(≈{{ expiresAt }})</small>
        </AppDefinition>
      </div>
      <div
        class="container-last-wrapper"
      >
        <Account
          v-if="firstPointerKey === 'account_pubkey'"
          :value="firstPointerId"
          title="Pointer Id"
          icon
        />
        <AppDefinition
          v-else
          class="container-last-inner"
          title="Pointer Id"
        >
          {{ firstPointerId }}
        </AppDefinition>
        <AppDefinition
          class="container-last-inner"
          title="Pointer Key"
        >
          {{ firstPointerKey }}
        </AppDefinition>
      </div>
    </div>
  </div>
</template>
<script>
import AppDefinition from '../components/appDefinition'
import Account from '../components/account'
import LabelType from '../components/labelType'

export default {
  name: 'Name',
  components: {
    AppDefinition,
    LabelType,
    Account
  },
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      expiresAt: null,
      expired: false
    }
  },
  computed: {
    firstPointerKey () {
      const pointers = Object.keys(this.data.info.pointers)

      return pointers.length > 0 ? pointers[0] : '-'
    },
    firstPointerId () {
      const pointers = this.data.info.pointers
      const pointersKeys = Object.keys(pointers)

      return pointersKeys.length > 0 ? pointers[pointersKeys[0]] : '-'
    }
  },
  mounted () {
    this.$watch('data', async (data) => this.calculateExpireTime(data), { deep: true })
    this.calculateExpireTime(this.data)
  },
  methods: {
    async calculateExpireTime (data) {
      const generations = await this.$store.dispatch('generations/getGenerationByRange', { start: data.info.activeFrom, end: data.info.activeFrom })
      let generation = generations.find(g => g.height === data.info.activeFrom)
      let date = this.$moment(generation.time)
      date.add((data.info.expireHeight * 3) - (generation.height * 3), 'minutes')

      this.expired = date.diff(this.$moment(), 'seconds') < 0
      this.expiresAt = date.from(this.$moment())
    }
  }
}
</script>

<style scoped lang="scss">
  @import "../node_modules/@aeternity/aepp-components-3/src/styles/variables/colors";
  .name {
    background-color: #FFFFFF;
    display: flex;
    flex-direction: column;
    padding: .6rem .6rem .6rem 0;
    border-radius: .4rem;
    box-shadow: 0 0 16px 0 rgba(27,68,121,0.10);
    margin-bottom: 1rem;
    @media (min-width: 768px) {
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
    @media (max-width: 425px) {
      width: 100%;
      flex-direction: column;
      justify-content: space-between;
    }
    @media (min-width: 768px) {
      width: 40%;
      margin-top: 1.5em;
      flex-direction: column;
      justify-content: space-between;
    }

    @media (min-width: 2560px) {
      margin-top: 1.5em;
      flex-direction: row;
      justify-content: flex-start;
    }
    &-inner {
      width: 40%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      @media (min-width: 320px) {
        width: 100%;
        height: 10%;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
      }
      @media (min-width: 768px) {
        width: 100%;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
      }
      @media (min-width: 1600px) {
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
      }

      &:last-child {
        border-left: 2px solid $color-neutral-positive-2;
        @media (min-width: 768px) {
          border-left: none;
        }
      }
    }
  }
  .container-last {
    display: flex;
    align-items: baseline;
    flex-direction: column;
    @media (min-width: 768px) {
      width: 80%;
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
      @media (min-width: 768px) {
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
      width: 60%;
      &:nth-child(2n) {
        border-left: 2px solid $color-neutral-positive-2;
      }
      @media (min-width: 768px) {
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
