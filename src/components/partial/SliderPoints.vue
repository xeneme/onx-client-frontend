<template>
  <div class="scroll" v-if="visible">
    <div
      class="arrow"
      :style="{
        transform: arrowRotation,
      }"
      @click="arrowGo"
    ></div>
    <div v-if="isSliderScroll" class="slider">
      <span
        v-for="(s, i) in slides"
        :key="i"
        :class="[slide === i ? 'active' : '', computedTheme]"
        @click="goto(i)"
      ></span>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'slider-points',
  props: {
    on: {
      type: Boolean,
      default: true,
    },
  },
  data: () => ({
    slide: 0,
    permit: true,
    destroyed: false,
    slides: [
      '.welcome',
      '.currencies',
      '.advantages-group',
      '.rates',
      '.owl-dot',
      '.about',
    ],
    scrollData: {
      y: 0,
    },
    idlePeriod: 50,
    animationDuration: 1000,
    lastAnimation: 0,
  }),
  watch: {
    visible(yes) {
      if (yes) {
        document.body.style.overflowY = 'hidden'
        this.registerEvent()
      } else {
        if (this.$route.name != 'Main') document.body.style.overflowY = 'auto'
        this.removeEvent()
      }
    },
  },
  computed: {
    ...mapGetters({
      sidebarVisibility: 'popups/sideMenuVisibility',
      signInVisibility: 'popups/signInVisibility',
      signUpVisibility: 'popups/signUpVisibility',
      passwordResetVisibility: 'popups/passwordResetVisibility',
      passwordResetToken: 'auth/passwordResetToken',
      supportVisibility: 'popups/supportVisibility',
      changeNameVisibility: 'popups/changeNameVisibility',
      changePasswordVisibility: 'popups/changePasswordVisibility',
      profile: 'auth/profile',
    }),
    visible() {
      return (
        !this.signUpVisibility &&
        !this.signInVisibility &&
        !this.passwordResetVisibility &&
        !this.passwordResetToken &&
        !this.changeNameVisibility &&
        !this.changePasswordVisibility &&
        !this.supportVisibility &&
        !this.profile?.popup && !this.sidebarVisibility
      )
    },
    computedTheme() {
      return this.slide === 2 ? 'light' : 'primary'
    },
    isSliderScroll() {
      return true
    },
    arrowRotation() {
      return this.slide === this.slides.length - 1
        ? 'rotate(225deg)'
        : 'rotate(45deg)'
    },
  },
  methods: {
    arrowGo() {
      if (this.slide == this.slides.length - 1) {
        this.slide = -1
        this.next()
      } else {
        this.next()
      }
    },
    prev() {
      var self = this,
        slideElement = null

      if (self.permit) {
        this.slide -= this.slide > 0 ? 1 : 0
        slideElement = document.querySelector(this.slides[this.slide])
        slideElement?.scrollIntoView({ block: 'center', behavior: 'smooth' })
        this.permit = false
        setTimeout(() => {
          slideElement?.scrollIntoView({ block: 'center', behavior: 'smooth' })
          self.permit = true
        }, 800)
      }
    },
    next() {
      var self = this,
        slideElement = null

      if (self.permit) {
        this.slide += this.slide < this.slides.length - 1 ? 1 : 0
        slideElement = document.querySelector(this.slides[this.slide])
        slideElement?.scrollIntoView({ block: 'center', behavior: 'smooth' })
        this.permit = false
        setTimeout(() => {
          slideElement?.scrollIntoView({ block: 'center', behavior: 'smooth' })
          self.permit = true
        }, 800)
      }
    },
    goto(slide) {
      this.slide = slide
      var slideElement = document.querySelector(this.slides[this.slide])
      slideElement?.scrollIntoView({ block: 'center', behavior: 'smooth' })
    },
    handleWheel(e) {
      var delta = e.wheelDelta || e.deltaY * -1
      var timeNow = new Date().getTime()
      if (
        timeNow - this.lastAnimation <
        this.idlePeriod + this.animationDuration
      ) {
        return
      }

      if (this.permit && !this.destroyed) {
        if (delta < 0) {
          this.next()
        } else {
          this.prev()
        }
      }

      this.lastAnimation = timeNow
    },
    registerEvent() {
      document.body.addEventListener('wheel', this.handleWheel)
    },
    removeEvent() {
      document.body.removeEventListener('wheel', this.handleWheel)
    },
  },
  mounted() {
    this.registerEvent()
  },
  destroyed() {
    this.destroyed = true
    this.removeEvent()
  },
}
</script>

<style lang="sass">
@import "@/scss/_variables"

.arrow
  width: 50px
  height: 50px
  transform: rotate(45deg)
  border-right: white 2px solid
  border-bottom: white 2px solid
  position: fixed
  z-index: 999
  bottom: 50px
  opacity: .4
  left: calc(50vw - 25px)
  cursor: pointer
  transition: all .3s
  &:hover
    opacity: 1
  &:active
    width: 60px
    height: 60px
    left: calc(50vw - 30px)

.slider
    position: fixed
    z-index: 2
    display: flex
    top: 44vh
    right: 50px
    flex-direction: column
    height: 200px

    span.active
        opacity: 1

    span
        background-color: #23c3fa
        margin-top: 15px
        width: 16px
        height: 16px
        border-radius: 100%
        opacity: .4
        transition: opacity .6s, background-color .6s, transform .2s

        &:hover
            cursor: pointer
            transform: scale(1.3)

    span.light
      background: white
</style>
