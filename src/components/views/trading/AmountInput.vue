<template>
  <div
    :class="['amount-input', typing ? 'active' : '']"
    @click="
      () => {
        typing =  !prevent
      }
    "
  >
    <div class="amount-input_placeholder">
      {{ title }}
    </div>
    <input v-if="!prevent" ref="input" type="text" @input="e => $emit('input', e)" />
    <div v-else class="amount-input_prevention-text">{{prevent}}</div>
    <div class="amount-input_currency">{{ coin }}</div>
  </div>
</template>

<script>
export default {
  name: 'amount-input',
  props: {
    title: String,
    coin: String,
    prevent: String,
  },
  data() {
    return {
      typing: false,
    }
  },
  watch: {
    typing(v) {
      if(v) this.$refs.input.focus()
    }
  },
  mounted() {
    document.addEventListener('mouseup', e => {
      if (!this.$el.contains(e.target)) {
        this.typing = false
      }
    })
  },
}
</script>

<style lang="scss">
@import "@/scss/_smart-grid";
@import "@/scss/_variables";

.amount-input {
  width: calc(100% - 10px);
  display: grid;
  grid-template-columns: auto 1fr auto;
  grid-gap: 10px;
  background: #00000033;
  color: $cyan-alpha;
  padding: 5px;
  border-radius: 3px;
  margin-bottom: 10px;
  transition: all 0.2s;
  height: 30px;
  align-items: center;
  cursor: text;

  &:hover {
    box-shadow: inset 0 0 1px 1px $cyan-alpha;
  }

  &.active {
    box-shadow: inset 0 0 1px 1px $cyan;
  }

  &_placeholder,
  &_currency {
    padding: 0 5px;
    user-select: none;
  }

  &_prevention-text {
    text-align: right;
    user-select: none;
  }

  input {
    background: none;
    border: none;
    text-align: right;
    color: $light-blue;
    font-family: Montserrat;
    letter-spacing: 0.04rem;
    font-size: 0.9rem;
    height: 100%;
    width: 100%;

    &:focus {
      outline: none;
    }
  }
}
</style>
