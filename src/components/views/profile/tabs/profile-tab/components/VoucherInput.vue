<template>
  <div class="input-wrap">
    <div
      class="input-wrap__input holo-panel"
      :class="{
        active: focused || value,
        filled: !!value,
        'holo-panel--interactive': !focused,
      }"
    >
      <div class="holo-panel__header">
        <fa class="holo-panel__icon" :icon="icon" />
        <span class="holo-panel__title">{{ text }}</span>
        <input
          type="text"
          ref="input"
          class="input-wrap__input-el"
          v-model="value"
          spellcheck="false"
          @keyup.enter="onInputKeyUp"
          @click="onInputClicked"
        />
        <div :class="{ active: !!value }" class="submit">
          OK
          <!-- <fa class="submit__icon" icon="check" /> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VoucherCode',
  props: ['text', 'icon'],
  data() {
    return {
      focused: false,
      value: '',
      savedValue: '',
    }
  },
  methods: {
    onInputClicked() {
      if (!this.focused) this.value = this.savedValue
      this.focused = true
    },
    onInputKeyUp() {
      this.focused = false
      this.value && this.submit(this.value)
      this.value = ''
      this.savedValue = ''
      this.$refs.input.blur()
    },
    submit(voucher) {
      console.log(voucher)
    },
  },
  mounted() {
    const t = this
    document.addEventListener('click', e => {
      if (!e.target.classList.contains('input-wrap__input-el')) {
        t.focused = false

        if (t.value && e.target.classList.contains('submit')) {
          t.submit(t.value)
        }

        t.savedValue = t.value
        t.value = ''
      }
    })
  },
}
</script>

<style lang="scss" scoped>
@import '@/scss/ui';

.input-wrap {
  display: flex;
  gap: 15px;
  grid-area: voucher;

  &__input {
    width: 100%;
    position: relative;

    &-el {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: transparent;
      color: white;
      text-align: left;
      align-content: center;
      border: none;
      font-size: 1.3rem;
      font-family: Montserrat;
      text-indent: 1rem;
      transition: all 0.23s;
      cursor: pointer;

      &::selection {
        background-color: white;
        color: $cyan;
      }

      &:focus {
        cursor: text;
        background-color: $blue-alpha;
        outline: none;
      }
    }

    .holo-panel__icon,
    .holo-panel__title {
      transition: all 0.3s;
    }

    &.filled .holo-panel__title {
      display: none;
    }

    &.active {
      .holo-panel__title {
        color: $cyan-alpha;
        transform: translateX(-25px);
      }
      .holo-panel__icon {
        transform: translateX(-60px);
      }
    }
  }

  .submit {
    display: none;
    position: absolute;
    right: 5px;
    width: 50px;
    height: 80%;
    display: none;
    font-size: 0.9rem;
    font-weight: 500;
    color: $light-blue;
    cursor: pointer;
    border-radius: 10px;

    &:hover {
      color: white;
      background-color: #ffffff44;
    }

    &.active {
      display: grid;
      align-content: center;
    }
  }
}
</style>
