<template>
  <div class="app-transactions">
    <PageHeader
      title="Oracle Queries"
      :has-crumbs="true"
      :page="{to: '/oracles', name: 'Oracles'}"
      :subpage="{to: `/oracles/queries/${$route.params.id}`, name: 'Oracle Queries'}"
    />
    <div
      v-if="queries.length"
    >
      <List>
        <OracleQuery
          v-for="(item, index) of queries"
          :key="index"
          :data="item"
        />
      </List>
      <LoadMoreButton
        :loading="loading"
        @update="loadMore"
      />
    </div>
    <div v-else>
      Nothing to see here right now....
    </div>
  </div>
</template>

<script>

import List from '../../../components/list'
import OracleQuery from '../../../partials/oracleQuery'
import PageHeader from '../../../components/PageHeader'
import LoadMoreButton from '../../../components/loadMoreButton'

export default {
  name: 'OracleQueryResponse',
  components: {
    List,
    OracleQuery,
    PageHeader,
    LoadMoreButton
  },
  async asyncData ({ store, params }) {
    const { data, next } = await store.dispatch('oracles/getAllQueries', { oracleId: params.id, page: null, limit: 10 })
    return { oracleId: params.id, data, page: next }
  },
  data () {
    return {
      oracleId: null,
      queries: [],
      page: null,
      loading: false
    }
  },
  methods: {
    async loadMore () {
      this.loading = true
      const { data, next } = await this.$store.dispatch('oracles/getAllQueries', { oracleId: this.oracleId, page: this.page, limit: 10 })
      this.loading = false
      this.queries = [...this.queries, ...data]
      this.page = next
    }
  }
}
</script>
