<template>
  <div class="page">
    <Background />
    <ChangeNameForm :show="changeNameFormVisibility" />
    <ChangePasswordForm :show="changePasswordFormVisibility" />
    <TwoFA :show="twoFaFormVisibility" />
    <div class="container">
      <div class="profile">
        <div class="profile__names">
          <div class="profile__names__title">
            <p><fa icon="user" class="icon" />Profile</p>
            <a href="#edit" @click="showChangeNameForm">edit</a>
          </div>
          <div class="profile__names__profile">
            <div
              :class="{ selecting: selectingAvatar }"
              class="profile__names__profile__avatars"
              ref="avatars"
            >
              <div
                v-for="(avatar, i) in avatars"
                :key="i"
                @click="selectAvatar(i)"
                class="profile__names__profile__avatars-item"
              >
                <img :src="avatar" />
              </div>
            </div>
            <div
              @click="toggleAvatarPicker"
              ref="avatarPicker"
              :class="{ selecting: selectingAvatar }"
              class="profile__names__profile_user"
            >
              <img :src="profile.pic" v-if="profile.pic" class="avatar-pic" />
              <fa v-else class="avatar" icon="user"></fa>
              <fa class="edit" icon="pencil-alt"></fa>
              <fa
                :class="{ loading }"
                class="spinner fa-spin"
                icon="spinner"
              ></fa>
            </div>
            <div
              ref="names"
              :class="{ selecting: selectingAvatar }"
              class="profile__names__profile_name"
            >
              <p>{{ profile.firstName }} {{ profile.lastName }}</p>
              <p v-if="profile.email != profile.firstName">
                {{ profile.email }}
              </p>
            </div>
          </div>
        </div>
        <div class="profile__password__title">
          <p><fa icon="lock" class="icon" />Password</p>
          <a href="#change-password" @click="showChangePasswordForm">change</a>
        </div>
        <div class="profile__password">
          <p>•••••••••••••••••••••</p>
        </div>
        <div class="two-factor_authentication">
          <p>
            <fa icon="calculator" class="icon" /><span
              class="two-factor_authentication_title-desktop"
              >Two-factor authentication</span
            ><span class="two-factor_authentication_title-mobile">2FA</span>
            <span
              :style="{
                color: profile.twoFa ? '#0f0' : '#f00',
              }"
              >{{ profile.twoFa ? ' ON' : ' OFF' }}</span
            >
          </p>
          <a href="#enable-2fa" @click="show2FAForm">
            set up
          </a>
        </div>
      </div>
      <a
        ref="promo"
        class="promo"
        href="#activate-promo"
        @click="enterPromoCode"
      >
        <div class="glare"></div>
        <div class="promo__title">
          <span class="title"
            ><fa icon="ticket-alt" class="icon" />Activate promo code</span
          >
          <input
            ref="promo-value"
            type="text"
            class="promo__value"
            v-model="code"
            @change="trim"
            @keydown.enter="activatePromoCode"
          />
          <inline-spinner :loading="loading" />
        </div>
        <div
          class="promo__button"
          :class="{
            loading,
          }"
          @click="activatePromoCode"
        >
          <fa icon="check" />
        </div>
      </a>
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
import InlineSpinner from '@/components/partial/InlineSpinner'

import axios from 'axios'

const base = window.location.protocol + '//' + window.location.host + '/api/'

export default {
  name: 'Profile',
  components: {
    Background,
    Footer,
    ChangeNameForm,
    ChangePasswordForm,
    InlineSpinner,
    TwoFA,
  },
  data: () => ({
    loading: false,
    selectingAvatar: false,
    promoInputOpened: false,
    selectedAvatar: null,
    code: '',
    avatars: [
      'https://i.ibb.co/yycbt3F/USDT.jpg',
      'https://i.ibb.co/jytq3hH/XRP.jpg',
      'https://i.ibb.co/d0xVzD0/BNB.jpg',
      'https://i.ibb.co/Sv7cqvB/BTC.jpg',
      'https://i.ibb.co/wNZW3Jd/ETH.jpg',
      'https://i.ibb.co/Mkmkmw8/LTC.jpg',
    ],
  }),
  computed: {
    ...mapGetters({
      changeNameFormVisibility: 'popups/changeNameVisibility',
      changePasswordFormVisibility: 'popups/changePasswordVisibility',
      twoFaFormVisibility: 'popups/twoFaFormVisibility',
      profile: 'auth/profile',
    }),
    name() {
      return (
        this.profile.firstName.toLowerCase().capitalize() +
        ' ' +
        this.profile.lastName.toLowerCase().capitalize()
      )
    },
  },
  methods: {
    toggleAvatarPicker() {
      this.selectingAvatar = !this.selectingAvatar
    },
    selectAvatar(i) {
      this.profile.pic = this.avatars[i]
      this.selectedAvatar = i
      this.toggleAvatarPicker()

      this.loading = true

      axios
        .get(base + 'user/update/avatar?n=' + this.selectedAvatar, {
          headers: { Authorization: localStorage.getItem('auth-token') },
        })
        .then(() => {
          this.loading = false
        })
        .catch(({ response }) => {
          this.loading = false
          if (response) {
            this.$store.commit('popups/ADD_ALERT', {
              type: 'error',
              title: response.data.stage,
              message: response.data.message,
            })
          }
        })
    },
    show2FAForm() {
      this.$store.commit('popups/CHANGE_TWOFA', true)
    },
    trim() {
      this.code = this.code.replace(' ', '').toUpperCase()
    },
    showChangeNameForm() {
      this.$store.commit('popups/CHANGE_NAME', true)
    },
    showChangePasswordForm() {
      this.$store.commit('popups/CHANGE_PASSWORD', true)
    },
    enterPromoCode() {
      this.promoInputOpened = true
      this.$refs.promo.classList.add('active')
      this.$refs['promo-value'].focus()
    },
    activatePromoCode() {
      this.$refs.promo.classList.remove('active')
      this.$refs['promo-value'].blur()
      this.loading = true

      axios
        .get(base + 'user/promo/use?code=' + this.code, {
          headers: { Authorization: localStorage.getItem('auth-token') },
        })
        .then(response => {
          this.loading = false
          this.$store.commit('auth/ADD_TRANSACTION', response.data.transaction)
          this.$store.commit('auth/UPDATE_WALLETS', response.data.wallets)
          this.$store.commit('popups/ADD_ALERT', {
            type: 'info',
            title: `Promo code applied (${response.data.amount})`,
            message: response.data.message,
          })

          this.close()
        })
        .catch(err => {
          this.loading = false
          if (err.response.data && err.response.data.message) {
            this.$store.commit('popups/ADD_ALERT', {
              type: 'error',
              title: "Promo code hasn't applied",
              message: err.response.data.message,
            })
          }
        })

      this.code = ''
    },
    closeOutside(e) {
      const { promo } = this.$refs

      if (!promo || promo.contains(e.target)) return

      this.close()
    },
    close() {
      this.promoInputOpened = false
      this.$refs.promo.classList.remove('active')
    },
  },
  created() {
    if (!this.profile) {
      this.$router.push('/')
      return
    }
  },
  mounted() {
    document.addEventListener('click', this.closeOutside)

    this.$store.commit('popups/CHANGE_NAME', false)
    this.$store.commit('popups/CHANGE_PASSWORD', false)

    if (this.$route.hash === '#edit') {
      this.$store.commit('popups/CHANGE_NAME', true)
    } else if (this.$route.hash === '#change-password') {
      this.$store.commit('popups/CHANGE_PASSWORD', true)
    } else if (this.$route.hash === '#activate-promo') {
      this.enterPromoCode()
    }
  },
}
</script>

<style lang="sass" scoped>
@import "@/scss/_smart-grid"
@import "@/scss/_variables"

$mobile-break: 30rem

.page
  position: relative
  background: $v-grad
  background-size: contain
  padding-top: $header-slot

  .container
    z-index: 1
    margin-bottom: 200px

.icon
  color: $light-blue
  margin-right: 5px
  margin-bottom: 2px
  font-size: .8rem
.profile , .promo
    margin: 10px auto
    padding: 15px
    backdrop-filter: blur(2px)
    background: $cyan-alpha
    opacity: .8
    border-radius: 5px
    display: grid
    border: 1px solid #56A4FF77
    grid-area: profile
    color: white

    @include xs-block
        width: 90%
    @include sm-block
        width: 90%
    @include md-block
        width: 70%
    @include lg-block
        width: 50%

    &__title
      width: 100%
      display: flex
      justify-content: space-between
      font-family: Montserrat

      a
          color: $light-blue
          text-decoration: none
          font-weight: 600
          text-transform: uppercase
          font-size: 12px

          &:hover
              color: white

      p
          color: white

    &__names
        border-bottom: 1px solid $cyan-alpha

    &__password
        p
            line-height: 3rem
            text-align: left
            margin-left: 1rem

            @include to(40rem)
              font-size: 1.2rem

            @include from(40rem)
              font-size: 2rem

        &__title
            margin-top: 15px

    &__names, &__password
        width: 100%

        &__title
            width: 100%
            display: flex
            justify-content: space-between
            font-family: Montserrat

            a
                color: $light-blue
                text-decoration: none
                font-weight: 600
                text-transform: uppercase
                font-size: 12px

                &:hover
                    color: white

            p
                color: white
                box-sizing: border-box


        &__profile
            display: grid
            width: 100%
            grid-template-columns: 100px 1fr
            justify-items: center
            align-items: center
            height: 80%

            @include to($mobile-break)
              margin-bottom: 30px

            @include from($mobile-break)
              margin: 0

            &__avatars
              top: 70px
              left: 40px
              position: absolute
              display: flex
              gap: 16px
              flex-wrap: wrap
              z-index: 10
              pointer-events: none
              display: flex
              opacity: 0
              transition: opacity .2s
              user-select: none
              &.selecting
                opacity: 1
                pointer-events: all
              &-item
                overflow: hidden
                border-radius: 100%
                width: 80px
                height: 80px
                opacity: .8
                cursor: pointer
                transition: all .2s
                transform: translate(-5px, 5px)

                &:hover
                  transform: translate(0px, 0px)
                  box-shadow: -5px 5px 10px 1px $blue
                  opacity: 1

                img
                  margin-left: -5%
                  margin-top: -5%
                  width: 110%

            &_user
                position: relative
                border-radius: 100%
                background-color: $cyan
                overflow: hidden
                justify-self: end
                display: grid
                margin: 40px 0
                width: 80px
                cursor: pointer
                height: 80px
                transition: all .2s
                pointer-events: all
                opacity: 1
                user-select: none
                &.selecting
                  opacity: 0
                  pointer-events: none

                .edit
                  transition: all .2s
                  opacity: 0
                  position: absolute
                  top: 30%
                  right: 30%
                  width: 40%
                  height: 40%

                .spinner
                  transition: all .2s
                  position: absolute
                  top: 30%
                  right: 30%
                  width: 40%
                  height: 40%
                  opacity: 0
                  &.loading
                    opacity: 1

                &:hover
                  background-color: $cyan-alpha
                &:hover .avatar
                  opacity: 0
                &:hover .edit
                  opacity: 1


                @include to($mobile-break)
                  display: none

                @include from($mobile-break)
                  display: grid

                .avatar
                    transition: all .2s
                    width: 50%
                    height: 50%
                    place-self: center

                .avatar-pic
                  width: 100%
                &:hover .avatar-pic
                  opacity: .5

            &_name
                margin-left: 20px
                justify-self: start
                opacity: 1
                pointer-events: all
                transition: opacity .2s

                &.selecting
                  pointer-events: none
                  opacity: 0

                p
                    @include to($mobile-break)
                      font-size: .8rem
                    @include from($mobile-break)
                      font-size: 1rem

                    text-align: left

                    &:first-child
                        @include to($mobile-break)
                          font-size: 1.3rem
                        @include from($mobile-break)
                          font-size: 2.1rem

.two-factor_authentication
  padding-top: 17px
  padding-bottom: 5px
  border-top: 1px solid $cyan-alpha
  width: 100%
  display: flex
  justify-content: space-between
  font-family: Montserrat

  &_title-desktop
    @include to($mobile-break)
      display: none
    @include from($mobile-break)
      display: inline
  &_title-mobile
    @include to($mobile-break)
      display: inline
    @include from($mobile-break)
      display: none

  a
      color: $light-blue
      text-decoration: none
      font-weight: 600
      text-transform: uppercase
      font-size: 12px

      &:hover
          color: white

  p
      color: white
      text-align: left

.promo
    cursor: pointer
    position: relative
    background: transparentize($cyan-alpha, .2)
    overflow: hidden
    text-decoration: none
    transition: background-color .2s ease

    &__button
      position: absolute
      width: 40px
      display: grid
      align-items: center
      justify-content: center
      height: 97%
      z-index: 10
      right: 0
      opacity: 0
      background-color: $cyan-alpha

      &:hover
        background-color: $cyan

        *
          color: white

      *
        color: $light-blue
        pointer-events: none

    .title
      position: absolute
      transition: transform .3s ease

      @include to($mobile-break)
        font-size: .8rem
      @include from($mobile-break)
        font-size: 1rem


    .icon
      transition: transform .3s ease

    &:hover
      background: $cyan-alpha

      .glare
        opacity: .5
        transform: rotate(45deg) translate(100rem, -100rem)

    &.active
      border: 1px solid #56A4FF33
      background: $blue-alpha

      .promo__button
        opacity: 1

        &.loading
          opacity: 0

      .title::after
        content: ":"

      .title
        transform: translateX(-20px)
        color: $cyan
        opacity: .7

      .icon
        transform: translateX(-30px)

    &.active:hover
      .glare
        opacity: 0

    .glare
      transform: rotate(45deg)
      position: absolute
      top: -250%
      left: -150px
      height: 500%
      opacity: 0
      width: 80px
      background: $light-blue
      transition: transform .3s linear

    &__value
      cursor: pointer
      outline: none
      border: none
      background: none
      height: 2rem
      width: 95%
      margin: -8px 0
      z-index: 2
      color: white
      font-size: 1.6rem
      display: grid
      align-content: center
      text-align: right
      text-transform: uppercase
</style>
