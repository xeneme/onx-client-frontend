<template>
  <div class="password-reset">
    <div class="password-reset__title">
      <fa icon="times" class="password-reset__title__close" @click="close" />
      <p>
        <fa
          icon="envelope"
          class="password-reset__title__icon"
          style="color: #0075ff"
        />
        Request of a password reset
      </p>
    </div>
    <div class="password-reset__form">
      <div class="password-reset__form_loading">
        <fa icon="spinner" class="password-reset__form_loading_icon fa-spin" />
      </div>
      <AuthInput
        type="email"
        @keydown.enter.native="reset"
        place="top"
        v-model="value"
        :busy="busy"
      />
      <Button
        :class="['password-reset__form__button_submit', busy ? 'busy_btn' : '']"
        @click.native="reset"
        text="Submit"
        theme="primary_big"
      />
    </div>
  </div>
</template>

<script>
import Button from './Button.vue'
import AuthInput from './AuthInput'

export default {
  name: 'PasswordReset',
  components: {
    Button,
    AuthInput,
  },
  props: ['show'],
  watch: {
    show(val) {
      this.visibleForm(val)
    },
  },

  data() {
    return {
      value: '',
      busy: false,
    }
  },
  methods: {
    reset() {
      const base = window.location.protocol + '//' + window.location.host

      this.loading()
      this.axios
        .post(base + '/api/auth/reset', {
          email: this.value,
        })
        .then(res => {
          setTimeout(() => {
            this.loaded()
            this.handleSuccess(res.data)
          }, 1000)
        })
        .catch(err => {
          this.loaded()

          if (err.response) {
            this.handleError(err.response.data)
          }
        })
    },
    handleError(response) {
      this.$store.commit('popups/ADD_ALERT', {
        type: 'error',
        title: response.stage,
        message: response.message,
      })
    },
    success() {
      this.$store.commit('auth/PASSWORD_RESET', false)
      this.$store.commit('popups/CLEAR_AUTH_INPUTS')
      this.close()
    },
    handleSuccess(response) {
      this.$store.commit('popups/ADD_ALERT', {
        type: 'info',
        title: response.stage,
        message: response.message,
      })
    },
    loading() {
      this.busy = true
      this.$el.querySelector('.password-reset__form_loading').style.opacity = 1
      this.$el.querySelector(
        '.password-reset__form_loading',
      ).style.pointerEvents = 'all'
    },
    loaded() {
      this.busy = false
      this.$el.querySelector('.password-reset__form_loading').style.opacity = 0
      this.$el.querySelector(
        '.password-reset__form_loading',
      ).style.pointerEvents = 'none'
    },
    fadeInBackground() {
      this.$el.style.backgroundColor = '#00002299'
      this.$el.style.backdropFilter = 'blur(2px)'
    },
    fadeOutBackground() {
      this.$el.style.backgroundColor = 'transparent'
      this.$el.style.backdropFilter = 'blur(0px)'
    },
    visibleForm(yes) {
      const self = this
      this.$el.style.top = 0

      if (yes) {
        this.$el.style.display = 'flex'

        this.$anime({
          targets: '.password-reset__title',
          translateX: [-500, 0],
          opacity: [0, 1],
          duration: 300,
          easing: 'easeInOutSine',
        })

        this.$anime({
          targets: '.password-reset__form',
          translateX: [500, 0],
          opacity: [0, 1],
          duration: 300,
          easing: 'easeInOutSine',
          update(anime) {
            if (anime.progress > 30) {
              self.fadeInBackground()
            }
          },
          complete() {
            self.fadeInBackground()
          },
        })
      } else {
        this.fadeOutBackground()

        this.$store.commit('popups/SIGN_UP_TOP_INPUT_CHANGED', '')
        this.$store.commit('popups/SIGN_UP_BOTTOM_INPUT_CHANGED', '')

        this.$anime({
          targets: '.password-reset__title',
          translateX: [0, 500],
          opacity: [1, 0],
          duration: 300,
          easing: 'easeOutSine',
        })

        this.$anime({
          targets: '.password-reset__form',
          translateX: [0, -500],
          opacity: [1, 0],
          duration: 300,
          easing: 'easeOutSine',
          complete() {
            self.$el.style.display = 'none'
          },
        })
      }
    },
    close() {
      if (!this.$store.getters['popups/signInVisibility']) return

      this.$store.commit('popups/SIGN_IN', false)
      this.$store.commit('popups/CLEAR_AUTH_INPUTS')

      this.$store.commit('popups/SIGN_UP_TOP_INPUT_CHANGED', '')
      this.$store.commit('popups/SIGN_UP_BOTTOM_INPUT_CHANGED', '')
    },
  },
  mounted() {
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        this.close()
      }
    })
  },
}
</script>

<style lang="sass" scroped>
@import "@/scss/_smart-grid"
@import "@/scss/_variables"

*
  margin: 0
  padding: 0

.password-reset
  position: fixed
  z-index: 888
  left: 0
  top: 0
  width: 100vw
  height: 100vh
  min-height: 26rem
  overflow: hidden
  transition: backdrop-filter .3s
  transition: background-color .3s
  display: none
  flex-direction: column
  justify-content: center
  align-items: center
  background-color: transparent;
  backdrop-filter: blur(0px);

  &__title
    top: -10px
    width: 500px
    position: relative
    background: linear-gradient(-45deg, $blue, lighten($blue, 7))
    border: 1px $cyan solid
    color: white
    font-family: 'Montserrat'
    font-weight: 500
    padding: 10px 0
    opacity: 0
    transform: translateX(500px)
    display: grid

    @include to(33rem)
      width: 100%
      border-radius: 0
    @include from(33rem)
      width: 500px
      border-radius: 10px 10px 0 0

    &__icon
      margin-right: 3px

    &__close
      position: absolute
      height: 100%
      margin-right: 20px
      justify-self: end
      color: #0075ff
      cursor: pointer
      font-size: 1.3rem

      &:hover
        color: white

  &__form
    position: relative
    width: 500px
    padding-top: 40px
    background: $blue
    border: 1px #0075ff33 solid
    display: flex
    flex-direction: column
    overflow: hidden
    opacity: 0
    transform: translateX(-500px)
    min-height: 140px

    @include to(33rem)
      width: 100%
      border-radius: 0
    @include from(33rem)
      width: 500px
      border-radius: 0 0 10px 10px

    .link
      color: $cyan
      margin: 10px auto
      font-size: .8rem
      text-decoration: none
      text-align: left
      width: 80%
      cursor: pointer
      letter-spacing: .03rem
      &:hover
        color: $light-blue

    &_loading
      position: absolute
      width: 100%
      height: 100%
      top: 0
      left: 0
      z-index: 3
      overflow: hidden
      background-color: $blue-alpha
      pointer-events: none
      transition: opacity .3s
      opacity: 0
      display: grid

      &_icon
        place-self: center
        width: 100px
        font-size: 4rem
        margin-bottom: 30px
        height: 80px
        color: $cyan

    &__button_submit
      opacity: 1
      margin: 25px auto
      width: 100px

    &__button_wallet, &__button_settings
      z-index: 100
      opacity: 0
      width: 100%
      pointer-events: none

    &__status
      position: absolute
      height: 80px
      left: calc(50% - 10rem)
      top: calc(50% - 75px)
      font-size: 2rem
      font-weight: 500
      font-family: 'Montserrat'
      color: white
      opacity: 0
      pointer-events: none

      &_icon
        transform: scale(0)

.busy_btn
  pointer-events: none
  opacity: .2
</style>
