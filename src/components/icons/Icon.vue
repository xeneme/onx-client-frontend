<script>
import IconBitcoin from './IconBitcoin'
import IconLitecoin from './IconLitecoin'
import IconEthereum from './IconEthereum'
import IconUsdCoin from './IconUsdCoin'
import IconTelegram from './IconTelegram'
import IconInstagram from './IconInstagram'
export default {
  components: {
    IconBitcoin,
    IconLitecoin,
    IconEthereum,
    IconUsdCoin,
    IconTelegram,
    IconInstagram,
  },
  props: {
    size: {
      type: Number,
      default: 1.5,
    },
    name: {
      type: String,
    },
    color: {
      type: String,
    },
  },
}
</script>

<template>
  <div class="icon">
    <component
      :is="`Icon${name.toPascalCase()}`"
      :width="size + 'rem'"
      :height="size + 'rem'"
      :color="color"
      :stroke="color"
    ></component>
  </div>
</template>

<style lang="scss" scoped>
.icon {
  display: flex;
  align-items: center;
  width: min-content;
  height: 100%;
  transition: transform 150ms ease;
}
</style>
