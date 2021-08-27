<template>
  <div
    class="rates"
    v-waypoint="{
      active: true,
      callback: onWaypoint,
      options: optionsWaypoint,
    }"
  >
    <div class="container hide">
      <div class="rates__wrap">
        <div class="tradingview-widget-container">
          <VueTradingView
            :options="{
              width: '100%',
              height: 610,
              symbol: 'XBT',
              interval: '20',
              timezone: 'Etc/UTC',
              theme: 'Dark',
              style: '2',
              locale: 'en',
              toolbar_bg: '#f1f3f6',
              enable_publishing: false,
              withdateranges: true,
              studies: ['MAVolumeWeighted@tv-basicstudies'],
            }"
          />
        </div>
      </div>
      <div class="rates__description">
        <p class="rates__description-text">
          {{ host }} is a trusted platform for trading Bitcoins. The exchange
          provides fast order execution, low spread, and access to high
          liquidity o rderbook for top currency pairs on the market.
        </p>
        <p class="rates__description-text">
          Cross-platform trading is realised via website, mobile app, and
          several API solutions. Safety of assets and data are backed by high
          security standards and advanced legal compliance.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import VueTradingView from 'vue-trading-view'

export default {
  name: 'Rates',
  components: { VueTradingView },
  data() {
    return {
      optionsWaypoint: {
        root: null,
        rootMargin: '0px 0px 0px 0px',
        threshold: [0.4, 1],
      },
      isShow: false,
    }
  },
  computed: {
    host() {
      return this.$store.getters.host
    },
  },
  methods: {
    onWaypoint({ going }) {
      if (going === this.$waypointMap.GOING_IN) {
        const rates = document.querySelector('.rates .container')
        rates.classList.remove('hide')
        rates.classList.add('animated', 'fadeInLeft', 'show')
      }
    },
  },
}
</script>

<style lang="sass" scoped>
@import "@/scss/_smart-grid"

.hide
  opacity: 0

.show
  opacity: 1

.rates
  padding: 180px 0 130px 0
  @include md-block
    height: auto
  @include lg-block
    height: 100vh
    padding: 180px 0 0 0
  position: relative
  background: linear-gradient(180deg, #000023 0%, rgba(0,20,85,1) 100%)

  .container
    display: flex
    flex-direction: column
    justify-content: center
    height: calc(100% - 150px)

  &__wrap
    display: flex
    flex-direction: column
    box-shadow: 0 8px 89px rgba(0, 0, 0, .3)
    width: 100%
    max-width: 920px
    margin: 0 auto

  &__description
    max-width: 940px
    margin: 55px auto 0 auto
    color: #9995FF
    font-size: 18px

.rates_trading_view
  min-height: 610px
</style>
