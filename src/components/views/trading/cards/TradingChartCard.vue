<template>
  <card class="trading-chart-card">
    <div ref="pulse" class="pulse-line animated"></div>
    <div class="range">
      <div
        class="range-el"
        v-for="el in ranges"
        :key="el"
        :class="{ active: range == el }"
        @click="setRange(el)"
      >
        {{ el }}
      </div>
    </div>
    <chart
      class="detail-container"
      ref="detailed-chart"
      :options="detailChart"
    ></chart>
  </card>
</template>

<script>
import Card from '../Card'

import Highcharts from 'highcharts'

var currentNetwork = 'BTC'

Highcharts.setOptions({
  time: {
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  },
})

export default {
  name: 'trading-chart-card',
  inject: ['rates'],
  props: ['history'],
  components: { Card },
  data() {
    return {
      detailChart: {
        chart: {
          style: {
            fontFamily: 'Montserrat, monospace',
            color: '#fff',
          },
          styleMode: true,
          backgroundColor: 'rgb(255, 255, 255, 0)',
          borderWidth: 0,
          plotBackgroundColor: 'rgba(255, 255, 255, 0)',
          plotBorderWidth: 0,
          colors: ['#ffffff'],
          zoomType: 'x',
          panning: {
            enabled: true,
          },
        },
        title: {
          text: 'Bitcoin (BTC/USD)',
          align: 'left',
          margin: 20,
          x: 30,
          style: {
            color: '#Fff',
            font: '16px Montserrat, "Trebuchet MS", Verdana, sans-serif',
          },
        },
        xAxis: {
          title: false,
          type: 'datetime',
          lineColor: '#0075ff',
          tickColor: '#0075ff44',
          gridLineColor: '#ffffff11',
          gridLineWidth: 1,
          labels: {
            style: {
              color: '#0075ff',
            },
          },
        },
        yAxis: {
          title: false,
          gridLineColor: '#ffffff11',
          labels: {
            style: {
              color: '#0075ff',
            },
          },
        },
        legend: {
          enabled: false,
        },
        credits: {
          enabled: false,
        },
        exporting: {
          enabled: false,
        },
        plotOptions: {
          area: {
            fillColor: {
              linearGradient: {
                x1: 0,
                y1: 0,
                x2: 0,
                y2: 1,
              },
              stops: [
                [0, '#0088ff40'],
                [1, '#0088ff05'],
              ],
            },
            marker: {
              radius: 1,
            },
            lineWidth: 1,
            states: {
              hover: {
                lineWidth: 2,
              },
            },
            threshold: null,
          },
        },
        series: [
          {
            fillOpacity: 0.3,
            name: 'Price',
            data: [],
            tooltip: {
              valuePrefix: '$ ',
            },

            unit: 'USD',
            type: 'area',
            valueDecimals: 0,
            color: '#0088ff',
            // color: '#ffffff',
          },
        ],
        tooltip: {
          positioner: function() {
            return {
              x: this.chart.chartWidth - this.label.width - 20,
              y: 30,
            }
          },
          formatter: function() {
            var point = this.points[0]
            return (
              '<b>' +
              point.series.name +
              '</b><br/>' +
              Highcharts.dateFormat('%A %B %e %Y', this.x) +
              ':<br/>' +
              `1 ${currentNetwork} = ` +
              Highcharts.numberFormat(point.y, 2) +
              ' USD'
            )
          },
          shared: true,
          style: {
            color: '#Fff',
            font: '18px Montserrat, "Trebuchet MS", Verdana',
          },
          borderWidth: 0,
          backgroundColor: 'none',
          shadow: false,
          color: '#ffffff',
        },
      },
      currency: 'BTC',
      range: '1h',
      ranges: ['1h', '1d', '1w', '1m', '3m', '1y', 'all'],
    }
  },
  watch: {
    history: {
      handler(v) {
        this.detailChart.series[0].data = this.getRange(v)
      },
      immediate: true,
    },
    currency(v) {
      currentNetwork = v
      this.$refs.pulse.classList.remove('animated')
      setTimeout(() => {
        this.$refs.pulse.classList.add('animated')
      }, 1000)
      this.detailChart.series[0].data = this.getRange(this.history)
      this.detailChart.title.text = `${this.toCurrency(v)} (${v}/USD)`
    },
  },
  methods: {
    setRange(v) {
      this.range = v
      this.detailChart.series[0].data = this.getRange(this.history)
    },
    toCurrency(net) {
      return {
        BTC: 'Bitcoin',
        LTC: 'Litecoin',
        ETH: 'Ethereum',
        LINK: 'Chainlink',
        DOT: 'Polkadot',
        XRP: 'Ripple',
      }[net]
    },
    getRange(history) {
      return history[this.currency] ? history[this.currency][this.range] : []
    },
    changeCurrency(c) {
      this.currency = c
    },
  },
  created() {},
  mounted() {
    this.$root.$emit('change-currency', 'BTC')
    this.$root.$on('change-currency', this.changeCurrency)
  },
  destroyed() {
    this.$root.$off('change-currency', this.changeCurrency)
  },
}
</script>

<style lang="scss">
@import "@/scss/_smart-grid";
@import "@/scss/_variables";

.detail-container {
  position: relative;
  width: calc(100% - 20px);
  height: calc(100% - 20px);
}

.trading-chart-card {
  position: relative;
  grid-area: trading-view;
  overflow: hidden;
  min-height: 500px;

  .range {
    position: absolute;
    bottom: 10px;
    right: 30px;
    height: 30px;
    display: flex;
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
