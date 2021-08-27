<template>
  <v-panel
    title="History"
    :first="{
      label: 'All transactions',
      size: 'full',
    }"
  >
    <template #form-wrap>
      <Transactions :loading="loading" :value="transactions || []" />
    </template>
  </v-panel>
</template>

<script>
import Transactions from '../components/Transactions.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'History',
  data: () => ({
    loading: true,
  }),
  computed: {
    ...mapGetters({
      transactions: 'auth/history',
    }),
  },
  components: {
    Transactions,
  },
  mounted() {
    this.$emit('mounted')
    this.loading = false
  },
}
</script>

<style lang="sass" scoped>
@import "@/scss/_smart-grid"
@import "@/scss/_variables"

.form-group
  display: flex
  flex-wrap: wrap
  justify-content: space-between
  margin-bottom: 20px

  @include xs-block
    flex-direction: column
    width: 100%
  @include sm-block
    flex-direction: column
    width: 100%
  @include md-block
    flex-direction: row
    width: 80%
  @include lg-block
    flex-direction: row
    width: 80%

  *:first-child
    margin-right: 10px

.pay_button
  margin-top: 20px
  width: 100px

  @include xs-block
    width: calc(100% - 38px)
  @include sm-block
    width: calc(100% - 38px)
  @include md-block
    width: 100px
  @include lg-block
    width: 100px
</style>
