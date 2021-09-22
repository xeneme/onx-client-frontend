<template>
  <div class="profile-tab">
    <!-- <mouse-tooltip label="Your account will be immediately deactivated and never be back." /> -->
    <identity-panel />
    <security-panel />
    <promo-input text="Promo code" icon="ticket-alt" />
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
// import MouseTooltip from '@/components/partial/MouseTooltip'

export default {
  name: 'ProfileTab',
  components: {
    IdentityPanel,
    SecurityPanel,
    PromoInput,
    DeactivateAccount,
    Logout,
    // MouseTooltip,
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
    grid-template-areas: 'identity identity' 'security security' 'promo promo' 'deactivate logout';
    grid-template-columns: 1.26fr 0.9fr;
    grid-template-rows: min-content min-content min-content min-content;
  }
  @include from($mobile-break) {
    grid-template-areas: 'identity security security' 'promo deactivate logout';
    grid-template-columns: 2.8fr 1.9fr 1.19fr;
    grid-template-rows: min-content min-content;
  }

  &__promo {
    grid-area: promo;

    @include holo-panel;
  }
}
</style>
