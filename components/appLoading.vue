<template>
  <div
    class="lds-ellipsis tooltip"
    :style="{
      'width': `${size * 6}px`,
      'height': `${size * 6}px`,
      'margin-top': `-${size * 1.75}px`,
      'margin-bottom': `-${size * 2.75}px`
    }"
  >
    <span
      v-if="tooltipText"
      class="tooltiptext"
      :style="{
        'width': `${tooltipText.length * 12}px`
      }"
    >
      {{ tooltipText }}
    </span>

    <div
      v-for="i in 4"
      :key="i"
      :style="{
        'width': `${size}px`,
        'height': `${size}px`,
        'top': `${(size * 6) / 3 + (size / 2)}px`,
      }"
    />
  </div>
</template>
<script>
export default {
  name: 'AppLoading',
  props: {
    size: {
      type: Number,
      required: false,
      default: 10
    },
    tooltipText: {
      type: String,
      required: false,
      default: null
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~@aeternity/aepp-components-3/src/styles/variables/colors';
@import '~@aeternity/aepp-components-3/src/styles/placeholders/typography';
.lds-ellipsis {
  display: inline-block;
  position: relative;
}
.lds-ellipsis div {
  position: absolute;
  border-radius: 50%;
  background: #76818C;
  animation-timing-function: cubic-bezier(0, 1, 1, 0);
}
.lds-ellipsis div:nth-child(1) {
  left: 8px;
  animation: lds-ellipsis1 0.6s infinite;
}
.lds-ellipsis div:nth-child(2) {
  left: 8px;
  animation: lds-ellipsis2 0.6s infinite;
}
.lds-ellipsis div:nth-child(3) {
  left: 32px;
  animation: lds-ellipsis2 0.6s infinite;
}
.lds-ellipsis div:nth-child(4) {
  left: 56px;
  animation: lds-ellipsis3 0.6s infinite;
}
@keyframes lds-ellipsis1 {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes lds-ellipsis3 {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
}
@keyframes lds-ellipsis2 {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(24px, 0);
  }
}

/* Tooltip text */
.tooltip .tooltiptext {
  visibility: hidden;
  background-color: #76818C;;
  color: #fff;
  text-align: center;
  padding: 5px 0;
  border-radius: 6px;
  /* Position the tooltip text - see examples below! */
  position: absolute;
  top: -10px;
  z-index: 1;
}

/* Show the tooltip text when you mouse over the tooltip container */
.tooltip:hover .tooltiptext {
  visibility: visible;
}

</style>
