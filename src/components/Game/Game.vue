<template src="./Game.html"></template>

<script>
export default {
  props: ["code", "player"],
  name: "game",
  data() {
    return {
      isDealer: false,
      playerId: null,
      dealer: null,
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
      let temp = Array.from(this.scores);
      temp.sort(function(a, b) {
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
      let result = [];
      let preScore = null;
      for (const i in temp) {
        let name = this.members[temp[i][0]];
        let score = temp[i][1];
        if (preScore && score == preScore) {
          result[result.length - 1][1].push(name);
        } else {
          result.push([score, [name]]);
        }
        let preScore = score;
      }
      console.log(result);
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
    if (this.$route.query && this.$route.query.is_dealer) {
      this.code = this.$route.params.code; // vue router issue. when query param was set, props doesn't works well
      this.isDealer = true;
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
            if (
              that.members &&
              that.members.length > 0 &&
              members.length > that.members.length
            ) {
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
          let dealer = session && session.owner && session.owner[0];
          that.dealer = dealer;
          that.cards = session.prefs.cards[0];
          that.title = session.prefs.title;
          that.$store.dispatch('updateScreenTitle', that.title)
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

<style lang="scss" scoped src="./Game.css">
</style>