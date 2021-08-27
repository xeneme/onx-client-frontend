<template>
  <div class="card">
    <slot />
    <div class="card-light" v-if="false" :style="{ top: my + 'px', left: mx + 'px' }"></div>
  </div>
</template>

<script>
export default {
  name: 'card',
  data: () => ({
    mx: 0,
    my: 0,
  }),
  methods: {
    handleMouseMove(e) {
      this.mx = e.x - this.$el.getBoundingClientRect().x - 200
      this.my = e.y - this.$el.getBoundingClientRect().y - 200
    },
  },
  mounted() {
    if (this.$isDesktop) {
      document.addEventListener('mousemove', this.handleMouseMove)
    }
  },
  destroyed() {
    if (this.$isDesktop) {
      document.removeEventListener('mousemove', this.handleMouseMove)
    }
  },
}
</script>

<style lang="scss" scoped>
@import "@/scss/_smart-grid";
@import "@/scss/_variables";

.divider {
  height: 5px;
}

.card {
  box-shadow: inset 0 0px 10px $cyan;
  border-radius: 5px;
  background: #0075ff22;
  border: 1px solid $cyan;
  padding: 10px;
  // overflow: hidden;
  position: relative;

  * {
    z-index: 5;
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 10px 20px;
    color: $light-blue;

    h4 {
      text-align: left;
      letter-spacing: 0.05rem;
      font-family: Montserrat;
    }

    .options {
      display: flex;
      align-items: center;
      width: 20px;
      height: 30px;
      cursor: pointer;

      &:hover * {
        color: white;
      }
    }
  }

  &-light {
    position: absolute;
    width: 400px;
    height: 400px;
    background-color: $cyan;
    border-radius: 100%;
    filter: blur(500px);
    z-index: 0;
    opacity: 0.1;
    pointer-events: none;
  }
}
</style>
