<template>
  <div
    class="profile-tab__logout holo-panel holo-panel--danger holo-panel--interactive"
    @click="logout"
  >
    <div class="holo-panel__header">
      <fa class="holo-panel__icon" icon="sign-out-alt" />
      <span class="holo-panel__title">Log Out</span>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    logout() {
      this.$store.dispatch('auth/logout', {
        redirect: true,
        ghostToken: localStorage.getItem('admin-token'),
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.profile-tab__logout {
  grid-area: logout;
}
</style>
