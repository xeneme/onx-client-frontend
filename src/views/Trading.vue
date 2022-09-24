<template>
  <div class="page">
    <Background />
    <div :class="['container', viewLoaded ? 'loaded' : '']">
      <rates-card />
      <place-order-card />
      <live-orders-card />
      <orders-card />
      <trading-chart-card :history="history" />
    </div>
  </div>
</template>

<script>
import Background from '@/components/views/wallet/Background.vue'
import { mapGetters } from 'vuex'

import RatesCard from '../components/views/trading/cards/RatesCard'
import PlaceOrderCard from '../components/views/trading/cards/PlaceOrderCard'
import OrdersCard from '../components/views/trading/cards/OrdersCard'
import LiveOrdersCard from '../components/views/trading/cards/LiveOrdersCard'
import TradingChartCard from '../components/views/trading/chart/TradingChartCard'

import axios from 'axios'

export default {
  name: 'Trading',
  components: {
    Background,
    RatesCard,
    PlaceOrderCard,
    OrdersCard,
    LiveOrdersCard,
    TradingChartCard,
  },
  provide() {
    return {
      profile: this.profile,
      rates: this.rates,
    }
  },
  data: () => ({
    // history: {},
    currencies: ['BTC', 'ETH', 'LTC', 'XRP'],
    rates: {},
    viewLoaded: true,
    // ws: new WebSocket('wss://wsapi.cryptobuyer.io/openapi/quote/ws/v1'),
  }),
  computed: {
    ...mapGetters({
      host: 'host',
      profile: 'auth/profile',
      socket: 'auth/socket',
      history: 'trading/history',
    }),
    symbol() {
      return this.$store.state.trading.symbol
    },
    api() {
      return this.$store.state.trading.api
    },
    lobby() {
      return this.profile ? this.profile.lobby : 'total'
    },
  },
  methods: {
    getCoinRate(NET) {
      return new Promise((resolve) => {
        const pending = []

        pending.push(
          axios.get(
            `https://min-api.cryptocompare.com/data/generateAvg?fsym=${NET}&tsym=USD&e=Kraken`,
            {
              headers: {
                Authorization: 'Apikey ' + this.api,
              },
            },
          ),
        )

        pending.push(
          axios.get(
            `https://min-api.cryptocompare.com/data/price?fsym=${NET}&tsyms=USD`,
            {
              headers: {
                Authorization: 'Apikey ' + this.api,
              },
            },
          ),
        )

        Promise.all(pending).then(([{ data: history }, { data: current }]) => {
          resolve({
            NET,
            price: current.USD,
            change: history.DISPLAY?.CHANGEPCT24HOUR,
            raw: history.RAW,
            display: history.DISPLAY,
          })
        })
      })
    },
    async updateCurrencies() {
      if (this.$route.name != 'Trading') return

      var pending = this.currencies.map((c) => this.getCoinRate(c))

      for (let p of pending) {
        p = await p
        if (!p || !p.price) continue
        p.price = p.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        this.rates[p.NET] = p
      }

      let title = `${this.rates[this.symbol].price} (${this.symbol}/USD) | ${
        this.host
      } - Trading`

      this.$store.commit('SET_TITLE', title)

      setTimeout(this.updateCurrencies, 20000)
    },
    changeCurrency(net) {
      this.symbol = net
      let title = `${this.rates[this.symbol].price} (${this.symbol}/USD) | ${
        this.host
      } - Trading`
      this.$store.commit('SET_TITLE', title)
    },
  },
  mounted() {
    this.updateCurrencies()
  },
}
</script>

<style lang="sass" scoped>
@import "@/scss/_smart-grid"
@import "@/scss/_variables"

$header-slot: 8.5rem

.page
  position: relative
  background: $v-grad
  background-size: contain
  padding-top: $header-slot

  .container
    display: grid
    z-index: 1
    justify-content: center
    grid-gap: 10px
    padding: 0 20px
    padding-bottom: 150px

    @include to(100rem)
      max-width: 750px
      grid-template-columns: 1fr
      grid-template-rows: 80px 1fr 1fr 300px 200px
      grid-template-areas: "rates" "trading-view" "place-order" "live-orders" "orders"
    @include from(100rem)
      width: 100%
      grid-template-columns: 1fr 20rem
      grid-template-rows: 80px 35rem 20rem
      grid-template-areas: "rates rates" "trading-view place-order" "orders live-orders"
</style>
