<template>
  <div class="alerts_container">
    <transition-group name="alerts-list" tag="ul">
      <Alert v-for="alert in alerts" :alert="alert" :key="alert.key" />
    </transition-group>
  </div>
</template>

<script>
import Alert from './Alert'

export default {
  components: { Alert },
  computed: {
    alerts() {
      return this.$store.state.popups.alerts
    },
  },
}
</script>

<style lang="scss">
.alerts-list-move {
  transition: transform 0.2s;
}
.alerts-list-leave-active,
.alerts-list-enter-active {
  transition: all 0.4s;
  transform: translateY(0px);
}
.alerts-list-enter {
  transform: translateY(200px);
  opacity: 0;
}
.alerts-list-leave-to {
  transform: translateX(200px);
  opacity: 0;
}
.alerts_container {
  position: fixed;
  right: 0;
  display: grid;
  align-content: end;
  padding-right: 50px;
  z-index: 999;
  pointer-events: none;
  overflow: hidden;
  top: 0;

  @include to(50rem) {
    padding: 0;
    width: 100%;
    height: 100vh;
  }
  @include from(50rem) {
    width: auto;
    padding: 30px;
    padding-right: 50px;
    height: calc(100% - 60px);
  }
}
</style>
