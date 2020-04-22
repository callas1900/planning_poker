<template>
  <div>
    <h1 class="md-title">Make New Planning Session</h1>
    <input v-model="owner" placeholder="input your name" />
    <input type="button" value="make!" v-on:click="makeSession(owner)" />
    <div v-if="code">
      <h1>{{code}}</h1>
      <p>Send your code to team members!</p>
      <router-link
        :to="{name: 'owner', params: { code: code}, query: { is_owner: true}}"
        
      >
        <h2>Go to the session</h2>
      </router-link>
    </div>
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
  methods: {
    makeSession: function(owner) {
      let uuid = this.generateUuid();
      console.log(uuid);
      let code = uuid.split("-")[0];
      this.writeData(code, owner, uuid);
      // read data
      let that = this;
      this.$database
        .ref("/plans/" + code)
        .once("value")
        .then(function(snapshot) {
          let owner_from_db =
            snapshot.val() && snapshot.val().owner && snapshot.val().owner[0];
          if (owner_from_db == owner) {
            console.log("achived");
            that.code = code;
          }
        }, that);
    },
    generateUuid: function() {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(
        c
      ) {
        var r = (Math.random() * 16) | 0,
          v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    },
    writeData: function(code, owner, uuid) {
      this.$database.ref("plans/" + code).set({
        owner: [owner, uuid]
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>