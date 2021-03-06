<template src="./Game.html"></template>

<script>
const MODE_VIEWER = 0
const MODE_DEALER = 1
const MODE_PLAYER = 2

export default {
  props: ['code', 'player', 'query'],
  name: 'game',
  data () {
    return {
      mode: MODE_VIEWER,
      playerId: null,
      dealer: null,
      cards: null,
      type: null,
      selectedCard: null,
      members: [],
      scores: null,
      title: null,
      kickTarget: null,
      dummyCode: 'ymmud'
    }
  },
  computed: {
    isDealer: function () {
      return this.mode === MODE_DEALER
    },
    isPlayer: function () {
      return this.mode === MODE_PLAYER
    },
    isViewer: function () {
      return this.mode === MODE_VIEWER
    },
    result: function () {
      if (this.waits.length !== 0 || !this.scores || this.scores === undefined) {
        return []
      }
      const temp = Array.from(this.scores)
      temp.sort(function (a, b) {
        const an = Number(a[1][0])
        const bn = Number(b[1][0])
        if (an < bn) {
          return -1
        }
        if (an > bn) {
          return 1
        }
        return 0
      })
      const result = []
      let preScore = null
      for (const i in temp) {
        const name = this.members[temp[i][0]]
        const score = temp[i][1]
        if (preScore && score[0] === preScore) {
          result[result.length - 1][1].push(name)
        } else {
          result.push([score, [name]])
        }
        preScore = score[0]
      }
      console.log(result)
      return result
    },
    waits: function () {
      if (!this.scores) {
        return this.members
      }
      const ids = this.getIds(this.scores)
      return this.members.filter(function (v, i) {
        return !ids.includes(i)
      })
    },
    dones: function () {
      if (!this.scores) {
        return []
      }
      const ids = this.getIds(this.scores)
      return this.members.filter(function (v, i) {
        return ids.includes(i)
      })
    },
    isDecided: function () {
      return this.dones.includes(this.player)
    },
    isFinished: function () {
      return (this.waits.length === 0 && this.scores)
    },
    buttonText: function () {
      return !this.isFinished && this.isDecided ? 'CANCEL...' : 'FIGHT!'
    }
  },
  watch: {
    title: function (newTitle, oldTitle) {
      this.$store.dispatch('updateScreenTitle', newTitle)
    }
  },
  mounted () {
    this.initMode(this)
    this.getSettings(this.code)
    this.keepUpdatingMembers()
    this.keepUpdatingScores()
    this.keepUpdatingTitle()
    this.keepUpdatingMessage()
  },
  methods: {
    resetGame: function () {
      const that = this
      this.$database
        .ref('/plans/' + this.code + '/scores/')
        .remove()
        .then(function () {
          console.log('Dealer reset game')
          that.sendMessage('Snake? Snake? SNAAAAAAAAKE!!!')
        }, that)
    },
    showScore: function () {
      const waitIds = []
      for (const i in this.waits) {
        const waitMember = this.waits[i]
        const playerId = this.members.indexOf(waitMember)
        waitIds.push(playerId)
        console.log(waitIds)
      }
      for (const i in waitIds) {
        const playerId = waitIds[i]
        this.updateScores(this.dummyCode, playerId, this.scores)
      }
    },
    kickUser: function (kickTarget) {
      for (const i in this.members) {
        const member = this.members[i]
        if (kickTarget === member) {
          this.removeScoreById(i, this.scores)
          this.members.splice(i, 1)
          this.kickTarget = null
          break
        }
      }
      this.$database.ref('plans/' + this.code + '/members/').set(this.members)
    },
    changeTitle: function (title) {
      if (!title || title === undefined) {
        title = ''
      }
      this.$database.ref('/plans/' + this.code + '/prefs/title').set(title)
    },
    updateScores: function (number, playerId, scores) {
      if (!scores || scores === undefined) {
        scores = []
      }
      scores.push([playerId, number])
      this.writeScore(scores)
    },
    removeScoreById: function (playerId, scores) {
      if (!this.scores || this.scores === undefined) {
        return
      }
      for (const i in scores) {
        if (scores[i][0] === playerId) {
          scores.splice(i, 1)
          break
        }
      }
      this.writeScore(scores)
    },
    writeScore: function (scores) {
      this.$database.ref('/plans/' + this.code + '/scores/').set(scores)
    },
    sendMessage: function (message) {
      const messageRef = this.$database.ref('/plans/' + this.code + '/message/')
      messageRef.set(message)
      messageRef.set(null)
    },
    keepUpdatingScores: function () {
      const that = this
      this.$database.ref('/plans/' + this.code + '/scores/').on(
        'value',
        function (snapshot) {
          const scores = snapshot.val()
          if (scores !== undefined) {
            that.scores = scores
            that.initializeSelectedCard(scores, that.playerId, that)
          }
        },
        that
      )
    },
    initializeSelectedCard: function (scores, playerId, that) {
      if (that.selectedCard == null) {
        for (const score of scores) {
          console.log(score)
          if (score[0] === playerId) {
            that.selectedCard = score[1]
          }
        }
      }
    },
    keepUpdatingMessage: function () {
      const that = this
      this.$database.ref('/plans/' + this.code + '/message/').on(
        'value',
        function (snapshot) {
          const message = snapshot.val()
          if (message && message !== undefined) {
            that.snackbar(message, that)
          }
        },
        that
      )
    },
    keepUpdatingTitle: function () {
      const that = this
      this.$database.ref('/plans/' + this.code + '/prefs/title').on(
        'value',
        function (snapshot) {
          const title = snapshot.val()
          if (title && title !== undefined) {
            that.title = title
          }
        },
        that
      )
    },
    keepUpdatingMembers: function () {
      const that = this
      this.$database.ref('/plans/' + this.code + '/members/').on(
        'value',
        function (snapshot) {
          const members = snapshot.val()
          if (members && members !== undefined) {
            // initialize
            that.playerId = null
            that.initMode(that)
            for (const i in members) {
              const member = members[i]
              if (that.player === member) {
                that.playerId = i
                that.mode = MODE_PLAYER
              }
            }
            if (
              that.members &&
              that.members.length > 0 &&
              members.length > that.members.length
            ) {
              that.showNewMember(members[members.length - 1], that)
            }
            that.members = members
          }
        },
        that
      )
    },
    showNewMember: function (member, that) {
      if (!that) {
        that = this
      }
      var suffixes = [
        'Draws Near!',
        'is Raring to Go!',
        'Steals the Show!',
        'Hits the Big Time!',
        'Turns Over A New Leaf!',
        'Turns Up the Heat!',
        'Enters the Ring!',
        'Lashes Out!',
        'Pipes Up!',
        'Comes Aboard!',
        'Faces the Fury!',
        'Joins Smash House!',
        'Gets Wicked!',
        'Joins the Battle!',
        'Storms Into Battle!',
      ]
      for (let i = suffixes.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * i)
        const k = suffixes[i]
        suffixes[i] = suffixes[j]
        suffixes[j] = k
      }
      that.snackbar('"' + member + '" ' + suffixes[0])
    },
    getSettings: function (code) {
      const that = this
      this.$database
        .ref('/plans/' + code)
        .once('value')
        .then(function (snapshot) {
          const session = snapshot.val()
          const dealer = session && session.owner && session.owner[0]
          that.dealer = dealer
          const cards = session.prefs.cards[0]
          let aliases = session.prefs.aliases
          if (aliases === null || aliases === undefined) {
            aliases = cards
          }
          const pairs = []
          for (var i = 0; i < cards.length; i++) {
            pairs.push([cards[i], aliases[i]])
          }
          that.cards = pairs
          that.type = session.prefs.type
        }, that)
    },
    getIds: function (scores) {
      const ids = []
      for (const score of scores) {
        ids.push(Number(score[0]))
      }
      return ids
    },
    initMode: function (that) {
      that.mode = that.query && that.query.is_dealer ? MODE_DEALER : MODE_VIEWER
    }
  }
}
</script>

<style lang="scss">
i.md-icon.md-theme-default.md-icon-image svg {
  fill: var( --md-theme-default-primary);
}
</style>
<style lang="scss" scoped src="./Game.css">
</style>
