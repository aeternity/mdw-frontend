<template>
  <div class="app-names">
    <PageHeader
      title="Names"
      :has-crumbs="true"
      :page="{ to: '/names', name: 'Names' }"
    />
    <div class="filter">
      <input
        v-model="searchName"
        class="search-name"
        placeholder="Search for a name..."
      >
      <multiselect
        v-model="sortby"
        track-by="name"
        label="name"
        :options="options"
        :allow-empty="false"
        :loading="loading"
        placeholder="Sort By...."
      />
    </div>
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
import Multiselect from 'vue-multiselect'
import List from '../../components/list'
import Name from '../../partials/name'
import PageHeader from '../../components/PageHeader'
import LoadMoreButton from '../../components/loadMoreButton'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'AppNames',
  components: {
    Multiselect,
    List,
    Name,
    PageHeader,
    LoadMoreButton
  },
  async asyncData ({ store }) {
    await store.dispatch('names/getLatest', { limit: 10, sortby: { direction: 'backward', by: 'expiration' } })
    return { loading: false }
  },
  data () {
    return {
      loading: true,
      loadingMore: false,
      options: [
        { name: 'Names - Asc', value: { direction: 'forward', by: 'name' } },
        { name: 'Names - Desc', value: { direction: 'backward', by: 'name' } },
        { name: 'Expiring Soon', value: { direction: 'backward', by: 'expiration' } }

      ],
      sortby: { name: 'Expiring Soon', value: { direction: 'backward', by: 'expiration' } },
      searchName: null
    }
  },
  computed: mapState('names', ['names', 'nextPageUrl']),
  watch: {
    sortby: function (sortby, old) {
      this.$store.dispatch('names/getLatest', { limit: 10, sortby: sortby.value })
    },
    searchName: function (search) {
      this.$store.dispatch('names/getLatest', { limit: 10, sortby: this.sortby.value, search })
    }
  },
  methods: {
    ...mapActions('names', ['getMore']),
    async loadMore () {
      this.loadingMore = true
      await this.getMore()
      this.loadingMore = false
    }
  }
}
</script>

<style lang="scss" scoped>
.filter {
  display: flex;
  width: 80%;
  flex-direction: row;
}
.search-name {
  border-radius: .4rem;
  border: 2px solid #D3DCE6;
  padding: .6rem;
  margin-bottom: .6rem;
  min-width: 50%;
  height: 40px;
  margin-right: 15px;

  @media (max-width: 767px) {
    width: 100%;
  }
}
</style>
