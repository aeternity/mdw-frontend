<template>
  <div class="dropdown">
    <button class="dropbtn">
      {{ name }}
    </button>
    <div
      v-if="otherDeployments"
      class="dropdown-content"
    >
      <a
        :href="otherDeployments[1]"
        target="_blanc"
      >{{ otherDeployments[0] }}</a>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    name () {
      return this.$store.state.networkName
    },
    otherDeployments () {
      let otherDeployments = this.$store.state.otherDeployments

      if (!otherDeployments) {
        return null
      }

      return otherDeployments.split('@')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@aeternity/aepp-components-3/src/styles/variables/colors';
@import '~@aeternity/aepp-components-3/src/styles/placeholders/typography';

.dropbtn {
  @extend %face-sans-xs;
  @extend %face-uppercase-xs;
  font-weight: 500;
  padding: 1rem 1.2rem;
  background-color: $color-primary;
  border-radius: 0.3rem;
  border: none;
  color: $color-white;
}

/* The container <div> - needed to position the dropdown content */
.dropdown {
  position: relative;
  display: inline-block;
}

/* Dropdown Content (Hidden by Default) */
.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f1f1f1;
  min-width: 110px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  border-radius: 0.3rem;
  z-index: 1;
}

/* Links inside the dropdown */
.dropdown-content a {
  @extend %face-sans-xs;
  @extend %face-uppercase-xs;
  font-weight: 500;
  color: black;
  padding: 1rem 1.2rem;
  text-decoration: none;
  display: block;
}

/* Change color of dropdown links on hover */
.dropdown-content a:hover {background-color: #ddd;}

/* Show the dropdown menu on hover */
.dropdown:hover .dropdown-content {display: block;}

/* Change the background color of the dropdown button when the dropdown content is shown */
.dropdown:hover .dropbtn {background-color: $color-primary-negative-2;}
</style>
