<template>
  <div class="portfolio-tab">
    <div class="portfolio-tab__profitability holo-panel">
      <div class="holo-panel__header">
        <fa class="holo-panel__icon" icon="id-card" />
        <span class="holo-panel__title">Profitability</span>
      </div>
      <div class="portfolio-tab__profitability__content"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PortfolioTab',
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
    grid-template-areas: 'profitability';
    grid-template-columns: 1fr;
    grid-template-rows: min-content;
  }
  @include from($mobile-break) {
    grid-template-areas: 'profitability';
    grid-template-columns: 1fr;
    grid-template-rows: min-content;
  }

  &__profitability {
    grid-area: profitability;
  }
}
</style>
