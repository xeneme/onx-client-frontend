<template>
  <div class="tooltip">
    <span :class="['tooltiptext', theme]">{{ text }}</span>
  </div>
</template>

<script>
export default {
  name: 'Tooltip',
  props: {
    text: String,
    index: String,
    theme: {
      type: String,
      default: 'dark'
    }
  },
  methods: {
    show() {
      this.$anime({
        targets: this.$el.querySelector('.tooltiptext'),
        opacity: 1,
        duration: 50,
        easing: 'easeOutExpo',
      })
    },
    hide() {
      this.$anime({
        targets: this.$el.querySelector('.tooltiptext'),
        opacity: 0,
        duration: 50,
        easing: 'easeOutExpo',
      })
    },
    once() {
      const self = this

      this.$anime({
        targets: this.$el.querySelector('.tooltiptext'),
        opacity: 1,
        duration: 50,
        easing: 'easeOutExpo',
        endDelay: 1200,
        complete() {
          self.$anime({
            targets: self.$el.querySelector('.tooltiptext'),
            opacity: 0,
            duration: 50,
            easing: 'easeOutExpo',
          })
        },
      })
    },
  },
  mounted() {
    ['once', 'show', 'hide'].forEach(action => {
      this.$root.$on('tooltip:' + action, index => {
        if (index == this.index) {
          this[action]()
        }
      })
    })
  },
}
</script>

<style lang="sass" scoped>
@import "@/scss/_variables"

.tooltip
  position: relative
  display: inline-block

  .tooltiptext
    color: #fff
    &.dark
      background-color: $blue
    &.light
      background-color: $cyan-alpha
      -webkit-backdrop-filter: blur(50px)
    &.white
      background-color: white
      color: $blue
    width: 140px
    text-align: center
    border-radius: 6px
    padding: 5px
    position: absolute
    z-index: 1
    bottom: 120%
    left: 50%
    margin-left: -55px
    opacity: 0
    transition: opacity 0.3s
    cursor: default
    pointer-events: none

    &::after
      content: ""
      position: absolute
      top: 100%
      left: 50%
      margin-left: -5px
      border-width: 5px
      border-style: solid
    &.dark::after
      border-color: $blue transparent transparent transparent
    &.light::after
      border-color: $cyan-alpha transparent transparent transparent
      -webkit-backdrop-filter: blur(50px)
    &.white::after
      border-color: white transparent transparent transparent
</style>
