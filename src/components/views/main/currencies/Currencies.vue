<template>
  <section
    class="currencies bg"
    v-waypoint="{
      active: true,
      callback: onWaypoint,
      options: waypointOptions,
    }"
  >
    <div class="container">
      <ul>
        <Currency
          v-for="coin in listedCoins"
          :title="coin.title"
          :icon="coin.icon"
          :shortTitle="coin.shortTitle"
          :rate="coin.rate"
          :ratePercent="coin.ratePercent"
          :link="'https://coinmarketcap.com/currencies/' + coin.icon"
          :index="coin.id"
          :key="coin.id"
        />
      </ul>
    </div>
    <img
      src="../../../../assets/svg/currencies/tracer2.svg"
      class="bg__comet"
    />
    <img
      src="../../../../assets/svg/currencies/large-comet.svg"
      class="bg__large-comet"
    />
  </section>
</template>

<script>
import Currency from './Currency.vue'
import 'animate.css'

import axios from 'axios'

export default {
  name: 'Currencies',
  components: { Currency },
  data: () => ({
    currentPage: 1,
    waypointOptions: {
      root: null,
      rootMargin: '0px 0px 0px 0px',
      threshold: [0.1, 1],
    },
    coins: [
      {
        id: 1,
        title: 'Bitcoin',
        icon: 'bitcoin',
        shortTitle: 'BTC',
        rate: 0,
        ratePercent: 0,
        page: 0,
      },
      {
        id: 6,
        title: 'Chainlink',
        icon: 'chainlink',
        shortTitle: 'LINK',
        rate: 0,
        ratePercent: 0,
        page: 1,
      },
      {
        id: 2,
        title: 'Ethereum',
        icon: 'ethereum',
        shortTitle: 'ETH',
        rate: 0,
        ratePercent: 0,
        page: 0,
      },
      {
        id: 7,
        title: 'Binance Coin',
        icon: 'binance-coin',
        shortTitle: 'BNB',
        rate: 0,
        ratePercent: 0,
        page: 1,
      },
      {
        id: 3,
        title: 'Tether',
        icon: 'tether',
        shortTitle: 'USDT',
        rate: 0,
        ratePercent: 0,
        page: 0,
      },
      {
        id: 8,
        title: 'Litecoin',
        icon: 'litecoin',
        shortTitle: 'LTC',
        rate: 0,
        ratePercent: 0,
        page: 1,
      },
      {
        id: 4,
        title: 'XRP',
        icon: 'ripple',
        shortTitle: 'XRP',
        rate: 0,
        ratePercent: 0,
        page: 0,
      },
      {
        id: 9,
        title: 'Polkadot',
        icon: 'polkadot',
        shortTitle: 'DOT',
        rate: 0,
        ratePercent: 0,
        page: 1,
      },
      {
        id: 5,
        title: 'Bitcoin Cash',
        icon: 'bitcoin-cash',
        shortTitle: 'BCH',
        rate: 0,
        ratePercent: 0,
        page: 0,
      },
      {
        id: 10,
        title: 'Bitcoin SV',
        icon: 'bitcoin-sv',
        shortTitle: 'BSV',
        rate: 0,
        ratePercent: 0,
        page: 1,
      },
    ],
  }),
  computed: {
    listedCoins() {
      return this.coins.filter(c => c.page == this.currentPage)
    },
  },
  methods: {
    changePage() {
      this.throughFade().then(() => {
        this.currentPage = +!this.currentPage
        setTimeout(this.changePage, 10000)
      })
    },
    throughFade() {
      return new Promise(resolve => {
        var container = this.$el.querySelector('.container')
        container.style.opacity = 0
        setTimeout(() => {
          container.style.opacity = 1
          resolve()
        }, 300)
      })
    },
    async updateCoinsRate() {
      for (let coin of this.coins) {
        var rates = await this.getCoinRate(coin.shortTitle)
        coin.rate = rates.rate ? rates.rate : 0
        coin.ratePercent = rates.ratePercent ? rates.ratePercent : '0'
      }
    },
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
            rate: current.USD,
            ratePercent: history.DISPLAY?.CHANGEPCT24HOUR,
          })
        })
      })
    },
    onWaypoint({ going }) {
      const currencies = document.querySelector('.currencies ul')
      if (going === this.$waypointMap.GOING_IN) {
        currencies.classList.add('animated', 'fadeInUp')
        currencies.style.opacity = 1
      }
    },
  },
  mounted() {
    this.changePage()
    this.updateCoinsRate()
  },
}
</script>

<style lang="sass" scoped>
@import "@/scss/_smart-grid"
@import "@/scss/_variables"

@keyframes go-by-path
  0%
    transform: rotate(0deg)

  100%
    transform: rotate(360deg)


.currencies
  height: 100vh
  display: grid
  align-content: center
  margin: 0

  .container
    transition: opacity .3s

    ul
      list-style: none
      display: flex
      flex-direction: column
      margin: 0 auto
      padding: 29px
      padding-top: 0
      padding-bottom: 80px
      position: relative
      z-index: 1
      opacity: 0

      @include to(30rem)
          padding: 0

.bg
  position: relative
  overflow: hidden
  background: $v-grad
  @include xs-block
    background-position: 50px bottom
  @include md-block
    background-position: 105% bottom

  &__large-comet, &__comet
      pointer-events: none
      user-select: none

  &__large-comet
    position: absolute

    @include xs-block
      width: 140vw
      height: 140vw
    @include sm-block
      width: 150vw
      height: 150vw
    @include md-block
      width: 130vw
      height: 130vw
    @include lg-block
      width: 130vw
      height: 130vw
    left: 0
    top: -110vw
    object-fit: cover
    animation: linear 25s 0s go-by-path infinite

  &__comet
    position: absolute
    z-index: 0
    width: calc(300px + 10vw)
    height: calc(300px + 10vw)
    left: calc(-150px - 5vw)
    bottom: 20%
    object-fit: cover
    animation: linear 15s 0s go-by-path infinite
</style>
