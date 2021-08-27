<template>
  <nav class="menu">
    <a
      @click="select(index)"
      v-for="(tab, index) in tabs"
      :key="index"
      :class="['menu__link', currentTabIndex == index && 'selected']"
    >
      {{ tab }}
    </a>
  </nav>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Tabs',
  mounted() {
    this.select(0)
  },
  computed: {
    ...mapGetters({
      currentTabIndex: 'popups/exchangeCurrentTab',
      tabs: 'popups/exchangeTabs',
    }),
  },
  methods: {
    select(index) {
      this.$emit('changed')
      this.$store.commit('popups/SELECT_EXCHANGE_TAB', index)
    },
  },
}
</script>

<style lang="sass" scoped>
@import "@/scss/_smart-grid"
@import "@/scss/_variables"

$break: 55rem

.menu
  @include to($break)
    display: none
  @include from($break)
    display: flex

  width: 100%
  max-width: 160px
  justify-self: end
  flex-direction: column
  position: relative
  z-index: 1

  &__link
    display: flex
    text-decoration: none
    color: $cyan
    align-items: center
    text-transform: uppercase
    border-radius: 5px
    justify-content: center
    transition: transform .1s
    font-weight: 500
    background:  #0075FFaa
    backdrop-filter: blur(3px)
    user-select: none
    border: 1px solid #56A4FF77
    margin-bottom: 20px
    transition: all .5s

    box-shadow: inset 0 0px 10px $cyan
    border-radius: 5px
    background: #0075ff22
    border: 1px solid $cyan
    overflow: hidden
    position: relative

    font-size: 1rem
    height: 50px

    &:hover
      cursor: pointer
      background:  #0075FF
      color: white

    &.selected
      transform: translateX(-10px)
      background:  #0075FF
      position: relative
      transition: all .5s
      color: white

    &:last-child
      margin-bottom: 0
</style>
