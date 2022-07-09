<template>
  <div class="toggle-group">
    <div class="toggle-group__label" v-if="label">{{ label }}:</div>
    <div class="toggle-group__container">
      <div
        class="toggle-group__item"
        :class="{ 'toggle-group__item--active': selected == i }"
        v-for="(el, i) in options"
        @click="select(i)"
        :key="i"
      >
        {{ el.name || el.value }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    label: String,
    options: {
      type: Array,
      validator(opts) {
        let valid = true

        if (opts.constructor !== Array) {
          valid = false
        } else {
          opts.forEach((el) => {
            if (!el.value) {
              valid = false
            }
          })
        }

        return valid
      },
    },
  },
  data() {
    return {
      selected: null,
    }
  },
  methods: {
    select(i) {
      this.selected = i
      this.$emit('select', this.options[i].value)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/scss/_variables.scss';

.toggle-group {
  display: flex;
  gap: 0.6rem;

  &__container {
    display: flex;
    gap: 0.18rem;
  }

  &__item {
    border-radius: 0.2rem;
    color: black;
    border: 1px $cyan-alpha solid;
    padding: 0.1rem 0.25rem;
    color: white;
    cursor: pointer;
    user-select: none;

    &:hover {
      border: 1px $cyan solid;
    }

    &--active {
      background-color: $cyan-alpha;
    }
  }
}
</style>
