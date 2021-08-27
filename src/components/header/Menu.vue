<template>
  <nav>
    <ul>
      <NeonLink text="Main" to="/" />
      <NeonLink text="Wallet" to="/wallet" v-if="authenticated" />
      <NeonLink text="Trading" to="/trading" />
      <NeonLink text="Contract" to="/contract" />
      <NeonLink text="About us" to="/about" />

      <NeonLink
        text="Log in"
        to=""
        theme="light"
        @click.native="login"
        v-if="!authenticated"
      />
      <NeonLink
        text="Sign up"
        to=""
        theme="light"
        @click.native="signup"
        v-if="!authenticated"
      />

      <Dropdown v-if="authenticated" class="user-dropdown" />
      <div class="burger" @click="toggleProfile">
        <div></div>
        <div></div>
        <div></div>
      </div>
    </ul>
  </nav>
</template>

<script>
import { mapGetters } from 'vuex'
import Dropdown from './Dropdown.vue'
import NeonLink from './NeonLink.vue'

export default {
  name: 'Menu',
  components: { NeonLink, Dropdown },
  data: () => ({
    authenticated: false,
  }),
  computed: {
    ...mapGetters({
      isLoggedIn: 'auth/isLoggedIn',
    }),
  },
  watch: {
    isLoggedIn(v) {
      let self = this
      self.$el.style.opacity = 0
      setTimeout(() => {
        self.authenticated = v
        self.$el.style.opacity = 1
      }, 150)
    },
  },
  methods: {
    open() {
      if (!this.show) this.$refs.drop.$emit('show', this.$refs.caller)
    },
    login() {
      this.$store.commit('popups/SIGN_IN', true)
    },
    signup() {
      this.$store.commit('popups/SIGN_UP', true)
    },
    toggleProfile() {
      this.$store.commit('popups/TOGGLE_SIDE_MENU')
    },
  },
  mounted() {
    this.authenticated = this.isLoggedIn
  },
}
</script>

<style lang="sass" scoped>
@import "@/scss/_smart-grid"
@import "@/scss/_variables"

.burger
    width: 40px
    height: 30px
    display: grid
    align-content: space-between
    pointer-events: all
    cursor: pointer
    z-index: 200

    @include to(78rem)
      display: grid
    @include from(78rem)
      display: none

    *
      margin: 0
      transition: all .1s

    &:hover *
      background-color: $light-blue

      &:first-child
        transform: translateX(-5px)

      &:last-child
        transform: translateX(5px)

    div
      width: 100%
      height: 3px
      background-color: white
      pointer-events: none

nav
  display: flex
  transition: opacity .15s

  ul
    display: flex
    list-style: none
    padding: 0
    justify-content: flex-end
    align-items: center

    *
      margin: 0 15px

  .user-dropdown
    margin: 0

    @include to(78rem)
      display: none
    @include from(78rem)
      display: grid
</style>
