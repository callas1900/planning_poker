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
      <label>Select card style</label>
      <md-select v-model="card_type">
          <md-option value='numbers'>Numbers</md-option>
          <md-option value='tshirt'>T-shirt</md-option>
      </md-select>
    </md-field>
    <md-field v-if="card_type === 'tshirt'">
      <label>Change card set if you want.</label>
      <md-checkbox v-model="t_xs">XS</md-checkbox>
      <md-checkbox v-model="t_s">S</md-checkbox>
      <md-checkbox v-model="t_m">M</md-checkbox>
      <md-checkbox v-model="t_l">L</md-checkbox>
      <md-checkbox v-model="t_xl">XL</md-checkbox>
    </md-field>
    <md-field v-else>
      <label>Change card set if you want.</label>
      <md-input v-model="cards"></md-input>
    </md-field>
    <md-button class="md-raised md-primary" @click="makeSession(dealer, title, cards, aliases, card_type)">make!</md-button>
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
const initCards = '1,2,3,5,8,13,100'
export default {
  name: 'make',
  data () {
    return {
      dealer: null,
      code: null,
      title: 'GAME',
      cards: '1,2,3,5,8,13,100',
      aliases: null,
      card_type: 'numbers',
      t_xs: false,
      t_s: true,
      t_m: true,
      t_l: true,
      t_xl: false,
      url_origin: null,
      url: null
    }
  },
  created () {
    this.$store.dispatch('updateScreenTitle', 'MAKING A SESSION')
    this.url_origin = window.location.origin
  },
  watch: {
    card_type: function (newType, oldType) {
      if (newType === 'tshirt') {
        this.makeTshirtValue()
      } else {
        this.cards = initCards
        this.aliases = null
      }
    },
    t_xs: function (newValue, oldValue) {
      this.makeTshirtValue()
    },
    t_s: function (newValue, oldValue) {
      this.makeTshirtValue()
    },
    t_m: function (newValue, oldValue) {
      this.makeTshirtValue()
    },
    t_l: function (newValue, oldValue) {
      this.makeTshirtValue()
    },
    t_xl: function (newValue, oldValue) {
      this.makeTshirtValue()
    },
  },
  methods: {
    makeSession: function (dealer, title, cards, aliases, type) {
      const uuid = this.generateUuid()
      console.log(uuid)
      const code = uuid.split('-')[0]
      const prefs = {
        title: title,
        cards: [this.cards.split(',')],
        aliases: aliases
        type: type
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
    },
    makeTshirtValue: function () {
      const values = []
      const aliases = []
      if (this.t_xs) {
        values.push('0')
        aliases.push('XS')
      }
      if (this.t_s) {
        values.push('1')
        aliases.push('S')
      }
      if (this.t_m) {
        values.push('2')
        aliases.push('M')
      }
      if (this.t_l) {
        values.push('3')
        aliases.push('L')
      }
      if (this.t_xl) {
        values.push('4')
        aliases.push('XL')
      }
      this.cards = values.join(',')
      this.aliases = aliases
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
