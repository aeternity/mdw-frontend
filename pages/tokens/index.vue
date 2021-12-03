<template>
  <div class="app-header">
    <PageHeader
      title="Tokens"
      :has-crumbs="true"
      :page="{to: '/tokens', name: 'Tokens'}"
    />
    <input
      v-model="query"
      class="search-token"
      placeholder="Search for a token..."
      @input="search"
    >
    <div v-if="tokensList.length && !$fetchState.pending">
      <List>
        <Token
          v-for="(item, index) in tokensList"
          :key="index"
          :data="item"
        />
      </List>
    </div>
    <div v-if="$fetchState.pending">
      Loading....
    </div>
    <div v-if="!$fetchState.pending && tokensList.length == 0">
      Nothing to see here right now....
    </div>
  </div>
</template>

<script>
import PageHeader from '../../components/PageHeader'
import List from '../../components/list'
import Token from '../../partials/token'

import { mapState } from 'vuex'

export default {
  name: 'AppTokens',
  components: { PageHeader, List, Token },
  data: function () {
    return {
      query: '',
      tokensList: []
    }
  },
  async fetch () {
    this.query = this.$route.query.search || ''
    this.tokensList = await this.$store.dispatch('tokens/getAllTokens')
    if (this.query) {
      this.search()
    }
  },
  computed: mapState('tokens', ['tokens']),
  methods: {
    search () {
      this.$router.push({ query: this.query ? { search: this.query } : null })
      this.tokensList = this.tokens.filter(token => token.name.toLowerCase().includes(this.query.toLowerCase()) || token.symbol.toLowerCase().includes(this.query.toLowerCase()))
    }
  }
}
</script>

<style lang="scss" scoped>
.search-token {
  border-radius: .4rem;
  border: 2px solid #D3DCE6;
  padding: .6rem;
  margin-bottom: .6rem;
  min-width: 300px;
  height: 3rem;

  @media (max-width: 767px) {
    width: 100%;
  }
}
</style>
