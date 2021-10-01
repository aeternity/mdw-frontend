<template>
  <div class="app-contracts">
    <PageHeader
      title="Contracts"
      :has-crumbs="true"
      :page="{to: '/contracts', name: 'Contracts'}"
    />
    <div v-if="contracts.length">
      <List>
        <Contract
          v-for="(item, index) in contracts"
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
    <div v-if="!loading && contracts.length == 0">
      Nothing to see here right now....
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import List from '../../components/list'
import Contract from '../../partials/contract'
import PageHeader from '../../components/PageHeader'
import LoadMoreButton from '../../components/loadMoreButton'

export default {
  name: 'AppContracts',
  components: {
    List,
    Contract,
    PageHeader,
    LoadMoreButton
  },
  async asyncData ({ store }) {
    await store.dispatch('contracts/getLatest')
    return { loading: false }
  },
  data () {
    return {
      page: 2,
      loading: true
    }
  },
  computed: mapState('contracts', ['contracts', 'nextPageUrl']),
  methods: {
    ...mapActions('contracts', ['getMore']),
    async loadMore () {
      this.loading = true
      await this.getMore()
      this.loading = false
    }
  }
}
</script>
