<template>
  <div class="bg">
    <img src="../../../assets/svg/currencies/tracer2.svg" class="bg__comet" />
    <img
      src="../../../assets/svg/currencies/large-comet.svg"
      class="bg__large-comet"
    />
    <img
      src="../../../assets/svg/exchange/triangle.svg"
      class="bg__triangle1"
    />
    <img
      src="../../../assets/svg/exchange/triangle.svg"
      class="bg__triangle2"
    />
  </div>
</template>

<script>
export default {
  name: 'Background',
}
</script>

<style lang="scss" scoped>
.bg {
  position: absolute;
  z-index: 0;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  overflow: hidden;

  &__triangle1,
  &__triangle2,
  &__large-comet,
  &__comet {
    pointer-events: none;
    user-select: none;
  }
  &__large-comet {
    position: absolute;

    @include xs-block {
      width: 180vw;
      height: 180vw;
      top: -120vw;
      left: 10vw;
    }
    @include sm-block {
      width: 180vw;
      height: 180vw;
      top: -120vw;
      left: 10vw;
    }
    @include md-block {
      width: 100vw;
      height: 100vw;
      top: -70vw;
      left: 20vw;
    }
    @include lg-block {
      width: 100vw;
      height: 100vw;
    }
    @include from(110rem) {
      width: 160vh;
      height: 160vh;
      top: -100vh;
      left: 40vw;
    }
    object-fit: cover;
    animation: linear 25s 0s go-by-path infinite;
  }
  &__comet {
    position: absolute;
    width: calc(300px + 10vw);
    height: calc(300px + 10vw);
    left: calc(-150px - 5vw);
    bottom: 70px;
    object-fit: cover;
    animation: linear 15s 0s go-by-path infinite;

    @include from(110rem) {
      width: 50vh;
      height: 50vh;
      top: 30vh;
      left: 10vw;
    }
  }
  &__triangle1,
  &__triangle2 {
    position: absolute;
    opacity: 0.46;

    @include xs-block {
      left: 50vw;
      top: 42vh;
    }
    @include sm-block {
      left: 50vw;
      top: 58vh;
    }
  }
  &__triangle1 {
    @include xs-block {
      width: 200px;
      height: 200px;
    }
    @include sm-block {
      width: 200px;
      height: 200px;
    }
    @include md-block {
      width: 300px;
      height: 300px;
    }
    @include lg-block {
      width: 300px;
      height: 300px;
    }
  }
  &__triangle2 {
    @include xs-block {
      width: 133.3px;
      height: 133.3px;
    }
    @include sm-block {
      width: 133.3px;
      height: 133.3px;
    }
    @include md-block {
      width: 180px;
      height: 180px;
    }
    @include lg-block {
      width: 180px;
      height: 180px;
    }
  }
}
@keyframes go-by-path {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
