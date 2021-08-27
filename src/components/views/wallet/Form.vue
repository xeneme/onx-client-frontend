<template>
  <div :class="['form', full ? 'full' : '']">
    <div class="coins_title" v-if="title">
      <label>{{ title }}</label>
      <label v-if="typeof secondTitle != 'undefined'" class="right-title">{{
        secondTitle
      }}</label>
      <label class="balance">{{ balance }}</label>
    </div>
    <Field
      v-if="type"
      :type="type"
      :id="id"
      :value="value"
      :options="options"
      :secret="secret"
      :index="index"
      :selectWidth="selectWidth"
      :isAddress="isAddress"
      @input="$emit('input', $event)"
    />
    <div class="subtitle_wrap">
      <span
        v-if="total"
        class="total"
        :style="{
          opacity: ['Invalid amount', 'Min 0.01'].includes(total) ? 0.5 : 1,
        }"
        >{{ total }}</span
      >
      <span v-if="validSubtitle" class="subtitle">{{ subtitle }}</span>
    </div>
  </div>
</template>

<script>
import Field from './Field'

export default {
  name: 'Form',
  props: [
    'title',
    'secondTitle',
    'total',
    'subtitle',
    'type',
    'value',
    'options',
    'full',
    'id',
    'secret',
    'index',
    'selectWidth',
    'isAddress',
    'balance',
  ],
  components: {
    Field,
  },
  computed: {
    validSubtitle() {
      try {
        let amount = this.total.split(' ')[0]

        if (isNaN(+amount) || +amount < 0.01 || +amount > 999999999999999) {
          return false
        } else {
          return true
        }
      } catch {
        return true
      }
    },
  },
}
</script>

<style lang="sass" scoped>
@import "@/scss/_smart-grid"
@import "@/scss/_variables"

span
  margin-right: 10px

.form
    display: flex
    flex-direction: column
    margin-bottom: 20px

    .coins_title
      display: flex
      width: 100%
      justify-content: space-between
      position: relative

      .right-title
        position: absolute
        right: 0
        font-size: .77rem

      label
        text-align: left
        color: #FFF
        font-size: 16px
        margin-bottom: 10px
        display: grid
        height: 100%
        align-content: center

        @include to(20rem)
          font-size: 14px
        @include from(20rem)
          font-size: 16px

      .balance
        font-size: 12px

        @include to(33rem)
          display: grid
        @include from(33rem)
          display: none

    .subtitle_wrap
      display: flex

      .subtitle, .total
        color: white
        font-size: .9rem
        text-align: left
        margin-bottom: 10px

      .subtitle
        color: $light-blue
        cursor: default
        user-select: none

.full
  width: 100%
</style>
