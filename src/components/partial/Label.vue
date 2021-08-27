<template>
  <label :for="id">{{ text }}</label>
</template>

<script>
export default {
  name: 'Label',
  props: ['id', 'text'],
};
</script>

<style lang="sass" scoped>
label
  text-align: left
  color: #FFF
  font-size: 16px
  margin-bottom: 10px
</style>
