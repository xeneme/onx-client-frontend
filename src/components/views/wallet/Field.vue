<template>
  <div :class="['field', secret ? 'secret_field' : '']">
    <Tooltip text="Address copied!" :index="index" />
    <div v-if="secret" class="copy" @click="copyToClipboard">
      <fa icon="copy" />
    </div>
    <v-select
      v-model="selectedCurrency"
      class="select_input"
      :style="'width:' + selectWidth"
      v-if="type === 'select'"
      :options="options"
      :clearable="false"
    ></v-select>
    <input
      :class="['text_input', `${type}_input`]"
      :type="type"
      :value="secret ? hiddenValue : value"
      :id="id"
      :style="
        isAddress ? '' : 'color: white;font-size: .8rem;font-weight: 600;'
      "
      :disabled="secret"
      @input="$emit('input', $event.target.value)"
      v-else
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Tooltip from '../../partial/Tooltip'

export default {
  name: 'Field',
  components: { Tooltip },
  props: [
    'id',
    'type',
    'value',
    'options',
    'secret',
    'index',
    'selectWidth',
    'placeholder',
    'isAddress',
  ],
  data() {
    return {
      selectedCurrency: 'Bitcoin',
    }
  },
  computed: {
    ...mapGetters({
      exchangeCurrentTab: 'popups/exchangeCurrentTab',
      exchangeSelectedCurrency: 'popups/exchangeSelectedCurrency',
    }),
    hiddenValue() {
      const match = this.value.match(new RegExp(`.{${20}}`))[0]
      return match ? match + '...' : this.value
    },
  },
  watch: {
    selectedCurrency() {
      this.$store.commit(
        'popups/SELECT_EXCHANGE_CURRENCY',
        this.selectedCurrency,
      )
    },
  },
  methods: {
    copyToClipboard() {
      this.$root.$emit('tooltip:once', this.index)
      this.$copy(this.value)
    },
  },
  mounted() {
    this.selectedCurrency = this.exchangeSelectedCurrency
  },
}
</script>

<style lang="sass">
@import "@/scss/_variables"
@import "@/scss/_smart-grid"
@import url("https://unpkg.com/vue-select@3.0.0/dist/vue-select.css")

.vs__selected, .vs__search
  color: white
  height: 30px

.vs__open-indicator, .vs__clear
  fill: white

.vs__open-indicator
  cursor: pointer
  transform: scale(.8)

.vs__dropdown-menu
  background: $blue

.vs__dropdown-option
  color: white

.vs__dropdown-toggle
  border: none

.field, .secret_field
  display: flex
  width: 100%
  margin-bottom: 6px

  .text_input, .sm_text_input
    background: $blue-alpha
    cursor: text
    transition: background-color .3s

    &:focus
      background: $blue
      outline: none

    &::selection
      background: $light-blue
      color: white

  .text_input
    color: #0094FF
    text-indent: 21px
    line-height: 38px
    border: none
    border-radius: 3px
    margin-right: 0
    width: 100%

  .sm_text_input, .select_input
    margin-left: 0
    margin-right: 0
    display: grid
    place-self: start
    width: 300px

    @include xs(width, 100%)
    @include sm(width, 100%)
    @include md(width, 300px)
    @include lg(width, 300px)

  .sm_text_input
    height: 40px

  .select_input
    background: $blue-alpha
    position: relative
    height: 40px
    color: #fff
    border-radius: 3px

.secret_field
  &:hover
    & > .text_input
      background: $blue

    & > .copy
      width: 38px

  .copy
    height: 38px
    display: grid
    color: $light-blue
    overflow: hidden
    cursor: pointer
    transition: width .15s
    transition-delay: .2s

    @include to(55rem)
      width: 38px
    @include from(55rem)
      width: 0px

    &:hover
      color: white
    &:active
      svg
        font-size: 12px
    svg
      place-self: center

  .text_input
    cursor: default
    user-select: none
</style>
