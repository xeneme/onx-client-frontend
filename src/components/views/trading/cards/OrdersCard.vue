<template>
  <card class="orders-card">
    <tabs :tabs="orderTabs" />
    <div class="divider"></div>
    <trade-denied :loggedIn="isLoggedIn" />
  </card>
</template>

<script>
import Card from '../Card'
import Tabs from '../Tabs'
import TradeDenied from '../TradeDenied'

import {mapGetters} from 'vuex'

export default {
  name: 'orders-card',
  components: { Card, Tabs, TradeDenied },
  computed: {
    ...mapGetters({
      isLoggedIn: 'auth/isLoggedIn'
    })
  },
  data() {
    return {
      orderTabs: [
        {
          name: 'Open Orders(0)',
        },
        {
          name: 'Order History',
        },
        {
          name: 'Trade History',
        },
        {
          name: 'Funds',
        },
      ],
    }
  },
}
</script>

<style lang="scss" scoped>
.orders-card {
  grid-area: orders;
}
</style>
