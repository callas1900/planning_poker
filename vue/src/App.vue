<template>
  <div id="app">
    <md-tabs class="md-primary" md-alignment="centered">
      <md-tab id="tab-home" md-label="Home" to="/"></md-tab>
      <md-tab id="tab-about" md-label="About" to="/about"></md-tab>
    </md-tabs>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "app",
  data() {
    return {
      msg: "Welcome to Your Vue.js App"
    };
  }
};
</script>

<style lang="scss">
@import "~vue-material/dist/theme/engine"; // Import the theme engine

@include md-register-theme("default", (
  primary: #3fffbe, // The primary color of your brand
  accent: #3904e7, // The secondary color of your brand
  theme: dark
));

@import "~vue-material/dist/theme/all"; // Apply the theme
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

h1,
h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

.md-app {
  max-height: 400px;
  border: 1px solid rgba(#000, 0.12);
}
.md-title {
 margin-top: 70px; 
 margin-bottom: 70px; 
}
.box {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
}
</style>
