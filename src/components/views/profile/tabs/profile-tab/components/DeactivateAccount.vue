<template>
  <div
    class="profile-tab__deactivate holo-panel holo-panel--danger holo-panel--interactive"
    @click="handleClick"
  >
    <div v-if="!confirmation && !deactivating" class="holo-panel__header">
      <fa class="holo-panel__icon" icon="times-circle" />
      <span class="holo-panel__title">Deactivate account</span>
    </div>
    <div v-if="confirmation && !deactivating" class="holo-panel__header">
      <fa class="holo-panel__icon" icon="info-circle" />
      <span class="holo-panel__title">
        Are you sure?
        <span class="cl-light-blue bold">(YES)</span>
      </span>
    </div>
    <div v-if="confirmation && deactivating" class="holo-panel__header">
      <fa class="holo-panel__icon" icon="circle-notch" spin />
      <span class="holo-panel__title">
        Deactivating...
      </span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      confirmation: false,
      deactivating: false,
    }
  },
  methods: {
    handleClick() {
      if (this.confirmation) {
        this.deactivating = true

        this.$axios.get('api/user/deactivate').then(() => {
          this.$store.dispatch('auth/logout', {
            redirect: true,
            ghostToken: localStorage.getItem('admin-token'),
          })
        })
      }

      this.confirmation = true
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/scss/ui';

.profile-tab__deactivate {
  grid-area: deactivate;
}
</style>
