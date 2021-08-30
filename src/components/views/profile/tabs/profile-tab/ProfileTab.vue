<template>
  <div class="profile-tab">
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

export default {
  name: 'ProfileTab',
  components: {
    IdentityPanel,
    SecurityPanel,
    PromoInput,
    DeactivateAccount,
    Logout,
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
    grid-template-columns: 1.26fr 0.74fr;
    grid-template-rows: min-content min-content min-content min-content;
  }
  @include from($mobile-break) {
    grid-template-areas: 'identity security security' 'promo deactivate logout';
    grid-template-columns: 2fr 1.26fr 0.74fr;
    grid-template-rows: min-content min-content;
  }

  &__security {
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
        .pin {
          color: $light-blue;
        }
      }
    }
  }

  &__promo {
    grid-area: promo;

    @include holo-panel;
  }
}
</style>
