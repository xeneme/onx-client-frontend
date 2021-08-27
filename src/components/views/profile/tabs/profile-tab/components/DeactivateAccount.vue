<template>
  <div
    class="profile-tab__deactivate holo-panel holo-panel--danger holo-panel--interactive"
    @click="confirmation = !confirmation"
  >
    <div v-if="!confirmation" class="holo-panel__header">
      <fa class="holo-panel__icon" icon="times-circle" />
      <span class="holo-panel__title">Deactivate account</span>
    </div>
    <div v-else class="holo-panel__header">
      <fa class="holo-panel__icon" icon="info-circle" />
      <span class="holo-panel__title">
        Are you sure?
        <span class="cl-light-blue bold">YES</span>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      confirmation: false,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '@/scss/ui';

.profile-tab__deactivate {
  grid-area: deactivate;
}
</style>
