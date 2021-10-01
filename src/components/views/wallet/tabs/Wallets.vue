<template>
  <v-panel
    title="Wallet"
    :first="{
      size: 'md',
    }"
    :second="{
      size: 'md',
      notCard: true,
    }"
  >
    <template #form-wrap>
      <div
        v-for="currency in Object.keys(wallets)"
        class="wallet"
        :key="currency"
      >
        <Form
          :title="currency.capitalize()"
          :secondTitle="coins(currency) + ' ' + toNetwork(currency)"
          type="text"
          isAddress="true"
          :value="wallets[currency].address"
          :full="true"
          :secret="true"
          :index="currency"
        />
        <label
          class="wallet_dollars"
          v-if="typeof wallets[currency].balance == 'number'"
          >{{ toUSD(wallets[currency]) }}$</label
        >
        <div class="wallet__balance">
          <div class="wallet__balance_chart">
            <svg viewBox="0 0 200 100">
              <polyline
                fill="none"
                class="data-points"
                stroke="#00aaf9"
                stroke-width="1"
                :points="wallets[currency].chartPoints"
              />
            </svg>
          </div>
        </div>
      </div>
    </template>
    <template #second-form-wrap>
      <new-contract
        @new-contract="newContract"
        :opened="newContractPopupOpened"
      />
    </template>
  </v-panel>
</template>

<script>
import Form from '../Form.vue'
import NewContract from '../components/NewContract.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'Wallets',
  components: {
    Form,
    NewContract,
  },
  data: () => ({
    newContractPopupOpened: false,
  }),
  computed: {
    ...mapGetters({
      wallets: 'auth/wallets',
    }),
  },
  methods: {
    newContract() {
      this.newContractPopupOpened = !this.newContractPopupOpened
    },
    toUSD(wallet) {
      return (wallet.balance * wallet.price).toFixed(2)
    },
    toNetwork(currency) {
      return {
        bitcoin: 'BTC',
        ethereum: 'ETH',
        litecoin: 'LTC',
        'usd coin': 'USDC',
      }[currency]
    },
    coins(currency) {
      let b = this.wallets[currency].balance

      b = Math.round(b * 10000000) / 10000000

      return b > 0 ? b : '0.0'
    },
    balance(currency) {
      if (!this.wallets) return ''
      let symbol = this.toNetwork(currency)

      return this.wallets[symbol].balance.toFixed(4) + ' ' + symbol
    },
    createAddress() {
      this.loading()
      setTimeout(() => this.loaded(), 2000)
    },
    loading() {
      this.busy = true
      this.$el.querySelector('.created_addresses_loading').style.opacity = 1
      this.$el.querySelector('.created_addresses_loading').style.pointerEvents =
        'all'
    },
    loaded() {
      this.busy = false
      this.$el.querySelector('.created_addresses_loading').style.opacity = 0
      this.$el.querySelector('.created_addresses_loading').style.pointerEvents =
        'none'
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

$break: 55rem

.buttons-group
  margin: 20px 0
  width: 100%
  height: 40px
  display: flex
  justify-content: space-between

  .form__button
    padding: 0
    display: grid
    align-content: center
    width: 100px
    height: 100%
    justify-self: center

  .form__input
    background: $blue-alpha
    cursor: text
    transition: background-color .3s
    color: #0094FF
    text-indent: 10px
    border: none
    border-radius: 3px
    margin-right: 0
    width: 120px
    height: 100%
    padding: 0 5px

    &:focus
      background: $blue
      outline: none

    &::selection
      background: $light-blue
      color: white

.wallet
  width: 100%
  display: grid
  border-bottom: 1px $cyan-alpha solid
  grid-template-columns: 1fr 230px
  display: grid

  @include to(33rem)
    grid-template-columns: 1fr
  @include from(33rem)
    grid-template-columns: 1fr 230px

  .form.full
    width: 100%

  &:last-child
    border: none

  &_dollars
    display: none
    color: white
    font-size: .8rem
    position: absolute
    z-index: 1
    margin-top: 45px
    right: 65px

  &__balance
    @include to(33rem)
      display: none
    @include from(33rem)
      display: block

    &_chart
      position: absolute
      z-index: 0
      justify-self: start
      margin: 15px 20px
      display: grid
      width: 200px
      height: 65px
      border-radius: 5px
      background-color: $blue-alpha
      background-image: url('../../../../assets/svg/exchange/chart-grid.svg')
      background-position: center
      background-size: cover
      overflow: hidden

      svg
        opacity: .8
        place-self: center

  .form
    padding-left: 10px
    padding-top: 12px
    width: 50%
</style>
