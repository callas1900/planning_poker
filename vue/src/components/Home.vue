<template>
  <div>
    <h1 class="md-title">PLANNING POKER</h1>
    <div class="box">
      <md-card md-with-hover>
        <md-card-header>
          <div class="md-title">Make a session</div>
        </md-card-header>
        <md-card-content>If you are a product owner, please make a session. Then you will provide a session code to your team member.</md-card-content>
        <md-card-actions>
          <router-link :to="{name: 'make'}">
            <md-button class="md-raised md-primary">MAKE!</md-button>
          </router-link>
        </md-card-actions>
      </md-card>
      <md-card md-with-hover>
        <md-card-header>
          <div class="md-title">Join a session</div>
        </md-card-header>
        <md-card-content>If you are a team member. Please get a session code from your product owner to join a session.</md-card-content>
        <md-card-actions>
          <router-link :to="{name: 'join'}">
            <md-button class="md-raised md-primary">JOIN!</md-button>
          </router-link>
        </md-card-actions>
      </md-card>
    </div>
  </div>
</template>


<script>
export default {
  name: "home",
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
.md-card {
  margin-left:10px;
  margin-right: 10px;
}
</style>