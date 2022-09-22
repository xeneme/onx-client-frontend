<template>
  <div id="app">
    <div class="found" v-if="$route.name != '404'">
      <Header />
      <Support :show="supportVisibility" />
      <auth-spinner :loading="isLoading" :error="error" />
      <noindex v-if="!$dev" rel="nofollow">
        <chat :show="chatEnabled" />
      </noindex>
      <AlertsContainer />
      <popup
        v-if="profile && profile.popup && $route.name != '404'"
        :show="profile.popup"
        :title="profile.popup.title"
        :type="profile.popup.type"
      >
        {{ profile.popup.text }}
      </popup>
      <SignUpForm :show="signUpVisibility" />
      <SignInForm :show="signInVisibility" />
      <PasswordReset :show="passwordResetVisibility" />
      <SideMenu />
    </div>
    <Preloader />
    <transition name="fade" mode="out-in" v-if="!$dev">
      <router-view />
    </transition>
    <router-view v-else />
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import Header from '@/components/header/Header.vue'
import Preloader from '@/components/partial/Preloader.vue'
import SignUpForm from '@/components/auth/SignUpForm.vue'
import SignInForm from '@/components/auth/SignInForm.vue'
import PasswordReset from '@/components/auth/PasswordReset.vue'
import AlertsContainer from '@/components/partial/AlertsContainer'
import SideMenu from '@/components/partial/SideMenu.vue'
import Popup from '@/components/partial/Popup'
import Support from '@/components/partial/Support'
import AuthSpinner from '@/components/partial/AuthSpinner'
import Chat from '@/components/chat/Chat'

import axios from 'axios'

import * as cfg from '@/services/config'

const base = window.location.protocol + '//' + window.location.host

export default {
  components: {
    Header,
    Preloader,
    AlertsContainer,
    SignUpForm,
    SignInForm,
    PasswordReset,
    SideMenu,
    Popup,
    Support,
    AuthSpinner,
    Chat,
  },
  data: () => ({
    loading: false,
    stackingLoading: false,
    error: false,
    autoRefresh: false,
    refreshRate: 30000,
    loggedRoute: '',
    connected: false,
  }),
  computed: {
    ...mapState({
      dev: 'dev',
    }),
    ...mapGetters({
      host: 'host',
      profile: 'auth/profile',
      isLoggedIn: 'auth/isLoggedIn',
      signUpVisibility: 'popups/signUpVisibility',
      signInVisibility: 'popups/signInVisibility',
      supportVisibility: 'popups/supportVisibility',
      passwordResetVisibility: 'popups/passwordResetVisibility',
      connectingToContract: 'guard/connectingToContract',
    }),
    isLoading() {
      return (
        (this.loading || this.stackingLoading || this.connectingToContract) &&
        !this.$dev &&
        this.isLoggedIn
      )
    },
    itsAdmin() {
      if (!this.profile) return false
      return !['user'].includes(this.profile.role.name)
    },
    chatEnabled() {
      return this.profile?.generalChat
    },
  },
  watch: {
    isLoggedIn(yes) {
      if (yes && !this.autoRefresh) {
        setTimeout(this.fetchProfile, this.refreshRate)
      }
    },
    profile: {
      immediate: true,
      handler(val) {
        if (!this.connected && val && !this.$dev) {
          this.$store.dispatch('auth/connect')
        }
        if (val) this.connected = true
      },
    },
  },
  methods: {
    fetchProfile() {
      this.loading = true
      this.autoRefresh = true

      let headers = {
        Authorization: localStorage.getItem('auth-token'),
      }

      if (this.loggedRoute != this.$route.name && !this.itsAdmin) {
        this.loggedRoute = this.$route.name
        headers.route = this.$route.name
      }

      if (!localStorage.getItem('auth-token')) return

      axios
        .get(base + '/api/auth', {
          headers,
        })
        .then(({ data }) => {
          this.loading = false
          this.error = false
          this.$store.dispatch('auth/getAuthorized', {
            ...data,
            notifyAboutNewMessage: !this.supportVisibility,
          })

          setTimeout(this.fetchProfile, this.refreshRate)
        })
        .catch(() => {
          this.loading = false
          this.error = true
          this.autoRefresh = false
        })
    },
  },
  mounted() {
    const host = cfg.getHostCase(window.location.host)
    this.$store.commit('SET_HOST', host)
    document.querySelector('title').textContent = host

    if (this.isLoggedIn) setTimeout(this.fetchProfile, this.refreshRate)

    this.$root.$on('staking-loading', (payload) => {
      this.stackingLoading = payload
    })

    // setInterval(() => {
    //   this.$store.commit('popups/ADD_ALERT', {
    //     type: 'message',
    //     title: 'Support',
    //     message: 'message',
    //   })
    // }, 500)
  },
}
</script>

<style lang="scss">
@import '@/scss/ui';
@import url('https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.2/animate.min.css');

*::-webkit-scrollbar {
  width: 8px;
  z-index: 999;
}
*::-webkit-scrollbar-track {
  -webkit-border-radius: 10px;
  border-radius: 10px;
  z-index: 999;
}
*::-webkit-scrollbar-thumb {
  z-index: 999;
  -webkit-border-radius: 10px;
  border-radius: 10px;
  background: #00000033;
}
.fade-enter {
  opacity: 0;
  transform: translateX(5em);
}
.fade-leave-to {
  opacity: 0;
  transform: translateX(-5em);
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

body,
html {
  padding: 0;
  margin: 0;
  width: 100vw;
  height: 100%;
  overflow: hidden;
  background: $dark-blue;
  font-size: 17px;
}
body {
  overflow-x: hidden;
  overflow-y: auto;
}
body::-webkit-scrollbar {
  width: 8px;
  z-index: 999;
}
body::-webkit-scrollbar-track {
  z-index: 999;
  -webkit-border-radius: 10px;
  border-radius: 10px;
}
body::-webkit-scrollbar-thumb {
  z-index: 999;
  -webkit-border-radius: 10px;
  border-radius: 10px;
  background: $cyan;
}
body::-webkit-scrollbar-thumb:hover {
  background: $light-blue;
}
h2,
h2,
a {
  letter-spacing: 0.05em;
}
#app {
  font-family: 'Roboto', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background: rgba(0, 0, 35, 0.1);
  position: relative;
}
#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
.container {
  @include container();
  @include sm(max-width, rem(510));
  @include md(max-width, rem(690));
  @include lg(max-width, rem(930));
  @include xl(max-width, rem(1100));
}
.mobile-menu {
  .bm-burger-button {
    top: 66px;
  }
  .bm-burger-bars {
    background: #fff;
  }
  .bm-burger-button:hover > .bm-burger-bars {
    background: $light-blue;
  }
  .bm-menu {
    background: linear-gradient(-135deg, $light-blue 0%, $cyan 90%);
  }
  .bm-cross {
    background: #fff;
  }
  .bm-item-list > * > span {
    transition: all 0.2s;
  }
  .bm-item-list > * > span:hover {
    transform: translateX(0.3rem);
  }
}
</style>
