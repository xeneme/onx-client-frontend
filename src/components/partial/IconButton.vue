<template>
  <div
    class="icon-button"
    :class="{
      disabled,
      ['icon-button--' + theme]: 1,
      ['icon-button--' + size]: 1,
    }"
    @click="handleClick"
  >
    <fa
      class="icon-button__icon"
      :class="{ hide: tempIconShow }"
      :icon="loading ? 'circle-notch' : icon"
      :spin="loading"
    />
    <fa
      class="icon-button__temp-icon"
      v-if="iconOnClick"
      :class="{ hide: !tempIconShow }"
      :icon="iconOnClick"
    />
  </div>
</template>

<script>
export default {
  name: 'IconButton',
  props: {
    icon: String,
    disabled: Boolean,
    theme: {
      type: String,
      default: 'flat',
      validator(s) {
        return ['flat', 'outline'].includes(s)
      },
    },
    size: {
      type: String,
      default: 'md',
      validator(s) {
        return ['xs', 'sm', 'md'].includes(s)
      },
    },
    iconOnClick: {
      type: String,
      default: '',
    },
    loading: Boolean,
  },
  data() {
    return {
      tempIconShow: false,
      tempIconDuration: 1500,
    }
  },
  methods: {
    handleClick(event) {
      if (this.loading) return

      this.$emit('click', {
        event,
      })

      if (this.iconOnClick) this.showIconOnce()
    },
    showIconOnce() {
      const t = this
      if (t.tempIconShow) return
      t.tempIconShow = true
      setTimeout(() => {
        t.tempIconShow = false
      }, t.tempIconDuration)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/scss/_variables';

.icon-button {
  &--md {
    height: 40px;
    width: 40px;
    border-radius: 10px;
  }

  &--sm {
    height: 30px;
    width: 30px;
    border-radius: 10px;
    font-size: 0.9rem;
  }

  &--xs {
    height: 25px;
    width: 25px;
    border-radius: 5px;
    font-size: 0.82rem;
  }

  cursor: pointer;
  display: grid;
  place-items: center;
  user-select: none;
  box-sizing: border-box;

  &__icon,
  &__temp-icon {
    pointer-events: none;
    transition: opacity 0.5s ease, transform 0.3s ease;

    &.hide {
      opacity: 0;
      transform: scale(0);
    }
  }

  &__temp-icon {
    position: absolute;
    color: white;
  }

  &--flat {
    color: $cyan;

    &:hover {
      background-color: #ffffff11;
      color: white;
    }

    &:active {
      background-color: #ffffff55;
      color: white;
    }
  }

  &--outline {
    color: $cyan;
    border: 1px $cyan solid;

    &:hover {
      background-color: $cyan;
      color: white;
    }

    &:active {
      background-color: white;
      color: $cyan;
    }
  }

  &.disabled {
    pointer-events: none;
    opacity: 0.7;
  }
}
</style>
