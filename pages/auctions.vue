<template>
  <div class="app-names">
    <PageHeader
      title="Name Auctions"
      :has-crumbs="true"
      :page="{to: '/auctions', name: 'Name Auctions'}"
    />
    <div class="filter">
      <multiselect
        v-model="sortby"
        track-by="name"
        label="name"
        :options="options"
        :allow-empty="false"
        :loading="loading"
        placeholder="Sort By...."
        @input="processInput"
      />
    </div>
    <div class="auction-error-messages">
      <div v-if="!loading && auctions.length > 0">
        <List>
          <NameAuction
            v-for="(item, index) of auctions"
            :key="index"
            :data="item"
          />
        </List>
        <LoadMoreButton @update="loadMore" />
      </div>
      <div v-if="loading">
        Loading....
      </div>
      <div v-if="!loading && auctions.length == 0">
        Nothing to see here right now....
      </div>
    </div>
  </div>
</template>

<script>
import List from '../components/list'
import NameAuction from '../partials/nameAuction'
import PageHeader from '../components/PageHeader'
import LoadMoreButton from '../components/loadMoreButton'
import Multiselect from 'vue-multiselect'

export default {
  name: 'AppNames',
  components: {
    List,
    NameAuction,
    PageHeader,
    LoadMoreButton,
    Multiselect
  },
  async asyncData ({ store }) {
    const auctions = await store.dispatch('names/getActiveNameAuctions', { 'page': 1, 'limit': 10, by: 'expiration', length: 0 })
    return { auctions, page: 2, loading: false }
  },
  data () {
    return {
      page: 1,
      loading: true,
      auctions: [],
      auctionMarks: ['All', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      options: [
        { name: 'Expiring Soon', value: 'expiration' },
        { name: 'Name', value: 'name' }
      ],
      sortby: { name: 'Expiring Soon', value: 'expiration' },
      length: 0
    }
  },
  computed: {
    actualLength () {
      return this.length > 0 ? this.length + 6 : this.length
    }
  },
  methods: {
    async loadMore () {
      const auctions = await this.$store.dispatch('names/getActiveNameAuctions', { 'page': this.page, 'limit': 10, by: this.sortby.value, length: this.actualLength })
      this.auctions = [...this.auctions, ...auctions]
      this.page += 1
    },
    async processInput () {
      this.loading = true
      this.page = 1
      this.auctions = await this.$store.dispatch('names/getActiveNameAuctions', { 'page': this.page, 'limit': 10, by: this.sortby.value, length: this.actualLength })
      this.page += 1
      this.loading = false
    }
  }
}
</script>
