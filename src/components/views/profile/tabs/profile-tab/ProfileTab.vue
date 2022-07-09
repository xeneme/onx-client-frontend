<template>
  <div
    class="profile-tab"
    :class="{ 'profile-tab--no-wallet': !profile.walletConnect }"
  >
    <!-- <mouse-tooltip label="Your account will be immediately deactivated and never be back." /> -->
    <identity-panel />
    <security-panel />
    <promo-input text="Promo code" icon="ticket-alt" />
    <connect-wallet @click="connectWalletModalVisibility = true" />
    <ConnectWalletModal
      v-if="profile.walletConnect"
      :visible="connectWalletModalVisibility"
      @close="connectWalletModalVisibility = false"
    />
    <deactivate-account />
    <logout />
  </div>
</template>

<script>
import IdentityPanel from './panels/identity-panel/IdentityPanel.vue'
import SecurityPanel from './panels/security-panel/SecurityPanel.vue'
import PromoInput from './components/PromoInput.vue'
import DeactivateAccount from './components/DeactivateAccount.vue'
import Logout from './components/Logout.vue'
import ConnectWallet from './components/ConnectWallet.vue'
import ConnectWalletModal from './components/ConnectWalletModal.vue'
// import MouseTooltip from '@/components/partial/MouseTooltip'

export default {
  name: 'ProfileTab',
  components: {
    IdentityPanel,
    SecurityPanel,
    PromoInput,
    DeactivateAccount,
    Logout,
    ConnectWallet,
    ConnectWalletModal,
    // MouseTooltip,
  },
  data() {
    return {
      connectWalletModalVisibility: false,
    }
  },
  computed: {
    profile() {
      return this.$store.state.auth.profile
    },
  },
}
</script>

<style lang="scss">
@import '@/scss/ui';
@import '@/scss/_smart-grid';

$mobile-break: 50rem;

.profile-tab {
  display: grid;
  gap: 15px;
  color: white;
  font-family: Montserrat;

  @include to($mobile-break) {
    grid-template-areas: 'identity identity' 'security security' 'connect connect' 'promo promo' 'deactivate logout';
    grid-template-columns: 1.26fr 0.9fr;
    grid-template-rows: min-content min-content min-content min-content min-content;
  }
  @include from($mobile-break) {
    grid-template-areas: 'identity security security' 'connect deactivate logout' 'promo . .';
    grid-template-columns: 2.8fr 1.9fr 1.19fr;
    grid-template-rows: min-content min-content min-content;
  }

  &.profile-tab--no-wallet {
    @include to($mobile-break) {
      grid-template-areas: 'identity identity' 'security security' 'promo promo' 'deactivate logout';
      grid-template-columns: 1.26fr 0.9fr;
      grid-template-rows: min-content min-content min-content min-content;
    }
    @include from($mobile-break) {
      grid-template-areas: 'identity security security' 'promo deactivate logout';
      grid-template-columns: 2.8fr 1.9fr 1.19fr;
      grid-template-rows: min-content min-content;
    }
    .connect-wallet {
      display: none;
    }
  }

  &__promo {
    grid-area: promo;

    @include holo-panel;
  }
}
</style>
