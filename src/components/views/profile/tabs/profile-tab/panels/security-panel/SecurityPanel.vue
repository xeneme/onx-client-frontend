<template>
  <div class="profile-tab__security holo-panel">
    <div class="holo-panel__header">
      <fa class="holo-panel__icon" icon="lock" />
      <span class="holo-panel__title">Security</span>
    </div>
    <div class="security_li change-password">
      <div class="security_li__title"><span>Change password</span></div>
      <i-button icon="pencil-alt" @click="changePassword" />
    </div>
    <div class="divider"></div>
    <div class="security_li 2fa">
      <div class="security_li__title">
        <span>Two-factor authentication</span>
      </div>
      <i-button
        :icon="profile.twoFa ? 'toggle-on' : 'toggle-off'"
        @click="change2FA"
      />
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
      this.$copy(this.profile.supportPin)
    },
  },
}
</script>

<style lang="scss">
@import '@/scss/_smart-grid';
@import '@/scss/ui';
@import '@/scss/_variables';

$mobile-break: 130rem;

.profile-tab__security {
  grid-area: security;
  display: flex;
  flex-direction: column;
  padding-bottom: 10px;

  .divider {
    width: 100%;
    width: calc(100% - 32px);
    border-top: 1px $cyan-alpha solid;
    margin: 0px 16px;
  }

  .security_li {
    width: calc(100% - 40px);
    display: flex;
    justify-content: space-between;
    padding: 5px 20px;

    &__title {
      display: grid;
      align-content: center;
      span {
        white-space: nowrap;
        text-overflow: ellipsis;
        display: inline-block;
        overflow: hidden;
      }
      .pin {
        display: inline-flex;
        align-self: center;
        color: $light-blue;
      }
    }
  }

  @include to($mobile-break) {
    font-size: 16px;
  }
  @include from($mobile-break) {
    font-size: 20px;
  }
}
</style>
