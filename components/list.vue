<template>
  <AppTable class="list">
    <slot />
  </AppTable>
</template>
<script>
import AppTable from '../components/appTable'
export default {
  components: { AppTable }
}
</script>

<style lang="scss" scoped>
.list {
  @media (min-width: 550px) {
    border-radius: .4rem;
    box-shadow: 0 0 16px 0 rgba(27,68,121,0.10);
    overflow: hidden;
  }
}
</style>
