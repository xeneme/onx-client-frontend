<template>
  <li class="currency">
    <h2 class="currency__index">{{ index }}</h2>
    <Icon :icon="['currency__icon', icon]" />
    <h2 class="currency__title">{{ title }}</h2>
    <h3 class="currency__subtitle">{{ shortTitle }}</h3>
    <span class="currency__rate">${{ rate }}</span>
    <span
      :class="['currency__rate-percent', +ratePercent > 0 ? 'green' : +ratePercent < 0 ? 'red' : '']"
      >{{ ratePercent }}%</span
    >
    <a :href="link" target="_blank" class="currency__link">
      <Icon icon="charts" />
    </a>
  </li>
</template>

<script>
import Icon from '@/components/partial/Icon.vue'

export default {
  name: 'Currency',
  components: { Icon },
  props: [
    'title',
    'shortTitle',
    'link',
    'icon',
    'rate',
    'ratePercent',
    'index',
  ],
  mounted() {},
}
</script>

<style lang="sass" scoped>
@import "@/scss/_smart-grid"
@import "@/scss/_variables"

.currency
  display: grid
  grid-gap: 10px
  grid-template-columns: 1fr 5fr 4fr 4fr 1fr 1fr
  grid-template-rows: auto
  grid-template-areas: "icon title subtitle rate rate-percent charts"

  color: #fff
  padding-bottom: 18px
  font-weight: bold
  width: 100%

  @include xs-block
    grid-template-columns: 4fr 1fr 1fr
    grid-template-areas: "title . subtitle" "rate rate-percent charts"
    border-bottom: 1px rgba(0, 50, 120, 1) solid
  @include sm-block
    grid-template-columns: 4fr 1fr 1fr
    grid-template-areas: "title . subtitle" "rate rate-percent charts"
    border-bottom: 1px rgba(0, 50, 120, 1) solid
  @include md-block
    grid-template-columns: 1fr 5rem 5fr 4fr 4fr 1fr 1fr
    grid-template-areas: "index title subtitle rate rate-percent charts"
    border-bottom: none
  @include lg-block
    grid-template-columns: .5fr 1fr 4fr 4fr 4fr 1fr 3fr
    grid-template-areas: "index icon title subtitle rate rate-percent charts"
    border-bottom: none
  @include to(30rem)
    grid-template-columns: 1fr 5fr 4fr 4fr
    grid-template-areas: "icon title subtitle rate"
    border-bottom: none

  &__icon, &__title, &__subtitle, &__rate, &__rate-percent, &__link
    place-self: center stretch

  &__title, &__subtitle, &__rate-percent
    color: white

  &__icon
    grid-column: 1
    grid-area: icon
    @include xs(display, none)
    @include sm(display, none)
    @include md(display, none)
    @include lg(display, flex)

  &:last-child
    margin-bottom: 0

  &__index
    height: 100%
    width: 100%
    text-align: center
    align-content: center
    font-size: .9rem
    opacity: .5
    color: $cyan
    grid-area: index
    display: none
    @include xs(display, none)
    @include sm(display, none)
    @include md(display, grid)
    @include lg(display, grid)
    
  &__title
    grid-column: 2
    grid-area: title
    text-align: left

  &__subtitle
    grid-column: 4
    grid-area: subtitle
    opacity: .7
    color: $cyan
    @include to(20rem)
      display: none

  &__title, &__subtitle
    @include xs(font-size, 20px)
    @include sm(font-size, 25px)
    @include md(font-size, 15px)
    @include lg(font-size, 18px)
    @include to(30rem)
      font-size: .9rem

  &__rate
    grid-column: 5
    grid-area: rate

    @include xs-block
      text-align: left
      color: #00FF88
    @include sm-block
      text-align: left
      color: #00FF88
    @include md-block
      text-align: center
      color: white
    @include lg-block
      text-align: center
      color: white
    @include to(30rem)
      font-size: .8rem

  &__subtitle, &__rate
    text-transform: uppercase

  &__rate-percent
    grid-column: 6
    grid-area: rate-percent
    width: 100px
    @include to(30rem)
      display: none

    &.green
      color: #22ff99
    &.red
      color: #ff2277

  &__link
    grid-column: 7
    grid-area: charts
    @include to(30rem)
      display: none

  &__link:hover
    opacity: .7
</style>
