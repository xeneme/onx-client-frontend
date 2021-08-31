<template>
  <div class="portfolio-tab">
    <balance-panel />
    <div class="portfolio-tab__profitability holo-panel holo-panel--danger">
      <div class="holo-panel__header">
        <fa class="holo-panel__icon" icon="id-card" />
        <span class="holo-panel__title">Profitability</span>
        <span class="percentage">{{ computedProfitability() }}%</span>
      </div>
      <div class="portfolio-tab__profitability__content"></div>
    </div>
    <div class="portfolio-tab__toggles">
      <balance-toggle currency="bitcoin" />
      <balance-toggle currency="ethereum" />
      <balance-toggle currency="litecoin" />
    </div>
  </div>
</template>

<script>
import BalancePanel from './panels/balance-panel/BalancePanel.vue'
import BalanceToggle from './components/BalanceToggle.vue'

export default {
  name: 'PortfolioTab',
  components: {
    BalancePanel,
    BalanceToggle,
  },
  data() {
    return {}
  },
  computed: {
    profile() {
      return this.$store.state.auth.profile
    },
  },
  methods: {
    computedProfitability() {
      const t = this.profile.transactions.filter(
        t => t.status == 'completed' && t.name == 'Transfer',
      )

      const sent = t.filter(t => t.type == 'sent to')
      const received = t.filter(t => t.type == 'received')

      let loss = sent.map(t => t.amount)
      let income = received.map(t => t.amount)

      loss = [...loss, 0].reduce((a, b) => a + b)
      income = [...income, 0].reduce((a, b) => a + b)

      return (100 - (loss / income) * 100).toFixed(2)
    },
  },
}
</script>

<style lang="scss">
@import '@/scss/ui';
@import '@/scss/_smart-grid';

$mobile-break: 50rem;

.portfolio-tab {
  display: grid;
  gap: 15px;
  color: white;
  font-family: Montserrat;

  @include to($mobile-break) {
    grid-template-areas: 'balance' 'profitability' 'toggles';
    grid-template-columns: 1fr;
    grid-template-rows: min-content min-content;
  }
  @include from($mobile-break) {
    grid-template-areas: 'balance balance' 'profitability toggles';
    grid-template-columns: 1fr 1fr;
    grid-template-rows: min-content min-content;
  }

  &__profitability {
    grid-area: profitability;
    position: relative;
    height: min-content;

    .percentage {
      right: 20px;
      position: absolute;
    }
  }

  &__toggles {
    grid-area: toggles;
    display: flex;
    gap: 5px;
    flex-direction: column;
  }
}
</style>
