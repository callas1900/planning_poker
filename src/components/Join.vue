<template>
  <div>
    <div v-if="found">
      <h2>Congratulations! Success to find your session!</h2>
      <router-link :to="{name: 'game', params: { code: code, player: name}}">
        <h2>Go to the session</h2>
      </router-link>
    </div>
    <div v-else>
      <md-field>
        <label v-if="isProvidedCode">Your provided code.</label>
        <label v-else>Input provided code.</label>
        <md-input v-model="code" :disabled="isProvidedCode"></md-input>
      </md-field>
      <md-field>
        <label>Type your name.</label>
        <md-input v-model="name" ref="nameInput"></md-input>
      </md-field>
      <md-button
        class="md-raised md-primary"
        :disabled="!(code && name)"
        v-on:click="join(code)"
      >join!</md-button>
      <h2>{{message}}</h2>
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
      found: false,
      message: null,
      isProvidedCode: false,
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
  methods: {
    join: function (code) {
      this.message = null
      const that = this
      this.$database
        .ref('/plans/' + code)
        .once('value')
        .then(function (snapshot) {
          const session = snapshot.val()
          const dealer = session && session.owner && session.owner[0]
          const isMembers = session.members && session.members !== undefined
          const isSameMemeber = isMembers && session.members.includes(that.name)
          if (dealer && !isSameMemeber) {
            console.log('achived')
            that.register(session, that)
            that.found = true
          } else if (!dealer) {
            that.message = 'Code is not found!'
          } else if (isSameMemeber) {
            that.message = 'name <' + that.name + '> already used'
          } else {
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
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
