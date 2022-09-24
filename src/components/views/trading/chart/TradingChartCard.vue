<template>
  <card class="trading-chart-card">
    <div ref="pulse" class="pulse-line animated"></div>
    <div id="cryptoview-container" ref="container"></div>
    <trading-chart-toolbar
      v-if="chart"
      :auto-scale="autoScale"
      @toggle-auto-scale="chart.toggleAutoScale()"
    />
  </card>
</template>

<script>
import {
  CandlesChart,
  Ticker,
} from 'cryptoview'
import Card from '../Card'
import TradingChartToolbar from './components/TradingChartToolbar'

export default {
  name: 'trading-chart-card',
  components: { Card, TradingChartToolbar },
  data() {
    return {
      ticker: null,
      chart: null,
    }
  },
  computed: {
    symbol() {
      return this.$store.state.trading.symbol
    },
    range() {
      return this.$store.state.trading.range
    },
    autoScale() {
      return this.chart ? this.chart.options.autoScale : false
    }
  },
  watch: {
    symbol(value) {
      this.$refs.pulse.classList.remove('animated')
      this.changeSymbol(value)
      setTimeout(() => {
        this.$refs.pulse.classList.add('animated')
      }, 1000)
    },
  },
  methods: {
    setRange(v) {
      this.$store.dispatch('trading/setRange', v)
      this.$store.dispatch('auth/connect', {
        trading: {
          range: v,
          symbol: this.symbol,
        },
      })
    },
    async changeSymbol(value) {
      this.ticker.symbol = value
      let history = await this.ticker.fetchHistory(value, 'minute')
      this.chart.loadHistory(history)
    },
    async initChart() {
      this.chart = new CandlesChart('#cryptoview-container', {
        textColor: '#58A5FF',
      })
      this.ticker = new Ticker(this.symbol)
      let history = await this.ticker.fetchHistory(this.symbol, 'minute')
      this.chart.loadHistory(history)
      this.chart.setTicker(this.ticker)
    },
  },
  mounted() {
    this.initChart()
    this.$store.dispatch('preloader/startAfterLoading')
  },
}
</script>

<style lang="scss">
.trading-chart-card {
  position: relative;
  grid-area: trading-view;
  overflow: hidden;
  box-sizing: border-box;
  height: 100%;
  display: flex;
  flex-direction: column;
  backdrop-filter: blur(15px);

  #cryptoview-container {
    height: calc(100% - 48px);
  }

  .range {
    position: absolute;
    bottom: 10px;
    right: 30px;
    height: 30px;
    display: flex;
    display: none;
    color: $light-blue;

    &-el {
      display: grid;
      align-content: center;
      margin-right: 3px;
      height: 100%;
      width: 40px;
      cursor: pointer;
      transition: all 0.2s ease;
      text-transform: capitalize;

      &:hover {
        color: white;
        transition: none;
        background: $cyan-alpha;
      }

      &.active {
        color: white;
        background-color: $cyan;
      }
    }
  }

  .pulse-line {
    margin-top: -10px;
    height: 100%;
    width: 100px;
    position: absolute;
    border-left: 1px #0075ff solid;
    pointer-events: none;
    transition: right 0.5s linear;
    right: 130%;
    background: linear-gradient(90deg, #0075ff65 0%, rgba(0, 0, 0, 0) 100%);

    &.animated {
      right: -101px;
      transition: none;
    }
  }

  #vue-trading-view {
    grid-area: trading-view;
    width: 100%;
  }
}
</style>
