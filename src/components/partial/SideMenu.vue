<template>
  <div class="menu">
    <div class="menu__panel">
      <div :class="['menu__panel__profile', isLoggedIn ? 'loggedIn' : '']">
        <div v-if="isLoggedIn" class="menu__panel__profile_email_icon">
          <fa icon="mail-bulk"></fa>
        </div>
        <div v-if="isLoggedIn" class="menu__panel__profile_email">
          <p>{{ profile ? profile.email : '' }}</p>
        </div>
        <div v-if="isLoggedIn" class="menu__panel__profile_balance">
          <p>{{ balance || 0 }}$</p>
        </div>
        <div class="menu__panel__profile_close" @click="closeMenu">
          <fa icon="times"></fa>
        </div>
      </div>
      <nav class="menu__panel__links">
        <a v-if="isLoggedIn && itsAdmin" :href="links.admin"
          ><li>
            <fa icon="user-secret"></fa>
            <p>Admin Panel</p>
          </li></a
        >
        <a v-if="!isLoggedIn" @click="login"
          ><li>
            <fa icon="user"></fa>
            <p>Log In</p>
          </li></a
        >
        <a v-if="!isLoggedIn" @click="signup"
          ><li>
            <fa icon="user-plus"></fa>
            <p>Sign Up</p>
          </li></a
        >
        <a v-if="isLoggedIn" class="menu__panel__links_profile"
          ><router-link :to="links.profile">
            <li @click="closeMenu">
              <fa icon="user"></fa>
              <p>Profile</p>
            </li>
          </router-link>
          <a @click="logout"
            ><li class="menu__panel__links_profile-logout">
              <fa icon="sign-out-alt"></fa>
            </li> </a
        ></a>
        <div class="divider"></div>
        <a v-if="isLoggedIn" @click="selectTab(0)" :href="links.wallet"
          ><li>
            <fa icon="credit-card"></fa>
            <p>Wallet</p>
          </li></a
        >
        <a v-if="isLoggedIn" @click="selectTab(1)" :href="links.deposit"
          ><li>
            <fa icon="chart-line"></fa>
            <p>Deposit</p>
          </li></a
        >
        <a v-if="isLoggedIn" @click="selectTab(2)" :href="links.withdraw"
          ><li>
            <fa icon="money-bill"></fa>
            <p>Withdraw</p>
          </li></a
        >
        <a v-if="isLoggedIn" @click="selectTab(3)" :href="links.transfer"
          ><li>
            <fa icon="exchange-alt"></fa>
            <p>Transfer</p>
          </li></a
        >
        <a v-if="isLoggedIn" @click="selectTab(4)" :href="links.history"
          ><li>
            <fa icon="history"></fa>
            <p>History</p>
          </li></a
        >
        <div v-if="isLoggedIn" class="divider"></div>
        <a :href="links.trading"
          ><li>
            <fa icon="chart-bar"></fa>
            <p>Trading</p>
          </li></a
        >
        <div class="divider"></div>
        <a v-if="isLoggedIn" @click="toggleSupport"
          ><li>
            <fa icon="envelope"></fa>
            <p>Support</p>
          </li></a
        >
        <a :href="links.contract"
          ><li>
            <fa icon="certificate"></fa>
            <p>Contract</p>
          </li></a
        >
        <a :href="links.about"
          ><li>
            <fa icon="users"></fa>
            <p>About us</p>
          </li></a
        >
      </nav>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'SideMenu',
  data() {
    return {
      balance: 0,
      links: {
        profile: '/account',
        wallet: '/wallet#',
        deposit: '/wallet#deposit',
        transfer: '/wallet#transfer',
        withdraw: '/wallet#withdraw',
        history: '/wallet#history',
        contract: '/contract',
        about: '/about',
        trading: '/trading',
        admin: '/admin/dashboard',
      },
    }
  },
  computed: {
    ...mapGetters({
      visibility: 'popups/sideMenuVisibility',
      profile: 'auth/profile',
      isLoggedIn: 'auth/isLoggedIn',
    }),
    itsAdmin() {
      if (!this.profile) return false
      return !['user'].includes(this.profile.role.name)
    },
    adminToken() {
      return localStorage.getItem('admin-token')
    },
  },
  watch: {
    profile: 'updateBalance',
    visibility(yes) {
      const self = this

      if (yes) {
        self.$el.style.display = 'block'

        this.$anime({
          targets: this.$el,
          duration: 400,
          easing: 'easeOutExpo',
          opacity: [0, 1],
        })

        this.$anime({
          targets: this.$el.querySelector('.menu__panel'),
          duration: 400,
          easing: 'easeOutExpo',
          translateX: [600, 0],
        })
      } else {
        this.$anime({
          targets: this.$el,
          duration: 400,
          easing: 'easeOutExpo',
          opacity: [1, 0],
          complete() {
            self.$el.style.display = 'none'
          },
        })

        this.$anime({
          targets: this.$el.querySelector('.menu__panel'),
          duration: 400,
          easing: 'easeInExpo',
          translateX: [0, 600],
        })
      }
    },
  },
  methods: {
    selectTab(index) {
      this.$store.commit('popups/SELECT_EXCHANGE_TAB', index)
      this.closeMenu()
    },
    login() {
      this.closeMenu()
      this.$store.commit('popups/SIGN_IN', true)
    },
    signup() {
      this.closeMenu()
      this.$store.commit('popups/SIGN_UP', true)
    },
    closeMenu() {
      this.$store.commit('popups/SIDE_MENU', false)
    },
    logout() {
      this.$store.dispatch('auth/logout', {
        redirect: ['Profile', 'Wallet'].includes(this.$route.name),
        ghostToken: this.adminToken,
      })

      this.closeMenu()
    },
    closeOutside(e) {
      if (
        !this.$el.contains(e.target) &&
        !e.target.classList.contains('burger') &&
        this.visibility
      )
        this.closeMenu()
    },
    updateBalance(profile) {
      if (!profile) return

      this.balance = Number(
        Object.values(profile.wallets)
          .reduce((b, w) => b + w.balance * w.price, 0)
          .toFixed(2),
      )
    },
    toggleSupport() {
      this.$store.commit('popups/SUPPORT')
      this.closeMenu()
    },
  },
  mounted() {
    var self = this
    document.addEventListener('click', e => {
      self.closeOutside(e)
    })

    this.updateBalance()
  },
}
</script>

<style lang="sass" scoped>
@import "@/scss/_smart-grid"
@import "@/scss/_variables"

a:focus
    outline: none

.menu
    position: fixed
    right: 0
    top: 0
    height: 100vh
    z-index: 10
    pointer-events: none
    opacity: 0
    display: none
    overflow: hidden

    @include to(25rem)
        backdrop-filter: blur(5px)
        width: calc(100% - 20px)
        padding: 10px 10px
        background-color: darken($blue-alpha, 10)
    @include from(25rem)
        width: 350px
        padding: 20px
        background-color: transparent

    &__panel
        transform: translateX(500px)
        border-radius: 10px
        margin: 0 auto
        background-color: $blue
        width: calc(100% - 40px)
        height: calc(100% - 40px)
        overflow: hidden
        pointer-events: all

        @include to(25rem)
            width: calc(100%)
            height: calc(100% - 20px)

        @include from(25rem)
            width: calc(100% - 40px)
            height: calc(100% - 40px)

        &__profile
            width: 100%
            background-color: $cyan
            border-bottom: 1px $blue-alpha solid
            box-shadow: 0 0 10px $blue-alpha
            display: flex
            justify-content: flex-end
            padding: 5px 0

            &.loggedIn
              padding: 0
              display: grid
              grid-template-columns: 70px 1fr 70px
              grid-template-rows: 50px 30px
              grid-template-areas: "email balance close" "email address close"
              justify-content: space-between
              align-items: center

            &_email
                color: #ffffff99
                text-align: left
                font-size: 13px
                overflow: hidden
                width: 100%
                grid-area: address
                align-self: start
                text-align: left

            &_balance
                color: #fff
                font-size: 16px
                font-weight: 800
                overflow: hidden
                width: 100%
                grid-area: balance
                align-self: end
                margin: 5px 0
                text-align: left

            &_email_icon
                color: #fff
                border-radius: 100%
                background-color: $light-blue
                height: 40px
                margin: 0 15px
                display: grid
                align-items: center
                justify-items: center
                grid-area: email

            &_close
                color: #fff
                border-radius: 100%
                height: 40px
                width: 40px
                margin: 0 15px
                display: grid
                align-items: center
                justify-items: center
                transition: all .2s cubic-bezier(.52,.89,.83,1.55)
                grid-area: close
                cursor: pointer

                &:hover
                    background-color: $pink
                    color: white

        &__links
          display: flex
          flex-direction: column
          overflow-y: auto
          height: calc(100% - 100px)

          .divider
            width: 100%
            border-bottom: 1px solid $cyan-alpha
            margin: 10px auto

          a
              text-decoration: none
              cursor: pointer

              & *
                color: lighten($light-blue, 10)

              &:hover *
                color: #fff

              li
                width: 100%
                display: grid
                grid-template-columns: 70px 1fr
                grid-template-rows: 50px
                color: white
                align-items: center
                justify-items: center
                transition: background-color .3s

                &:hover
                    background-color: $cyan
                &.menu__panel__links_profile-logout:hover
                  background-color: red

              p
                font-family: Montserrat, sans-serif;
                text-transform: uppercase;
                justify-self: start

          &_profile
            display: grid
            grid-template-columns: 1fr 70px
</style>
