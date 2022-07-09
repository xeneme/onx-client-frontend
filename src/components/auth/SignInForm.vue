<template>
  <div class="signinform">
    <div class="signinform__title">
      <fa icon="times" class="signinform__title__close" @click="close" />
      <p>
        <fa
          :icon="icon"
          class="signinform__title__icon"
          style="color: #0075ff"
        />
        {{ title }}
      </p>
    </div>
    <div
      class="signinform__form"
      :style="{ 'min-height': secondAuthInput ? '240px' : '140px' }"
    >
      <div class="signinform__form_loading">
        <fa icon="spinner" class="signinform__form_loading_icon fa-spin" />
      </div>
      <AuthInput
        v-if="firstAuthInput"
        :type="firstAuthInput"
        @keydown.enter.native="handleSubmit"
        place="top"
        :busy="busy"
        extend="signin"
      />
      <InputWorm
        :top="topInputValue"
        :bottom="bottomInputValue"
        v-if="firstAuthInput && secondAuthInput"
      />
      <AuthInput
        v-if="secondAuthInput"
        :type="secondAuthInput"
        @keydown.enter.native="handleSubmit"
        place="bottom"
        :busy="busy"
        extend="signin"
      />
      <div @click="resetPassword" v-if="!twoFa" class="link">
        Forgot your password?
      </div>
      <Button
        :class="['signinform__form__button_submit', busy ? 'busy_btn' : '']"
        @click.native="handleSubmit"
        :text="twoFa ? 'Submit' : 'Sign In'"
        theme="primary_big"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Button from './Button.vue'
import InputWorm from './InputWorm.vue'
import AuthInput from './AuthInput'
import Axios from '@/services/apiRequest'

export default {
  name: 'SignInForm',
  components: {
    Button,
    InputWorm,
    AuthInput,
  },
  props: ['show'],
  watch: {
    show: {
      handler: 'visibleForm',
      immediate: true,
    },
  },
  data() {
    return {
      title: 'Authorization',
      icon: 'user',
      animToReset: [],
      busy: false,
      twoFa: false,
      localstore: {
        email: '',
        password: '',
      },
    }
  },
  computed: {
    ...mapGetters({
      firstAuthInput: 'popups/firstSignInInput',
      secondAuthInput: 'popups/secondSignInInput',
      topInputValue: 'popups/firstSignInInputValue',
      bottomInputValue: 'popups/secondSignInInputValue',
    }),
  },
  methods: {
    handleSubmit() {
      if (this.twoFa) {
        this.twoFaLogin()
      } else {
        this.login()
      }
    },
    login() {
      this.loading()

      Axios
        .post('/auth/signin', {
          email: this.topInputValue,
          password: this.bottomInputValue,
        })
        .then(res => {
          if (res.data.twoFa) {
            this.loaded()
            this.title = 'Two-Factor Authorization'
            this.icon = 'lock'
            this.secondAuthInput = ''
            this.twoFa = true
            this.localstore.email = this.topInputValue
            this.localstore.password = this.bottomInputValue
            this.$store.commit('popups/CLEAR_AUTH_INPUTS')
            this.$store.commit('popups/CHANGE_SIGN_IN_INPUTS', {
              first: 'code',
              second: '',
            })
          } else {
            setTimeout(() => {
              this.loaded()
              this.success(res.data)
              this.handleSuccess(res.data)
            }, 1000)
          }
        })
        .catch(err => {
          this.loaded()

          if (err.response && typeof err.response.data == 'object') {
            this.handleError(err.response.data)
          } else {
            this.handleError({
              stage: 'Sign Up',
              message: 'Something wrong with your internet connection',
            })
          }
        })
    },
    twoFaLogin() {
      this.loading()
      Axios
        .post('/auth/signin', {
          email: this.localstore.email,
          password: this.localstore.password,
          twofa: this.topInputValue,
        })
        .then(res => {
          setTimeout(() => {
            this.loaded()
            this.success(res.data)
            this.handleSuccess(res.data)

            this.title = 'Authorization'
            this.icon = 'user'
            this.twoFa = false
            this.localstore = {
              email: '',
              password: '',
            }
          }, 1000)
        })
        .catch(err => {
          this.loaded()

          if (err.response && typeof err.response.data == 'object') {
            this.handleError(err.response.data)
          } else {
            this.handleError({
              stage: 'Sign Up',
              message: 'Something wrong with your internet connection',
            })
          }
        })
    },
    resetPassword() {
      this.$store.commit('popups/PASSWORD_RESET', true)
    },
    handleError(response) {
      this.$store.commit('popups/ADD_ALERT', {
        type: 'error',
        title: response.stage || 'Validation',
        message: response.message,
      })
    },
    success({ token, profile, messages }) {
      // const t = this
      this.$store.dispatch('auth/getAuthorized', {
        token,
        profile,
        messages,
        notifyAboutNewMessage: true,
      })

      // setTimeout(() => {
      // t.$store.commit('auth/CONNECT')
      // }, 10)

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
      this.$el.querySelector('.signinform__form_loading').style.opacity = 1
      this.$el.querySelector('.signinform__form_loading').style.pointerEvents =
        'all'
    },
    loaded() {
      this.busy = false
      this.$el.querySelector('.signinform__form_loading').style.opacity = 0
      this.$el.querySelector('.signinform__form_loading').style.pointerEvents =
        'none'
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
      if (!this.$el) return

      const self = this
      this.$el.style.top = 0

      if (yes) {
        this.$el.style.display = 'flex'

        this.$anime({
          targets: '.signinform__title',
          translateX: [-500, 0],
          opacity: [0, 1],
          duration: 300,
          easing: 'easeInOutSine',
        })

        this.$anime({
          targets: '.signinform__form',
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
        this.twoFa = false
        this.localstore = {
          email: '',
          password: '',
        }

        this.fadeOutBackground()

        this.$store.commit('popups/SIGN_UP_TOP_INPUT_CHANGED', '')
        this.$store.commit('popups/SIGN_UP_BOTTOM_INPUT_CHANGED', '')

        this.$anime({
          targets: '.signinform__title',
          translateX: [0, 500],
          opacity: [1, 0],
          duration: 300,
          easing: 'easeOutSine',
        })

        this.$anime({
          targets: '.signinform__form',
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
      this.twoFa = false
      this.title = 'Authorization'
      this.icon = 'user'

      if (!this.$store.getters['popups/signInVisibility']) return

      this.$store.commit('popups/CHANGE_SIGN_IN_INPUTS', {
        first: 'email',
        second: 'password',
      })

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

.signinform
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
    height: 22px
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
      height: 60%
      transform: translateY(30%)
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
    min-height: 240px

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
      user-select: none
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
      margin: 15px auto
      margin-bottom: 30px
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
