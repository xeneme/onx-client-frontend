<template>
  <div class="page">
    <slider-points v-if="$isDesktop" />
    <NewPasswordForm
      @closed="passwordResetVisibility = false"
      :show="passwordResetVisibility"
      :token="passwordResetToken"
    />
    <div class="welcome bg">
      <div class="welcome__container">
        <h1 v-if="airdrop" class="welcome__container__title">
          Get AirDrop after Sign Up!
        </h1>
        <h1 v-else class="welcome__container__title">
          {{ $dev ? 'Happy coding!' : 'Welcome to ' + host }}
        </h1>
        <h2
          v-if="airdrop"
          :class="{ getting: gettingAirdrop }"
          class="welcome__container__airdrop-title"
        >
          You'll receive
        </h2>
        <h2 v-else class="welcome__container__subtitle">
          {{ $dev ? '' : 'Start to earn on cryptocurrency' }}
        </h2>
        <h2
          v-if="airdrop"
          :class="{ getting: gettingAirdrop }"
          class="airdrop_amount"
        >
          {{ airdrop.amount + ' ' + airdrop.currency }}
        </h2>
        <lottie-animation
          v-if="airdrop"
          :loop="true"
          :autoPlay="true"
          :width="280"
          :height="280"
          class="airdrop-lottie"
          :class="{ getting: gettingAirdrop }"
          path="https://assets10.lottiefiles.com/packages/lf20_ygr1xkdj.json"
        />
        <div v-if="airdrop" class="welcome__container__group-button">
          <FancyButton
            class="airdrop-button"
            v-bind:is-button="false"
            value="Get started"
            :hidden="gettingAirdrop"
            @click.native="getAirdrop()"
          />
        </div>
        <div v-else class="welcome__container__group-button">
          <Button
            v-if="!$store.getters['auth/isLoggedIn']"
            v-bind:is-button="false"
            value="Sign up"
            :theme="'light'"
            @click.native="showSignUp"
          />
          <Button
            v-if="!$store.getters['auth/isLoggedIn']"
            v-bind:is-button="true"
            value="Sign in"
            @click.native="showSignIn"
          />
          <Button v-if="false" v-bind:is-button="false" value="Get started" />
        </div>
      </div>
      <div class="bg__fullscreen-video-wrap">
        <img
          src="@/assets/img/mobile_background.jpg"
          class="bg__fullscreen-video"
          v-if="!$isDesktop"
        />
        <video
          v-if="$isDesktop"
          src="@/assets/vids/earth-compressed.mp4"
          preload="false"
          autoplay="true"
          loop="true"
          muted="muted"
          class="bg__fullscreen-video"
        ></video>
      </div>
    </div>
    <Currencies />
    <Advantages />
    <Rates />
    <Partners />
    <About />
  </div>
</template>

<script>
import Button from '@/components/partial/Button.vue'
import FancyButton from '@/components/partial/FancyButton.vue'
import Currencies from '@/components/views/main/currencies/Currencies.vue'
import Advantages from '@/components/views/main/advantages/Advantages.vue'
import Rates from '@/components/views/main/rates/Rates.vue'
import Partners from '@/components/views/main/partners/Partners.vue'
import About from '@/components/views/main/about/About.vue'
import SliderPoints from '@/components/partial/SliderPoints'
import NewPasswordForm from '@/components/auth/NewPassword'

import LottieAnimation from 'lottie-vuejs/src/LottieAnimation.vue' // import lottie-vuejs

export default {
  name: 'Main',
  components: {
    Button,
    FancyButton,
    Currencies,
    Advantages,
    Rates,
    Partners,
    About,
    SliderPoints,
    NewPasswordForm,
    LottieAnimation,
  },
  data: () => ({
    on: false,
    gettingAirdrop: false,
    passwordResetVisibility: false,
  }),
  computed: {
    airdrop() {
      return this.$store.getters['auth/airdrop']
    },
    host() {
      return this.$store.getters.host
    },
    passwordResetToken() {
      return this.$store.getters['auth/passwordResetToken']
    },
  },
  methods: {
    getAirdrop() {
      this.gettingAirdrop = true
      let t = this
      setTimeout(function() {
        t.showSignUp()
      }, 5000)
    },
    showSignIn() {
      this.$store.commit('popups/SIGN_IN', true)
    },
    showSignUp() {
      this.$store.commit('popups/SIGN_UP', true)
    },
    updateVideoOpacity() {
      var val = (document.body.scrollTop / window.innerHeight) * 1.4
      val = val < 0 ? 0 : val > 1 ? 1 : val
      this.$el.querySelector('.bg__fullscreen-video-wrap').style.opacity =
        1 - val
    },
  },
  created() {
    this.passwordResetVisibility = !!this.$store.getters[
      'auth/passwordResetToken'
    ]
  },
  mounted() {
    let self = this

    this.$root.$on('popup-closed', () => {
      self.on = true
    })

    setTimeout(() => {
      self.$el.querySelector('.welcome__container').classList.remove('no-video')
    }, 2000)

    document.body.addEventListener('scroll', this.updateVideoOpacity)
  },
}
</script>

<style lang="sass" scoped>
@import "@/scss/_smart-grid"
@import "@/scss/_variables"

.page
  position: relative

.welcome
  position: relative
  overflow: hidden

  &__container
    position: relative
    display: flex
    flex-direction: column
    justify-content: center
    transition: background-color 1.3s
    background-color: transparentize(darken($blue, 10), .8)
    &.no-video
      background-color: transparentize(darken($blue, 12), 0)
    @include to(30rem)
      height: 40rem
    @include from(30rem)
      height: 102vh

    z-index: 1

    &__group-button
      display: flex
      flex-wrap: wrap
      justify-content: center

      button, a
        @include to(110rem)
          margin: 2rem 1rem 0 1rem
        @include from(110rem)
          margin: 3vh 1vh 0 1vh

    .airdrop-lottie
      position: absolute
      top: calc(50% + 40px)
      left: 50%
      filter: blur(100px)
      opacity: 0
      transition: all 1.2s
      transform: translate(-50%, calc(-50% + 100px))

      &.getting
        opacity: 1
        filter: blur(0px)
        transform: translate(-50%, -50%)

    .airdrop_amount
      transition: all 3s
      opacity: 0
      filter: blur(30px)
      color: white
      z-index: 10
      top: calc(50% + 60px)
      left: 50%
      transform: translate(-50%, calc(-50% + 50px))
      position: absolute
      font-family: Montserrat
      font-size: 1.5rem
      pointer-events: none
      transition-delay: 500ms

      &.getting
        opacity: 1
        filter: blur(0px)
        transform: translate(-50%, -50%)


    &__title, &__subtitle
      font-family: Montserrat
      color: #fff
      padding-left: 3rem
      padding-right: 3rem
      z-index: 10

    &__airdrop-title
      pointer-events: none
      font-family: Montserrat
      color: #fff
      padding-left: 3rem
      padding-right: 3rem
      z-index: 10
      margin: 0 auto
      margin-bottom: -50px
      max-width: 350px
      transition: all 3s
      opacity: 0
      filter: blur(30px)
      font-size: 1.1rem

      &.getting
        filter: blur(0px)
        opacity: 1

      @include to(30rem)
        font-size: .8rem

    &__title
      font-weight: bold
      -webkit-text-stroke: 1px $cyan
      font-family: Montserrat
      text-shadow: $cyan 2px 2px
      margin-bottom: 2vh
      font-size: 2.8rem

      @include to(30rem)
        font-size: 2rem

    &__subtitle
      margin: 0 auto
      max-width: 350px
      transition: all 3s
      font-size: 1.1rem

      @include to(30rem)
        font-size: .8rem

  .bg
    position: relative
    overflow: hidden

    &__fullscreen-video-wrap
      transition: opacity .1s
    &__fullscreen-video
      @include xs-block
        left: -600px
      @include sm-block
        left: -400px
      @include md-block
        left: -150px
      @include lg-block
        left: 0
      @include to(30rem)
        left: -400px

      position: absolute
      z-index: 0
      object-fit: cover
      top: 0
      min-width: 100%
      min-height: 100%
      opacity: .6
</style>
