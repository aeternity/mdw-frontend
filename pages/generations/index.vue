<template>
  <div
    class="generations-wrapper"
  >
    <PageHeader
      title="Generations"
      :has-crumbs="true"
      :page="{to: '/generations', name: 'Generations'}"
    />
    <List>
      <nuxt-link
        v-for="(generation, number) in Object.values(generations).reverse()"
        :key="number"
        :to="`/generations/${generation.height}`"
        class="generation-link"
      >
        <Generation :data="generation" />
      </nuxt-link>
    </List>
    <LoadMoreButton
      v-if="nextPageUrl"
      :loading="loading"
      @update="loadMore"
    />
  </div>
</template>

<script>

import { mapState, mapActions } from 'vuex'
import List from '../../components/list'
import Generation from '../../partials/generation'
import PageHeader from '../../components/PageHeader'
import LoadMoreButton from '../../components/loadMoreButton'

export default {
  name: 'AppGenerations',
  components: {
    List,
    Generation,
    PageHeader,
    LoadMoreButton
  },
  async asyncData ({ store }) {
    await store.dispatch('generations/getLatest')
  },
  data () {
    return {
      loading: false
    }
  },
  computed: mapState('generations', ['generations', 'nextPageUrl']),
  methods: {
    ...mapActions('generations', ['getMore']),
    async loadMore () {
      this.loading = true
      await this.getMore()
      this.loading = false
    }
  }
}
</script>

<style scoped lang='scss'>
  .generations-wrapper {
    .generation-link {
      &:hover {
        color: #000000;
      }
    }
  }
</style>
