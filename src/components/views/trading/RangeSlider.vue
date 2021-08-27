<template>
  <div class="range-slider">
    <div class="range-slider_filled">
      <div
        class="range-slider_filled-path"
        :style="{ right: computeRight(active) }"
      ></div>
    </div>
    <div class="range-slider_path"></div>
    <div
      :class="[
        'range-slider_point',
        active == i ? 'active' : '',
        i < active ? 'filled' : '',
      ]"
      v-for="i in Array(range).keys()"
      :key="i"
      @mousedown="pointPressed"
    >
      <div
        class="inside"
        :style="{ display: grabbing ? 'none' : 'block' }"
      ></div>
      <div
        class="percent"
        :style="{ opacity: grabbing ? 1 : '' }"
        v-if="active == i"
      >
        {{ computePercent(i) }}
      </div>
    </div>
  </div>
</template>

<script>
const distance = (x1, y1, x2, y2) => {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))
}

export default {
  name: 'range-slider',
  props: {
    range: {
      type: Number,
      default: 5,
    },
  },
  data: () => ({
    active: 0,
    value: 0,
    grabbing: false,
  }),
  computed: {},
  watch: {
    grabbing(v) {
      document.body.style.cursor = v ? 'grab' : ''
    },
  },
  methods: {
    computePercent(i) {
      return (100 / (this.range - 1)) * i + '%'
    },
    computeRight(i) {
      return 100 - (100 / (this.range - 1)) * i + '%'
    },
    pointPressed() {
      this.grabbing = true
    },
    handleMouseUp(e) {
      var points = this.$el.querySelectorAll('.range-slider_point')

      if (!points) return

      points = Array.from(points).map(p => p.getBoundingClientRect())

      points.forEach((p, i) => {
        if (this.grabbing && distance(e.x, p.y, p.x, p.y) < 50) {
          this.active = i
        }
      })

      this.grabbing = false
    },
    handleMouseMove(e) {
      if (!e.buttons) this.grabbing = false

      var points = this.$el.querySelectorAll('.range-slider_point')

      if (!points) return

      points = Array.from(points).map(p => p.getBoundingClientRect())

      points.forEach((p, i) => {
        if (this.grabbing && distance(e.x, p.y, p.x, p.y) < 50) {
          this.active = i
        }
      })
    },
  },
  mounted() {
    document.addEventListener('mouseup', this.handleMouseUp)
    document.addEventListener('mousemove', this.handleMouseMove)
  },
  destroyed() {
    document.removeEventListener('mouseup', this.handleMouseUp)
    document.removeEventListener('mousemove', this.handleMouseMove)
  },
}
</script>

<style lang="scss" scoped>
@import "@/scss/_smart-grid";
@import "@/scss/_variables";

$point-size: 15px;

.range-slider {
  width: calc(100% - 40px);
  margin: 0 auto;
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
  position: relative;
  align-items: center;
  user-select: none;
  &_path {
    position: absolute;
    top: calc(50% - 1px);
    left: 0;
    width: 100%;
    height: 2px;
    background-color: #00000033;
  }

  &_filled {
    position: absolute;
    width: 100%;
    overflow: hidden;
    &-path {
      position: relative;
      top: calc(50% - 1px);
      right: 100%;
      width: 100%;
      height: 2px;
      background: linear-gradient(90deg, transparent 0%, $cyan 100%);
    }
  }

  &_point {
    cursor: grab;
    width: #{$point-size / 1.5};
    height: #{$point-size / 1.5};
    border-radius: 100%;
    background-color: #000e32;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2;
    position: relative;

    &:hover {
      .percent {
        opacity: 1;
      }
    }

    .inside {
      width: 60%;
      border-radius: 100%;
      height: 60%;
      background-color: none;
    }

    .percent {
      opacity: 0;
      transition: opacity 0.4s;
      top: 20px;
      position: absolute;
      color: white;
      font-size: 0.75rem;
    }

    &.active {
      background-color: white;
      opacity: 1;
      width: $point-size;
      height: $point-size;

      .inside {
        background-color: $cyan;
      }
    }

    &.filled {
      background-color: $cyan;
    }
  }
}
</style>
