<template>
  <div>
    <div class="box">
      <div>
        <h2>owner</h2>
        <md-chip class="md-accent">{{ owner }}</md-chip>
      </div>
      <div>
        <h2>member</h2>
        <md-chip class="md-primary" v-for="member in members" :key="member">{{ member }}</md-chip>
      </div>
    </div>
    <h1 class="md-title">{{title}}</h1>
    <div v-if="isOwner">you are PO</div>
    <div v-else>
      your name is
      <b>{{player}}</b>
      your id is
      <b>{{ playerId }}</b>
    </div>
    <hr />
    <div v-if="isOwner">
      <md-button class="md-raised md-primary" v-on:click="resetGame()">reset!</md-button>
      <div id="kick">
      <md-field id="kick">
        <label>Type user name.</label>
        <md-input v-model="kickTarget"></md-input>
      </md-field>
      <md-button class="md-raised md-primary" v-on:click="kickUser(kickTarget)">kick!</md-button>
      </div>
    </div>
    <div v-else>
      <div class="number-card-container">
        <div v-for="card in cards" :key="card" @click="number = card">
          <md-card md-with-hover v-if="number == card" class="number-card md-primary">
            <h1>{{card}}</h1>
          </md-card>
          <md-card md-with-hover v-else class="number-card">
            <h1>{{card}}</h1>
          </md-card>
        </div>
      </div>
      <md-button
        v-bind:class="{'md-primary': !isDecided, 'md-accent' : isDecided}"
        class="md-raised"
        :disabled="isFinished || !number"
        v-on:click="isDecided ? cancelOwnScore(playerId, scores) : updateScores(number, playerId, scores)"
      >{{ buttonText }}</md-button>
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
      cards: null,
      number: null,
      members: [],
      scores: null,
      title: "GAME",
      kickTarget: null
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
    },
    isDecided: function() {
      return this.dones.includes(this.player);
    },
    isFinished: function() {
      return this.waits.length == 0 && this.scores ? true : false;
    },
    buttonText: function() {
      return !this.isFinished && this.isDecided ? "CANCEL..." : "FIGHT!";
    }
  },
  mounted() {
    if (this.$route.query && this.$route.query.is_owner) {
      this.code = this.$route.params.code; // vue router issue. when query param was set, props doesn't works well
      this.isOwner = true;
    }
    this.getSettings(this.code);
    this.keepUpdatingMembers();
    this.keepUpdatingScores();
    this.keepUpdatingMessage();
  },
  methods: {
    resetGame: function() {
      let that = this;
      this.$database
        .ref("/plans/" + this.code + "/scores/")
        .remove()
        .then(function() {
          console.log("Dealer reset game");
          that.sendMessage("Snake? Snake? SNAAAAAAAAKE!!!");
        }, that);
    },
    kickUser: function(kickTarget) {
      for (let i in this.members) {
        let member = this.members[i];
        if (kickTarget == member) {
          this.members.splice(i, 1);
          this.kickTarget = null;
          break;
        }
      }
      this.$database.ref("plans/" + this.code + "/members/").set(this.members);
    },
    updateScores: function(number, playerId, scores) {
      if (!scores || scores === undefined) {
        scores = [];
      }
      scores.push([playerId, number]);
      this.writeScore(scores);
    },
    cancelOwnScore: function(playerId, scores) {
      if (!this.scores || this.scores === undefined) {
        return;
      }
      for (let i in scores) {
        if (scores[i][0] == playerId) {
          scores.splice(i, 1);
          break;
        }
      }
      this.writeScore(scores);
    },
    writeScore: function(scores) {
      this.$database.ref("/plans/" + this.code + "/scores/").set(scores);
    },
    sendMessage: function(message) {
      let messageRef = this.$database.ref("/plans/" + this.code + "/message/");
      messageRef.set(message);
      messageRef.set(null);
    },
    keepUpdatingScores: function() {
      let that = this;
      this.$database.ref("/plans/" + this.code + "/scores/").on(
        "value",
        function(snapshot) {
          let scores = snapshot.val();
          if (scores !== undefined) {
            that.scores = scores;
          }
        },
        that
      );
    },
    keepUpdatingMessage: function() {
      let that = this;
      this.$database.ref("/plans/" + this.code + "/message/").on(
        "value",
        function(snapshot) {
          let message = snapshot.val();
          if (message && message !== undefined) {
            that.snackbar(message, that);
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
    getSettings: function(code) {
      let that = this;
      this.$database
        .ref("/plans/" + code)
        .once("value")
        .then(function(snapshot) {
          let session = snapshot.val();
          let owner = session && session.owner && session.owner[0];
          that.owner = owner;
          that.cards = session.prefs.cards[0];
          that.title = session.prefs.title;
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
.md-avatar-icon {
  margin: 5px;
}
.number-card-container {
  display: flex;
  flex-direction: row;
}
.number-card {
  width: 50px;
  height: 80px;
  margin: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
}
#kick {
  display: flex;
  flex-direction: row;;
}
</style>