<template>
  <div
    class="holo-panel holo-panel--interactive connect-wallet"
    @click="$emit('click')"
  >
    <div class="holo-panel__header">
      <fa class="holo-panel__icon" icon="sign-out-alt" />
      <span class="holo-panel__title">Connect Wallet</span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      seed: '',
    }
  },
  methods: {},
  mounted() {},
}
</script>

<style lang="scss" scoped>
@import '@/scss/ui';

.connect-wallet {
  grid-area: connect;
}
</style>
