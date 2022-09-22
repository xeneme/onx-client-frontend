<template>
  <div class="page">
    <Background />
    <ChangeNameForm :show="changeNameFormVisibility" />
    <ChangePasswordForm :show="changePasswordFormVisibility" />
    <TwoFA :show="twoFaFormVisibility" />
    <div class="profile">
      <profile-tabs />
      <div class="profile__tab-content">
        <transition name="tab-switch" mode="out-in">
          <router-view></router-view>
        </transition>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import Background from '@/components/views/wallet/Background'
import Footer from '@/components/footer/Footer'
import ChangeNameForm from '@/components/views/profile/components/ChangeNameForm'
import ChangePasswordForm from '@/components/views/profile/components/ChangePasswordForm'
import TwoFA from '@/components/views/profile/components/TwoFA'

import ProfileTabs from '@/components/views/profile/ProfileTabs'

export default {
  name: 'Profile',
  components: {
    Background,
    Footer,
    ChangeNameForm,
    ChangePasswordForm,
    TwoFA,
    ProfileTabs,
  },
  data: () => ({}),
  computed: {
    ...mapGetters({
      changeNameFormVisibility: 'popups/changeNameVisibility',
      changePasswordFormVisibility: 'popups/changePasswordVisibility',
      twoFaFormVisibility: 'popups/twoFaFormVisibility',
      profile: 'auth/profile',
    }),
  },
  methods: {},
  created() {
    if (!this.profile) {
      this.$router.push('/')
      return
    }
  },
  mounted() {
    // if (this.$route.hash === '#change-name') {
    // this.$store.commit('popups/CHANGE_NAME', true)
    // } else if (this.$route.hash === '#change-password') {
    // this.$store.commit('popups/CHANGE_PASSWORD', true)
    // }
  },
}
</script>

<style lang="scss" scoped>
$mobile-break: 83em;

.tab-switch-enter-from,
.tab-switch-enter-active,
.tab-switch-leave-to {
  opacity: 0;
  transform: translateX(2.3rem) translateY(0.2rem) scale(1.03);
}

.tab-switch-enter-to {
  opacity: 1;
  transform: translateX(0rem) translateY(0rem) scale(1);
}

.tab-switch-enter-active,
.tab-switch-leave-active {
  transition: opacity 0.26s ease, transform 0.26s ease;
}

.page {
  position: relative;
  background: $v-grad;
  background-size: contain;
  padding-top: $header-slot;

  .profile {
    z-index: 1;
    display: flex;
    margin: auto;
    margin-bottom: 200px;
    // transform: translateX(-50px);
    gap: 25px;
    min-height: 30rem;

    @include to($mobile-break) {
      padding: 0 20px;
      flex-direction: column;
    }
    @include from($mobile-break) {
      padding: 0;
      width: min-content;
      flex-direction: row;
    }

    &__tab-content {
      max-width: 76rem;
      @include to($mobile-break) {
        width: 100%;
      }
      @include from($mobile-break) {
        width: calc(33em + 23vw);
      }
    }
  }
}
</style>
