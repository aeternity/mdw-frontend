<template>
  <div class="app-header">
    <PageHeader
      title="Tokens"
      :has-crumbs="true"
      :page="{to: '/tokens', name: 'Tokens'}"
    />
    <div v-if="tokens.length">
      <List>
        <Token
          v-for="(item, index) in tokens"
          :key="index"
          :data="item"
        />
      </List>
    </div>
    <div v-if="loading">
      Loading....
    </div>
    <div v-if="!loading && tokens.length == 0">
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
  async asyncData ({ store }) {
    await store.dispatch('tokens/getAllTokens')
    return { loading: false }
  },
  data: function () {
    return {
      loading: false
    }
  },
  computed: mapState('tokens', ['tokens'])

}
</script>
