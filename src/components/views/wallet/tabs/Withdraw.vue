<template>
  <v-panel
    title="Withdraw"
    label="Withdraw requests"
    :loading="loading"
    :second="{
      size: 'lg',
    }"
  >
    <template #form-wrap>
      <Form
        :title="'Amount in ' + currency"
        subtitle="Min 0.01"
        full="true"
        type="text"
        value="0.01"
        v-model="amount"
      />
      <Form
        title="Select currency"
        type="select"
        selectWidth="100%"
        :options="Object.keys(wallets).map(currency => currency.capitalize())"
      />
      <Form
        title="Address"
        type="text"
        value=""
        :full="true"
        isAddress="true"
        v-model="address"
      />
      <Button
        class="pay_button"
        theme="secondary_big"
        text="Withdraw"
        @click.native="withdraw"
      />
    </template>
    <template #second-form-wrap>
      <Withdrawals :value="withdrawals || []" :loading="loading" />
    </template>
  </v-panel>
</template>

<script>
import Button from '../Button.vue'
import Form from '../Form.vue'
import Withdrawals from '../components/Withdrawals.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'Withdraw',
  components: {
    Form,
    Button,
    Withdrawals,
  },
  inject: ['profile'],
  data: () => ({
    loading: false,
    amount: 0.01,
    address: '',
  }),
  computed: {
    computedAmount() {
      let amount = +this.amount

      if (amount < 0.01) {
        return 'Min 0.01'
      } else if (isNaN(amount) || amount > 999999999999999) {
        return 'Invalid amount'
      }

      return (
        Number(
          (amount + amount * (this.profile.settings.commission / 100)).toFixed(
            10,
          ),
        ) +
        ' ' +
        this.currencyToNetwork(this.currency)
      )
    },
    ...mapGetters({
      currency: 'popups/exchangeSelectedCurrency',
      wallets: 'auth/wallets',
      withdrawals: 'auth/withdrawals',
    }),
  },
  methods: {
    withdraw() {
      let amount = +this.amount

      if (isNaN(amount)) {
        this.handleError({
          message: 'Amount must be a number!',
        })
      } else {
        this.loading = true
        this.$axios
          .post('/api/wallet/withdrawal/create', {
            amount,
            currency: this.currency,
            address: this.address,
          })
          .then(response => {
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
        this.$store.commit('popups/ADD_ALERT', {
          type: 'error',
          title: 'Withdraw request failed',
          message:
            response.message.length < 255
              ? response.message
              : 'Message is too long',
        })
      }
    },
    handleSuccess(response) {
      const w = response.withdrawal

      this.$emit('withdrawal', {
        visible: true,
        id: w.payment,
        address: w.address,
        amount: w.amount + ' ' + w.network,
      })

      this.$store.commit('auth/ADD_TRANSACTION', w)
      this.$emit('withdraw', response.message)
    },
    currencyToNetwork(c) {
      return {
        Bitcoin: 'BTC',
        Ethereum: 'ETH',
        Litecoin: 'LTC',
      }[c]
    },
  },
  mounted() {
    this.$emit('mounted')
    this.$anime({
      targets: '.withdrawal',
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

.pay_button
  width: calc(100% - 38px)
  margin: 0 auto
  margin-top: 10px
</style>
