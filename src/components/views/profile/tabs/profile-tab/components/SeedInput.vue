<template>
  <div :class="['profileinput', place]">
    <div class="profileinput_icon_wrap">
      <div class="profileinput_icon">
        <fa :icon="icon" />
      </div>
    </div>
    <input
      class="profileinput_input"
      :type="parsedType"
      :placeholder="placeholder"
      v-model="inputValue"
      :disabled="busy"
    />
  </div>
</template>

<script>
export default {
  name: 'ProfileInput',
  props: ['type', 'busy', 'placeholder', 'place'],
  data() {
    return {
      inputValue: '',
      mounted: false,
    }
  },
  watch: {
    inputValue(value) {
      this.$emit('typed', value)
    },
  },
  computed: {
    icon() {
      if (this.mounted) {
        this.$anime({
          targets: this.$el.querySelector('.profileinput_icon *'),
          scale: [0, 1],
          duration: 1200,
        })
      }

      return {
        name: 'user',
        password: 'lock',
        repeatPassword: 'lock',
      }[this.type]
    },
    parsedType() {
      return {
        name: 'text',
        password: 'password',
        repeatPassword: 'password',
      }[this.type]
    },
  },
  mounted() {
    this.mounted = true
  },
}
</script>

<style lang="sass" scoped>
@import "@/scss/_smart-grid"
@import "@/scss/_variables"

input[type=password]:not(:placeholder-shown) + .profileinput_input
    width: 80%
    background: linear-gradient(90deg, $cyan, $cyan-alpha)

.top
    .profileinput_icon_wrap
        border-radius: 10px 0 0 0

    .profileinput_input
        border-radius: 0 10px 0 0

.bottom
    .profileinput_icon_wrap
        border-radius: 0 0 0 10px

    .profileinput_input
        border-radius: 0 0 10px 0

.profileinput
    z-index: 2
    display: grid
    grid-template-columns: 48px 1fr
    grid-template-rows: 48px
    margin: 0 auto
    justify-content: end
    overflow: hidden
    margin-bottom: 40px

    @include xs-block
      width: 80%
    @include sm-block
      width: 405px

    &_icon_wrap
        width: calc(100% - 2px)
        height: calc(100% - 2px)
        border: 1px #0075ff22 solid
        display: grid
        background-color: #0075ff22

    &_icon
        display: grid
        width: 40%
        height: 40%
        place-self: center
        color: #0075ff88

        *
            place-self: center

    &_input
        color: #0094ff
        text-indent: 21px
        line-height: 45px
        width: 99.7%
        font-size: 1.1rem
        letter-spacing: 0.04rem
        background: darken($blue, 3)
        transition: background-color 0.3s
        border: none
        box-shadow: 10px 0 20px #00002344 inset

        &:focus
            background: darken($blue, 7)
            outline: none

        &::selection
            background: $cyan-alpha
            color: white

        &::placeholder
            transition: all .3s
            text-align: left
            color: #0094ff55
</style>
