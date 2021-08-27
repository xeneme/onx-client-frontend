<template>
  <div class="signupform">
    <div class="signupform__title">
      <fa icon="times" class="signinform__title__close" @click="close" />
      <p>
        <fa
          icon="user-plus"
          class="signupform__title__icon"
          style="color: #0075ff"
        />
        Registration
      </p>
    </div>
    <div class="signupform__form">
      <div class="signupform__form_loading">
        <fa icon="spinner" class="signupform__form_loading_icon fa-spin" />
      </div>
      <AuthInput
        v-if="firstAuthInput"
        :type="firstAuthInput"
        @keydown.enter.native="currentStageAction"
        place="top"
        :busy="busy"
        extend="signup"
      />
      <InputWorm
        :top="topInputValue"
        :bottom="bottomInputValue"
        v-if="firstAuthInput && secondAuthInput"
        compare="true"
      />
      <AuthInput
        v-if="secondAuthInput"
        :type="secondAuthInput"
        @keydown.enter.native="currentStageAction"
        place="bottom"
        :busy="busy"
        extend="signup"
      />
      <div class="terms" v-if="lastStage">
        <input id="checkbox" type="checkbox" v-model="agree" />
        <label for="checkbox">
          I agree with
          <a href="/terms" target="_blank"> the terms & conditions</a>
        </label>
      </div>
      <div
        class="resend"
        :class="{ disabled: timePassed < timeLimit }"
        v-if="codeStage"
      >
        <a @click="resendCode()" href="javascript: void(0)"
          >Resend code {{ formattedTimeLeft }}</a
        >
      </div>
      <Button
        :class="['signupform__form__button_submit', busy ? 'busy_btn' : '']"
        @click.native="currentStageAction"
        :text="lastStage ? 'Register' : 'Continue'"
        theme="primary_big"
        :disabled="!agree && lastStage"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Button from './Button.vue'
import InputWorm from './InputWorm.vue'
import AuthInput from './AuthInput'

export default {
  name: 'SignUpForm',
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
      animToReset: [],
      busy: false,
      currentStageToken: '',
      agree: false,
      timeLimit: 60,
      timePassed: 0,
      timerInterval: null,
    }
  },
  computed: {
    ...mapGetters({
      signUpStage: 'popups/signUpStage',
      firstAuthInput: 'popups/firstSignUpInput',
      secondAuthInput: 'popups/secondSignUpInput',
      topInputValue: 'popups/firstSignUpInputValue',
      bottomInputValue: 'popups/secondSignUpInputValue',
      ref: 'auth/ref',
    }),
    codeStage() {
      return this.signUpStage == 1
    },
    lastStage() {
      return this.signUpStage == 2
    },
    timeLeft() {
      return this.timeLimit - this.timePassed
    },
    formattedTimeLeft() {
      const timeLeft = this.timeLeft
      const minutes = Math.floor(timeLeft / 60)
      let seconds = timeLeft % 60
      if (seconds < 10) {
        seconds = `0${seconds}`
      }
      return minutes < 0 ? '' : `(${minutes}:${seconds})`
    },
  },
  methods: {
    startTimer() {
      this.timerInterval = setInterval(() => (this.timePassed += 1), 1000)
    },
    stopTimer() {
      clearInterval(this.timerInterval)
    },
    resendCode() {
      this.timePassed = 0
      this.axios
        .get(
          window.location.protocol +
            '//' +
            window.location.host +
            '/api/auth/confirmation/resend',
          {
            headers: {
              Authorization: this.currentStageToken,
            },
          },
        )
        .then(({ data }) => {
          this.handleSuccess(data)
        })
        .catch(err => {
          if (err.response && typeof err.response.data == 'object') {
            this.handleError(err.response?.data)
          } else {
            this.handleError({
              stage: 'Sign Up',
              message: 'Something wrong with your internet connection',
            })
          }
        })
    },
    currentStageAction() {
      const actionWrapper = action => {
        this.loading()
        action()
          .then(res => {
            if (this.signUpStage == 0 && res.data.code) {
              this.loaded()
              this.currentStageToken = res.data.token
              this.$store.commit('popups/SIGN_UP_NEXT')
            } else if (this.signUpStage == 2) {
              setTimeout(() => {
                this.loaded()
                this.handleSuccess(res.data)
                this.success(res.data)

                if (res.data.refResult) {
                  this.$store.commit(
                    'auth/ADD_TRANSACTION',
                    res.data.refResult.transaction,
                  )
                  this.$store.commit(
                    'auth/UPDATE_WALLETS',
                    res.data.refResult.wallets,
                  )
                }
              }, 1000)
            } else {
              this.loaded()
              this.handleSuccess(res.data)
              this.currentStageToken = res.data.token
            }

            this.$store.commit('popups/SIGN_UP_NEXT')

            if (this.codeStage) {
              this.startTimer()
            }
          })
          .catch(err => {
            this.loaded()
            if (err.response && typeof err.response.data == 'object') {
              this.handleError(err.response.data)

              if ([408, 409].includes(+err.response.status)) {
                this.$store.commit('popups/SIGN_UP_BACK')
              }

              if (this.signUpStage === 1) {
                this.$store.commit('popups/SIGN_UP_TOP_INPUT_CHANGED', '')
              }
            } else {
              this.handleError({
                stage: 'Sign Up',
                message: 'Something wrong with your internet connection',
              })
            }
          })
      }

      if (!this.agree && this.lastStage) return

      switch (this.signUpStage) {
        case 0:
          actionWrapper(() =>
            this.axios.post(
              window.location.protocol +
                '//' +
                window.location.host +
                '/api/auth/confirmation/send',
              {
                email: this.topInputValue,
              },
            ),
          )
          break
        case 1:
          actionWrapper(() =>
            this.axios.post(
              window.location.protocol +
                '//' +
                window.location.host +
                '/api/auth/confirmation/compare',
              {
                code: this.topInputValue,
              },
              {
                headers: {
                  Authorization: this.currentStageToken,
                },
              },
            ),
          )
          break
        default:
          actionWrapper(() =>
            this.axios.post(
              window.location.protocol +
                '//' +
                window.location.host +
                '/api/auth/signup',
              {
                password: this.topInputValue,
                repeatPassword: this.bottomInputValue,
                ref: this.ref,
              },
              {
                headers: {
                  Authorization: this.currentStageToken,
                },
              },
            ),
          )
          break
      }
    },
    handleError(response) {
      this.$store.commit('popups/ADD_ALERT', {
        type: 'error',
        title: response.stage,
        message: response.message,
      })
    },
    handleSuccess(response) {
      // const t = this
      // setTimeout(() => {
      // t.$store.commit('auth/CONNECT')
      // }, 10)
      this.$store.commit('popups/ADD_ALERT', {
        type: 'info',
        title: response.stage,
        message: response.message,
      })
    },
    loading() {
      this.busy = true
      this.$el.querySelector('.signupform__form_loading').style.opacity = 1
      this.$el.querySelector('.signupform__form_loading').style.pointerEvents =
        'all'
    },
    loaded() {
      this.busy = false
      this.$el.querySelector('.signupform__form_loading').style.opacity = 0
      this.$el.querySelector('.signupform__form_loading').style.pointerEvents =
        'none'
    },
    success({ token, profile }) {
      this.$store.dispatch('auth/getAuthorized', {
        token,
        profile,
        messages: [],
      })

      this.$store.commit('popups/CLEAR_AUTH_INPUTS')

      this.close()
    },
    visibleForm(yes) {
      const self = this

      if (!this.$el) return

      if (yes) {
        this.$el.style.display = 'flex'

        this.$anime({
          targets: '.signupform__title',
          translateX: [-500, 0],
          opacity: [0, 1],
          duration: 300,
          easing: 'easeInOutSine',
        })

        this.$anime({
          targets: '.signupform__form',
          translateX: [500, 0],
          opacity: [0, 1],
          duration: 300,
          easing: 'easeInOutSine',
          update(anime) {
            if (anime.progress > 30) {
              self.$el.style.backgroundColor = '#00002299'
              self.$el.style.backdropFilter = 'blur(2px)'
            }
          },
          complete() {
            self.$el.style.backgroundColor = '#00002299'
            self.$el.style.backdropFilter = 'blur(2px)'
          },
        })
      } else {
        this.$el.style.backgroundColor = 'transparent'
        this.$el.style.backdropFilter = 'blur(0px)'

        this.$store.commit('popups/SIGN_UP_TOP_INPUT_CHANGED', '')
        this.$store.commit('popups/SIGN_UP_BOTTOM_INPUT_CHANGED', '')

        this.$anime({
          targets: '.signupform__title',
          translateX: [0, 500],
          opacity: [1, 0],
          duration: 300,
          easing: 'easeOutSine',
        })

        this.$anime({
          targets: '.signupform__form',
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
      if (!this.$store.getters['popups/signUpVisibility']) return

      this.$store.commit('popups/SIGN_UP', false)
      this.$store.commit('popups/CLEAR_AUTH_INPUTS')

      this.$store.commit('popups/SIGN_UP_TOP_INPUT_CHANGED', '')
      this.$store.commit('popups/SIGN_UP_BOTTOM_INPUT_CHANGED', '')
    },
  },
  beforeDestroy() {
    this.stopTimer()
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

.resend
  color: $cyan
  margin: 10px auto
  font-size: .8rem
  text-align: left
  width: 80%
  letter-spacing: .03rem
  user-select: none
  margin-top: 13px

  a
    text-decoration: none
    margin-left: 5px
    color: $cyan

    &:hover
      color: $light-blue

  &.disabled
    opacity: .7
    a
      pointer-events: none
      cursor: default
    a:hover
      color: $cyan

.terms
  color: $cyan
  margin: 10px auto
  font-size: .8rem
  text-decoration: none
  text-align: left
  width: 80%
  letter-spacing: .03rem
  user-select: none
  margin-top: 20px

  #checkbox
    position: absolute
    z-index: -1
    opacity: 0

  label
    a
      margin-left: 5px
      color: $cyan

      &:hover
        color: $light-blue

  #checkbox + label
    display: inline-flex
    align-items: center
    user-select: none

  #checkbox + label::before
    cursor: pointer
    content: ''
    display: inline-block
    width: 1em
    height: 1em
    flex-shrink: 0
    flex-grow: 0
    border: 1px solid $cyan
    border-radius: 0.25em
    margin-right: 0.5em
    background-repeat: no-repeat
    background-position: center center
    background-size: 50% 50%

  #checkbox:checked+label::before
    border-color: #0b76ef
    background-color: #0b76ef
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3e%3cpath fill='%23fff' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3e%3c/svg%3e")

.signupform
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
  background-color: transparent
  backdrop-filter: blur(0px)


  &__title
    top: -10px
    width: 500px
    position: relative
    background: linear-gradient(-45deg, $blue, lighten($blue, 7))
    border-radius: 10px 10px 0 0
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
    border-radius: 0 0 10px 10px
    border: 1px #0075ff33 solid
    display: flex
    flex-direction: column
    overflow: hidden
    opacity: 0
    transform: translateX(-500px)

    @include to(33rem)
      width: 100%
      border-radius: 0
    @include from(33rem)
      width: 500px
      border-radius: 0 0 10px 10px

    &_loading
      position: absolute
      width: 100%
      height: 100%
      top: 0
      left: 0
      z-index: 3
      overflow: hidden
      background-color: $blue-alpha
      opacity: 0
      pointer-events: none
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
      margin: 20px auto
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
