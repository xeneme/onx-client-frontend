<template>
  <div class="charts-tab">
    <div class="charts-tab__profitability holo-panel">
      <div class="holo-panel__header">
        <fa class="holo-panel__icon" icon="id-card" />
        <span class="holo-panel__title">Profitability</span>
      </div>
      <div class="charts-tab__profitability__content"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChartsTab',
}
</script>

<style lang="scss">
@import '@/scss/ui';
@import '@/scss/_smart-grid';

$mobile-break: 50rem;

.charts-tab {
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
