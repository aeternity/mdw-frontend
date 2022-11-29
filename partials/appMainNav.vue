<template>
  <div class="app-main-nav">
    <Logo />

    <AppNavAccordion
      icon="search"
      class="mobile-search"
    >
      <SearchBar />
      <p>
        Search by account, height, tx, oracle, contract
      </p>
    </AppNavAccordion>

    <AppNavAccordion>
      <AppNavLink
        to="/"
        exact
      >
        Dashboard
      </AppNavLink>
      <AppNavLink to="/generations">
        Generations
      </AppNavLink>
      <AppNavLink to="/transactions">
        Transactions
      </AppNavLink>
      <AppNavLink to="/contracts">
        Contracts
      </AppNavLink>
      <AppNavLink to="/names">
        Names
      </AppNavLink>
      <AppNavLink to="/auctions">
        Name Auctions
      </AppNavLink>
      <AppNavLink to="/oracles">
        Oracles
      </AppNavLink>
      <AppNavLink to="/tokens">
        Tokens
      </AppNavLink>
      <AppNavLink
        v-if="isFaucetActive"
        to="/faucet"
      >
        Faucet
      </AppNavLink>
      <div class="footer mobile">
        <a
          :href="apiDocs"
          target="_blank"
        >
          API docs
        </a>
        <br>
        {{ mdwVersion }}
      </div>
    </AppNavAccordion>
    <div class="footer desktop">
      <a
        :href="apiDocs"
        target="_blank"
      >
        API docs
      </a>
      <br>
      {{ getVersion }} (mdw {{ mdwVersion }})
    </div>
  </div>
</template>

<script>
import Logo from '../components/logo'
import AppNavAccordion from '../components/appNavAccordion'
import SearchBar from '../components/searchBar'
import AppNavLink from '../components/appNavLink'

export default {
  name: 'AppMainNav',
  components: {
    AppNavAccordion,
    AppNavLink,
    SearchBar,
    Logo
  },
  computed: {
    getVersion () {
      return `v${this.$store.state.version}`
    },
    isFaucetActive () {
      return this.$store.state.enableFaucet
    },
    apiDocs () {
      return this.$store.state.apiDocs
    },
    mdwVersion () {
      return `v${this.$store.state.status.mdwVersion}`
    }
  },
  async mounted () {
    await this.$store.dispatch('status')
  }
}
</script>

<style scoped lang="scss">
  @import "~@aeternity/aepp-components-3/src/styles/variables/colors";
  @import "~@aeternity/aepp-components-3/src/styles/placeholders/typography";

  .app-main-nav {
    display: flex;
    background-color: #001833;
    color: #FFFFFF;
    padding: .8rem;
    justify-content: space-between;

    .footer.desktop {
      display: none;
    }

    @media (min-width: 769px) {
      flex-direction: column;
      padding-left: 1rem;
      min-width: 12rem;
      width: 20%;
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;

      .footer.mobile {
        display: none;
      }
      .footer.desktop {
        display: inline-block;
      }
    }

    @media (min-width: 1040px) {
      width: 15%;
    }

    .logo {
      margin-right: auto;
    }

    .mobile-search {
      @media (min-width: 769px) {
        display: none;
      }

      * {
        margin: 1.5rem;
      }

      p {
        @extend %face-sans-s;
        margin-top: -.5rem;
        color: $color-neutral-negative-1;
      }
    }
    .footer {
      position: absolute;
      left: 0;
      bottom: 0;
      padding: 1.5rem;
      width: 100%;
      font-size: 1.2rem;

      &.desktop {
        font-size: 0.9rem;
      }

      a {
        color: #76818C;

        &:hover {
          color: $color-primary;
        }
      }

      p {
        margin: 0;
      }
    }
  }
</style>
