<template>
  <i :class="['ox-icon', icon]">
    <div class="hover_circle"></div>
  </i>
</template>

<script>
export default {
  name: 'Icon',
  props: ['icon'],
};
</script>

<style lang="sass" scoped>
@import "@/scss/_variables"

.ox-icon
  display: inline-block
  width: 55px
  height: 55px
  overflow: hidden

  &.bitcoin
    background: url(../../assets/svg/icons/bitcoin.svg) no-repeat center center
    background-size: cover

  &.charts
    background: url(../../assets/svg/icons/charts.svg) no-repeat center center
    background-size: cover
    width: 34px
    height: 34px

  &.ethereum
    background: url(../../assets/svg/icons/ethereum.svg) no-repeat center center
    background-size: 40px

  &.usdc
    background: url(../../assets/svg/icons/usdc.svg) no-repeat center center
    background-size: 40px

  &.bitcoin-cash
    background: url(../../assets/svg/icons/bitcoin-cash.svg) no-repeat center center
    background-size: cover

  &.tether
    background: url(../../assets/svg/icons/usdt.svg) no-repeat center center
    background-size: 40px

  &.ripple
    background: url(../../assets/svg/icons/xrp.svg) no-repeat center center
    background-size: 40px

  &.chainlink
    background: url(../../assets/svg/icons/chain.svg) no-repeat center center
    background-size: 40px

  &.binance-coin
    background: url(../../assets/svg/icons/bnb.svg) no-repeat center center
    background-size: 40px

  &.bitcoin-sv
    background: url(../../assets/svg/icons/bsv.svg) no-repeat center center
    background-size: 40px

  &.polkadot
    background: url(../../assets/svg/icons/dot.svg) no-repeat center center
    background-size: 40px

  &.litecoin
    background: url(../../assets/svg/icons/litecoin.svg) no-repeat center center
    background-size: 40px

  &.protection
    background: url(../../assets/svg/icons/protection.svg) no-repeat center center
    background-size: 50%
    background-position: center
    padding: 2px
    background-color: white
    border-radius: 100%
    border: 5px solid $cyan

  &.safety
    background: url(../../assets/svg/icons/safety.svg) no-repeat center center
    background-size: 50%
    background-position: center
    padding: 2px
    background-color: white
    border-radius: 100%
    border: 5px solid $cyan

  &.support
    background: url(../../assets/svg/icons/support.svg) no-repeat center center
    background-size: 50%
    background-position: center
    padding: 2px
    background-color: white
    border-radius: 100%
    border: 5px solid $cyan

  &.stability
    background: url(../../assets/svg/icons/stability.svg) no-repeat center center
    background-size: 40%
    background-position: center
    padding: 2px
    background-color: white
    border-radius: 100%
    border: 5px solid $cyan
</style>
