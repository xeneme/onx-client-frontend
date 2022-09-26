<template>
  <footer class="footer">
    <div class="container">
      <div class="footer__wrap">
        <div class="footer__logo">
          <Logo theme="dark" />
          <p class="footer__logo-text">
            Safety. Efficiency. Quality.
          </p>
        </div>
        <Menu />
        <Contact />
        <small class="footer__copyright">
          © {{ new Date().getFullYear() }} {{ host }}
        </small>
      </div>
    </div>
  </footer>
</template>

<script>
import Logo from '../header/Logo.vue'
import Menu from './Menu.vue'
import Contact from './Contact.vue'

export default {
  name: 'Footer',
  components: { Logo, Menu, Contact },
  computed: {
    host() {
      return this.$store.getters.host
    },
  },
}
</script>

<style lang="sass" scoped>
@import "@/scss/_smart-grid"

.footer
  position: relative
  z-index: 1
  background: 0px -50px / 1147.7px 667px no-repeat url("../../assets/svg/footer/building.svg")

  @include xs-block
    background-position: center bottom
    background-size: 500px
  @include sm-block
    background-position: center bottom
    background-size: 600px
  @include md-block
    background-size: 800px
    background-position: 0px bottom
  @include lg-block
    background-size: calc(333px + 45%)
    background-position: 0px bottom

  background-color:  #000048
  padding: 89px 0 100px 0

  @include to(30rem)
    padding: 0
    background-position: center bottom
    background-size: 500px

  &__wrap
    display: grid
    grid-gap: 30px
    grid-template-rows: auto
    padding-bottom: 220px
    padding-top: 30px

    @include xs-block
      margin: 0 5px
      grid-template-columns: 1fr 1fr 1fr
      grid-template-areas: ". logo ." "menu contact contact" "menu copyright copyright"
    @include sm-block
      margin: 0 10px
      grid-template-columns: 1fr 1fr 1fr
      grid-template-areas: ". logo ." "menu . contact" "menu . copyright"
    @include md-block
      margin: 0 50px
      grid-template-columns: 4fr 1fr 1fr
      grid-template-areas: "logo menu contact" "logo menu copyright"
    @include lg-block
      margin: 0 50px
      grid-template-columns: 4fr 1fr 1fr
      grid-template-areas: "logo menu contact" ". . copyright"

      
    @include from(30rem)
      margin: 0 50px
      grid-template-columns: 4fr 1fr 1fr
      grid-template-areas: "logo menu contact" ". . copyright"
    @include to(30rem)
      margin: 0 7px
      grid-template-columns: 1fr 1fr 1fr
      grid-template-areas: "logo" "menu" "contact" "copyright"


  &__logo
    grid-area: logo
    max-width: 160px
    text-align: left
    @include xs-block
      margin-left: 10%
      text-align: center
    @include lg-block
      margin-left: 0

    &-text
      color: #9F9FFF
      font-size: 12px
      font-family: Montserrat

  .menu-footer
    grid-area: menu

  .footer-contact
    grid-area: contact

  &__copyright
    grid-area: copyright
    display: block
    color: #3434A1
    text-align: left

    @include xs-block
      margin: 0 0 100px 0
    @include sm-block
      margin: 0 0 100px 0
    @include md-block
      margin: 0 0 0 0
    @include lg-block
      margin: 233px 0 0 0
</style>
