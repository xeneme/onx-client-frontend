<template>
  <nav class="menu-footer">
    <h2 class="menu-footer__title">
      Menu
    </h2>
    <ul class="menu-footer__list">
      <li class="menu-footer__item">
        <router-link to="/" class="menu-footer__link">
          Main
        </router-link>
      </li>
      <li class="menu-footer__item">
        <router-link to="/wallet" class="menu-footer__link">
          Wallet
        </router-link>
      </li>
      <li class="menu-footer__item">
        <router-link to="/trading" class="menu-footer__link">
          Trading
        </router-link>
      </li>
      <li class="menu-footer__item">
        <router-link to="/contract" class="menu-footer__link">
          Contract
        </router-link>
      </li>
      <li class="menu-footer__item">
        <router-link to="/about" class="menu-footer__link">
          About us
        </router-link>
      </li>
      <li class="menu-footer__item">
        <router-link to="/terms" class="menu-footer__link">
          Terms
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'Menu',
};
</script>

<style lang="sass" scoped>
@import "@/scss/_smart-grid"

.menu-footer
  text-align: left
  padding: 0
  margin: 0
  @include xs-block
    width: 80%
    padding: 21px 0
    margin: 0 auto
  @include lg-block
    width: 160px
    padding: 0

  &__title
    font-size: 16px
    height: 34px
    color: rgba(50, 100, 255, 0.7)

  &__list
    list-style: none
    padding: 0

  &__link
    color: #3434A1
    text-decoration: none
    font-size: 14px
    height: 34px
    display: flex
    align-items: center
    min-width: 100px
    max-width: 100px
    transition: all .2s

    &:hover
      color: #5555ff

    &:focus
      outline: none
</style>
