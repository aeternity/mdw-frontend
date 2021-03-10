<template>
  <div class="app-contracts">
    <PageHeader
      title="Contracts"
      :has-crumbs="true"
      :page="{to: '/contracts', name: 'Contracts'}"
    />
    <div v-if="Object.values(contracts).length">
      <List>
        <Contract
          v-for="(item, index) in Object.values(contracts)"
          :key="index"
          :data="item"
        />
      </List>
      <LoadMoreButton @update="loadMore" />
    </div>
    <div v-if="loading">
      Loading....
    </div>
    <div v-if="!loading && Object.values(contracts).length == 0">
      Nothing to see here right now....
    </div>
  </div>
</template>

<script>

import List from '../../components/list'
import Contract from '../../partials/contract'
import PageHeader from '../../components/PageHeader'
import LoadMoreButton from '../../components/loadMoreButton'
import { mapState } from 'vuex'

export default {
  name: 'AppContracts',
  components: {
    List,
    Contract,
    PageHeader,
    LoadMoreButton
  },
  async asyncData ({ store }) {
    await store.dispatch('contracts/getContracts', { page: 1, limit: 10 })
    return { loading: false }
  },
  data () {
    return {
      page: 2,
      loading: true
    }
  },
  computed: mapState('contracts', ['contracts']),
  methods: {
    async loadMore () {
      await this.$store.dispatch('contracts/getContracts', { 'page': this.page, 'limit': 10 })
      this.page += 1
    }
  }
}
</script>
