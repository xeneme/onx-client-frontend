<template>
  <div class="no-data" :style="css">
    <fa
      :spin="loading"
      :icon="loading ? 'spinner' : 'sticky-note'"
      :style="{
        fontSize: '4rem',
        marginBottom: '0.8rem',
      }"
    />
    {{ loading ? LT : ET }}
  </div>
</template>

<script>
export default {
  name: 'no-data',
  props: {
    loading: Boolean,
    css: Object,
    LT: {
      type: String,
      required: true,
    },
    ET: {
      type: String,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.no-data {
  color: white;
  height: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-content: center;
  min-height: 120px;
  padding-top: 0.5rem;
  font-size: 1.2rem;
  text-align: center;
  opacity: 0.12;
  font-weight: bold;

  svg {
    margin: auto;
    margin-top: 20px;
  }
}
</style>
