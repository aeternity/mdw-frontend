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
        v-model="filterby"
        track-by="name"
        label="name"
        :options="filterOptions"
        :allow-empty="false"
        :loading="loading"
        placeholder="Filter By...."
      />
      <multiselect
        v-model="sortby"
        track-by="name"
        label="name"
        :options="sortOptions"
        :allow-empty="false"
        :loading="loading"
        placeholder="Sort By...."
      />
    </div>
    <List>
      <template
        v-for="(item, index) of names"
      >
        <Name
          v-if="item.info.ownership"
          :key="index"
          :data="item"
        />
        <NameAuction
          v-else
          :key="index"
          :data="item"
        />
      </template>
    </List>
    <LoadMoreButton
      v-if="nextPageUrl"
      :loading="loadingMore"
      @update="loadMore"
    />
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
import NameAuction from '../../partials/nameAuction'
import PageHeader from '../../components/PageHeader'
import LoadMoreButton from '../../components/loadMoreButton'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'AppNames',
  components: {
    Multiselect,
    List,
    Name,
    NameAuction,
    PageHeader,
    LoadMoreButton
  },
  async asyncData ({ store }) {
    await store.dispatch('names/getLatest', {
      limit: 10,
      sortby: { direction: 'backward', by: 'expiration' }
    })
    return { loading: false }
  },
  data () {
    return {
      loading: true,
      loadingMore: false,
      filterOptions: [
        { name: 'Active', value: 'active' },
        { name: 'In Auction', value: 'inauction' },
        { name: 'Expired', value: 'expired' }
      ],
      sortOptions: [
        {
          name: 'Names - Asc',
          value: { direction: 'forward', by: 'name' }
        },
        {
          name: 'Names - Desc',
          value: { direction: 'backward', by: 'name' }
        },
        {
          name: 'Expiration Height - Asc',
          value: { direction: 'forward', by: 'expiration' }
        },
        {
          name: 'Expiration Height - Desc',
          value: { direction: 'backward', by: 'expiration' }
        }
      ],
      sortby: {
        name: 'Expiration Height - Desc',
        value: { direction: 'backward', by: 'expiration' }
      },
      filterby: { name: 'Active', value: 'active' },
      searchName: null
    }
  },
  computed: mapState('names', ['names', 'nextPageUrl']),
  mounted () {
    this.$watch('sortby', this.reloadData, { deep: true })
    this.$watch('filterby', this.reloadData, { deep: true })
    this.$watch('searchName', this.reloadData, { deep: true })
  },
  methods: {
    ...mapActions('names', ['getMore']),
    async loadMore () {
      this.loadingMore = true
      await this.getMore()
      this.loadingMore = false
    },
    reloadData () {
      this.loading = true
      if (this.$searchTimeout) {
        clearTimeout(this.$searchTimeout)
      }
      this.$searchTimeout = setTimeout(async () => {
        await this.$store.dispatch('names/getLatest', {
          limit: 10,
          sortby: this.sortby ? this.sortby.value : null,
          filterby: this.filterby ? this.filterby.value : null,
          search: this.searchName
        })
        this.loading = false
      }, 400)
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
    border-radius: 0.4rem;
    border: 2px solid #d3dce6;
    padding: 0.6rem;
    margin-bottom: 0.6rem;
    min-width: 40%;
    height: 40px;

    @media (max-width: 767px) {
        width: 100%;
    }
}
.multiselect,
.search-name {
    margin-right: 15px;
}
</style>
