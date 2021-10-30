<template>
  <div class="portfolio-tab__balance holo-panel">
    <div class="holo-panel__header">
      <fa
        class="holo-panel__icon"
        :spin="loading"
        :icon="loading ? 'circle-notch' : 'wallet'"
      />
      <span class="holo-panel__title"
        >{{ currency.toSymbol() }} Balance History</span
      >
    </div>
    <div class="portfolio-tab__balance__content">
      <chart
        class="detail-container"
        ref="detailed-chart"
        v-if="detailChart.series[0].data.length"
        :options="detailChart"
      ></chart>
      <div class="fetching-data" v-else-if="loading">
        <fa class="holo-panel__icon" icon="circle-notch" spin />
        <span>Loading...</span>
      </div>
      <div class="no-data" v-else>
        <fa class="holo-panel__icon" icon="wallet" />
        <span>No transactions</span>
      </div>
    </div>
  </div>
</template>

<script>
import Highcharts from 'highcharts'
import _ from 'underscore'

import ApiRequest from '@/services/apiRequest'

Highcharts.setOptions({
  time: {
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  },
})

export default {
  data() {
    return {
      transactionsHistory: {
        bitcoin: [],
        litecoin: [],
        ethereum: [],
        'usd coin': [],
      },
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
          text: '',
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
            name: 'USD',
            data: [],
            tooltip: {
              valuePrefix: '$ ',
            },

            unit: 'USD',
            type: 'area',
            valueDecimals: 0,
            color: '#58A5FF',
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
              `${Highcharts.numberFormat(point.y, 2)} ${point.series.name}` +
              '</b><br/>' +
              Highcharts.dateFormat('%A %B %e %Y', this.x)
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
    }
  },
  computed: {
    profile() {
      return this.$store.state.auth.profile
    },
    currency() {
      return this.$store.state.profile.analyticsCurrency
    },
  },
  watch: {
    currency(value) {
      this.fetchHistory(value, this.transactionsHistory)
    },
  },
  methods: {
    fetchHistory(currency, history) {
      if (!this.transactionsHistory[currency].length) {
        this.loading = false
        this.detailChart.series[0].data = []
        return
      } else if (this.loading) return
      this.loading = true
      this.detailChart.series[0].data = []
      ApiRequest.post('/wallet/balance/history', {
        currency,
        transactions: history[currency],
      })
        .then(({ data }) => {
          this.loading = false
          this.detailChart.series[0].data = data.chartData
          if (this.currency != currency)
            this.fetchHistory(this.currency, this.transactionsHistory)
        })
        .catch(err => {
          if (this.currency != currency) {
            this.fetchHistory(this.currency, this.transactionsHistory)
          }
          console.log(err)
        })
    },
    buildTransactionsHistory() {
      const t = this
      const p = t.profile

      let transactions = _.where(p.transactions, {
        status: 'completed',
        name: 'Transfer',
      })

      transactions.forEach(({ currency, amount, type, at }) => {
        t.transactionsHistory[currency.toLowerCase()].push({
          at,
          amount: type == 'received' ? amount : -amount,
        })
      })

      return t.transactionsHistory
    },
  },
  created() {
    this.fetchHistory(this.currency, this.buildTransactionsHistory())
  },
}
</script>

<style lang="scss" scoped>
.portfolio-tab__balance {
  grid-area: balance;

  &__content {
    height: 375px;
  }
}

.no-data,
.fetching-data {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: scale(1.5);
  opacity: 0.14;
  padding-bottom: 20rem;

  svg {
    color: white !important;
  }
}

.detail-container {
  position: relative;
  width: calc(100% - 20px);
  height: calc(100% - 20px);
}
</style>
