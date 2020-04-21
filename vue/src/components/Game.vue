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
    <div id="result" v-if="waits.length == 0 && scores">
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
      scores: null
    };
  },
  computed: {
    result: function() {
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
      for (const i in result) {
        let name = this.members[result[i][0]];
        result[i].push(name);
      }
      return result;
    },
    waits: function() {
      if (!this.scores) {
        return this.members;
      }
      let ids = this.getIds(this.scores);
      return this.members.filter(function(v, i) {
        return !ids.includes(i);
      });
    },
    dones: function() {
      if (!this.scores) {
        return [];
      }
      let ids = this.getIds(this.scores);
      return this.members.filter(function(v, i) {
        return ids.includes(i);
      });
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
          let scores = snapshot.val();
          if (scores && scores !== undefined) {
            that.scores = scores;
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
    },
    getIds: function(scores) {
      let ids = [];
      for (const score of scores) {
        ids.push(Number(score[0]));
      }
      return ids;
    },
  }
};
</script>

<style lang="scss" scoped>
</style>