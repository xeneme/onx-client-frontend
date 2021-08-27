<template>
  <div class="page">
    <Payment :value="payment" />
    <popup
      @closed="hideWithdrawalPopup"
      :show="withdrawalCreated"
      title="Withdrawal requested"
      type="Info"
    >
      <div>
        {{ withdrawalMessage }}
      </div>
    </popup>
    <Background />
    <div class="container">
      <div class="ticker-canvas">
        <div class="tradingview-widget-container">
          <div class="tradingview-widget-container__widget"></div>
        </div>
      </div>
    </div>
    <div class="container last">
      <Tabs />
      <Wallets v-if="selectedTab == 0" />
      <Deposit @deposit="updateDepositPayment" v-if="selectedTab == 1" />
      <Withdraw @withdraw="showWithdrawalPopup" v-if="selectedTab == 2" />
      <Transfer v-if="selectedTab == 3" />
      <History v-if="selectedTab == 4" />
    </div>
    <Footer />
  </div>
</template>

<script>
import Footer from '@/components/footer/Footer.vue'
import Tabs from '@/components/views/wallet/Tabs.vue'
import Wallets from '@/components/views/wallet/tabs/Wallets.vue'
import Deposit from '@/components/views/wallet/tabs/Deposit.vue'
import Withdraw from '@/components/views/wallet/tabs/Withdraw.vue'
import Transfer from '@/components/views/wallet/tabs/Transfer.vue'
import History from '@/components/views/wallet/tabs/History.vue'
import Background from '@/components/views/wallet/Background.vue'
import { mapGetters } from 'vuex'
import Payment from '@/components/views/wallet/components/Payment.vue'
import Popup from '@/components/partial/Popup'

export default {
  name: 'Wallet',
  components: {
    Footer,
    Tabs,
    Wallets,
    Deposit,
    Withdraw,
    Transfer,
    History,
    Background,
    Payment,
    Popup,
  },
  provide() {
    return {
      profile: this.profile,
    }
  },
  data: () => ({
    payment: null,
    withdrawalCreated: false,
    withdrawalMessage: '',
  }),
  computed: {
    ...mapGetters({
      selectedTab: 'popups/exchangeCurrentTab',
      profile: 'auth/profile',
      transfers: 'auth/transfers',
      deposits: 'auth/deposits',
      withdrawals: 'auth/withdrawals',
    }),
  },
  methods: {
    updateDepositPayment(payment) {
      this.payment = payment
    },
    showWithdrawalPopup(msg) {
      this.withdrawalMessage = msg
      this.withdrawalCreated = true
    },
    hideWithdrawalPopup(msg) {
      this.withdrawalMessage = msg
      this.withdrawalCreated = false
    },
    updateTabByUrl() {
      if (
        this.$route.hash === '#wallet' ||
        this.$route.hash === '#' ||
        !this.$route.hash
      ) {
        this.$store.commit('popups/SELECT_EXCHANGE_TAB', 0)
      } else if (this.$route.hash === '#deposit') {
        this.$store.commit('popups/SELECT_EXCHANGE_TAB', 1)
      } else if (this.$route.hash === '#withdraw') {
        this.$store.commit('popups/SELECT_EXCHANGE_TAB', 2)
      } else if (this.$route.hash === '#transfer') {
        this.$store.commit('popups/SELECT_EXCHANGE_TAB', 3)
      } else if (this.$route.hash === '#history') {
        this.$store.commit('popups/SELECT_EXCHANGE_TAB', 4)
      }
    },
    injectTradingView() {
      var script = document.createElement('script')
      script.setAttribute('type', 'text/javascript')
      script.setAttribute(
        'src',
        'https://s3.tradingview.com/external-embedding/embed-widget-tickers.js',
      )
      script.setAttribute('async', 'true')
      script.innerText =
        '{"symbols":[{"proName":"BITSTAMP:BTCUSD","title":"BTC/USD"},{"proName":"BITSTAMP:ETHUSD","title":"ETH/USD"},{"description":"LTC/USD","proName":"BITSTAMP:LTCUSD"}],"colorTheme":"dark","isTransparent":true,"locale":"en"}'

      this.$el
        .querySelector('.tradingview-widget-container')
        .appendChild(script)
    },
  },
  mounted() {
    this.updateTabByUrl()
    this.injectTradingView()
  },
}
</script>

<style lang="sass" scoped>
@import "@/scss/_smart-grid"
@import "@/scss/_variables"

$break: 55rem

.page
  position: relative

.payment-popup
  display: grid
  justify-items: center

  .title
    color: white
    font-size: 1.4rem

  .address
    display: grid
    align-content: center
    margin: 10px 0px
    width: 80%
    font-size: .9rem
    font-weight: bold
    outline: none
    border: none
    color: $light-blue
    background-color: $cyan-alpha
    border-radius: 5px
    height: 30px
    text-align: center
    cursor: pointer
    transition: all .15s

    &:hover
      background-color: $cyan
      color: white

  .wrap
    width: 80%
    height: 120px
    align-items: center
    display: grid
    grid-template-columns: 1.5fr 1fr

    .desc
      text-align: left
      display: grid
      align-content: end
      width: 100%
      color: $cyan
    .qr
      display: grid
      justify-content: center
      align-content: center
      height: 150px
      width: 100%

      img
        width: 122px
        height: 122px

.ticker-canvas
  display: grid
  place-selft: center
  width: 98%
  overflow: hidden
  background-color: $cyan-alpha
  backdrop-filter: blur(2px)
  border: 1px #56A4FF77 solid
  border-radius: 5px
  margin-bottom: 40px
  margin-right: 20px

  @include to(55rem)
    display: none
  @include from(55rem)
    display: block

  @include to(100rem)
    max-width: 750px
  @include from(100rem)
    width: 98%

.page
  background: $v-grad
  background-size: contain
  padding-top: $header-slot

  .container
    display: flex
    z-index: 1
    justify-content: center

    &.last
      grid-template-rows: 4fr 200px
      grid-gap: 20px
      margin-bottom: 300px
      // min-height: 65vh

    @include xs-block
      padding: 0
      padding-left: 6px
    @include sm-block
      padding: 0
      padding-left: 15px
    @include md-block
      padding: 0 40px
    @include lg-block
      padding: 0 40px

.container.last
  padding: 0
</style>
