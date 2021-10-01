<template>
  <div class="app-oracles">
    <PageHeader
      title="Oracles"
      :has-crumbs="true"
      :page="{to: '/oracles', name: 'Oracles'}"
    />
    <div v-if="oracles.length">
      <List>
        <Oracle
          v-for="(item, index) of oracles"
          :key="index"
          :data="item"
        />
      </List>
      <LoadMoreButton
        v-if="nextPageUrl"
        :loading="loading"
        @update="loadMore"
      />
    </div>
    <div v-if="loading">
      Loading....
    </div>
    <div v-if="!loading && oracles.length == 0">
      Nothing to see here right now....
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import List from '../../components/list'
import Oracle from '../../partials/oracle'
import PageHeader from '../../components/PageHeader'
import LoadMoreButton from '../../components/loadMoreButton'

export default {
  name: 'AppOracles',
  components: {
    List,
    Oracle,
    PageHeader,
    LoadMoreButton
  },
  async asyncData ({ store }) {
    await store.dispatch('oracles/getLatest')
    return { loading: false }
  },
  data () {
    return {
      loading: true
    }
  },
  computed: mapState('oracles', ['oracles', 'nextPageUrl']),
  methods: {
    ...mapActions('oracles', ['getMore']),
    async loadMore () {
      this.loading = true
      await this.getMore()
      this.loading = false
    } }
}
</script>
