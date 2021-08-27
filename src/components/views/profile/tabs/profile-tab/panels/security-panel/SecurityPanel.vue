<template>
  <div class="profile-tab__security holo-panel">
    <div class="holo-panel__header">
      <fa class="holo-panel__icon" icon="lock" />
      <span class="holo-panel__title">Security</span>
    </div>
    <div class="security_li change-password">
      <div class="security_li__title">Change password</div>
      <i-button icon="pencil-alt" @click="changePassword" />
    </div>
    <div class="divider"></div>
    <div class="security_li 2fa">
      <div class="security_li__title">Two-factor authentication</div>
      <i-button icon="pencil-alt" @click="change2FA" />
    </div>
    <div class="divider"></div>
    <div class="security_li pin">
      <div class="security_li__title">
        <span
          >Support PIN: <span class="pin">{{ profile.supportPin }}</span></span
        >
      </div>
      <i-button icon="copy" icon-on-click="check" @click="copySupportPIN" />
    </div>
  </div>
</template>

<script>
import IButton from '@/components/partial/IconButton.vue'

export default {
  components: {
    IButton,
  },
  computed: {
    profile() {
      return this.$store.state.auth.profile
    },
  },
  methods: {
    changePassword() {
      this.$store.commit('popups/CHANGE_PASSWORD', true)
    },
    change2FA() {
      this.$store.commit('popups/CHANGE_TWOFA', true)
    },
    copySupportPIN() {
      this.$copy(this.pin)
    },
  },
}
</script>

<style></style>
