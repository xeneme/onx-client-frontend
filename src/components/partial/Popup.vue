<template>
  <div class="popup">
    <div class="popup_wrap">
      <div class="popup__title" :style="computedTheme">
        <fa
          icon="times"
          class="popup__title__icon"
          @click="close"
        />
        <span>
          <fa
            :icon="computedIcon"
            class="icon"
            style="color: #0075ff; font-size: 1rem; margin-right: 5px; margin-left: 10px"
          ></fa>
          {{ title }}
        </span>
      </div>
      <div class="popup__form" :style="computedTheme">
        <div class="popup__form_loading">
          <fa
            icon="spinner"
            class="popup__form_loading_icon fa-spin"
          />
        </div>
        <div class="slot_wrapper">
          <slot />
        </div>
        <Button
          v-if="closeable"
          @click.native="close"
          class="submit_button"
          text="Close"
          theme="primary_big"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Button from '../views/wallet/Button'

export default {
  name: 'popup',
  components: {
    Button,
  },
  props: {
    type: {
      type: String,
      default: 'default',
    },
    closeable: {
      type: Boolean,
      default: () => false,
    },
    show: {
      type: Boolean,
      default: false,
    },
    icon: String,
    title: {
      type: String,
      default: 'Title',
    },
  },
  computed: {
    computedTheme() {
      if (this.type === 'Error') {
        return {}
      } else {
        return {}
      }
    },
    computedIcon() {
      if (this.icon) {
        return this.icon
      } else {
        if (this.type === 'Error') {
          return 'times-circle'
        } else if (this.type === 'Warning') {
          return 'exclamation-triangle'
        } else if (this.type === 'Info') {
          return 'info-circle'
        } else {
          return ''
        }
      }
    },
  },
  watch: {
    show(val) {
      this.visibleForm(val)
    },
  },
  data() {
    return {
      busy: false,
      // show: true,
    }
  },
  methods: {
    loading() {
      this.busy = true
      this.$el.querySelector('.popup__form_loading').style.display = 'grid'
    },
    loaded() {
      this.busy = false
      this.$el.querySelector('.popup__form_loading').style.display = 'none'
    },
    visibleForm(yes) {
      const self = this
      this.$el.style.top = 0

      if (yes) {
        this.$store.commit('popups/SHOW_POPUP')
        document.body.style.overflowY = 'hidden'

        this.$el.style.display = 'flex'

        this.$anime({
          targets: '.popup_wrap',
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
          complete() {
            self.$el.style.backgroundColor = '#00002299'
            self.$el.style.backdropFilter = 'blur(2px)'
          },
        })
      } else {
        this.$store.commit('popups/HIDE_POPUP')
        this.$emit('closed')
        if(this.$route.name != 'Main') document.body.style.overflowY = 'auto'

        this.$el.style.backgroundColor = 'transparent'
        this.$el.style.backdropFilter = 'blur(0px)'

        this.$anime({
          targets: '.popup_wrap',
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
      if(!this.show) return

      this.show = false
      this.$root.$emit('popup-closed')
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

<style lang="sass">
@import "@/scss/_smart-grid"
@import "@/scss/_variables"

*
  margin: 0
  padding: 0

.slot_wrapper
  padding: 0 30px
  color: $cyan
  text-align: left

.submit_button
  width: 40%
  display: grid
  margin-top: 25px
  place-self: center

$xs-break: 22rem
$sm-break: 32rem

.popup
  position: fixed
  z-index: 888
  left: 0
  top: 0
  width: 100%
  height: 100%
  transition: backdrop-filter .3s
  transition: background-color .3s
  display: none
  flex-direction: column
  justify-content: center
  align-items: center
  background-color: transparent;
  backdrop-filter: blur(0px);
  transform: scale(1.1)

  &_wrap
    display: flex
    flex-direction: column
    justify-content: center
    align-items: center
    width: 100%
    height: 100%

  &__title
    position: relative
    display: grid
    background: linear-gradient(-45deg, $blue, lighten($blue, 7))
    border: 1px $cyan solid
    color: white
    font-family: 'Montserrat'
    font-weight: 500
    padding: .8rem 0
    overflow: hidden

    @include to($sm-break)
      justify-content: start
      font-size: .9rem
      border-radius: 0
      padding-left: 1rem
      width: calc(100% - 2rem)
    @include from($sm-break)
      font-size: 1.2rem
      width: 30rem
      padding-left: 0
      border-radius: .5vh .5vh 0 0 

    &__icon
      position: absolute
      height: 100%
      margin-right: 1rem
      justify-self: end
      color: #0075ff
      cursor: pointer
      font-size: 1.5rem

      &:hover
        color: white

  &__form
    position: relative
    padding: 25px 0
    background: $blue
    border: 1px #0075ff33 solid
    display: flex
    flex-direction: column
    overflow: hidden
    font-size: .9rem
    line-height: 1.2rem

    @include to($sm-break)
      border-radius: 0
      width: 100%
    @include from($sm-break)
      width: 30rem
      border-radius: 0 0 .5vh .5vh

    .popup__form_loading
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
        width: 5vh
        margin-bottom: 10px
        height: 5vh
        color: $cyan

    &__button_submit
      opacity: 1
      margin: 33px auto
      margin-top: 0
      width: 100px

    &__status
      position: absolute
      height: 5vh
      left: calc(50% - 10rem)
      top: calc(50% - 75px)
      font-size: 5vh
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
