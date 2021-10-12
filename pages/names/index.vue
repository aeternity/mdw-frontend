<template>
  <div class="app-names">
    <PageHeader
      title="Names"
      :has-crumbs="true"
      :page="{to: '/names', name: 'Names'}"
    />
    <div v-if="!loading && names.length > 0">
      <List>
        <Name
          v-for="(item, index) of names"
          :key="index"
          :data="item"
        />
      </List>
      <LoadMoreButton
        v-if="nextPageUrl"
        :loading="loadingMore"
        @update="loadMore"
      />
    </div>
    <div v-if="loading || loadingMore">
      Loading....
    </div>
    <div v-if="!loading && names.length == 0">
      Nothing to see here right now....
    </div>
  </div>
</template>

<script>
import List from '../../components/list'
import Name from '../../partials/name'
import PageHeader from '../../components/PageHeader'
import LoadMoreButton from '../../components/loadMoreButton'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'AppNames',
  components: {
    List,
    Name,
    PageHeader,
    LoadMoreButton
  },
  async asyncData ({ store }) {
    await store.dispatch('names/getLatest', { page: 1, limit: 10 })
    return { loading: false }
  },
  data () {
    return {
      loading: true,
      loadingMore: false
    }
  },
  computed: mapState('names', ['names', 'nextPageUrl']),
  methods: {
    ...mapActions('names', ['getMore']),
    async loadMore () {
      this.loadingMore = true
      await this.getMore()
      this.loadingMore = false
    } }
}
</script>
