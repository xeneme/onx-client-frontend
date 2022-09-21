<template>
  <div :class="['form', { full, hidden }]">
    <div class="coins_title" v-if="title">
      <label class="coins_title--text"
        ><Icon
          :name="this.currency.replaceAll(' ', '-')"
          :size="1.2"
          color="#58A5FF"
        />
        <div>{{ title }}</div></label
      >
      <label v-if="typeof secondTitle == 'string'" class="right-title">
        <div>{{ secondTitle }}</div>
        <div class="right-title--after" v-if="hidden">{{ usd }}</div>
      </label>
      <label class="balance">{{ balance }}</label>
    </div>
    <Field
      v-if="type && !hidden"
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
import Icon from '@/components/icons/Icon.vue'

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
    'hidden',
  ],
  components: {
    Field,
    Icon,
  },
  computed: {
    profile() {
      return this.$store.state.auth.profile
    },
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
    amount() {
      if(!this.secondTitle) return ''
      return +this.secondTitle.split(' ')[0]
    },
    currency() {
      if(!this.secondTitle) return ''
      return this.secondTitle?.split(' ')[1]?.toCurrency()
    },
    usd() {
      try {
        return (
          (
            this.amount *
            this.profile.wallets[this.currency.toLowerCase()].price
          ).toFixed(2) + ' USD'
        )
      } catch (err) {
        return ''
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/scss/_smart-grid';
@import '@/scss/_variables';

span {
  margin-right: 10px;
}
.form {
  display: flex;
  flex-direction: column;
  // margin-bottom: 20px;

  &.hidden .coins_title {
    height: 100%;
    align-items: center;
    .right-title {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      height: max-content !important;
      font-size: 0.9rem !important;
      margin: 0 !important;
      gap: 0;
      &--after {
        opacity: 0.4;
      }
    }
  }

  .coins_title {
    display: flex;
    width: 100%;
    justify-content: space-between;
    position: relative;

    .right-title {
      position: absolute;
      right: 0;
      font-size: 0.77rem;
    }
    label {
      text-align: left;
      color: #fff;
      font-size: 16px;
      margin-bottom: 10px;
      // display: grid;
      height: 100%;
      align-items: center;
      display: flex;
      gap: 5px;

      @include to(20rem) {
        font-size: 14px;
      }
      @include from(20rem) {
        font-size: 16px;
      }
    }
    .balance {
      font-size: 12px;

      @include to(33rem) {
        display: grid;
      }
      @include from(33rem) {
        display: none;
      }
    }
  }
  .subtitle_wrap {
    display: flex;

    .subtitle,
    .total {
      color: white;
      font-size: 0.9rem;
      text-align: left;
      margin-bottom: 10px;
    }
    .subtitle {
      color: $light-blue;
      cursor: default;
      user-select: none;
    }
  }
}
.full {
  width: 100%;
}
</style>
