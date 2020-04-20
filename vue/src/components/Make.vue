<template>
  <div>
    <h1>Make</h1>
  </div>
</template>


<script>
export default {
  name: "make",
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