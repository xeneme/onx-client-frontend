<template>
  <section
    class="partners bg"
    v-waypoint="{
      active: true,
      callback: onWaypoint,
      options: optionsWaypoint,
    }"
  >
    <img src="@/assets/svg/partners/bg-inner.svg" class="bg__inner" />
    <div class="container">
      <h2 class="partners__title">Partners</h2>
      <Carousel
        :nav="false"
        :loop="true"
        :items="3"
        :center="true"
        :autoHeight="true"
        :autoplay="true"
        :responsive="{ 0: { items: 1 }, 600: { items: 3 } }"
      >
        <img
          src="@/assets/svg/partners/binex.svg"
          alt="partner"
          class="partners__image"
        />
        <img
          src="@/assets/svg/partners/olymp-trade.svg"
          alt="partner"
          class="partners__image"
        />
        <img
          src="@/assets/svg/partners/finmax.svg"
          alt="partner"
          class="partners__image"
        />
        <img
          src="@/assets/svg/partners/binomo.svg"
          alt="partner"
          class="partners__image"
        />
        <img
          src="@/assets/svg/partners/windsor.svg"
          alt="partner"
          class="partners__image"
        />
        <img
          src="@/assets/svg/partners/mcafee.svg"
          alt="partner"
          class="partners__image"
        />
      </Carousel>
    </div>
  </section>
</template>

<script>
import Carousel from 'vue-owl-carousel';

export default {
  name: 'Partners',
  components: { Carousel },
  data() {
    return {
      optionsWaypoint: {
        root: null,
        rootMargin: '0px 0px 0px 0px',
        threshold: [0, 1],
      },
      isShow: false,
    };
  },
  methods: {
    onWaypoint({ going }) {
      if (going === this.$waypointMap.GOING_IN) {
        const carousel = document.querySelector('.partners .container');
        carousel.classList.add('animated', 'slideInUp');
      }
    },
  },
};
</script>

<style lang="sass">
@import "@/scss/_smart-grid"

.partners
  position: relative
  height: 55vh
  display: grid
  align-items: center
  background-size: auto 80%

  .bg
    &__inner
      pointer-events: none
      user-select: none
      position: absolute
      top: -18vw
      left: -10%
      @include to(30rem)
        width: 260%
        top: -41vw
      @include xs-block
        width: 260%
        top: -41vw
      @include sm-block
        width: 210%
        top: -32vw
      @include md-block
        width: 110%
        top: -18vw
      @include lg-block
        width: 110%
        top: -16vw

  .container
    width: 100vw

  &__title
    position: relative
    color: #fff
    margin-bottom: 100px

    &::after
      position: absolute
      top: 40px
      left: calc(50% - 20px)
      content: ""
      width: 40px
      background-color: #0077ff
      border-radius: 3px
      height: 6px

  &__image
    align-self: center
    max-width: 144px
    max-height: 50px
    display: block
    margin: 0 auto

    &:hover
      filter: sepia(93%) saturate(1352%) hue-rotate(-160deg)

  .owl-carousel
    .owl-dots
      padding: 40px 0

    .owl-dot
      outline: none
      span
        background: #4F33FD

      &:hover span
        background: rgba(79, 51, 253, 0.5)

    .owl-dot.active span
      background: rgba(79, 51, 253, 0.5)
</style>
