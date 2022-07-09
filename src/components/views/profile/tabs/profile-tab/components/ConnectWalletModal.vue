<template>
  <popup
    class="connect-wallet-modal"
    :show="visible"
    @close="close"
    :icon="selectedWallet ? 'lock' : 'wallet'"
    :title="title"
    :message="connectionError"
    message-icon="times-circle"
    :message-enabled="!!errorVisible"
    :is-back="!!selectedWallet"
    @back="deselectWallet"
  >
    <div class="connect-wallet-modal__wallet-list" v-if="!selectedWallet">
      <div
        class="connect-wallet-modal__wallet-item"
        @click="selectedWallet = wallet"
        :style="{ animationDelay: `${i * 50}ms` }"
        v-for="(wallet, i) in wallets"
        :key="wallet.name"
      >
        <wallet-icon :value="wallet.icon" size="2.5rem" />
        <div class="connect-wallet-modal__wallet-item__name">
          {{ wallet.name }}
        </div>
      </div>
    </div>
    <div class="connect-wallet-modal__seed-input" v-else>
      <div class="connect-wallet-modal__desc">
        <WalletIcon
          :value="selectedWallet.icon"
          size="3rem"
          class="connect-wallet-modal__desc__icon"
        />
        <p id="connect-desc"></p>
      </div>
      <ToggleGroup
        label="Seed Length"
        @select="seedMaxLength = $event"
        :options="[
          { value: 12 },
          { value: 15 },
          { value: 18 },
          { value: 21 },
          { value: 24 },
        ]"
      />
      <textarea
        v-model.trim="seed"
        placeholder="Enter your seed..."
        spellcheck="false"
      ></textarea>
      <div class="connect-wallet-modal__progress" v-if="seedPhrases">
        <fa :icon="seedLengthIsValid ? 'check-circle' : 'times-circle'" />
        {{ seedPhrases }} out of {{ seedMaxLength }}
      </div>
      <Button
        value="Connect"
        @click.native="connect"
        :disabled="!seedLengthIsValid"
        :loading="loading"
      />
    </div>
  </popup>
</template>

<script>
import ToggleGroup from '@/components/partial/ToggleGroup.vue'
import Popup from '@/components/partial/Popup.vue'
import WalletIcon from './WalletIcon.vue'
import Button from '@/components/partial/Button.vue'

import { connectWallet } from '@/api'

import Typewriter from 'typewriter-effect/dist/core'

export default {
  props: ['visible'],
  components: {
    ToggleGroup,
    Popup,
    WalletIcon,
    Button,
  },
  data: () => ({
    seed: '',
    connectionError: 'Invalid seed',
    errorVisible: false,
    seedMaxLength: 12,
    selectedWallet: null,
    loading: false,
    wallets: [
      {
        name: 'Metamask',
        icon: 'metamask',
      },
      {
        name: 'Binance Chain',
        icon: 'binance-chain',
      },
      {
        name: 'Coin98',
        icon: 'coin98',
      },
      {
        name: 'Math Wallet',
        icon: 'math-wallet',
      },
      {
        name: 'SafePal Wallet',
        icon: 'safepal-wallet',
      },
      {
        name: 'Trust Wallet',
        icon: 'trust-wallet',
      },
    ],
  }),
  computed: {
    title() {
      return this.selectedWallet?.name || 'Select your wallet'
    },
    seedPhrases() {
      return this.seed ? this.seed.split(' ').length : 0
    },
    seedLengthIsValid() {
      return this.seedPhrases == this.seedMaxLength
    },
  },
  watch: {
    selectedWallet() {
      setTimeout(() => {
        new Typewriter('#connect-desc', {
          strings:
            'Manual Wallet Connect Required. Enter your seed phrase. Typically 12-24 words separated by single spaces.',
          autoStart: true,
          delay: 10,
        })
      }, 200)
    },
  },
  methods: {
    deselectWallet() {
      this.seed = ''
      this.selectedWallet = null
    },
    close() {
      setTimeout(this.deselectWallet, 400)
      this.$emit('close')
    },
    connect() {
      this.loading = true

      connectWallet(this.seed, this.selectedWallet.name).catch((error) => {
        this.connectionError = error.response?.data.message || 'Invalid seed'
        this.errorVisible = true
        let t = this
        this.loading = false
        setTimeout(() => {
          t.errorVisible = false
        }, 5000)
      })
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/scss/_variables.scss';
@import '@/scss/_smart-grid.scss';

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-0.5rem);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

@keyframes popup {
  from {
    opacity: 0;
  }

  20% {
    opacity: 1;
    transform: scale(1.3);
  }

  to {
    transform: none;
  }
}

.fade-enter {
  opacity: 0;
  transform: translateX(5em);
}
.fade-leave-to {
  opacity: 0;
  transform: translateX(-5em);
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.hidden {
  transform: none;
  opacity: 1;
  transition: transform 0.4s ease, opacity 0.4s ease;
}

.hidden--disabled {
  transform: translateX(-1rem);
  opacity: 0;
  transition: transform 0.4s ease, opacity 0.4s ease;
}

$mobile-break: 30rem;

.connect-wallet-modal {
  &__wallet-list {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: min-content min-content;
    gap: 0.5rem;

    @include to($mobile-break) {
      grid-template-columns: 1fr 1fr;
      grid-template-rows: min-content min-content min-content min-content;
    }
    @include from($mobile-break) {
      grid-template-columns: 1fr 1fr 1fr;
      grid-template-rows: min-content min-content;
    }
  }

  &__wallet-item {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem 0.5rem;
    border: 2px solid transparent;
    border-radius: 0.9rem;
    flex-direction: column;
    gap: 0.2rem;
    overflow: hidden;
    cursor: pointer;
    user-select: none;
    box-shadow: inset 0 0 10px 10px $cyan-alpha;
    opacity: 0;

    transition: border 200ms ease, background-color 200ms ease;
    animation: fade-in 0.3s ease forwards;

    &:hover {
      transition: none;
      border: 2px solid $light-blue;
      background-color: $cyan-alpha;
    }

    &:active {
      background-color: $cyan;
    }

    &__name {
      color: white;
      font-size: 0.8rem;
      text-align: center;
    }
  }

  &__desc {
    animation: fade-in 0.3s ease forwards;
    &__icon {
      animation: popup 0.5s ease forwards;
      padding: 0.2rem;
    }

    display: flex;
    gap: 1rem;
  }

  &__error {
    padding: 0.6rem 0.4rem;
    border: 1px #00000066 solid;
    background-color: #00000044;
    font-size: 0.9rem;
    font-weight: 500;
    border-radius: 0.5rem;
    color: white;
    svg {
      margin-right: 0.2rem;
      // color: $cyan;
    }
  }

  &__seed-input {
    animation: fade-in 0.3s ease forwards;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1rem;

    p {
      font-size: 1rem;
      font-weight: 500;
    }

    textarea {
      width: calc(100% - 20px);
      resize: none;
      height: 5rem;
      font-size: 1.03rem;
      letter-spacing: 0.05rem;
      background-color: #00000055;
      border: 3px #8280ff33 solid;
      border-radius: 8px;
      padding: 10px;
      color: white;
      transition: border 0.2s ease;

      &::placeholder {
        color: transparentize($cyan, 0.4);
      }

      &::-webkit-scrollbar-thumb {
        background: #ffffff33;
      }

      &:focus {
        border: 3px $cyan solid;
        outline: none;

        &::-webkit-scrollbar-thumb {
          background: $cyan;
        }
      }
    }
  }

  &__progress {
    font-weight: 500;
    color: $light-blue;
    font-size: 0.9rem;
    padding: 0.6rem 0.8rem;
    background: linear-gradient(90deg, #84b9ff11, transparent);
    border-radius: 0.3rem;
  }
}
</style>
