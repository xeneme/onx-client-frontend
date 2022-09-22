<template>
  <div class="panels">
    <!-- DESKTOP -->
    <div
      :class="['panel', 'desktop', first.size]"
      :style="computedPanels.first"
      v-if="isDesktop"
    >
      <div class="panel__wrap">
        <div
          :class="['panel panel--default desktop', first.notCard ? '' : 'card']"
          :style="css"
        >
          <div class="panel--default_loading">
            <fa icon="spinner" class="panel--default_loading_icon fa-spin" />
          </div>
          <label v-if="first.label" class="panel__label">{{
            first.label
          }}</label>
          <slot name="form-wrap"></slot>
        </div>
      </div>
    </div>
    <!-- MOBILE FIRST -->
    <div :class="['panel', 'mobile']" v-if="!isDesktop">
      <label v-if="title" class="panel__title">{{ title }}</label>
      <div class="panel__wrap">
        <div :class="['panel panel--default', first.notCard ? '' : 'card']">
          <div class="panel--default_loading">
            <fa icon="spinner" class="panel--default_loading_icon fa-spin" />
          </div>
          <label v-if="first.label" class="panel__label">{{
            first.label
          }}</label>
          <slot name="form-wrap"></slot>
        </div>
      </div>
    </div>
    <!-- SECOND -->
    <div
      :class="[
        'panel',
        'desktop',
        {
          sm: 'lg',
          lg: 'sm',
          md: 'md',
        }[this.first.size],
      ]"
      v-if="(!!this.$slots['second-form-wrap'] || secondEmpty) && isDesktop"
      :style="computedPanels.second"
    >
      <div class="panel__wrap">
        <div
          style="padding-top: 30px"
          :class="['panel panel--default', second.notCard ? '' : 'card']"
        >
          <label v-if="label" class="panel__label">{{ label }}</label>
          <slot name="second-form-wrap"></slot>
        </div>
      </div>
    </div>
    <!-- MOBILE SECOND -->
    <div
      :class="['panel', 'mobile']"
      v-if="!!this.$slots['second-form-wrap'] && !isDesktop"
    >
      <div class="panel__wrap">
        <div
          style="padding-top: 30px"
          :class="['panel panel--default', second.notCard ? '' : 'card']"
        >
          <label v-if="label" class="panel__label">{{ label }}</label>
          <slot name="second-form-wrap"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Panel',
  props: {
    secondEmpty: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: 'Title',
    },
    label: {
      type: String,
      default: '',
    },
    css: Object,
    loading: {
      type: Boolean,
      default: false,
    },
    first: {
      type: Object,
      default: () => ({
        id: 0,
        size: 'sm',
        notCard: false,
      }),
    },
    second: {
      type: Object,
      default: () => ({
        id: 1,
        notCard: false,
      }),
    },
  },
  data: () => ({
    sizes: {
      sm: '400px',
      md: '550px',
      lg: '700px',
    },
    isDesktop: true,
  }),
  methods: {
    checkIsDesktop() {
      this.isDesktop = window.matchMedia(`(min-width: 55rem)`).matches
    },
    updateLoading() {
      if (this.loading) {
        this.$el.querySelector('.panel--default_loading').style.opacity = 1
        this.$el.querySelector('.panel--default_loading').style.pointerEvents =
          'all'
      } else {
        this.$el.querySelector('.panel--default_loading').style.opacity = 0
        this.$el.querySelector('.panel--default_loading').style.pointerEvents =
          'none'
      }
    },
  },
  watch: {
    loading: 'updateLoading',
  },
  computed: {
    computedPanels() {
      let secondWidth =
        {
          sm: 'lg',
          lg: 'sm',
          md: 'md',
        }[this.first.size] !== 'lg'
          ? 'width'
          : 'aaa'

      return {
        first: !['full', 'lg'].includes(this.first.size)
          ? {
              width: this.sizes[this.first.size],
              'backdrop-filter': 'blur(2px)',
            }
          : {
              'backdrop-filter': 'blur(2px)',
            },
        second: {
          [secondWidth]: this.sizes[
            {
              sm: 'lg',
              lg: 'sm',
              md: 'md',
            }[this.first.size]
          ],
          visibility: !this.second ? 'hidden' : 'visible',
          'backdrop-filter':
            !this.second || this.second.notCard ? 'none' : 'blur(2px)',
        },
      }
    },
  },
  created() {
    window.addEventListener('resize', this.checkIsDesktop)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.checkIsDesktop)
  },
  mounted() {
    this.checkIsDesktop()
    this.$anime({
      targets: '.panel',
      scale: [0.95, 1],
      translateX: [60, 0],
      easing: 'easeOutExpo',
      duration: 800,
      opacity: [0, 1],
      delay: this.$anime.stagger(100),
    })
  },
}
</script>

<style lang="sass" scoped>
@import "@/scss/_smart-grid"
@import "@/scss/_variables"

$break: 55rem

.panels
  display: flex

  @include to(100rem)
    flex-direction: column
    gap: 20px
  @include from(100rem)
    flex-direction: row

  @include to($break)
    width: 100vw
  @include from($break)
    width: auto

.panel.full
  @include to(100rem)
    width: 550px
  @include from(100rem)
    width: 1140px

.panel.lg
  @include to(100rem)
    width: 550px
  @include from(100rem)
    width: 700px

.panel
  padding: 0 20px
  // margin-bottom: 20px
  min-height: 100px
  width: 100%

  &.mobile
    padding: 0
    margin: 0
    width: 100%

  &__title
    color: white
    font-family: sans-serif
    text-transform: uppercase
    font-size: 2em
    letter-spacing: 0.05em

  &__label
    color: white
    font-weight: 400
    font-size: 1.5rem
    position: relative

  &__wrap
    display: flex
    width: 100%

    @include to($break)
      flex-wrap: wrap
    @include from($break)
      margin-top: 0
      flex-wrap: nowrap

  .panel--default
    width: 100%
    opacity: .8
    display: flex
    flex-direction: column
    padding: 30px

    @include to($break)
      border-radius: none
    @include from($break)
      border-radius: 5px

    &.card
      background-color: #0075ff66
      border: 1px solid #56A4FF77
      box-shadow: inset 0 0px 10px $cyan

    &_loading
      position: absolute
      width: 100%
      height: 100%
      top: 0
      left: 0
      z-index: 3
      overflow: hidden
      background-color: $blue-alpha
      opacity: 0
      pointer-events: none
      display: grid

      &_icon
        place-self: center
        width: 100px
        font-size: 4rem
        margin-bottom: 30px
        height: 80px
        color: $cyan

.panel.desktop
  @include to($break)
    display: none
  @include from($break)
    display: block

.panel.mobile
  padding: 0
  width: 100vw
  @include to($break)
    display: flex
    flex-direction: column
    gap: 20px
  @include from($break)
    display: none
</style>
