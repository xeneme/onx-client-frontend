<template>
  <div class="new-contract">
    <card :visible="opened">
      <div ref="menu" class="trade-card-menu">
        <a href="javascript:void(0)" class="disabled">
          <fa class="icon" icon="lock" />Verify the account to create new trade
        </a>
        <div class="divider"></div>
        <a href="javascript:void(0)" @click="enterTradePin">
          <input
            placeholder="TRADE PIN"
            v-model="tradePin"
            v-if="connectInputOpened"
            @keyup.enter="connect"
            class="connect-input"
            ref="connect-input"
            type="password"
            name="pin"
            pattern="[0-9]{4}"
            maxlength="4"
            value=""
          />
          <div class="connect-button" v-if="!connectInputOpened">
            <fa class="icon" icon="plug" />Connect to a contract
          </div>
        </a>
      </div>
    </card>
    <div
      ref="button"
      :class="['new-contract-button', opened ? '' : 'opened']"
      @click="newContract"
    >
      <fa icon="shield-alt" class="shield" />
      Trade Guard
    </div>
  </div>
</template>

<script>
import axios from 'axios'

import Card from './Card'

export default {
  name: 'new-contract',
  components: { Card },
  props: {
    opened: {
      type: Boolean,
      deafult: false,
    },
  },
  data: () => ({
    connectInputOpened: false,
    tradePin: '',
    timeout: 0,
  }),
  watch: {
    opened(v) {
      if (v) {
        this.$refs.button.style.cursor = 'default'
        this.timeout = setTimeout(() => {
          if (v) this.$refs.button.style.display = 'none'
        }, 200)

        this.$refs.menu.style.cursor = 'pointer'
        if (v) this.$refs.menu.style.display = 'block'
      } else {
        clearTimeout(this.timeout)

        this.$refs.button.style.cursor = 'pointer'
        this.$refs.button.style.display = 'flex'

        this.$refs.menu.style.cursor = 'default'
        this.$refs.menu.style.display = 'none'
      }
    },
  },
  methods: {
    // filterTradePin() {
    //   this.tradePin = this.tradePin.replace(/[^0-9]/, '').substr(0, 4)
    // },
    connect() {
      this.$store.commit('guard/CONNECTING', true)

      axios
        .post(
          window.location.protocol +
            '//' +
            window.location.host +
            '/trade-guard/connect',
          {
            pin: this.tradePin,
          },
        )
        .then(response => {
          this.$store.commit('guard/CONNECTING', false)
          this.$store.commit('guard/SET_CONTRACT', response.data)
          this.$store.commit('guard/SET_PIN', this.tradePin)
          this.$router.push({ name: 'TradeGuard' })
        })
        .catch(err => {
          this.tradePin = ''
          this.$store.commit('guard/CONNECTING', false)

          if (err.response) {
            this.$store.commit('popups/ADD_ALERT', {
              type: 'error',
              title: 'Contract Connection',
              message: err.response.data.message,
            })
          }
        })
    },
    enterTradePin() {
      this.connectInputOpened = true
      setTimeout(() => {
        this.$refs['connect-input'].focus()
      }, 10)
    },
    newContract() {
      this.$emit('new-contract')
    },
    mouseClickHandler(e) {
      if (!this.$el.contains(e.target) && this.opened) {
        this.newContract()
        this.connectInputOpened = false
      }
    },
  },
  mounted() {
    document.addEventListener('mouseup', this.mouseClickHandler)
  },
  destroyed() {
    document.removeEventListener('mouseup', this.mouseClickHandler)
  },
}
</script>

<style lang="scss">
@import "@/scss/_smart-grid";
@import "@/scss/_variables";

@keyframes attention {
  0% {
    color: $cyan-alpha;
  }

  20% {
    color: $cyan;
  }

  100% {
    color: $cyan-alpha;
  }
}

.new-contract {
  width: calc(100% + 60px);
  height: 405px;
  font-family: Montserrat;
  font-weight: 500;
  margin: -30px;
  user-select: none;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  &-button {
    position: absolute;
    z-index: 2;
    border-radius: 0;
    height: 100%;
    width: 100%;
    color: $cyan;
    cursor: pointer;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    display: flex;
    background-color: transparent;
    opacity: 0;
    transform: scale(.7);
    transition: all 0.1s;
    &:hover {
      background-color: transparentize($cyan, .9);
    }
  }

  .trade-card {
    position: absolute;
    z-index: 1;
    width: 100%;
    height: calc(100% - 20px);

    &-menu {
      color: white;
      cursor: pointer;
      display: grid;
      height: 100%;
      grid-template-rows: 1fr 1px 1fr;
      grid-gap: 10px;

      .divider {
        width: 100%;
        height: 0;
        border-bottom: 1px $cyan solid;
      }

      a {
        text-decoration: none;
        cursor: pointer;
        height: 50%;
        padding: 0 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        width: calc(100% - 40px);
        border-radius: 3px;
        background-color: #00000000;
        color: $cyan;

        .icon {
          margin-right: 10px;
          font-size: 1.1rem;
        }

        &:hover {
          color: white;
          background-color: #ffffff11;
        }

        &.disabled {
          cursor: default;
          opacity: 0.8;
          animation-name: attention;
          animation-duration: 2s;
          animation-iteration-count: infinite;
          animation-timing-function: ease-in-out;
          &:hover {
            color: $cyan;
            background-color: #00000000;
          }
        }
      }

      .connect-input {
        background: transparent;
        border: none;
        outline: none;
        font-size: 3rem;
        text-align: center;
        color: white;
        height: 100%;
        width: 100%;
        letter-spacing: 1rem;

        &::placeholder {
          opacity: 0.17;
          color: $cyan;
          font-family: Montserrat;
          font-weight: 500;
          letter-spacing: 0.1rem;
        }
      }
    }
  }

  .opened {
    opacity: 1;
    border-radius: 10px;
    font-size: 1.3rem;
    transform: scale(1);
  }

  .shield {
    margin-bottom: 1rem;
    font-size: 6rem;
  }
}
</style>
