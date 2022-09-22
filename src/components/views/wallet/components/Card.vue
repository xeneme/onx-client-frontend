<template>
  <div :class="['trade-card', visible ? 'visible' : '']">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'trade-card',
  props: {
    visible: {
      type: Boolean,
      default: true,
    },
  },
  data: () => ({
    mx: 0,
    my: 0,
  }),
  watch: {
    visible(v) {
      if (v) {
        this.$el.style.display = 'block'
      } else {
        setTimeout(() => {
          if (v) this.$el.style.display = 'none'
        }, 300)
      }
    },
  },
}
</script>

<style lang="scss">
.divider {
  height: 5px;
}

.trade-card {
  box-shadow: inset 0 0px 10px $cyan;
  border-radius: 5px;
  background: #0075ff22;
  border: 1px solid $cyan;
  padding: 10px;
  overflow: hidden;
  position: relative;

  display: none;
  transition: all 0.3s;
  opacity: 0;
  transform: scale(0.7);

  &.visible {
    opacity: 1;
    transform: scale(1);
  }

  * {
    z-index: 5;
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 10px 20px;
    color: $light-blue;

    h4 {
      text-align: left;
      letter-spacing: 0.05rem;
      font-family: Montserrat;
    }

    .options {
      display: flex;
      align-items: center;
      width: 20px;
      height: 30px;
      cursor: pointer;

      &:hover * {
        color: white;
      }
    }
  }
}
</style>
