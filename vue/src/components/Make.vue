<template>
  <div class="container">
    <h1 class="md-title">Make New Planning Session</h1>
    <md-field>
      <label>Type your name.</label>
      <md-input v-model="owner"></md-input>
    </md-field>
    <md-field>
      <label>What is the goal.</label>
      <md-input v-model="goal"></md-input>
    </md-field>
    <md-field>
      <label>Change card set if you want.</label>
      <md-input v-model="cards"></md-input>
    </md-field>
    <md-button class="md-raised md-primary" @click="makeSession(owner)">make!</md-button>
    <md-card md-with-hover v-if="code">
      <md-card-header>
        <div class="md-title">Send your code to team members!</div>
      </md-card-header>
      <md-card-content>
        <div id="code-contaienr" @click="copyToClipBoard(code)">
          <h1>{{code}}</h1>
          <md-icon>assignment</md-icon>
        </div>
      </md-card-content>
      <md-card-actions>
        <router-link :to="{name: 'owner', params: { code: code}, query: { is_owner: true}}">
          <h2>Go to the session</h2>
        </router-link>
      </md-card-actions>
    </md-card>
    <md-snackbar md-position="center" :md-active.sync="showSnackbar" md-persistent>
      <span>{{message}}</span>
    </md-snackbar>
  </div>
</template>

<script>
export default {
  name: "make",
  data() {
    return {
      owner: null,
      code: null,
      goal: null,
      cards: "1,2,3,5,8,13,100"
    };
  },
  methods: {
    makeSession: function(owner) {
      let uuid = this.generateUuid();
      console.log(uuid);
      let code = uuid.split("-")[0];
      let goal = this.goal;
      console.log(this.goal);
      if (!goal || goal === "") {
        goal = "GAME";
      }
      this.writeData(code, owner, uuid, goal, this.cards);
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
    writeData: function(code, owner, uuid, goal, cards) {
      console.log(cards);
      this.$database.ref("plans/" + code).set({
        owner: [owner, uuid],
        goal: goal,
        cards: [cards.split(",")]
      });
    },
    copyToClipBoard: function(code) {
      let that = this;
      this.$copyText(code).then(
        function(e) {
          that.snackbar("Code was copied!", that);
          console.log(e);
        },
        function(e) {
          console.log(e);
        }
      );
    }
  }
};
</script>

<style lang="scss" scoped>
.md-card {
  margin-top: 70px;
}
#code-contaienr {
  h1 {
    display: inline;
  }
  .md-icon {
    margin: 5px;
  }
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
</style>