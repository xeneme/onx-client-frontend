<template>
  <router-link v-bind="$attrs" :class="['link', theme || 'default']">
    <div class="comet"></div>
    <div class="edges">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
    <p>{{ text || 'Text' }}</p>
  </router-link>
</template>

<script>
export default {
  name: 'NeonLink',
  data() {
    return {
      base: '#',
    }
  },
  props: ['text', 'theme'],
}
</script>

<style lang="sass" scoped>
@import "@/scss/_smart-grid"

$primary: #2196f3
$secondary: #125a94
$speed: 1
$comet-r: 8
$edge-width: 1

*
    margin: 0
    padding: 0
    box-sizing: border-box

.link
    z-index: 100
    position: relative
    display: flex
    justify-content: center
    align-items: center
    color: $primary
    font-family: 'Montserrat'
    font-weight: 500
    outline: none
    letter-spacing: .08rem
    text-transform: uppercase
    text-decoration: none
    pointer-events: all
    transition: box-shadow #{$speed * .2}s, background #{$speed * .2}s, color #{$speed * .2}s

    display: block

    @include to(78rem)
      display: none
    @include from(78rem)
      display: block

    @include lg-block
        min-width: 7rem
        min-height: 2rem
        font-size: .8rem

    p
        padding-top: 10px

    .edges
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        overflow: hidden

        span
            position: absolute
            display: block

        span:nth-child(1) // upper edge
            top: 0
            left: -100%
            width: 100%
            height: #{$edge-width}px
            background: linear-gradient(90deg, transparent, $primary)

        span:nth-child(2) // bottom edge
            bottom: 0
            right: -100%
            width: 100%
            height: #{$edge-width}px
            background: linear-gradient(-90deg, transparent, $primary)

        span:nth-child(3) // right edge
            top: -100%
            right: 0
            width: #{$edge-width}px
            height: 100%
            background: linear-gradient(-180deg, transparent, $primary)

        span:nth-child(4) // left edge
            top: 100%
            left: 0
            width: #{$edge-width}px
            height: 100%
            background: linear-gradient(0deg, transparent, $primary)

    .comet
        position: absolute
        z-index: 2
        width: #{$comet-r}px
        height: #{$comet-r}px
        opacity: 0
        content: ""
        border-radius: 100%
        background: linear-gradient(-90deg, $secondary, $primary)

.link:hover
    &.default
        color: white
        background-color: $primary

    &.light
        background-color: white

    box-shadow: 0 0 5px $primary, 0 0 20px $primary, 0 0 40px $primary
    color: darken($primary, 30)
    transition-delay: #{$speed}s

    span:nth-child(1)
        left: 100%
        transition: #{$speed/2}s linear

    span:nth-child(2)
        right: 100%
        transition: #{$speed/2}s linear
        transition-delay: #{$speed * .5}s

    span:nth-child(3)
        top: 100%
        transition: #{$speed/2}s linear
        transition-delay: #{$speed * .25}s

    span:nth-child(4)
        top: -100%
        transition: #{$speed/2}s linear
        transition-delay: #{$speed * .75}s

    .comet
        animation: fly-around #{$speed}s
        animation-timing-function: linear


@keyframes fly-around
    0%
        left: #{-$comet-r/2}px
        top: #{-$comet-r/2}px
        opacity: 1

    25%
        left: calc(100% + #{-$comet-r / 2}px)
        top: calc(#{-$comet-r/2}px)

    50%
        left: calc(100% + #{-$comet-r / 2}px)
        top: calc(100% + #{-$comet-r/2}px)

    75%
        left: #{-$comet-r+4}px
        top: calc(100% + #{-$comet-r/2}px)

    90%
       opacity: 1

    100%
        opacity: 0
        left: #{-$comet-r+4}px
        top: #{-$comet-r}px
</style>
