<template>
  <section class="footer-contact">
    <h2 class="footer-contact__title">
      Contact
    </h2>
    <ul class="footer-contact__list">
      <li class="footer-contact__item">
        Email:
        <a :href="`mailto:support@${host}`">support@{{ host }}</a>
      </li>
    </ul>
  </section>
</template>

<script>
export default {
  name: 'Contact',
  computed: {
    host() {
      return window.location.host
    },
  },
}
</script>

<style lang="sass" scoped>
@import "@/scss/_smart-grid"

.footer-contact
  text-align: left
  width: 230px
  @include xs-block
    margin: 34px auto 0 auto
  @include lg-block
    margin-top: 0

  &__title
    font-size: 16px
    margin-bottom: 20px
    color: rgba(50, 100, 255, 0.7)

  &__list
    list-style: none
    padding: 0
    color: #3434A1

  a
    color: #3434A1
    text-decoration: none
    margin-left: 10px

    &:hover
      color: #7474f1


  &__item
    height: 34px
    display: flex
    align-items: center
</style>
