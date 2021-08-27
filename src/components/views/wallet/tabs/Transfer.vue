<template>
  <v-panel
    title="Transfer"
    label="Transfers"
    :loading="loading"
    :second="{
      size: 'lg',
    }"
  >
    <template #form-wrap>
      <Form
        :title="'Amount in ' + currency"
        :subtitle="`(${profile.settings.commission}% commission)`"
        :total="computedAmount"
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
        title="Transfer address or E-mail"
        type="text"
        value=""
        isAddress="true"
        v-model="address"
      />
      <Button
        class="pay_button"
        theme="secondary_big"
        text="Transfer"
        @keydown.enter.native="transfer"
        @click.native="transfer"
      />
    </template>
    <template #second-form-wrap>
      <Transfers :value="transactions || []" />
    </template>
  </v-panel>
</template>

<script>
import Button from '../Button.vue'
import Form from '../Form.vue'
import Transfers from '../components/Transfers.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'Transfer',
  components: {
    Form,
    Button,
    Transfers,
  },
  inject: ['profile'],
  data: () => ({
    address: '',
    amount: '0.1',
    loading: false,
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
      wallets: 'auth/wallets',
      transactions: 'auth/transfers',
      currency: 'popups/exchangeSelectedCurrency',
    }),
  },
  methods: {
    currencyToNetwork(c) {
      return {
        Bitcoin: 'BTC',
        Ethereum: 'ETH',
        Litecoin: 'LTC',
      }[c]
    },
    transfer() {
      let amount = +this.amount

      if (isNaN(amount)) {
        this.handleError({
          message: 'Amount must be a number!',
        })
      } else {
        this.loading = true
        this.$axios
          .post('/api/wallet/transfer', {
            recipient: this.address,
            amount,
            currency: this.currency,
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
        this.$store.commit('auth/ADD_TRANSACTION', response.transaction)
        this.$store.commit('popups/ADD_ALERT', {
          type: 'error',
          title: 'Transfer failed',
          message: response.message,
        })
      }
    },
    handleSuccess(response) {
      this.$store.commit('auth/ADD_TRANSACTION', response.transaction)
      this.$store.commit('auth/UPDATE_WALLETS', response.wallets)
      this.$store.commit('popups/ADD_ALERT', {
        type: 'info',
        title: 'Transfer succeed!',
        message:
          'You have just successfully sent ' +
          response.transaction.amount +
          ' of ' +
          response.transaction.currency +
          '!',
      })
    },
  },
  mounted() {
    this.$emit('mounted')
  },
}
</script>

<style lang="sass" scoped>
@import "@/scss/_smart-grid"
@import "@/scss/_variables"

.pay_button
  margin-top: 10px
  width: calc(100% - 38px)
</style>
