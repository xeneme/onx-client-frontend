<template>
  <button
    v-if="isButton"
    :type="typeButton"
    :class="['default', theme, disabled || loading ? 'disabled' : '']"
    :disabled="disabled || loading"
  >
    <fa icon="circle-notch" class="fa-spin" v-if="loading" />
    <span>{{ value }}</span>
  </button>
  <a :href="link" v-else :class="['default', theme]"
    ><fa icon="circle-notch" class="fa-spin" v-if="loading" /><span>{{
      value
    }}</span></a
  >
</template>

<script>
export default {
  name: 'Button',
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    isButton: {
      type: Boolean,
      default: true,
    },
    typeButton: {
      type: String,
      default: 'button',
    },
    link: {
      type: String,
      default: 'javascript: void(0)',
    },
    value: {
      type: String,
      default: 'send',
    },
    theme: String,
    loading: Boolean,
  },
}
</script>

<style lang="sass" scoped>
@import "@/scss/_smart-grid"

button, a
  border: none
  background: #0075FF
  color: #fff
  border-radius: 5px
  text-decoration: none
  display: flex
  justify-content: center
  align-items: center
  font-weight: bold
  outline: none
  letter-spacing: 0.05em
  min-width: 8.5rem
  font-size: .9rem
  min-height: 2.7rem
  gap: .2rem

  &.light
    background: #2297FF
  &.disabled
    opacity: .5

  &:hover:not(.disabled)
    cursor: pointer
    background: linear-gradient(108.97deg, #0075FF 0%, #2297FF 100%)

  &:active:not(.disabled)
    box-shadow: 0 0 14px #2297FF
    background: #2297FF
</style>
