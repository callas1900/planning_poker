<template>
  <div>
    <h1>Join</h1>
  </div>
</template>


<script>
export default {
  name: "join",
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