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
    <md-button class="md-raised md-primary" v-on:click="makeSession(owner)">make!</md-button>
    <md-card md-with-hover v-if="code">
      <md-card-header>
        <div class="md-title">Send your code to team members!</div>
      </md-card-header>
      <md-card-content>
        <h1>{{code}}</h1>
      </md-card-content>
      <md-card-actions>
        <md-button v-on:click="copyToClipBoard()">Copy</md-button>
      </md-card-actions>
      <md-card-actions>
        <router-link :to="{name: 'owner', params: { code: code}, query: { is_owner: true}}">
          <h2>Go to the session</h2>
        </router-link>
      </md-card-actions>
    </md-card>
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
      if ( !goal || goal === "" ){ 
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
    copyToClipBoard: function() {
      let that = this;
      this.$copyText(this.code).then(function (e) {
          let toast = that.$toasted.show("Code copied!", { 
            theme: "toasted-primary", 
            type: "success",
            position: "bottom-right", 
            duration : 5000
          });
          console.log(e)
        }, function (e) {
          // alert('Can not copy')
          console.log(e)
        })
    }
  }
};
</script>

<style lang="scss" scoped>
.md-card {
  margin-top: 70px;
}
</style>