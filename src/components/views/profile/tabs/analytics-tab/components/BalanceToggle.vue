<template
  ><div
    class="portfolio-tab__balance-toggle holo-panel--interactive holo-panel"
    :class="{ 'holo-panel--danger': active }"
    :style="{ opacity: disabled ? 0.8 : 1 }"
    @click="selectCurrency"
  >
    <div class="holo-panel__header">
      <fa class="holo-panel__icon" icon="credit-card" />
      <span class="holo-panel__title">{{ currency }}</span>
      <span class="balance">{{ balance }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    currency: String,
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    profile() {
      return this.$store.state.auth.profile
    },
    balance() {
      return this.profile.wallets[this.currency].balance.toString().substr(0, 8)
    },
    active() {
      return this.$store.state.profile.analyticsCurrency != this.currency
    }
  },
  methods: {
    selectCurrency() {
      this.$store.commit('profile/SET_ANALYTICS_CURRENCY', this.currency)
    },
  },
}
</script>

<style lang="scss">
.portfolio-tab__balance-toggle {
  position: relative;
  height: 40px;

  .holo-panel__title {
    text-transform: capitalize;
  }

  .balance {
    right: 20px;
    position: absolute;
  }
}
</style>
