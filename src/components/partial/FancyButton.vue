<template>
  <a :href="link" :class="['default', theme, hidden ? 'hidden' : '']">{{ value }}</a>
</template>

<script>
export default {
  name: 'Button',
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    link: {
      type: String,
      default: 'javascript: void(0)',
    },
    value: {
      type: String,
      default: 'send',
    },
    hidden: {
      type: Boolean,
      default: false
    }
  },
}
</script>

<style lang="sass" scoped>
@import "@/scss/_smart-grid"

a
  color: #fff
  text-decoration: none
  display: flex
  justify-content: center
  align-items: center
  cursor: pointer
  font-weight: bold
  outline: none
  letter-spacing: 0.05em
  min-width: 8.5rem
  font-size: .9rem
  min-height: 2.7rem
  position: relative
  border: none
  z-index: 1
  transition: all 1.4s
  border-radius: 5px
  background: #2297FF88

  &.hidden
    opacity: 0
    pointer-events: none
    filter: blur(100px)

  &::after
    border-radius: 5px
    position: absolute
    content: ""
    top: 0
    left: 0
    width: 100%
    height: 100%
    z-index: -1
    transition: all .7s
    transform: scaleX(1.2) scaleY(1.5)
    opacity: 0
    background: #2297FF
    pointer-events: none

  &::after.light
    background: #2297FF
  &::after.disabled
    opacity: .5

  &:hover::after
    background: #2297FF
    transform: scaleX(1.1) scaleY(1.2)
    opacity: 1
    transition: all .35s

  &:hover
    transition: all .8s
    background: transparent

  &:active::after
    transition: all .07s
    transform: scale(1)

</style>
