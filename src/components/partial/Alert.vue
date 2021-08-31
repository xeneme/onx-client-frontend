<template>
  <div
    :class="['alert', 'alert--' + alert.type, alert.type]"
    @click="openSupport"
  >
    <div ref="title" class="alert__title">
      <fa :icon="icon" class="alert__title__icon" v-if="icon" />
      <h3>{{ alert.title }}</h3>

      <i-button
        icon="times"
        size="sm"
        @click="close"
        class="alert__title__close"
      />
    </div>
    <div class="alert__message">{{ alert.message }}</div>
  </div>
</template>

<script>
import IButton from './IconButton.vue'

export default {
  components: {
    IButton,
  },
  props: ['alert'],
  computed: {
    lifetime() {
      return this.$store.state.popups.lifetime
    },
    icon() {
      const iconset = {
        message: 'envelope',
        error: 'exclamation-triangle',
        warning: 'exclamation',
        info: 'info-circle',
      }

      return iconset[this.alert.type]
    },
  },
  methods: {
    initDestroyer() {
      var initialTimeout = setTimeout(() => {
        this.close()
      }, this.lifetime + this.alert.message.length * 30)

      var timeoutOnHover = null

      this.$el.onmouseover = () => {
        clearTimeout(initialTimeout)
      }

      this.$el.onmouseleave = () => {
        if (!timeoutOnHover) {
          timeoutOnHover = setTimeout(() => {
            this.close()
          }, this.lifetime / 5)
        }
      }
    },
    close() {
      this.$store.commit('popups/RM_ALERT', this.alert)
      if (this.alert.type != 'message') return
      this.$store.commit('popups/SUPPORT', false)
    },
    openSupport() {
      if (this.alert.type != 'message') return
      this.$store.commit('popups/SUPPORT', true)
      this.close()
    },
  },
  mounted() {
    this.initDestroyer()
  },
}
</script>

<style lang="scss" scoped>
@import '@/scss/_smart-grid';
@import '@/scss/_variables';

* {
  padding: 0;
  margin: 0;
}

.page {
  overflow-x: hidden;
}

@keyframes appearance {
  from {
    filter: brightness(1000%);
  }
  to {
    filter: brightness(100%);
  }
}

.alert {
  width: 365px;
  min-height: 50px;
  border-radius: 8px;
  background-color: #000f5d;
  color: white;
  padding: 15px;
  text-align: left;
  font-size: 0.9em;
  animation: appearance 0.5s 0s ease-out;
  pointer-events: all;
  cursor: default;
  user-select: none;
  overflow: hidden;
  position: relative;

  @include to(30rem) {
    width: calc(100% - 30px);
    border-radius: 0px;
    margin: 0;
    box-shadow: 0 -10px 30px darken($blue-alpha, 10);
    border: 0;
  }

  @include from(30rem) {
    width: 365px;
    border-radius: 8px;
    margin-top: 20px;
    border: 2px solid #102074;
  }

  &__title {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    gap: 8px;
    max-height: 30px;

    &__icon {
      opacity: 0.5;
      margin-left: 5px;
      transform: scale(1.3);
      height: calc(100% - 15px);
    }
    &__default {
      opacity: 0.5;
      margin-left: 5px;
      transform: scale(1.3);
      height: calc(100% - 15px);
    }
    &__close {
      position: absolute;
      z-index: 10;
      right: 7px;
      top: 7px;
      color: white;
      opacity: 0.7;

      &:hover {
        opacity: 1;
      }
    }
    h3 {
      letter-spacing: 0.03em;
    }
  }
  &__message {
    font-size: 0.9rem;
    letter-spacing: 0.03em;
    text-indent: 5px;
    opacity: 0.6;
    text-overflow: fade;
    max-height: 200px;
  }
  &--error {
    background-color: #303030;
    border-color: #5a5a5a;
  }
  &--warning {
    border-color: #ffd231;
    background-color: #c19700;
  }
  &--message {
    border-color: #627af6;
    background-color: #3352f688;
    cursor: pointer;

    &:hover {
      background-color: #3352f6aa;
    }
  }
  &--info {
    border-color: #627af6;
    background-color: #3352f6;
  }
}
</style>
