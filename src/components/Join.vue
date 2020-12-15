<template>
  <div>
    <div>
      <md-field :class="messageCodeClass">
        <label v-if="isProvidedCode">Your provided code.</label>
        <label v-else>Input provided code.</label>
        <md-input v-model="code" :disabled="isProvidedCode"></md-input>
        <span class="md-error">{{message}}</span>
      </md-field>
      <md-field :class="messageNameClass">
        <label>Type your name.</label>
        <md-input v-model="name" ref="nameInput"></md-input>
        <span class="md-error">{{message}}</span>
      </md-field>
      <md-button
        class="md-raised md-primary"
        :disabled="!(code && name)"
        v-on:click="join(code)"
      >join!</md-button>
    </div>
  </div>
</template>

<script>
export default {
  props: ['query'],
  name: 'join',
  data () {
    return {
      code: null,
      name: null,
      message: null,
      isProvidedCode: false,
      hasCodeError: false,
      hasNameError: false,
    }
  },
  created () {
    this.$store.dispatch('updateScreenTitle', 'JOIN')
  },
  mounted () {
    if (this.query && this.query.c) {
      this.code = this.query.c
      this.isProvidedCode = true
      this.$refs.nameInput.$el.focus()
    }
  },
  computed: {
    messageCodeClass () {
      return {
        'md-invalid': this.hasCodeError
      }
    },
    messageNameClass () {
      return {
        'md-invalid': this.hasNameError
      }
    }
  },
  methods: {
    join: function (code) {
      this.clearMessages()
      const that = this
      this.$database
        .ref('/plans/' + code)
        .once('value')
        .then(function (snapshot) {
          const session = snapshot.val()
          const dealer = session && session.owner && session.owner[0]
          const isMembers = session && session.members && session.members !== undefined
          const isSameMemeber = isMembers && session.members.includes(that.name)
          if (dealer && !isSameMemeber) {
            console.log('achived')
            that.register(session, that)
            that.$router.push({ name: 'game', params: { code: that.code, player: that.name } })
          } else if (!dealer) {
            that.message = 'Code is not found!'
            that.hasCodeError = true
            that.isProvidedCode = false
          } else if (isSameMemeber) {
            that.message = 'same name was already used'
            that.hasNameError = true
          } else {
            that.hasCodeError = true
            that.hasNameError = true
            that.isProvidedCode = false
            that.message = 'error'
          }
        }, that)
    },
    register: function (session, that) {
      console.log('---------')
      const code = that.code
      let members = session.members
      if (!members || members === undefined) {
        members = []
      }
      members.push(that.name)
      this.$database.ref('plans/' + code + '/members/').set(members)
    },
    clearMessages: function () {
      this.message = null
      this.hasCodeError = false
      this.hasNameError = false
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
