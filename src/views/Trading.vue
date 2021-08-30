<template>
  <div class="page">
    <Background />
    <div :class="['container', viewLoaded ? 'loaded' : '']">
      <rates-card />
      <place-order-card />
      <live-orders-card :orders="orders" />
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
import TradingChartCard from '../components/views/trading/cards/TradingChartCard'

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
    orders: {},
    history: {},
    currency: 'BTC',
    currencies: ['BTC', 'ETH', 'LTC', 'LINK', 'DOT', 'XRP'],
    rates: {},
    viewLoaded: true,
    ws: new WebSocket('wss://wsapi.cryptobuyer.io/openapi/quote/ws/v1'),
  }),
  computed: {
    ...mapGetters({
      host: 'host',
      profile: 'auth/profile',
      socket: 'auth/socket',
    }),
    lobby() {
      return this.profile ? this.profile.lobby : 'total'
    },
  },
  methods: {
    getCoinRate(NET) {
      return new Promise(resolve => {
        const pending = []

        pending.push(
          axios.get(
            `https://min-api.cryptocompare.com/data/generateAvg?fsym=${NET}&tsym=USD&e=Kraken`,
          ),
        )

        pending.push(
          axios.get(
            `https://min-api.cryptocompare.com/data/price?fsym=${NET}&tsyms=USD`,
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

      var pending = this.currencies.map(c => this.getCoinRate(c))

      for await (let p of pending) {
        if (!p || !p.price) continue
        p.price = p.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        this.rates[p.NET] = p
      }

      let title = `${this.rates[this.currency].price} (${
        this.currency
      }/USD) | ${this.host} - Trading`

      this.$store.commit('SET_TITLE', title)

      setTimeout(this.updateCurrencies, 20000)
    },
    changeCurrency(net) {
      this.currency = net
      let title = `${this.rates[this.currency].price} (${
        this.currency
      }/USD) | ${this.host} - Trading`
      this.$store.commit('SET_TITLE', title)
    },
    // for vanila WS
    subscribeTicker() {
      const ws = this.ws
      ws.onopen = () => {
        ws.send(
          JSON.stringify({
            symbol: 'BTCUSDT',
            topic: 'realtimes',
            event: 'sub',
            interval: '1m',
            params: {
              binary: false,
            },
          }),
        )
      }

      const t = this

      ws.onmessage = function(msg) {
        t.history = {
          BTC: {
            '1h': [
              [+new Date() - 30000 * 1000, +JSON.parse(msg.data).data[0]],
              [+new Date() - 60000 * 1000, 20000],
              [+new Date() - 60000 * 2 * 1000, 13000],
              [+new Date() - 60000 * 3 * 1000, 20000],
              [+new Date() - 60000 * 4 * 1000, 10000],
            ],
          },
        }
      }
    },
  },
  mounted() {
    this.updateCurrencies()

    this.$root.$on('change-currency', this.changeCurrency)

    this.socket.on('update-orders', orders => {
      this.orders = orders
    })

    this.socket.on('update-history', data => {
      if (this.lobby == data.lobby) {
        this.$store.dispatch('preloader/startAfterLoading')
        this.history = data.history
      }
    })

    // this.$store.dispatch('preloader/startAfterLoading') // for vanila WS
    // this.subscribeTicker()
  },
  destroyed() {
    this.$root.$off('change-currency', this.changeCurrency)
  },
}
</script>

<style lang="sass" scoped>
@import "@/scss/_smart-grid"
@import "@/scss/_variables"

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
      width: 98%
      grid-template-columns: 1fr 440px
      grid-template-rows: 80px 1fr 400px
      grid-template-areas: "rates rates" "trading-view place-order" "orders live-orders"
</style>
