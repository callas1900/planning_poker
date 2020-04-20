<template>
  <div>
    <h1>Make New Planning Session</h1>
    <input v-model="owner" placeholder="input your name" />
    <input type="button" name="make!" v-on:click="makeSession" />
    <h1>{{code}}</h1>
  </div>
</template>


<script>
export default {
  name: "make",
  data() {
    return {
      owner: null,
      code: null
    };
  },
  mounted() {
    console.log(this.$database);
    this.$database.once("value").then(function(dataSnapShot) {
      console.log(dataSnapShot);
    });
  },
  methods: {
    makeSession: function() {
      let uuid = this.generateUuid();
      console.log(uuid);
      this.code = uuid.split('-')[0];
    },
    generateUuid: function() {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(
        c
      ) {
        var r = (Math.random() * 16) | 0,
          v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>