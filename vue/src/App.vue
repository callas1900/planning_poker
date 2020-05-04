<template>
  <div>
    <md-tabs class="md-primary" md-alignment="centered">
      <md-tab id="tab-home" md-label="Home" to="/home"></md-tab>
      <md-tab id="tab-about" md-label="About" to="/about"></md-tab>
    </md-tabs>
    <div id="container">
      <div class="md-layout md-alignment-center">
        <h1 class="md-title">{{title}}</h1>
      </div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: "app",
  data() {
    return {
      title: "PLANNING POKER"
    };
  }
};
</script>

<style lang="scss">
@import "~vue-material/dist/theme/engine"; // Import the theme engine

@include md-register-theme(
  "default",
  (
    // The primary color of your brand
      primary: #a1d978,
    // The secondary color of your brand
      accent: #d93d86,
    theme: dark // This can be dark or light
  )
);

@import "~vue-material/dist/theme/all"; // Apply the theme
.md-title {
  margin-top: 70px;
  margin-bottom: 70px;
}
</style>
