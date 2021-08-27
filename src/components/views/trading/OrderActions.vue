<template>
  <div class="actions">
    <div :class="['cover', action]"></div>
    <div
      :class="['actions-buy', action == 'buy' ? 'active' : '']"
      @click="changeAction('buy')"
    >
      Buy
    </div>
    <div
      :class="['actions-sell', action == 'sell' ? 'active' : '']"
      @click="changeAction('sell')"
    >
      Sell
    </div>
  </div>
</template>

<script>
export default {
  name: 'order-actions',
  data: () => ({
    action: 'buy',
  }),
  methods: {
    changeAction(action) {
      this.action = action
      this.$emit('input', action)
    },
  },
}
</script>

<style lang="scss" scoped>
@import "@/scss/_smart-grid";
@import "@/scss/_variables";

.actions {
  display: flex;
  margin: 20px;
  margin-bottom: 30px;
  overflow: hidden;
  border-radius: 5px;
  background: $cyan-alpha;
  user-select: none;
  position: relative;

  .cover {
    position: absolute;
    width: 50%;
    height: 100%;
    top: 0;
    pointer-events: none;

    &.buy {
      left: 0;
      background-color: #02c076;
    }

    &.sell {
      background-color: $red;
      left: 50%;
    }
  }

  * {
    height: 30px;
    width: 50%;
    display: grid;
    align-content: center;
    font-family: Montserrat;
    font-weight: bold;
    cursor: pointer;
    opacity: 0.9;
    color: $light-blue;
    transition: all 0.2s;

    &:hover {
      color: white;
    }
    &.active {
      color: white;
    }
  }
}
</style>
