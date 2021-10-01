<template>
  <div class="deposit">
    <v-panel
      title="Deposit"
      label="Deposit requests"
      :loading="loading"
      :second="{
        size: 'lg',
      }"
    >
      <template #form-wrap>
        <Form
          title="Select currency"
          type="select"
          selectWidth="100%"
          :options="Object.keys(wallets).map(currency => currency.capitalize())"
        />
        <Form
          :title="'Amount in ' + currency"
          full="true"
          type="text"
          :value="getMinimum"
          :subtitle="'Min ' + getMinimum"
          v-model="amount"
        />
        <Button
          class="pay_button"
          theme="apple"
          text="Request"
          @click.native="deposit"
        />
      </template>
      <template #second-form-wrap>
        <Deposits :value="deposits || []" />
      </template>
    </v-panel>
  </div>
</template>

<script>
import Form from '../Form.vue'
import Deposits from '../components/Deposits.vue'
import Button from '../Button.vue'
import { mapGetters } from 'vuex'

import qrcode from 'qrcode-generator'

export default {
  name: 'Deposit',
  components: {
    Form,
    Button,
    Deposits,
  },
  inject: ['profile'],
  data: () => ({
    loading: false,
    amount: 0.01,
  }),
  computed: {
    computedAmount() {
      let amount = +this.amount

      if (amount < 0.01) {
        return 'Min 0.01'
      } else if (isNaN(amount) || amount > 999999999999999) {
        return 'Invalid amount'
      }

      return amount.toFixed(10)
    },
    getMinimum() {
      let net = this.currencyToNetwork(this.currency)
      return this.profile.settings.depositMinimum[net]
    },
    ...mapGetters({
      currency: 'popups/exchangeSelectedCurrency',
      wallets: 'auth/wallets',
      deposits: 'auth/deposits',
    }),
  },
  methods: {
    deposit() {
      let amount = +this.amount

      if (isNaN(amount)) {
        this.handleError({
          message: 'Amount must be a number!',
        })
      } else {
        this.loading = true
        this.$axios
          .post('api/wallet/deposit/create', {
            amount,
            currency: this.currency,
          })
          .then(response => {
            // this.$emit('deposit-created', {})
            this.handleSuccess(response.data)
            this.loading = false
          })
          .catch(err => {
            this.loading = false
            this.handleError(err.response.data)
          })
      }
    },
    handleError(response) {
      if (response) {
        // this.$store.commit('auth/ADD_TRANSACTION', response.deposit)
        this.$store.commit('popups/ADD_ALERT', {
          type: 'error',
          title: 'Deposit request failed',
          message:
            response.message.length < 200
              ? response.message
              : 'Message is too long',
        })
      }
    },
    handleSuccess(response) {
      const d = response.deposit

      const qr = a => {
        var q = qrcode(0, 'L')
        q.addData(a)
        q.make()
        return q.createImgTag(4, 1)
      }

      this.$emit('deposit', {
        visible: true,
        id: d.payment,
        address: d.address,
        amount: d.amount + ' ' + d.network,
        qr: qr(d.address),
      })

      this.$store.commit('auth/ADD_TRANSACTION', d)
    },
    currencyToNetwork(c) {
      return {
        Bitcoin: 'BTC',
        Ethereum: 'ETH',
        Litecoin: 'LTC',
        'Usd coin': 'USDC',
      }[c]
    },
  },
  mounted() {
    this.$emit('mounted')
    this.$anime({
      targets: '.deposit',
      scale: [0.95, 1],
      easing: 'easeOutExpo',
      duration: 800,
    })
  },
}
</script>

<style lang="sass" scoped>
@import "@/scss/_smart-grid"
@import "@/scss/_variables"

.created_addresses
  margin-top: 30px

  &_loading
    position: absolute
    width: 100%
    height: 100%
    top: 0
    left: 0
    z-index: 3
    overflow: hidden
    background-color: $blue-alpha
    pointer-events: none
    transition: opacity .3s
    opacity: 0

    &_icon
      place-self: center
      width: 80px
      margin-bottom: 10px
      height: 100%
      color: $cyan

.pay_button
  width: calc(100% - 60px)
</style>
