<template>
  <a :class="['button', theme || 'primary']">{{ text }}</a>
</template>

<script>
export default {
  name: 'Button',
  props: ['theme', 'text'],
};
</script>

<style lang="sass" scoped>
@import "@/scss/_variables"

.button
    padding: 15px 45px
    background-color: $cyan
    border-radius: 5px
    color: white
    cursor: pointer
    transition: background-color .3s

    &:hover
        background-color: $light-blue
        transition: none

    &:hover.apple
        background-color: #67da4a
        transition: none

    &.secondary_big:hover, &.secondary:hover
        background-color: $blue-alpha
        transition: none

.primary_big
  font-size: 16px
  padding: 15px 20px

.secondary_big
  font-size: 14px
  padding: 15px 20px
  background-color: $blue

.secondary
  font-size: 14px
  padding: 11px 20px 9px 20px
  background-color: $blue

.primary
  font-size: 14px
  padding: 5px 45px

.primary_small
  font-size: 12px
  padding: 1px 20px

.apple
  font-size: 16px
  padding: 10px 30px
  border: 1px solid #40DD18
  background-color: #36B616
</style>
