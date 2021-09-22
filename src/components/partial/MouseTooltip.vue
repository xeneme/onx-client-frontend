<template>
  <div ref="tooltip" class="mouse-tooltip">{{ label }}</div>
</template>

<script>
export default {
  props: ['label'],
  data() {
    return {}
  },
  methods: {
    init() {
      const self = this
      this.$el.querySelector('.mouse-tooltip')
      document.addEventListener('mousemove', e => {
        self.$refs.tooltip.style.top = e.clientY + 'px'
        self.$refs.tooltip.style.left = e.clientX + 'px'
      })
      document.addEventListener('mousemove', e => {
        self.$refs.tooltip.style.top = e.clientY + 'px'
        self.$refs.tooltip.style.left = e.clientX + 'px'
      })
    },
  },
  mounted() {
    this.init()
  },
}
</script>

<style lang="scss">
@import '@/scss/_variables.scss';

$radius: 17px;

.mouse-tooltip {
  position: fixed;
  top: 0;
  left: 0;
  box-sizing: border-box;
  margin: 15px;
  margin-left: 30px;
  z-index: 100;
  background: #00000033;
  backdrop-filter: blur(30px);
  padding: 20px;
  box-shadow: 0 10px 15px transparentize($light-blue, 0.9);
  border: 1px solid $blue;
  border-radius: 0px $radius $radius $radius;
  user-select: none;
  max-width: 18rem;
  overflow-wrap: break-word;
  text-align: left;
  font-size: 14px;
}
</style>
