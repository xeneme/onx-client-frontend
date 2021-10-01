<template>
  <card class="place-order-card">
    <div class="header">
      <h4 class="title">
        Place Order
      </h4>
      <div class="options">
        <fa icon="ellipsis-v" />
      </div>
    </div>
    <order-actions />
    <tabs @change="tabChanged" :tabs="orderTabs" arrange />
    <div class="form">
      <div class="balance" v-if="isLoggedIn">
        <fa icon="credit-card" class="balance_icon" />
        <div class="balance_amount">{{ balance }}</div>
      </div>
      <amount-input v-if="tab == 'Stop-limit'" title="Stop" coin="USD" />
      <amount-input
        :prevent="tab == 'Market' ? tab : ''"
        title="Price"
        coin="USD"
      />
      <amount-input title="Amount" coin="BTC" />
    </div>
    <range-slider />
    <trade-denied :loggedIn="isLoggedIn" attention />
    <div class="divider"></div>
    <div class="header" v-if="isLoggedIn">
      <h4 class="title">
        Assets
      </h4>
    </div>
    <div class="assets" v-if="isLoggedIn">
      <a href="/wallet#deposit">Deposit</a>
      <a href="/wallet#withdraw">Withdraw</a>
    </div>
  </card>
</template>

<script>
import Card from '../Card'
import AmountInput from '../AmountInput'
import Tabs from '../Tabs'
import OrderActions from '../OrderActions'
import RangeSlider from '../RangeSlider'
import TradeDenied from '../TradeDenied'

import { mapGetters } from 'vuex'

export default {
  name: 'place-order-card',
  components: {
    Card,
    AmountInput,
    Tabs,
    OrderActions,
    RangeSlider,
    TradeDenied,
  },
  computed: {
    ...mapGetters({
      profile: 'auth/profile',
      isLoggedIn: 'auth/isLoggedIn',
    }),
    balance() {
      var c = {
        BTC: 'bitcoin',
        ETH: 'ethereum',
        LTC: 'litecoin',
        USDC: 'usd coin',
      }[this.currency]

      if (!c) return '0.00 USD'
      else
        return this.profile.wallets[c].balance.toFixed(5) + ' ' + this.currency
    },
  },
  data: () => ({
    orderTabs: [
      {
        name: 'Limit',
      },
      {
        name: 'Market',
      },
      {
        name: 'Stop-limit',
        // info: 'To buy of sell a coin once the price reaches a specified price.',
        // replacement: {
        // name: 'OCO',
        // info: `One Cancels the Other: To place a stop-limit
        // order and a limit order at the same time. When either
        // of the order pairs is triggered, the other order will
        // be cancelled. If one is cancelled, the OCO pair will
        // be cancelled.`,
        // },
      },
    ],
    currency: 'BTC',
    tab: 'Limit',
  }),
  methods: {
    changeCurrency(net) {
      this.currency = net
    },
    tabChanged(e) {
      this.tab = e
    },
  },
  mounted() {
    this.$root.$on('change-currency', this.changeCurrency)
  },
  destroyed() {
    this.$root.$off('change-currency', this.changeCurrency)
  },
}
</script>

<style lang="scss" scoped>
@import '@/scss/_smart-grid';
@import '@/scss/_variables';

.place-order-card {
  grid-area: place-order;

  .form {
    padding: 20px;

    .balance {
      margin-bottom: 16px;
      display: flex;
      justify-content: flex-start;
      font-size: 0.82rem;
      letter-spacing: 0.1rem;
      font-weight: 500;
      font-family: Montserrat;
      &_icon {
        font-size: 0.9rem;
        color: $cyan;
        margin-right: 10px;
      }
      &_amount {
        color: $cyan;
      }
    }
  }

  .assets {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 10px;
    padding: 5px 20px;

    a {
      text-decoration: none;
      cursor: pointer;
      height: 34px;
      display: grid;
      align-content: center;
      width: 100%;
      border-radius: 3px;
      background-color: #00000033;
      color: $cyan;

      &:hover {
        color: white;
        background-color: #ffffff11;
      }
    }
  }
}
</style>
