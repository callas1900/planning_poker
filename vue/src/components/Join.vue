<template>
  <div>
    <h1>Join</h1>code:
    <input type="text" v-model="code" placeholder="input provided code" />
    name:
    <input type="text" v-model="name" placeholder="type your name" />
    <input type="button" value="join!" v-on:click="join(code)" v-if="code && name" />
    <router-link :to="{name: 'game', params: { code: code, player: name}}" v-if="found">
      <h2>Go the session</h2>
    </router-link>
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
          if (owner && isMembers && !isSameMemeber) {
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
      let code = that.code;
      let name = that.name;
      let members = session.members;
      console.log(members);
      if (!members || members === undefined) {
        members = [that.name];
      } else {
        members.push(that.name);
      }
      console.log(members);
      this.$database.ref("plans/" + code).set({
        owner: session.owner,
        members: members
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>