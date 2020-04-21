<template>
  <div>
    <h1>GAME</h1>
    <h2>PO</h2>
    {{owner}}
    <h2>Members</h2>
    <li v-for="(member, index) in members">{{member}}</li>
  </div>
</template>


<script>
export default {
  props: ["code"],
  name: "game",
  data() {
    return {
      owner: null,
      members: []
    };
  },
  mounted() {
    this.getOwner(this.code);
    let that = this;
    this.$database.ref("/plans/" + this.code + "/members/").on(
      "value",
      function(snapshot) {
        console.log(snapshot.val());
        let members = snapshot.val();
        if (members && members !== undefined) {
          that.members = members;
        }
      },
      that
    );
  },
  methods: {
    getOwner: function(code) {
      let that = this;
      this.$database
        .ref("/plans/" + code)
        .once("value")
        .then(function(snapshot) {
          let session = snapshot.val();
          let owner = session && session.owner && session.owner[0];
          that.owner = owner;
        }, that);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>