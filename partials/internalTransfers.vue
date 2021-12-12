<template>
  <div>
    Internal transfers
    <p
      v-for="(transfer, index) in internalTransfers"
      :key="index"
    >
      {{ transfer }}
    </p>
  </div>
</template>

<script>
export default {
  name: 'InternalTransfers',
  props: {
    internalTransfers: { type: Array, required: true }
  }
}
</script>
