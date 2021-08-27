<template>
  <popup
    icon="clock"
    :title="'Payment' + (value.id ? ' #' + value.id : '')"
    v-if="value"
    :show="value.visible"
  >
    <div class="payment-popup">
      <div class="title">Send exactly {{ value.amount }} at</div>
      <Tooltip text="Address copied!" theme="white" :index="value.address" />
      <div class="address" @click="copyPaymentAddress(value.address)">
        {{ value.address }}
      </div>
      <div class="wrap">
        <div class="desc">
          Your payment will be completed after confirmation by the network.
          Confirmation time may vary and depends on the Commission
        </div>
        <div class="qr">
          <div class="qrcode" v-html="value.qr"></div>
        </div>
      </div>
    </div>
  </popup>
</template>

<script>
import Popup from '@/components/partial/Popup.vue'
import Tooltip from '@/components/partial/Tooltip.vue'

import qrcode from 'qrcode-generator'

export default {
  name: 'payment',
  components: {
    Popup,
    Tooltip,
  },
  props: {
    value: {
      type: Object,
      default: () => ({
        visible: false,
        id: 0,
        address: '',
        amount: '',
        qr: a => {
          var qr = qrcode(0, 'L')
          qr.addData(a)
          qr.make()
          return qr.createImgTag(4, 1)
        },
      }),
    },
  },
  methods: {
    copyPaymentAddress(a) {
      this.$root.$emit('tooltip:once', a)
      this.$copy(a)
    },
  },
}
</script>

<style lang="sass" scoped>

@import "@/scss/_smart-grid"
@import "@/scss/_variables"

$xs-break: 22rem
$sm-break: 32rem

.payment-popup
  display: grid
  justify-items: center

  .title
    color: white
    @include to($xs-break)
      font-size: .9rem
    @include from($xs-break)
      font-size: 1.2rem

  .address
    display: grid
    align-content: center
    margin: 10px 0px
    width: 100%
    padding: 0 10px
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
    overflow: hidden

    @include to($xs-break)
      font-size: .7rem
    @include from($xs-break)
      font-size: .9rem

    &:hover
      background-color: $cyan
      color: white

  .wrap
    width: 100%
    align-items: center
    margin-top: 20px

    @include to($sm-break)
      display: flex
      flex-direction: column
    @include from($sm-break)
      display: grid
      justify-content: space-between
      align-items: start
      grid-template-columns: 1fr auto

    .desc
      text-align: left
      display: grid
      align-content: end
      width: 100%
      color: $cyan
      margin-bottom: 20px
    .qr
      height: 100%
      width: 100%
      padding-left: 10px
      display: grid

      .qrcode
        img
          width: 130px
          height: 130px

      @include to($sm-break)
        justify-content: center
      @include from($sm-break)
        justify-content: end
</style>
