<template>
  <div class="cookies-agreement">
    <div class="cookies-agreement__offer">
      <p>
        We use cookies to recognize your browser or device and provide you with
        essential features and services and for additional purposes detailed in
        our <a href="javascript: void(0)">Cookies Privacy</a>.
      </p>
    </div>
    <Button
      class="cookies-agreement__accept"
      text="Accept"
      theme="primary_big"
      @click.native="accept"
    />
    <Button
      class="cookies-agreement__decline"
      text="Decline"
      theme="secondary_big"
      @click.native="decline"
    />
  </div>
</template>

<script>
import Button from '../views/exchange/Button';

export default {
  name: 'CookiesAgreement',
  components: {
    Button,
  },
  methods: {
    accept() {
      localStorage.setItem('accepted-cookies', true);
    },
    decline() {
      localStorage.setItem('accepted-cookies', false);
    },
  },
  mounted() {
    if (typeof localStorage.getItem('accepted-cookies') === 'boolean')
      this.$el.destroy();

    this.$store.subscribe(mutation => {
      if (mutation.type === 'preloader/PAGE_IS_LOADING' && !mutation.payload) {
        this.$anime({
          targets: this.$el,
          translateY: [100, 0],
          duration: 300,
          easing: 'easeOutExpo',
          delay: 1000,
        });
      }
    });
  },
};
</script>

<style lang="sass" scoped>
@import "@/scss/_smart-grid"
@import "@/scss/_variables"

.cookies-agreement
  display: grid
  grid-gap: 20px
  padding: 20px 40px
  align-items: center
  justify-content: end
  z-index: 99
  min-height: 50px
  width: calc(100% - 80px)
  position: absolute
  bottom: 0
  left: 0
  background-color: $blue

  @include to(30rem)
    grid-template-columns: 1fr 150px
    grid-template-rows: 80px 80px
    grid-template-areas: 'offer accept' 'offer decline'
  @include from(30rem)
    grid-template-columns: 1fr 150px 100px
    grid-template-rows: 50px
    grid-template-areas: 'offer accept decline'

  &__offer
    color: white
    display: grid
    text-align: left
    align-content: center
    grid-area: offer

    @include to(50rem)
      font-size: .7rem
    @include from(50rem)
      font-size: 1rem

    a
      color: $light-blue
      grid-area: offer
      display: inline

  &__accept
    grid-area: accept

  &__decline
    grid-area: decline
</style>
