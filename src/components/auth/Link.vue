<template>
  <router-link v-bind="$attrs" :class="['button', theme || 'primary']">{{ text }}</router-link>
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
    text-decoration: none

    &:hover
        background-color: $light-blue

    &.secondary_big:hover
        background-color: $cyan

.primary_big
  font-size: 16px
  padding: 15px 20px

.secondary_big
  font-size: 16px
  padding: 15px 20px
  background-color: $cyan-alpha

.primary
  font-size: 14px
  padding: 5px 45px

.primary_small
  font-size: 12px
  padding: 1px 20px

.apple
  font-size: 14px
  padding: 15px 30px
  border: 1px solid #40DD18
  background-color: #36B616
</style>
