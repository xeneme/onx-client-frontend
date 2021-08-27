<template>
  <div class="twofa">
    <div class="twofa_wrap">
      <div class="twofa__title">
        <i-button class="twofa__title__close" icon="times" @click="close" />
        <p>
          <fa icon="calculator" style="color: #0075ff; margin-right: 3px" />
          Two-Factor Authentication
        </p>
      </div>
      <div class="twofa__form">
        <div class="twofa__form_loading">
          <fa icon="spinner" class="twofa__form_loading_icon fa-spin" />
        </div>
        <div class="text">
          With 2FA enabled, you have to enter a 6-digit code that our Telegram
          bot will send you every log in to your account.
        </div>
        <a href="/api/user/twofa" target="_blank" class="link">
          go to the bot
        </a>
        <div class="text" v-if="!profile.twoFa">
          In order to enable 2FA, take your activation code from the bot and
          past it here:
        </div>
        <div class="text" v-else>
          In order to disable 2FA, take your activation code from the bot and
          past it here:
        </div>
        <div class="code">
          <input
            class="code-input"
            type="text"
            min="0"
            max="6"
            @keydown.enter="twoFa"
            placeholder="000000"
            v-model="code"
          />
          <Button
            :class="['twofa__form__button_submit', busy ? 'busy_btn' : '']"
            @click.native="twoFa"
            :text="profile.twoFa ? 'Disable' : 'Enable'"
            :light="profile.twoFa ? '' : 'true'"
            theme="primary_big"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Button from './Button'
import IButton from '@/components/partial/IconButton'

import { mapGetters } from 'vuex'

import axios from 'axios'

const base = window.location.protocol + '//' + window.location.host + '/api/'

export default {
  name: 'TwoFaForm',
  components: {
    Button,
    IButton,
  },
  props: ['show'],
  watch: {
    show(val) {
      this.visibleForm(val)
    },
  },
  computed: {
    host() {
      return window.location.host.split('.')[0]
    },
    ...mapGetters({
      profile: 'auth/profile',
    }),
  },
  data() {
    return {
      code: '',
      busy: false,
    }
  },
  methods: {
    sendCode() {
      const mode = this.profile.twoFa ? 'disable' : 'enable'

      this.loading()

      axios
        .get(base + 'user/two-factor-authorization/' + mode + '/code', {
          headers: { Authorization: localStorage.getItem('auth-token') },
        })
        .then(() => {
          this.loaded()
        })
        .catch(() => {
          this.loaded()
        })
    },
    twoFa() {
      this.loading()

      const mode = this.profile.twoFa ? 'disable' : 'enable'
      const url = base + 'user/two-factor-authorization'
      const headers = {
        headers: { Authorization: localStorage.getItem('auth-token') },
      }
      const body = {
        mode,
        code: this.code,
      }

      axios
        .post(url, body, headers)
        .then(({ data }) => {
          this.loaded()
          this.code = ''
          this.profile.twoFa = !this.profile.twoFa
          this.$store.commit('popups/ADD_ALERT', {
            type: 'info',
            title: data.stage,
            message: data.message,
          })
          this.close()
        })
        .catch(err => {
          this.loaded()
          this.code = ''

          if (err.response && err.response.data) {
            this.$store.commit('popups/ADD_ALERT', {
              type: 'error',
              title: err.response.data.stage,
              message: err.response.data.message,
            })
          } else {
            this.$store.commit('popups/ADD_ALERT', {
              type: 'error',
              title: 'Exception',
              message: 'Something wrong with your connection',
            })
          }
        })
    },
    loading() {
      this.busy = true
      this.$el.querySelector('.twofa__form_loading').style.display = 'grid'
    },
    loaded() {
      this.busy = false
      this.$el.querySelector('.twofa__form_loading').style.display = 'none'
    },
    success() {
      this.close()
    },
    visibleForm(yes) {
      const self = this
      this.$el.style.top = 0

      if (yes) {
        this.sendCode()

        this.$el.style.display = 'flex'

        this.$anime({
          targets: '.twofa_wrap',
          scale: [0.9, 1],
          opacity: [0, 1],
          duration: 200,
          easing: 'easeInOutSine',
          update(anime) {
            if (anime.progress > 30) {
              self.$el.style.backgroundColor = '#00002299'
              self.$el.style.backdropFilter = 'blur(2px)'
            }
          },
        })
      } else {
        this.$el.style.backgroundColor = 'transparent'
        this.$el.style.backdropFilter = 'blur(0px)'

        this.$anime({
          targets: '.twofa_wrap',
          scale: [1, 0.9],
          opacity: [1, 0],
          duration: 200,
          easing: 'easeInOutSine',
          complete() {
            self.$el.style.display = 'none'
          },
        })
      }
    },
    close() {
      if (!this.$store.getters['popups/twoFaFormVisibility']) return

      this.$store.commit('popups/CHANGE_TWOFA', false)

      history.replaceState(null, null, ' ')
    },
  },
  mounted() {
    this.visibleForm(this.show)

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        this.close()
      }
    })
  },
}
</script>

<style lang="sass" scoped>
@import "@/scss/_smart-grid"
@import "@/scss/_variables"

*
  margin: 0
  padding: 0

.code
  width: 100%
  display: flex
  align-items: center
  justify-content: center
  margin: 30px 0

.code-input
  margin-right: 20px
  width: 150px
  display: grid
  place-self: center
  text-align: center
  background-color: $cyan-alpha
  outline: none
  border: none
  height: 50px
  color: white
  font-size: 1.6rem
  letter-spacing: .3rem
  border-radius: 5px

  &::placeholder
    color: $cyan

.link
  color: $light-blue
  text-decoration: none
  font-weight: 600
  text-align: center
  text-transform: uppercase
  font-size: 14px
  margin: 20px 0

  &:hover
      color: white

.twofa
  position: fixed
  z-index: 888
  left: 0
  top: 0
  width: 100vw
  height: 100vh
  transition: backdrop-filter .3s
  transition: background-color .3s
  display: none
  flex-direction: column
  justify-content: center
  align-items: center
  background-color: transparent;
  backdrop-filter: blur(0px);

  &_wrap
    display: flex
    flex-direction: column
    justify-content: center
    align-items: center
    width: 100%
    height: 100%

  &__title
    width: 500px
    position: relative
    display: grid
    background: linear-gradient(-45deg, $blue, lighten($blue, 7))
    border: 1px $cyan solid
    color: white
    font-family: 'Montserrat'
    font-weight: 500
    height: 22px
    padding: 10px 0

    @include xs-block
      width: 100%
      border-radius: 0
    @include sm-block
      width: 500px
      border-radius: 10px 10px 0 0

    &__close
      position: absolute
      margin: 5px
      justify-self: end
      align-self: center

  &__form
    position: relative
    width: 500px
    padding-top: 20px
    background: $blue
    border: 1px #0075ff33 solid
    display: flex
    flex-direction: column
    overflow: hidden
    min-height: 140px

    @include xs-block
      width: 100%
      border-radius: 0
    @include sm-block
      width: 500px
      border-radius: 0 0 10px 10px

    .text
      color: $cyan
      text-align: left
      padding: 0 20px

    .twofa__form_loading
      position: absolute
      width: 100%
      height: 100%
      top: 0
      left: 0
      z-index: 3
      background-color: $blue-alpha
      display: none

      &_icon
        place-self: center
        width: 100px
        margin-bottom: 10px
        height: 80px
        color: $cyan

    &__button_submit
      opacity: 1
      width: 60px

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
