<template>
  <div>
    <md-field>
      <label>Type your name.</label>
      <md-input v-model="dealer"></md-input>
    </md-field>
    <md-field>
      <label>Change title if you want.</label>
      <md-input v-model="title"></md-input>
    </md-field>
    <md-field>
      <label>Change card set if you want.</label>
      <md-input v-model="cards"></md-input>
    </md-field>
    <md-button class="md-raised md-primary" @click="makeSession(dealer, title, cards)">make!</md-button>
    <md-card md-with-hover v-if="code">
      <md-card-header>
        <div class="md-title">Click URL or code to copy it. Then send it to the team members!</div>
      </md-card-header>
      <md-card-content>
        <div id="code-contaienr" @click="copyToClipBoard(url)" v-if="url">
          <h1>{{url}}</h1>
          <md-icon>assignment</md-icon>
        </div>
        <h3></h3>
        <div id="code-contaienr" @click="copyToClipBoard(code)">
          <h1>{{code}}</h1>
          <md-icon>assignment</md-icon>
        </div>
      </md-card-content>
      <md-card-actions>
        <router-link :to="{name: 'dealer', params: { code: code}, query: { is_dealer: true}}">
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
  name: 'make',
  data () {
    return {
      dealer: null,
      code: null,
      title: 'GAME',
      cards: '1,2,3,5,8,13,100',
      url_origin: null,
      url: null
    }
  },
  created () {
    this.$store.dispatch('updateScreenTitle', 'MAKING A SESSION')
    this.url_origin = window.location.origin
  },
  methods: {
    makeSession: function (dealer, title, cards) {
      const uuid = this.generateUuid()
      console.log(uuid)
      const code = uuid.split('-')[0]
      const prefs = {
        title: title,
        cards: [this.cards.split(',')]
      }
      this.writeData(code, dealer, uuid, prefs)
      // read data
      const that = this
      this.$database
        .ref('/plans/' + code)
        .once('value')
        .then(function (snapshot) {
          const dealerFromDb =
            snapshot.val() && snapshot.val().owner && snapshot.val().owner[0]
          if (dealerFromDb === dealer) {
            console.log('achived')
            that.code = code
            if (that.url_origin) {
              that.url = that.url_origin + '/#/join?c=' + code
            }
          }
        }, that)
    },
    generateUuid: function () {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (
        c
      ) {
        var r = (Math.random() * 16) | 0,
          v = c === 'x' ? r : (r & 0x3) | 0x8
        return v.toString(16)
      })
    },
    writeData: function (code, dealer, uuid, prefs) {
      console.log(prefs)
      this.$database.ref('plans/' + code).set({
        owner: [dealer, uuid],
        prefs: prefs
      })
    },
    copyToClipBoard: function (code) {
      const that = this
      this.$copyText(code).then(
        function (e) {
          that.snackbar('Copied!', that)
          console.log(e)
        },
        function (e) {
          console.log(e)
        }
      )
    }
  }
}
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
