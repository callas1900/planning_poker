<template>
  <div>
    <h1>PLANNING POKER</h1>
    <router-link :to="{name: 'make'}"><h2>making new planning session</h2></router-link>
    <router-link :to="{name: 'join'}"><h2>join a planning session</h2></router-link>
  </div>
</template>


<script>
export default {
  name: "home",
  data() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
</style>