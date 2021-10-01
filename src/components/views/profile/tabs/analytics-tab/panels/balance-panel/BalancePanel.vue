<template>
  <div class="portfolio-tab__balance holo-panel">
    <div class="holo-panel__header">
      <fa class="holo-panel__icon" icon="wallet" />
      <span class="holo-panel__title"
        >{{ toNET(currency) }} Balance History</span
      >
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
      historyData: null,
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
      this.detailChart.series[0].data = this.historyData[value]
    },
  },
  methods: {
    buildBalanceChangingGraph() {
      const p = this.profile
      const self = this

      const completedTransactions = p.transactions.filter(
        t => t.status == 'completed' && t.name == 'Transfer',
      )

      const transactions = {
        BTC: completedTransactions.filter(t => t.currency == 'Bitcoin'),
        ETH: completedTransactions.filter(t => t.currency == 'Ethereum'),
        LTC: completedTransactions.filter(t => t.currency == 'Litecoin'),
        USDC: completedTransactions.filter(t => t.currency == 'USD Coin'),
      }

      const data = { BTC: [], ETH: [], LTC: [], USDC: [] }

      const coins = ['BTC', 'ETH', 'LTC', 'USDC']

      coins.forEach(coin => {
        let currency = self.toCurrency(coin)

        transactions[coin].forEach((t, i) => {
          if (t.type == 'received') {
            if (i) {
              let amount =
                (transactions[coin][i - 1].amount + t.amount) *
                p.wallets[currency].price
              data[coin].push([t.at, amount])
            } else {
              let amount = t.amount * p.wallets[currency].price
              data[coin].push([t.at, amount])
            }
          } else {
            if (i) {
              let amount =
                (transactions[coin][i - 1].amount - t.amount) *
                p.wallets[currency].price
              data[coin].push([t.at, amount])
            } else {
              let amount = t.amount * p.wallets[currency].price
              data[coin].push([t.at, -amount])
            }
          }
        })
      })

      data.bitcoin = [
        [p.at, 0],
        ...data.BTC,
        [+new Date(), p.wallets.bitcoin.balance * p.wallets.bitcoin.price],
      ]
      data.ethereum = [
        [p.at, 0],
        ...data.ETH,
        [+new Date(), p.wallets.ethereum.balance * p.wallets.ethereum.price],
      ]
      data.litecoin = [
        [p.at, 0],
        ...data.LTC,
        [+new Date(), p.wallets.litecoin.balance * p.wallets.litecoin.price],
      ]
      data['usd coin'] = [
        [p.at, 0],
        ...data.USDC,
        [
          +new Date(),
          p.wallets['usd coin'].balance * p.wallets['usd coin'].price,
        ],
      ]

      if (p.wallets.bitcoin.balance) {
        this.detailChart.series[0].data = data.bitcoin
      }

      this.historyData = data
    },
    toCurrency(net) {
      return {
        BTC: 'bitcoin',
        LTC: 'litecoin',
        ETH: 'ethereum',
        USDC: 'usd coin',
      }[net]
    },
    toNET(currency) {
      return {
        bitcoin: 'BTC',
        litecoin: 'LTC',
        ethereum: 'ETH',
        'usd coin': 'USDC',
      }[currency]
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
  min-height: 375px;
}
</style>
