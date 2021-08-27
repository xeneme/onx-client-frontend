<template>
  <article class="advantage">
    <div class="advantage__header">
      <Icon :icon="['advantage__icon', icon]" />
      <h2 class="advantage__title">
        {{ title }}
      </h2>
    </div>
    <div class="advantage__body">
      <p class="advantage__description">{{ description }}</p>
    </div>
  </article>
</template>

<script>
import Icon from '@/components/partial/Icon.vue';

export default {
  name: 'Advantage',
  components: { Icon },
  props: ['title', 'icon', 'description'],
};
</script>

<style lang="sass" scoped>
@import "@/scss/_variables"

.advantage
  display: flex
  flex-direction: column
  margin: 34px 30px
  color: #fff
  max-width: 255px
  visibility: hidden
  border-radius: 15px
  background: transparentize($purple, .7)

  &.visible
    visibility: visible

  &__header
    display: flex
    flex-direction: column
    justify-content: flex-start
    align-items: center
    position: relative
    padding-top: 13px
    margin-top: 20px

    &::after
      content: ""
      width: 40px
      background-color: #3f3
      border-radius: 3px
      height: 6px
      margin: 15px 0

  &__title
    font-size: 20px
    font-weight: normal
    text-transform: capitalize

  &__icon
    position: absolute
    top: -60px

  &__body
    padding: 0 34px 25px 34px
    overflow: hidden

  &__description
    font-size: 16px
</style>
