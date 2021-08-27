<template>
  <a href="/" class="logo">
    <img src="../../assets/svg/logo/logo--light.svg" alt="exchange" v-if="theme === 'light'" />
    <img src="../../assets/svg/logo/logo.svg" alt="exchange" v-else />
  </a>
</template>

<script>
export default {
  name: 'Logo',
  props: ['theme'],
};
</script>

<style lang="sass">
@import "@/scss/_smart-grid"

.logo
  user-select: none
  z-index: 100
  pointer-events: all
  img
    @include xl(width, 5rem)
    @include from(110rem)
      min-width: 5rem
      max-width: 8vh
    @include to(30rem)
      max-width: 4rem
</style>
