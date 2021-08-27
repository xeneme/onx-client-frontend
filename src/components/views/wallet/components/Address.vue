<template>
  <div :class="['field', 'secret_field']">
    <Tooltip text="Address copied!" :index="index.toString()" />
    <div class="copy" @click="copyToClipboard">
      <fa icon="copy" />
    </div>
    <div
      class="text_input-container"
      v-on="{ mouseenter: showExpireTime, mouseleave: hideExpireTime }"
    >
      <Tooltip
        v-if="deposit.status != 'completed'"
        theme="light"
        :text="computedExpiration"
        :index="index + 'info'"
      />
      <input class="text_input" :value="hiddenValue" disabled />
    </div>
  </div>
</template>

<script>
import Tooltip from '../../../partial/Tooltip'

export default {
  name: 'Address',
  components: { Tooltip },
  props: ['index', 'deposit', 'value'],
  data() {
    return {
      expiresIn: '',
    }
  },
  computed: {
    hiddenValue() {
      const match = this.value.match(new RegExp(`.{${20}}`))[0]
      return match ? match + '...' : this.value
    },
    computedExpiration() {
      let { min, sec } = this.expiresIn
      return !this.expiresIn
        ? 'Loading...'
        : !this.expiresIn.expired
        ? `Expires in ${min}m ${sec}s`
        : 'Expired'
    },
  },
  watch: {
    value: 'calculateExpiration',
  },
  methods: {
    copyToClipboard() {
      this.$root.$emit('tooltip:once', this.index.toString())
      this.$copy(this.value)
    },
    showExpireTime() {
      this.$root.$emit('tooltip:show', this.index + 'info')
    },
    hideExpireTime() {
      this.$root.$emit('tooltip:hide', this.index + 'info')
    },
    calculateExpiration() {
      // let tz =  new Date().getTimezoneOffset() * 60000
      let delta = this.deposit.exp - +new Date()

      var min = Math.floor(delta / 60000)
      var sec = ((delta % 60000) / 1000).toFixed(0)
      sec = (sec < 10 ? '0' : '') + sec

      this.expiresIn = {
        min: parseInt(min),
        sec: parseInt(sec),
        expired: !(parseInt(min) >= 0 && parseInt(sec) >= 0),
      }

      if (this.expiresIn.expired && this.deposit.status === 'processing') {
        this.deposit.status = 'failed'
      }

      setTimeout(this.calculateExpiration, 2000)
    },
  },
  mounted() {
    this.calculateExpiration()
  },
}
</script>

<style lang="sass" scoped>
@import "@/scss/_variables"
@import "@/scss/_smart-grid"


.field, .secret_field
  display: flex
  width: 100%
  margin-bottom: 6px

  .text_input-container
    width: 100%

  .text_input
    background: $blue-alpha
    cursor: text
    transition: background-color .3s

    &:hover
      background: $blue

  .text_input
    color: #0094FF
    text-indent: 21px
    line-height: 38px
    border: none
    border-radius: 3px
    margin-right: 0
    width: 100%

.secret_field
  &:hover
    & > .text_input
      background: $blue

    & > .copy
      width: 38px

  .copy
    height: 38px
    display: grid
    color: $light-blue
    overflow: hidden
    cursor: pointer
    transition: width .15s
    transition-delay: .2s

    @include xs(width, 38px)
    @include sm(width, 0px)

    &:hover
      color: white
    &:active
      svg
        font-size: 12px
    svg
      place-self: center

  .text_input
    cursor: default
    user-select: none
</style>
