<template>
  <div class="newpassword">
    <div class="newpassword_wrap">
      <div class="newpassword__title">
        <fa icon="times" class="newpassword__title__icon" @click="close" />
        <p>
          <fa icon="lock" style="color: #0075ff; margin-right: 3px;" />
          Reset password
        </p>
      </div>
      <div class="newpassword__form">
        <div class="newpassword__form_loading">
          <fa icon="spinner" class="newpassword__form_loading_icon fa-spin" />
        </div>
        <ProfileInput
          type="password"
          place="top"
          @typed="newPassword = $event"
          placeholder="New password"
          @keydown.enter.native="resetPasswordHandler"
          :busy="busy"
        />
        <InputWorm
          compare="true"
          :top="newPassword"
          :bottom="repeatNewPassword"
        />
        <ProfileInput
          type="repeatPassword"
          place="bottom"
          @typed="repeatNewPassword = $event"
          placeholder="Repeat password"
          @keydown.enter.native="resetPasswordHandler"
          :busy="busy"
        />
        <Button
          :class="['newpassword__form__button_submit', busy ? 'busy_btn' : '']"
          @click.native="resetPasswordHandler"
          text="Save"
          theme="primary_big"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Button from '../views/profile/components/Button'
import ProfileInput from '../views/profile/components/ProfileInput'
import InputWorm from './InputWorm'

export default {
  name: 'NewPasswordForm',
  components: {
    Button,
    ProfileInput,
    InputWorm,
  },
  props: ['show', 'token'],
  watch: {
    show(val) {
      this.visibleForm(val)
    },
  },
  data() {
    return {
      busy: false,
      newPassword: '',
      repeatNewPassword: '',
    }
  },
  computed: {
    isLoggedIn() {
      return this.$store.getters['auth/isLoggedIn']
    },
  },
  methods: {
    resetPasswordHandler() {
      if (
        !this.repeatNewPassword.replace(' ', '') &&
        !this.newPassword.replace(' ', '')
      ) {
        this.close()
        return
      }

      this.loading()

      var base = window.location.protocol + '//' + window.location.host

      if (!this.token) {
        if (!(this.password && this.repeatNewPassword && this.newPassword)) {
          this.handleError({
            stage: 'Validation',
            message:
              'The operation was canceled because of validation troubles. Have you filed every form?',
          })
          this.loaded()
          return
        }

        this.axios
          .post(
            base + '/api/user/reset-password',
            {
              token: this.token,
              password: this.password,
              newPassword: this.newPassword,
              repeatNewPassword: this.repeatNewPassword,
            },
            {
              headers: { Authorization: localStorage.getItem('auth-token') },
            },
          )
          .then(res => {
            this.loaded()
            this.success(res.data.token)
            this.handleSuccess(res.data)
          })
          .catch(err => {
            this.loaded()

            if (err.response) {
              this.handleError(err.response.data)
            }
          })
      } else {
        this.axios
          .post(base + '/api/auth/reset/submit', {
            token: this.token,
            newPassword: this.newPassword,
            repeatNewPassword: this.repeatNewPassword,
          })
          .then(res => {
            this.$store.commit('auth/RESET_PASSWORD', '')
            this.loaded()
            this.close()
            this.handleSuccess(res.data)
          })
          .catch(err => {
            this.loaded()

            if (err.response) {
              this.handleError(err.response.data)
            }
          })
      }
    },
    handleError(response) {
      if (!response) return

      this.$store.commit('popups/ADD_ALERT', {
        type: 'error',
        title: response.stage,
        message: response.message,
      })
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
      this.$el.querySelector('.newpassword__form_loading').style.display =
        'grid'
    },
    loaded() {
      this.busy = false
      this.$el.querySelector('.newpassword__form_loading').style.display =
        'none'
    },
    success(token) {
      this.$store.commit('auth/GET_AUTHORIZED', {
        token,
      })

      this.close()
    },
    visibleForm(yes) {
      const self = this
      this.$el.style.top = 0

      if (yes) {
        this.$el.style.display = 'flex'
        this.$el.querySelector('.newpassword_wrap').style.scale = '1'
        this.$el.querySelector('.newpassword_wrap').style.opacity = '1'
        this.$el.style.backgroundColor = '#00002299'
        this.$el.style.backdropFilter = 'blur(2px)'
      } else {
        this.$el.style.backgroundColor = 'transparent'
        this.$el.style.backdropFilter = 'blur(0px)'

        this.$anime({
          targets: '.newpassword_wrap',
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
      if (!this.$store.getters['popups/changePasswordVisibility']) return

      this.$store.commit('popups/CHANGE_PASSWORD', false)
      this.$store.commit('auth/RESET_PASSWORD', '')

      this.$emit('closed')

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

<style lang="scss" scoped>
* {
  margin: 0;
  padding: 0;
}
.profileinput {
  margin-bottom: 0;
}
.newpassword {
  position: fixed;
  z-index: 888;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  transition: backdrop-filter 0.3s;
  transition: background-color 0.3s;
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  backdrop-filter: blur(0px);

  &_wrap {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }
  &__title {
    width: 500px;
    position: relative;
    display: grid;
    background: linear-gradient(-45deg, $blue, lighten($blue, 7));
    border: 1px $cyan solid;
    color: white;
    font-family: 'Montserrat';
    font-weight: 500;
    padding: 10px 0;
    height: 22px;

    @include to(33rem) {
      width: 100%;
      border-radius: 0;
    }
    @include from(33rem) {
      width: 500px;
      border-radius: 10px 10px 0 0;
    }
    &__icon {
      position: absolute;
      height: 100%;
      margin-right: 20px;
      justify-self: end;
      color: #0075ff;
      cursor: pointer;
      font-size: 1.3rem;

      &:hover {
        color: white;
      }
    }
  }
  &__form {
    position: relative;
    width: 500px;
    padding-top: 40px;
    background: $blue;
    border: 1px #0075ff33 solid;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    min-height: 240px;

    @include to(33rem) {
      width: 100%;
      border-radius: 0;
    }
    @include from(33rem) {
      width: 500px;
      border-radius: 0 0 10px 10px;
    }
    .newpassword__form_loading {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      z-index: 3;
      background-color: $blue-alpha;
      display: none;

      &_icon {
        place-self: center;
        width: 100px;
        margin-bottom: 10px;
        height: 80px;
        color: $cyan;
      }
    }
    &__button_submit {
      opacity: 1;
      margin: 33px auto;
      margin-top: 40px;
      width: 100px;
    }
    &__status {
      position: absolute;
      height: 80px;
      left: calc(50% - 10rem);
      top: calc(50% - 75px);
      font-size: 2rem;
      font-weight: 500;
      font-family: 'Montserrat';
      color: white;
      opacity: 0;
      pointer-events: none;

      &_icon {
        transform: scale(0);
      }
    }
  }
}
.busy_btn {
  pointer-events: none;
  opacity: 0.2;
}
</style>
