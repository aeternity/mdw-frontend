<template>
  <div class="app-transactions">
    <PageHeader
      title="Oracle Queries"
      :has-crumbs="true"
      :page="{to: '/oracles', name: 'Oracles'}"
      :subpage="{to: `/oracles/queries/${$route.params.id}`, name: 'Oracle Queries'}"
    />

    <List v-if="oracle">
      <Oracle
        :data="oracle"
      />
    </List>
    <div
      v-if="queries.length"
    >
      <List>
        <TXListItem
          v-for="(item, index) of queries"
          :key="index"
          :data="item"
        />
      </List>
      <LoadMoreButton
        v-if="page"
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
import Oracle from '../../../partials/oracle'
import TXListItem from '../../../partials/txListItem'
import PageHeader from '../../../components/PageHeader'
import LoadMoreButton from '../../../components/loadMoreButton'
import { fetchMiddleware, initMiddleware } from '../../../store/utils'

export default {
  name: 'OracleQueryResponse',
  components: {
    List,
    Oracle,
    TXListItem,
    PageHeader,
    LoadMoreButton
  },
  async asyncData ({ store, params }) {
    const middleware = initMiddleware()

    let queries = []
    let page = null
    let oracle = null

    try {
      const oracleQueries = await fetchMiddleware(`txs/backward?type_group=oracle&oracle_id=${params.id}`)
      queries = oracleQueries.data
      page = oracleQueries.next
    } catch (error) {

    }

    try {
      oracle = await middleware.getOracle(params.id)
    } catch (error) {

    }
    return { queries, oracle, page }
  },
  data () {
    return {
      oracle: null,
      queries: [],
      page: null,
      loading: false
    }
  },
  methods: {
    async loadMore () {
      this.loading = true
      const oracleQueries = await fetchMiddleware(this.page)
      this.page = oracleQueries.next
      this.queries = [
        ...this.queries,
        ...oracleQueries.data
      ]
      this.loading = false
    }
  }
}
</script>
