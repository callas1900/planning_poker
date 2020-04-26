<template>
  <div>
    <h1 class="md-title">Join</h1>
    <div v-if="found">
      <h2>Congratulations! Success to find your session!</h2>
      <router-link :to="{name: 'game', params: { code: code, player: name}}">
        <h2>Go to the session</h2>
      </router-link>
    </div>
    <div v-else>
      <md-field>
        <label>Input provided code.</label>
        <md-input v-model="code"></md-input>
      </md-field>
      <md-field>
        <label>Type your name.</label>
        <md-input v-model="name"></md-input>
      </md-field>
      <md-button
        class="md-raised md-primary"
        :disabled="!(code && name)"
        v-on:click="join(code)"
      >join!</md-button>
      <h2>{{message}}</h2>
    </div>
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
      this.message = null;
      let that = this;
      this.$database
        .ref("/plans/" + code)
        .once("value")
        .then(function(snapshot) {
          let session = snapshot.val();
          let owner = session && session.owner && session.owner[0];
          let isMembers = session.members && session.members !== undefined;
          let isSameMemeber = isMembers && session.members.includes(that.name);
          if (owner && !isSameMemeber) {
            console.log("achived");
            that.register(session, that);
            that.found = true;
          } else if (!owner) {
            that.message = "Code is not found!";
          } else if (isSameMemeber) {
            that.message = "name <" + that.name + "> already used";
          } else {
            that.message = "error";
          }
        }, that);
    },
    register: function(session, that) {
      console.log("---------");
      let code = that.code;
      let name = that.name;
      let members = session.members;
      if (!members || members === undefined) {
        members = [];
      }
      members.push(that.name);
      this.$database.ref("plans/" + code + "/members/").set(members);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>