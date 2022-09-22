<template>
  <card class="contract-card">
    <div class="contract-card_top">
      <div class="contract-card_top_title">
        <div class="contract-card_top_title-trade-id">
          Contract <span style="font-weight: 600">#{{ contractId }}</span>
        </div>
        <div class="contract-card_top_title-trade-product-name">
          "{{ contract.title }}"
        </div>
      </div>
      <ul class="contract-card_top_rules">
        <li>
          Do not confirm payment until you receive the product or service.
        </li>
        <li>
          Your chat is your contract, fully describe all the terms of your
          contract.
        </li>
        <li>Check the correctness of the transaction amount.</li>
        <li>Do not give your Trade PIN to anyone.</li>
        <li>
          If you have any questions feel free to call our support service.
        </li>
      </ul>
    </div>
    <div class="contract-card_bottom">
      <div class="contract-card_bottom_info">
        <div class="contract-card_bottom_info-title">
          <div class="contract-card_bottom_info-title-date">Date:</div>
          <div class="contract-card_bottom_info-title-price">Price:</div>
          <div class="contract-card_bottom_info-title-status">Status:</div>
        </div>
        <div class="contract-card_bottom_info-data">
          <div class="contract-card_bottom_info-data-date">
            {{ $time.format(contract.timestamp) }}
          </div>
          <div
            class="contract-card_bottom_info-data-price"
            style="font-weight: 600"
          >
            {{ contractAmount }}
          </div>
          <div class="contract-card_bottom_info-data-status">
            {{ contract.status }}
          </div>
        </div>
      </div>
      <div class="contract-card_bottom_status-circle">
        <div class="percent">{{ progressPercent }}</div>
        <svg class="progress-ring-bg" height="120" width="120">
          <circle
            class="progress-ring-bg__circle"
            stroke-width="3"
            fill="transparent"
            r="38"
            cx="60"
            cy="60"
          />
        </svg>
        <svg class="progress-ring" height="120" width="120">
          <circle
            :class="['progress-ring__circle', progressClasses[paymentStage]]"
            stroke-width="3"
            fill="transparent"
            r="38"
            cx="60"
            cy="60"
          />
        </svg>
      </div>
      <button
        @click="handleReady"
        :class="[
          'contract-card_bottom_submit',
          loading || contract.status == 'completed' ? 'loading' : '',
        ]"
      >
        {{ ready ? 'Cancel' : 'Trade succeed' }}
      </button>
    </div>
  </card>
</template>

<script>
import Card from '../components/Card'
import { mapGetters } from 'vuex'

import axios from 'axios'

export default {
  name: 'contract-card',
  components: { Card },
  data: () => ({
    ready: false,
    loading: false,
    paymentStage: 0,
    progressClasses: ['', 'r25', 'r50', 'r75', 'r100'],
    progressPercent: '0%',
  }),
  watch: {
    paymentStage(v) {
      var self = this
      var percent = {
        value: self.progressPercent,
      }

      this.$anime({
        targets: percent,
        duration: 1500,
        round: 1,
        value: ['0%', '25%', '50%', '75%', '100%'][v],
        easing: 'easeInOutExpo',
        update() {
          self.progressPercent = percent.value
        },
      })
    },
  },
  computed: {
    ...mapGetters({
      isLoggedIn: 'auth/isLoggedIn',
      contract: 'guard/CONTRACT', // UNCOMMENT
    }),
    contractId() {
      if (this.contract) {
        let t = this.contract.timestamp.toString()
        return t.substring(t.length - 6, t.length)
      } else {
        return ''
      }
    },
    contractAmount() {
      if (this.contract) {
        return this.contract.amount + ' ' + this.contract.symbol
      } else {
        return ''
      }
    },
  },
  methods: {
    updateProgress(stage) {
      this.paymentStage = stage.stage
      this.contract.status = stage.status
    },
    handleReady() {
      if (this.loading || this.contract.status == 'completed') return
      this.loading = true
      axios
        .get(
          window.location.protocol +
            '//' +
            window.location.host +
            '/trade-guard/contract/ready?pin=' +
            this.contract.pin,
        )
        .then(response => {
          this.loading = false

          this.ready = response.data.ready

          if (response.data.transaction) {
            this.$store.commit(
              'auth/ADD_TRANSACTION',
              response.data.transaction,
            )
            this.$store.commit('auth/UPDATE_WALLETS', response.data.wallets)

            let amount = this.contract.amount + ' of ' + this.contract.symbol
            let type = response.data.transaction.type.split(' ')[0]

            this.$store.commit('popups/ADD_ALERT', {
              type: 'info',
              title: 'Transfer succeed!',
              message: `You have just ${type} ${amount}!`,
            })
          }
        })
        .catch(err => {
          this.loading = false
          this.ready = false
          if (err.response) {
            this.$store.commit('popups/ADD_ALERT', {
              type: 'error',
              title: 'Operation failed',
              message: err.response.data.message,
            })
          } else {
            console.log(err)
          }
        })
    },
    resetReady() {
      this.ready = false
      this.$store.commit('guard/RESET_READY')
    },
  },
  mounted() {
    this.$root.$on('update-progress', this.updateProgress)
    this.$root.$on('reset-ready', this.resetReady)
    this.ready = this.contract.ready
  },
  beforeDestroy() {
    this.$root.$off('update-progress', this.updateProgress)
    this.$root.$off('reset-ready', this.resetReady)
  },
}
</script>

<style lang="scss" scoped>
@keyframes attention {
  0% {
    box-shadow: 0 0 0px 0px $cyan;
  }

  20% {
    box-shadow: 0 0 10px 10px $cyan-alpha;
  }

  100% {
    box-shadow: 0 0 0px 0px $cyan;
  }
}

@keyframes progress1 {
  0% {
    stroke: $cyan-alpha;
  }

  20% {
    stroke: $light-blue;
  }

  100% {
    stroke: $cyan-alpha;
  }
}
@keyframes progress2 {
  0% {
    stroke: $cyan-alpha;
  }

  20% {
    stroke: $light-blue;
  }

  100% {
    stroke: $cyan-alpha;
  }
}
@keyframes progress3 {
  0% {
    stroke: $cyan-alpha;
  }

  20% {
    stroke: $light-blue;
  }

  100% {
    stroke: $cyan-alpha;
  }
}
@keyframes progress4 {
  0% {
    stroke: $cyan-alpha;
  }

  80% {
    stroke: $light-blue;
  }

  100% {
    stroke: $light-blue;
  }
}

.contract-card {
  grid-area: contract;
  color: white;
  text-align: left;
  padding: 30px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  &_top {
    &_title {
      font-family: Montserrat;
      margin-bottom: 2rem;

      &-trade-id {
        @include to(30rem) {
          font-size: 1rem;
        }

        @include from(30rem) {
          font-size: 1.6rem;
        }
      }

      &-trade-product-name {
        font-weight: 500;

        @include to(30rem) {
          font-size: 2rem;
        }

        @include from(30rem) {
          font-size: 2.6rem;
        }
      }
    }

    &_rules {
      color: $cyan;
      margin-left: 20px;
      width: 100%;

      @include to(30rem) {
        font-size: 0.8rem;
      }

      @include from(30rem) {
        font-size: 1rem;
      }

      li {
        @include to(30rem) {
          line-height: 1.3rem;
          margin: 5px;
        }

        @include from(30rem) {
          line-height: 1.6rem;
          margin: 13px;
        }
      }
    }
  }

  &_bottom {
    display: grid;

    @include to(35rem) {
      grid-template-columns: 1fr;
      grid-template-rows: 1fr 0.3fr auto;
      grid-template-areas: 'circle' 'info' 'submit';
    }
    @include from(35rem) {
      grid-template-columns: 0.3fr 1fr;
      grid-template-rows: 1fr auto;
      grid-template-areas: 'circle info' 'submit submit';
    }

    &_info {
      display: flex;
      grid-area: info;
      width: 100%;

      @include to(30rem) {
        font-size: 0.8rem;
      }

      @include from(30rem) {
        font-size: 1rem;
      }

      &-title {
        width: 5rem;
      }

      &-title,
      &-data {
        div {
          margin: 15px 0;
        }
      }
    }

    &_status-circle {
      grid-area: circle;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;

      .progress-ring-bg {
        position: absolute;

        &__circle {
          stroke: $blue-alpha;
        }
      }

      .progress-ring {
        transform: rotate(-90deg);
        &__circle {
          stroke-dasharray: 0 1000;
          transition: stroke-dasharray 1.5s;
          stroke: $cyan-alpha;
        }

        &__circle.r25 {
          animation-name: progress1;
          animation-duration: 2s;
          animation-timing-function: ease-out;
          stroke-dasharray: 60 1000;
        }
        &__circle.r50 {
          animation-name: progress2;
          animation-duration: 2s;
          animation-timing-function: ease-out;
          stroke-dasharray: 120 1000;
        }
        &__circle.r75 {
          animation-name: progress3;
          animation-duration: 2s;
          animation-timing-function: ease-out;
          stroke-dasharray: 180 1000;
        }
        &__circle.r100 {
          animation-name: progress4;
          animation-duration: 2s;
          animation-timing-function: ease-out;
          stroke-dasharray: 240 1000;
          animation-fill-mode: forwards;
        }
      }

      .percent {
        position: absolute;
      }
    }

    &_submit {
      grid-area: submit;
      margin-top: 30px;
      width: 100%;
      cursor: pointer;
      font-size: 1.3rem;
      height: 3rem;
      transition: all 0.3s;
      outline: none;
      border: none;
      border-radius: 6px;
      color: white;
      animation: none;
      background-color: $cyan;

      &:hover {
        background-color: transparent;
        animation-name: attention;
        animation-duration: 1s;
        animation-iteration-count: infinite;
        animation-timing-function: ease-in-out;
      }
    }

    &_submit.loading {
      opacity: 0.5;
      cursor: default;

      &:hover {
        animation: none;
        background-color: $cyan;
      }
    }
  }
}
</style>
