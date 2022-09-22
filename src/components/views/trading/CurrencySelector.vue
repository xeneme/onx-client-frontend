<template>
  <div class="currency-selector">
    <div
      @click="toggleDropdown"
      :class="['currency-selector__current', ['', 'active'][+dropdown]]"
    >
      <Icon :icon="['currency__icon', current]" />
    </div>
    <div
      ref="dd"
      :class="['currency-selector__dropdown', dropdown ? 'active' : '']"
    >
      <div
        v-for="(currency, i) in currencies"
        :key="i"
        @click="selectCurrency(currency)"
        class="currency-selector__dropdown__coin"
      >
        {{ currency.capitalize() }}
      </div>
    </div>
  </div>
</template>

<script>
import Icon from '@/components/partial/Icon.vue'

export default {
  name: 'currency-selector',
  components: { Icon },
  data: () => ({
    current: 'bitcoin',
    dropdown: false,
    currencies: ['bitcoin', 'ethereum', 'litecoin', 'ripple'],
  }),
  watch: {
    dropdown(v) {
      if (v) {
        this.dropdownVisibility(true)
      } else {
        setTimeout(() => {
          this.dropdownVisibility(false)
        }, 400)
      }
    },
    current(v) {
      this.$store.dispatch(
        'trading/setSymbol',
        {
          bitcoin: 'BTC',
          ethereum: 'ETH',
          litecoin: 'LTC',
          ripple: 'XRP',
        }[v],
      )
    },
  },
  methods: {
    toggleDropdown() {
      this.dropdown = !this.dropdown
    },
    selectCurrency(currency) {
      this.current = currency
      this.dropdown = false
    },
    dropdownVisibility(b) {
      this.$refs.dd.style.display = b ? 'block' : 'none'
    },
  },
  mounted() {
    document.addEventListener('mouseup', (e) => {
      if (!e.target.classList.contains('currency-selector__dropdown__coin')) {
        this.dropdown = false
      }
    })
  },
}
</script>

<style lang="scss" scoped>
@keyframes flip {
  from {
    transform: rotateY(0deg);
  }

  to {
    transform: rotateY(360deg);
  }
}

.currency-selector {
  display: flex;
  height: 100%;
  align-items: center;
  position: relative;
  z-index: 10;

  &__current {
    margin-right: 10px;
    width: 50px;
    height: 50px;
    border-radius: 5px;
    background: #0075ff22;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: inset 0 0px 10px $cyan-alpha;
    border: 1px solid transparent;

    &:hover,
    &.active {
      border: 1px solid $cyan;
      box-shadow: inset 0 0px 10px $cyan;
    }

    .currency__icon {
      opacity: 1;
      animation: none;
      transform: rotateY(0deg);
    }

    &:hover {
      border: 1px solid $cyan;
      box-shadow: inset 0 0px 10px $cyan;

      .currency__icon {
        animation: flip 1.5s ease-in-out infinite;
        animation-delay: 0.5s;
      }
    }

    .currency__icon {
      width: 100%;
      height: 100%;
      transition: all 0.3s;
    }
  }

  &__dropdown {
    position: absolute;
    display: none;
    width: 140px;
    top: 60px;
    left: 0;
    transform: scale(0.8);
    opacity: 0;

    transition: all 0.15s ease-in-out;

    &.active {
      transform: scale(1);
      opacity: 1;
    }

    &__coin {
      text-align: left;
      color: $cyan;
      padding: 2px;
      cursor: pointer;
      user-select: none;

      box-shadow: inset 0 0px 10px $cyan-alpha;
      border-radius: 3px;
      background: $blue;
      border: 1px solid transparent;
      padding: 5px 10px;
      transition: all 0.25s;

      &:hover {
        transition: none;
        box-shadow: inset 0 0px 10px $cyan;
        border: 1px solid $cyan;
        color: white;
      }
    }
  }
}
</style>
