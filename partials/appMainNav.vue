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
      <AppNav>
        <AppNavLink
          to="/"
          :exact="true"
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
        <AppNavLink
          :to="this.$store.state.swaggerHub"
          :external="true"
          external-value="Swagger Hub"
        >
          Swagger Hub
        </AppNavLink>
        <AppNavLink
          v-if="isFaucetActive"
          to="/faucet"
        >
          Faucet
        </AppNavLink>
      </AppNav>
    </AppNavAccordion>
  </div>
</template>

<script>
import Logo from '../components/logo'
import AppNavAccordion from '../components/appNavAccordion'
import SearchBar from '../components/searchBar'
import AppNav from '../components/appNav'
import AppNavLink from '../components/appNavLink'

export default {
  name: 'AppMainNav',
  components: {
    AppNavAccordion,
    AppNav,
    AppNavLink,
    SearchBar,
    Logo
  },
  computed: {
    isFaucetActive () {
      return this.$store.state.enableFaucet
    }
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

    @media (min-width: 769px) {
      flex-direction: column;
      padding-left: 1rem;
      min-width: 12rem;
      width: 20%;
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
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
  }
</style>
