<template>
  <card class="live-orders-card">
    <div class="live-orders-card_title">
      <div class="live-orders-card_title-price">Price</div>
      <div class="live-orders-card_title-amount">Amount</div>
      <div class="live-orders-card_title-time">Time</div>
    </div>
    <div class="live-orders-card_all">
      <div
        class="live-orders-card_all_order"
        v-for="order in orders[symbol]"
        :key="hash(order)"
      >
        <div :class="['live-orders-card_all_order-price', order.action]">
          {{ order.price }}
        </div>
        <div class="live-orders-card_all_order-amount">{{ order.amount }}</div>
        <div class="live-orders-card_all_order-time">{{ order.time }}</div>
      </div>
    </div>
    <div class="divider"></div>
  </card>
</template>

<script>
import Card from '../Card'

export default {
  name: 'live-orders-card',
  components: { Card },
  inject: ['rates'],
  props: ['orders'],
  data: () => ({
    symbol: 'BTC',
  }),
  methods: {
    hash: require('object-hash'),
    changeCurrency(net) {
      this.symbol = net
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
@import "@/scss/_smart-grid";
@import "@/scss/_variables";

.live-orders-card {
  grid-area: live-orders;
  flex-direction: column;
  display: flex;

  &_title {
    display: flex;
    justify-content: space-between;
    padding: 10px 20px;
    padding-right: 40px;
    color: $light-blue;
    user-select: none;
  }

  &_all {
    width: 100%;
    height: 100%;
    overflow: auto;
    &_order {
      padding-right: 10px;
      margin: 5px;
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      color: $cyan;

      &:hover {
        background-color: $cyan-alpha;
      }

      &-price {
        &.buy {
          color: #02c076;
        }

        &.sell {
          color: $red;
        }
      }
    }
  }
}
</style>
