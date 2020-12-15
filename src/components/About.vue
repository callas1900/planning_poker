<template>
  <div class="md-layout md-alignment-center">
    <div class="md-laytout-item">
      <h2>How to play</h2>
      <h3>Starting Game</h3>
      <ol>
        <li>Dealer makes a session for planning. then Dealer provide a session code.</li>
        <li>Member join to the session by the code.</li>
      </ol>
      <h3>In Game</h3>
      <ul>
        <li>Each member can decide own number.</li>
        <li>After all of members decided it, A result scre will be shown up.</li>
        <li>The result is sorted numbers with member's name.</li>
        <li>Dealer can reset the game.</li>
      </ul>
      <h2>Legal Disclaimer</h2>
      <p>This application doesn't have strong security. Please do not put your confidential information.</p>
      <h2>Feedback</h2>
      <p>Please feel free to give me feedback.</p>
      <a href="https://github.com/callas1900/planning_poker/issues">https://github.com/callas1900/planning_poker/issues</a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'about',
  data () {
    return {}
  },
  created () {
    this.$store.dispatch('updateScreenTitle', 'ABOUT')
  }
}
</script>

<style lang="scss" scoped>
</style>
