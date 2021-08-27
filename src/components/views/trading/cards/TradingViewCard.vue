<template>
  <card class="trading-view-card">
    <VueTradingView
      :options="{
        width: '100%',
        height: 610,
        symbol: 'XBT',
        interval: $isDesktop ? '5' : '10',
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
  </card>
</template>

<script>
import Card from '../Card'

import VueTradingView from 'vue-trading-view'

export default {
  name: 'trading-view-card',
  inject: ['rates'],
  components: { Card, VueTradingView },
  methods: {
    checkViewNode() {
      // var view = this.$el.querySelector('#vue-trading-view')

      // if (view && view.childElementCount) {
        this.$store.dispatch('preloader/startAfterLoading')
        this.$root.$emit('change-currency', 'BTC')
      // } else {
        // setTimeout(this.checkViewNode, 2000)
      // }
    },
  },
  mounted() {
    this.checkViewNode()
  },
}
</script>

<style lang="scss" scoped>
@import "@/scss/_smart-grid";
@import "@/scss/_variables";

.trading-view-card {
  grid-area: trading-view;

  #vue-trading-view {
    grid-area: trading-view;
    width: 100%;
  }
}
</style>
