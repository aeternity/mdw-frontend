<template>
  <div class="app-names">
    <PageHeader
      title="Names"
      :has-crumbs="true"
      :page="{to: `/names/search/${$route.params.search}`, name: `Search results for ${$route.params.search}`}"
    />
    <div v-if="!loading && names.length > 0">
      <List>
        <component
          :is="item.status === 'name'? 'Name' : 'NameAuction'"
          v-for="(item, index) of names"
          :key="index"
          :data="item"
        />
      </List>
    </div>
    <div v-if="loading">
      Loading....
    </div>
    <div v-if="!loading && names.length == 0">
      Nothing to see here right now....
    </div>
  </div>
</template>

<script>
import List from '../../../components/list'
import Name from '../../../partials/name'
import NameAuction from '../../../partials/nameAuction'
import PageHeader from '../../../components/PageHeader'

export default {
  name: 'AppNames',
  components: {
    List,
    Name,
    NameAuction,
    PageHeader
  },
  async asyncData ({ store, params }) {
    const names = await store.dispatch('names/searchNames', params.search)
    return { names, loading: false }
  },
  data () {
    return {
      names: [],
      loading: true
    }
  }
}
</script>
