<template>
  <div class="page">
    <slider-points v-if="$isDesktop" />
    <NewPasswordForm
      @closed="passwordResetVisibility = false"
      :show="passwordResetVisibility"
      :token="passwordResetToken"
    />
    <ReferWelcome v-if="isReferralRaceDomain" />
    <Welcome v-else />
    <Currencies />
    <Advantages />
    <Rates />
    <Partners />
    <About />
  </div>
</template>

<script>
import Welcome from '@/components/views/main/welcome/Welcome.vue'
import ReferWelcome from '@/components/views/main/welcome/ReferWelcome.vue'
import Currencies from '@/components/views/main/currencies/Currencies.vue'
import Advantages from '@/components/views/main/advantages/Advantages.vue'
import Rates from '@/components/views/main/rates/Rates.vue'
import Partners from '@/components/views/main/partners/Partners.vue'
import About from '@/components/views/main/about/About.vue'
import SliderPoints from '@/components/partial/SliderPoints'
import NewPasswordForm from '@/components/auth/NewPassword'

export default {
  name: 'Main',
  components: {
    Welcome,
    ReferWelcome,
    Currencies,
    Advantages,
    Rates,
    Partners,
    About,
    SliderPoints,
    NewPasswordForm,
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
    isReferralRaceDomain() {
      return this.$store.state.auth.domainOptions?.referralRace
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
.page
  position: relative
</style>
