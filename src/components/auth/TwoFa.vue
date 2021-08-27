<template>
  <popup :show="show" title="Two-Factor Authorization"> </popup>
</template>

<script>
import Popup from '@/components/partial/Popup.vue'

export default {
  name: 'TwoFA',
  components: {
    Popup,
  },
  props: {
    show: Boolean
  }
}
</script>

<style></style>
