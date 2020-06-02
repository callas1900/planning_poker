<template>
  <div class="md-layout md-gutter md-alignment-center">
    <md-card md-with-hover class="md-layout-item md-large-size-50 md-medium-size-100">
      <md-card-header>
        <div class="md-title">Make a session</div>
      </md-card-header>
      <md-card-content>Make a session if you wanna be a dealer. Then you gonna show up a code.</md-card-content>
      <md-card-actions>
        <router-link :to="{name: 'make'}">
          <md-button class="md-raised md-primary">MAKE!</md-button>
        </router-link>
      </md-card-actions>
    </md-card>
    <md-card md-with-hover class="md-layout-item md-large-size-50 md-medium-size-100">
      <md-card-header>
        <div class="md-title">Join a session</div>
      </md-card-header>
      <md-card-content>Get a code of a session from your dealer to enjoy.</md-card-content>
      <md-card-actions>
        <router-link :to="{name: 'join'}">
          <md-button class="md-raised md-primary">JOIN!</md-button>
        </router-link>
      </md-card-actions>
    </md-card>
  </div>
</template>


<script>
export default {
  name: "home",
  data() {
    return {};
  },
  created() {
    this.$store.dispatch('updateScreenTitle', "PLANNING POKER")
  }
};
</script>

<style lang="scss" scoped>
.md-card {
  margin: 10px;
}
</style>
