<template>
  <div>
    <h1>Join</h1>
    code: <input type="text" v-model="code" placeholder="input provided code"/>
    name: <input type="text" v-model="name" placeholder="type your name"/>
    <input type="button" value="join!" v-on:click="join(code)" />
    <h2>{{found}}</h2>
    <h2>{{message}}</h2>
  </div>
</template>


<script>
export default {
  name: "join",
  data() {
    return {
      code: null,
      name: null,
      found: false,
      message: null
    };
  },
  methods: {
    join: function(code) {
      let that = this;
      this.$database
        .ref("/plans/" + code)
        .once("value")
        .then(function(snapshot) {
          let owner =
            snapshot.val() && snapshot.val().owner && snapshot.val().owner[0];
          if (owner) {
            console.log("achived");
            that.found = true;
          } else {
            that.message = "Code is not found!";
          }
        }, that);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>