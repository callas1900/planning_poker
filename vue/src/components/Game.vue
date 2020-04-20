<template>
  <div>
    <h1>GAME</h1>
  </div>
</template>


<script>
export default {
  props:['code'],
  name: "game",
  data() {
    return {};
  },
  mounted() {
    console.log(this.$database);
    this.$database.once('value').then(function(dataSnapShot) {
      console.log(dataSnapShot);
    })
  }
};
</script>

<style lang="scss" scoped>
</style>