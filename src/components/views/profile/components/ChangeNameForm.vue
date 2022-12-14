<template>
  <div class="changename">
    <div class="changename_wrap">
      <div class="changename__title">
        <i-button
          class="changename__title__close"
          icon="times"
          @click="close"
        />
        <p>
          <fa icon="user" style="color: #0075ff; margin-right: 3px;" />
          Change name
        </p>
      </div>
      <div class="changename__form">
        <div class="changename__form_loading">
          <fa icon="spinner" class="changename__form_loading_icon fa-spin" />
        </div>
        <ProfileInput
          type="name"
          place="top"
          @typed="firstName = $event"
          placeholder="Firstname"
          @keydown.enter.native="changeName"
          :busy="busy"
        />
        <ProfileInput
          type="name"
          place="bottom"
          @typed="lastName = $event"
          placeholder="Lastname"
          @keydown.enter.native="changeName"
          :busy="busy"
        />
        <Button
          :class="['changename__form__button_submit', busy ? 'busy_btn' : '']"
          @click.native="changeName"
          text="Save"
          theme="primary_big"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Button from './Button'
import ProfileInput from './ProfileInput'
import IButton from '@/components/partial/IconButton'

export default {
  name: 'ChangeNameForm',
  components: {
    Button,
    ProfileInput,
    IButton,
  },
  props: ['show'],
  watch: {
    show(val) {
      this.visibleForm(val)
    },
  },
  data() {
    return {
      busy: false,
      firstName: '',
      lastName: '',
    }
  },
  methods: {
    changeName() {
      if (!this.firstName.replace(' ', '') && !this.lastName.replace(' ', '')) {
        this.close()
        return
      }

      this.loading()
      this.axios
        .post(
          window.location.protocol +
            '//' +
            window.location.host +
            '/api/user/update/name',
          {
            firstName: this.firstName,
            lastName: this.lastName,
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
      this.$el.querySelector('.changename__form_loading').style.display = 'grid'
    },
    loaded() {
      this.busy = false
      this.$el.querySelector('.changename__form_loading').style.display = 'none'
    },
    success(token) {
      this.$store.commit('auth/GET_AUTHORIZED', {
        token,
      })

      this.$store.commit('auth/CHANGE_NAME', {
        first: this.firstName,
        last: this.lastName,
      })

      this.close()
    },
    visibleForm(yes) {
      const self = this
      this.$el.style.top = 0

      if (yes) {
        this.$el.style.display = 'flex'

        this.$anime({
          targets: '.changename_wrap',
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
          targets: '.changename_wrap',
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
      if (!this.$store.getters['popups/changeNameVisibility']) return

      this.$store.commit('popups/CHANGE_NAME', false)
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

<style lang="scss" scroped>
* {
  margin: 0;
  padding: 0;
}
.changename {
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

    @include xs-block {
      width: 100%;
      border-radius: 0;
    }
    @include sm-block {
      width: 500px;
      border-radius: 10px 10px 0 0;
    }
    &__close {
      position: absolute;
      margin: 5px;
      justify-self: end;
      align-self: center;
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

    @include xs-block {
      width: 100%;
      border-radius: 0;
    }
    @include sm-block {
      width: 500px;
      border-radius: 0 0 10px 10px;
    }
    .changename__form_loading {
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
      margin-top: 0;
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
