<template>
  <div class="portfolio-tab__balance holo-panel">
    <div class="holo-panel__header">
      <fa class="holo-panel__icon" icon="wallet" />
      <span class="holo-panel__title">Balance</span>
    </div>
    <div class="portfolio-tab__balance__content">
      <chart
        class="detail-container"
        ref="detailed-chart"
        :options="detailChart"
      ></chart>
    </div>
  </div>
</template>

<script>
import Highcharts from 'highcharts'

Highcharts.setOptions({
  time: {
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  },
})

export default {
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
            color: '#ff88ff',
            // color: '#ffffff',
          },
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
            color: '#8800ff',
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
  },
  methods: {
    buildBalanceChangingGraph() {
      const p = this.profile

      const completedTransactions = p.transactions.filter(
        t => t.status == 'completed' && t.name == 'Transfer',
      )

      const transactions = {
        BTC: completedTransactions.filter(t => t.currency == 'Bitcoin'),
        ETH: completedTransactions.filter(t => t.currency == 'Ethereum'),
        LTC: completedTransactions.filter(t => t.currency == 'Litecoin'),
      }

      const data = { BTC: [], ETH: [], LTC: [] }

      const coins = ['BTC', 'ETH', 'LTC']

      coins.forEach(coin => {
        transactions[coin].forEach((t, i) => {
          if (t.type == 'received') {
            if (i) {
              data[coin].push([
                t.at,
                transactions[coin][i - 1].amount + t.amount,
              ])
            } else {
              data[coin].push([t.at, t.amount])
            }
          } else {
            if (i) {
              data[coin].push([
                t.at,
                transactions[coin][i - 1].amount - t.amount,
              ])
            } else {
              data[coin].push([t.at, -t.amount])
            }
          }
        })
      })

      data.BTC = [
        [p.at, 0],
        ...data.BTC,
        [+new Date(), p.wallets.bitcoin.balance],
      ]
      data.ETH = [
        [p.at, 0],
        ...data.ETH,
        [+new Date(), p.wallets.ethereum.balance],
      ]
      data.LTC = [
        [p.at, 0],
        ...data.LTC,
        [+new Date(), p.wallets.litecoin.balance],
      ]

      if (p.wallets.bitcoin.balance) {
        this.detailChart.series[0].name = 'BTC'
        this.detailChart.series[0].data = data.BTC
      }

      if (p.wallets.ethereum.balance) {
        this.detailChart.series[1].name = 'ETH'
        this.detailChart.series[1].data = data.ETH
      }

      if (p.wallets.litecoin.balance) {
        this.detailChart.series[2].name = 'LTC'
        this.detailChart.series[2].data = data.LTC
      }
    },
  },
  created() {
    this.buildBalanceChangingGraph()
  },
}
</script>

<style lang="scss" scoped>
.portfolio-tab__balance {
  grid-area: balance;
}

.detail-container {
  position: relative;
  width: calc(100% - 20px);
  height: calc(100% - 20px);
}
</style>
