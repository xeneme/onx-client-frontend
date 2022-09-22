<template>
  <div class="exchange-spinner">
    <div :class="['exchange-spinner-loaded', loading || 'done']">
      <fa
        :icon="!error ? 'check' : 'times'"
        class="exchange-spinner-loaded-itself"
      />
    </div>
    <svg
      :class="['exchange-spinner-itself', loading || 'done']"
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="50" cy="50" r="45" />
    </svg>
  </div>
</template>

<script>
export default {
  name: 'auth-spinner',
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    error: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    setTimeout(() => {
      this.$el.style.opacity = 1
    }, 3000)
  },
}
</script>

<style lang="scss" stroke>
.exchange-spinner {
  opacity: 0;
  position: fixed;
  bottom: 0;
  margin: 40px;
  left: 0;
  z-index: 10;
  width: 50px;
  height: 50px;

  &-loaded {
    transform: scale(0);
    position: absolute;
    z-index: 9;
    top: 0;
    left: 0;
    border-radius: 100%;
    width: 100%;
    height: 100%;
    background-color: $cyan;
    display: grid;
    align-items: center;
    justify-content: center;

    &-itself {
      color: white;
    }
  }

  &-loaded.done {
    animation: 2s ease-in-out done;
    animation-fill-mode: forwards;
  }

  &-itself {
    animation: 0.8s linear infinite svg-animation;
    transition: all 0.4s;

    circle {
      animation: 3s ease-in-out infinite both circle-animation;
      display: block;
      fill: transparent;
      stroke: $cyan;
      stroke-linecap: round;
      stroke-dasharray: 283;
      stroke-dashoffset: 280;
      stroke-width: 7px;
      transform-origin: 50% 50%;
    }
  }

  &-itself.done {
    opacity: 0;
  }
}

@keyframes done {
  0% {
    transform: scale(0);
  }

  10% {
    transform: scale(1);
  }

  90% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
}

@keyframes svg-animation {
  0% {
    transform: rotateZ(0deg);
  }
  100% {
    transform: rotateZ(360deg);
  }
}

@keyframes circle-animation {
  0%,
  25% {
    stroke-dashoffset: 280;
    transform: rotate(0);
  }

  50%,
  75% {
    stroke-dashoffset: 75;
    transform: rotate(45deg);
  }

  100% {
    stroke-dashoffset: 280;
    transform: rotate(360deg);
  }
}
</style>
