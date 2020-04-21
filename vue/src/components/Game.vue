<template>
  <div>
    <h1>GAME</h1>your name is
    <b>{{player}}</b>
    your id is
    <b>{{ playerId }}</b>
    <h2>PO</h2>
    {{owner}}
    <h2>Members</h2>
    <li v-for="(member, index) in members">{{member}}</li>
    <hr />select your number :
    <input type="number" v-model="number" />
    <input
      v-if="!dones.includes(player)"
      type="button"
      value="attack!"
      v-on:click="updateScores(number)"
    />
    <hr />
    <div id="result" v-if="waits.length == 0">
      <h2>result</h2>
      <li v-for="(r, index) in result">{{r[1]}}{{r[2]}}</li>
    </div>
    <div id="in_game" v-else>
      <h2>waiting</h2>
      <li v-for="(w, index) in waits">{{w}}</li>
      <h2>decided</h2>
      <li v-for="(d, index) in dones">{{d}}</li>
    </div>
  </div>
</template>


<script>
export default {
  props: ["code", "player"],
  name: "game",
  data() {
    return {
      isOwner: false,
      playerId: null,
      owner: null,
      number: null,
      members: [],
      scores: null,
      waits: [],
      dones: []
    };
  },
  computed: {
    result: function() {
      console.log("----------");
      if (this.waits.length != 0 || !this.scores || this.scores === undefined) {
        return [];
      }
      let result = Array.from(this.scores);
      result.sort(function(a, b) {
        if (a[1] < b[1]) {
          return -1;
        }
        if (a[1] > b[1]) {
          return 1;
        }
        return 0;
      });
      for(const i in result) {
        let name = this.members[result[i][0]];
        result[i].push(name);
      }
      console.log(result);
      return result;
    }
  },
  mounted() {
    this.getOwner(this.code);
    this.keepUpdatingMembers();
    this.keepUpdatingScores();
  },
  methods: {
    updateScores: function(number) {
      if (!this.scores || this.scores === undefined) {
        this.scores = [];
      }
      this.scores.push([this.playerId, number]);
      this.$database.ref("plans/" + this.code + "/scores/").set(this.scores);
    },
    keepUpdatingScores: function() {
      let that = this;
      this.$database.ref("/plans/" + this.code + "/scores/").on(
        "value",
        function(snapshot) {
          console.log(snapshot.val());
          let scores = snapshot.val();
          if (scores && scores !== undefined) {
            that.scores = scores;
            // update waits and dones FIXME:
            let dones = [];
            for (const i in scores) {
              let id = scores[i][0];
              dones.push(that.members[id]);
            }
            that.dones = dones;
            that.waits = that.members.filter(function(mem) {
              return !dones.includes(mem);
            });
          }
        },
        that
      );
    },
    keepUpdatingMembers: function() {
      let that = this;
      this.$database.ref("/plans/" + this.code + "/members/").on(
        "value",
        function(snapshot) {
          console.log(snapshot.val());
          let members = snapshot.val();
          if (members && members !== undefined) {
            for (const i in members) {
              let member = members[i];
              if (that.player == member) {
                that.playerId = i;
              }
            }
            that.members = members;
          }
        },
        that
      );
    },
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