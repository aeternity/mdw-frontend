<template>
  <a
    v-if="external"
    :href="to"
    target="_blank"
    class="app-nav-link"
  >
    <slot />
  </a>
  <NuxtLink
    v-else
    :to="to"
    class="app-nav-link"
    active-class="active"
    :exact="exact"
  >
    <slot />
  </NuxtLink>
</template>

<script>
export default {
  props: {
    to: {
      type: String,
      required: true
    },
    external: Boolean,
    exact: Boolean
  }
}
</script>

<style scoped lang="scss">
 .app-nav-link {
   display: block;
   color: #76818C;
   line-height: 1;
   padding-left: 1.5rem;
   margin: 1rem 0 1rem .2rem;

   &.active {
     color: #FFFFFF;
     border-left: 2px solid #F7296E;
   }
 }
</style>
