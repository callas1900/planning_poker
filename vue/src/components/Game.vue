<template>
  <div>
    <h1 class="md-title">GAME</h1>
    <div v-if="isOwner">you are PO</div>
    <div v-else>
      your name is
      <b>{{player}}</b>
      your id is
      <b>{{ playerId }}</b>
    </div>
    <div class="box">
      <div>
        <h2>PO</h2>
        <md-chip class="md-accent">{{ owner }}</md-chip>
      </div>
      <div>
        <h2>Members</h2>
        <md-chip class="md-primary" v-for="member in members" :key="member">{{ member }}</md-chip>
      </div>
    </div>
    <hr />
    <div v-if="isOwner">
      <md-button class="md-raised md-primary" v-on:click="resetGame()">reset!</md-button>
    </div>
    <div v-else>
      <md-field>
        <label>Select your number</label>
        <md-input v-model="number" type="number"></md-input>
      </md-field>
      <md-button
        class="md-raised md-primary"
        :disabled="dones.includes(player)"
        v-on:click="updateScores(number)"
      >attack!</md-button>
    </div>
    <hr />
    <div id="result" v-if="waits.length == 0 && scores">
      <h2>result</h2>
      <div class="result-card" v-for="r in result" :key="r[0]">
        <md-avatar class="md-avatar-icon md-large md-primary">
          <md-ripple>{{r[1]}}</md-ripple>
        </md-avatar>
        {{r[2]}}
      </div>
    </div>
    <div class="box" v-else>
      <div id="waiting">
        <h2>waiting</h2>
        <md-avatar class="md-avatar-icon md-large md-accent" v-for="w in waits" :key="w">
          <md-ripple>{{w.slice(0, 2)}}</md-ripple>
        </md-avatar>
      </div>
      <div id="decided">
        <h2>decided</h2>
        <md-avatar class="md-avatar-icon md-large md-primary" v-for="d in dones" :key="d">
          <md-ripple>{{d.slice(0, 2)}}</md-ripple>
        </md-avatar>
      </div>
    </div>
    <md-snackbar md-position="center" :md-active.sync="showSnackbar" md-persistent>
      <span>{{message}}</span>
    </md-snackbar>
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
      showSnackbar: false,
      message: null
    };
  },
  computed: {
    result: function() {
      if (this.waits.length != 0 || !this.scores || this.scores === undefined) {
        return [];
      }
      let result = Array.from(this.scores);
      result.sort(function(a, b) {
        let an = Number(a[1]);
        let bn = Number(b[1]);
        if (an < bn) {
          return -1;
        }
        if (an > bn) {
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
    if (this.$route.query && this.$route.query.is_owner) {
      this.code = this.$route.params.code; // vue router issue. when query param was set, props doesn't works well
      this.isOwner = true;
    }
    this.getOwner(this.code);
    this.keepUpdatingMembers();
    this.keepUpdatingScores();
  },
  methods: {
    resetGame: function() {
      let that = this;
      this.$database
        .ref("/plans/" + this.code + "/scores/")
        .remove()
        .then(function() {
          console.log("PO reset game");
          that.snackbar("Snake? Snake? SNAAAAAAAAKE!!!", that);
        }, that);
    },
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
      this.$database
        .ref("/plans/" + this.code + "/scores/")
        .on("child_removed", function(snapshot) {
          that.scores = null;
        });
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
            if (that.members && that.members.length > 0) {
              that.showNewMember(members[members.length - 1], that);
            }
            that.members = members;
          }
        },
        that
      );
    },
    showNewMember: function(member, that) {
      if (!that) {
        that = this;
      }
      var suffixes = [
        "Draws Near!",
        "is Raring to Go!",
        "Steals the Show!",
        "Hits the Big Time!",
        "Turns Over A New Leaf!",
        "Turns Up the Heat!",
        "Enters the Ring!",
        "Lashes Out!",
        "Pipes Up!",
        "Comes Aboard!",
        "Faces the Fury!",
        "Joins Smash House!",
        "Gets Wicked!",
        "Joins the Battle!",
        "Storms Into Battle!"
      ];
      for (let i = suffixes.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * i);
        let k = suffixes[i];
        suffixes[i] = suffixes[j];
        suffixes[j] = k;
      }
      that.snackbar('"' + member + '" ' + suffixes[0]);
    },
    snackbar: function(message, that) {
      if (!that) {
        that = this;
      }
      that.message = message;
      that.showSnackbar = true;
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
    }
  }
};
</script>

<style lang="scss" scoped>
.result-card {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.md-avatar.md-theme-default.md-primary.md-avatar-icon {
  margin: 5px;
}
</style>