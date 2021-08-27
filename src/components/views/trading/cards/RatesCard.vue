<template>
  <card class="rates-order">
    <currency-selector />
    <div class="divider"></div>
    <price-block :main="price" :secondary="price + '$'" />
    <price-block :main="change24" secondary="24h Change" flip />
    <price-block class="on-half-width" :main="high" secondary="24h High" flip />
    <price-block class="on-half-width" :main="low" secondary="24h Low" flip />
    <price-block class="on-half-width" :main="coinVolume" secondary=" 24h Volume (BTC)" flip />
    <price-block class="on-half-width" :main="usdVolume" secondary=" 24h Volume (USD)" flip />
  </card>
</template>

<script>
import Card from '../Card'
import CurrencySelector from '../CurrencySelector'
import PriceBlock from '../PriceBlock'

export default {
  name: 'rates-order',
  inject: ['rates'],
  components: { Card, CurrencySelector, PriceBlock },
  data: () => ({
    currency: '',
    reactiveRates: {},
  }),
  computed: {
    ratesLoaded() {
      return !!this.reactiveRates[this.currency]
    },
    price() {
      return this.ratesLoaded ? this.reactiveRates[this.currency].price : '0.00'
    },
    change24() {
      return this.ratesLoaded ? this.reactiveRates[this.currency].change : '0.00'
    },
    high() {
      return this.ratesLoaded
        ? this.reactiveRates[this.currency].display.HIGH24HOUR
        : '0.00'
    },
    low() {
      return this.ratesLoaded
        ? this.reactiveRates[this.currency].display.LOW24HOUR
        : '0.00'
    },
    coinVolume() {
      return this.ratesLoaded
        ? this.reactiveRates[this.currency].raw.VOLUME24HOUR.toFixed(2)
        : '0.00'
    },
    usdVolume() {
      return this.ratesLoaded
        ? this.reactiveRates[this.currency].raw.VOLUME24HOURTO.toFixed(2)
        : '0.00'
    },
  },
  methods: {
    changeCurrency(net) {
      this.currency = net
    },
    updateRates() {
      this.reactiveRates = { ...this.rates }
      setTimeout(this.updateRates, 1000)
    },
  },
  mounted() {
    this.updateRates()
    this.$root.$on('change-currency', this.changeCurrency)
  },
  destroyed() {
    this.$root.$off('change-currency', this.changeCurrency)
  },
}
</script>

<style lang="scss" scoped>
@import "@/scss/_smart-grid";
@import "@/scss/_variables";

.rates-order {
  grid-area: rates;
  display: flex;
  // overflow: hidden;

  .divider {
    height: 100%;
    border-left: 1px solid $cyan-alpha;
  }

  .on-half-width {
    @include to(50rem) {
      display: none;
    }
    @include from(50rem) {
      display: flex;
    }
  }

  .on-full-width {
    @include to(100rem) {
      display: none;
    }
    @include from(100rem) {
      display: flex;
    }
  }
}
</style>
