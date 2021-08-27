<template>
  <header :class="fixed ? 'fixed' : ''">
    <div class="background" :class="fixed ? 'fixed' : ''"></div>
    <div class="container">
      <div class="wrap">
        <Logo theme="light" />
        <Menu />
      </div>
    </div>
  </header>
</template>

<script>
import Logo from './Logo.vue'
import Menu from './Menu.vue'

export default {
  name: 'Header',
  components: { Logo, Menu },
  data: () => ({
    fixed: true,
  }),
  created() {
    document.body.addEventListener('scroll', this.handleScroll)
  },
  destroyed() {
    document.body.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    handleScroll() {
      if (this.$route.name == 'Main' && this.$isDesktop)
        this.fixed = document.body.scrollTop < window.innerHeight / 3
      else this.fixed = document.body.scrollTop < 25
    },
  },
}
</script>

<style lang="sass" scoped>
@import "@/scss/_smart-grid"
@import "@/scss/_variables"

header
  position: fixed
  z-index: 10
  width: calc(100vw - .6em)
  top: 0
  padding: 1em .3rem
  transition: padding .5s
  pointer-events: none

  &.fixed
    pointer-events: none
    padding: 2em .3rem

  .background
    position: absolute
    z-index: 49
    top: 0
    left: 0
    width: 100vw
    height: 13rem
    transition: opacity .5s
    background: linear-gradient(180deg, $blue 0%, transparent 100%)
    pointer-events: none
    .container
      pointer-events: none

  .background.fixed
    pointer-events: none
    opacity: 0

.wrap
  display: flex
  justify-content: space-between
  align-items: center
</style>
