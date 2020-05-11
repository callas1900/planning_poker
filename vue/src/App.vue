<template>
  <div id="main">
    <md-tabs class="md-primary" md-alignment="centered">
      <md-tab id="tab-home" md-label="Home" to="/home"></md-tab>
      <md-tab id="tab-about" md-label="About" to="/about"></md-tab>
    </md-tabs>
    <div id="app-body" class="md-layout md-alignment-center">
      <div class="md-layout-item md-size-5">
        <!--left space -->
      </div>
      <div id="container" class="md-layout-item md-size-90">
        <div class="md-layout md-alignment-center">
          <h1 class="md-title">{{title}}</h1>
        </div>
        <router-view></router-view>
      </div>
      <div class="md-layout-item md-size-5">
        <!-- right space -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "app",
  data() {
    return {};
  },
  computed: {
    title: function() {
      return this.$store.state.screenTitle;
    }
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
body {
  height: 100%;
  overflow-x: hidden;
}
</style>

<style lang="scss" scoped>
@import "~vue-material/src/components/MdAnimation/variables";
@import "~vue-material/src/components/MdLayout/mixins";
@import "~vue-material/dist/theme/engine";

#main {
  height: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  transition: $md-transition-default;
  transition-property: padding-top;
}
#app-body {
  height: 100%;
  flex:1;
}
#container {
  height: 100%;
}
.md-title {
  margin-top: 70px;
  margin-bottom: 70px;
}
</style>
