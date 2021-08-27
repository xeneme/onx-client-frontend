<template>
  <div
    class="price-block"
    :style="{ 'flex-direction': flip ? 'column-reverse' : '' }"
  >
    <div
      class="price-block_main"
      ref="main"
      :style="{ fontSize: flip ? '.8rem' : '' }"
    >
      {{ main }}
    </div>
    <div class="price-block_secondary">
      {{ secondary }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'price-block',
  props: {
    main: String,
    secondary: String,
    flip: Boolean,
    currency: String,
  },
  watch: {
    main(value, old) {
      var v = Number(value.replace('$', '').replace(',', ''))
      var o = Number(old.replace('$', '').replace(',', ''))
      
      if (v < o || value[0] === '-') {
        this.$refs.main.style.color = 'red'
      } else if (v > o) {
        this.$refs.main.style.color = 'greenyellow'
      } else {
        this.$refs.main.style.color = ''
      }

      setTimeout(() => {
        this.$refs.main.style.color = ''
      }, 2000)
    },
  },
}
</script>

<style lang="scss" scoped>
@import "@/scss/_smart-grid";

.price-block {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;

  @include to(50rem) {
    margin: 0 8px;
  }
  @include from(50rem) {
    margin: 0 20px;
  }

  &_main,
  &_secondary {
    color: white;
    margin-bottom: 2px;
    transition: color 1s;
  }

  &_secondary {
    font-size: 0.7rem;
    opacity: 0.6;
  }
}
</style>
