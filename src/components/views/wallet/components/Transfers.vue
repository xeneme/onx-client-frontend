<template>
  <div class="transfers-table" v-if="value && value.length && !loading">
    <div
      class="transfers-table__items"
      :style="{
        height: range * 40 + 30 + 'px',
      }"
    >
      <div class="transfers-table__items__title">
        <div class="transfers-table__items__title-amount">
          Date
        </div>
        <div class="transfers-table__items__title-amount">
          Amount
        </div>
        <div class="transfers-table__items__title-type">
          Type
        </div>
        <div class="transfers-table__items__title-status">
          Status
        </div>
      </div>
      <div
        class="transfers-table__items__item"
        v-for="item in listPageItems"
        :key="item._id"
      >
        <div class="transfers-table__items__item-date">
          {{ formatDate(item.at) }}
        </div>
        <div class="transfers-table__items__item-amount">
          {{ formatAmount(item) }}
        </div>
        <div class="transfers-table__items__item-type">
          {{ item.type }}
        </div>
        <div class="transfers-table__items__item-status">
          <fa
            :icon="formatStatus(item.status).icon"
            :style="{
              marginTop: '2px',
              marginRight: '3px',
            }"
          />
          <div>{{ formatStatus(item.status).text }}</div>
        </div>
      </div>
    </div>
    <div class="pagination">
      <div v-if="pages.length > 1" class="pages">
        <span class="page_back" @click="goto('back')"
          ><fa icon="arrow-left"
        /></span>
        <span
          v-for="(page, index) in pages"
          :key="index"
          :class="[
            page != '...' ? 'page' : 'page_ellipsis',
            page != '...' && page - 1 == current ? 'page_active' : '',
          ]"
          @click="page != '...' ? goto(page - 1) : false"
          >{{ page }}</span
        >
        <span class="page_back" @click="goto('forward')"
          ><fa icon="arrow-right"
        /></span>
      </div>
    </div>
  </div>
  <NoData
    v-else
    :loading="loading"
    :css="{
      height: range * 40 + 30 + 'px',
    }"
    LT="Your transfers are loading..."
    ET="There is nothing to list"
  />
</template>

<script>
import NoData from './NoData'

export default {
  name: 'Transfers',
  components: {
    NoData,
  },
  data: () => ({
    current: 0,
    maxPagesHalf: 7,
    range: 7,
  }),
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    value: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    formatDate(t) {
      let locale = this.$time.toLocale(t)
      return this.$moment(locale).format('YYYY-MM-DD HH:mm')
    },
    formatAmount(transaction) {
      return (
        transaction.amount +
        ' ' +
        { Ethereum: 'ETH', Bitcoin: 'BTC', Litecoin: 'LTC' }[
          transaction.currency
        ]
      )
    },
    formatStatus(status) {
      let types = {
        processing: {
          icon: 'clock',
        },
        'await approval': {
          icon: 'clock',
        },
        pending: {
          icon: 'clock',
        },
        failed: {
          icon: 'times-circle',
        },
        canceled: {
          icon: 'times-circle',
        },
        success: {
          icon: 'check-circle',
        },
        completed: {
          icon: 'check-circle',
        },
      }

      let type = types[status] ? types[status] : types.failed

      type.text = status.toLowerCase()

      return type
    },
    goto(page) {
      let self = this

      this.$anime({
        targets: '.transfers-table__items__item',
        opacity: [1, 0],
        duration: 200,
        easing: 'easeInSine',
        complete() {
          switch (page) {
            case 'back':
              self.current -= self.current ? 1 : 0
              break
            case 'forward':
              self.current += self.current < self.pagesCount - 1 ? 1 : 0
              break
            default:
              self.current = page
              break
          }

          self.$anime({
            targets: '.transfers-table__items__item',
            opacity: [0, 1],
            duration: 200,
            easing: 'easeOutSine',
          })
        },
      })
    },
  },
  computed: {
    pages() {
      if (!this.value) return []

      const raw = [...Array(this.pagesCount).keys()].map(page => page + 1)

      if (this.pagesCount < this.maxPagesHalf + 3) return raw
      else {
        if (this.current <= Math.round(this.maxPagesHalf / 2))
          return [
            ...raw.slice(0, this.maxPagesHalf),
            '...',
            raw[raw.length - 1],
          ]
        else if (this.current > this.pagesCount - this.maxPagesHalf + 1)
          return [
            raw[0],
            '...',
            ...raw.slice(raw.length - this.maxPagesHalf, raw.length),
          ]
        else
          return [
            raw[0],
            '...',
            ...raw.slice(
              this.current + 2 - this.maxPagesHalf / 2,
              this.current + this.maxPagesHalf / 2,
            ),
            '...',
            raw[raw.length - 1],
          ]
      }
    },
    pagesCount() {
      return Math.ceil(this.value.length / this.range)
    },
    listPageItems() {
      return this.value.slice(
        this.current * this.range,
        this.range * (this.current + 1),
      )
    },
  },
}
</script>

<style lang="sass">
@import "@/scss/_smart-grid"
@import "@/scss/_variables"

.pagination
    max-width: 100%
    color: white

    .pages
        margin-top: 39px
        font-size: 0.9rem
        display: flex
        justify-content: center

        .page, .page_back, .page_forward
            background-color: $cyan-alpha
            padding: 5px 0
            width: 40px
            text-align: center
            margin-right: 1px
            cursor: pointer
            user-select: none
            transition: background-color .5s

            &:hover
                background-color: $cyan
                transition: none

            &:active
                background-color: $light-blue

            &:first-child
                border-radius: 20px 0 0 20px

            &:last-child
                margin: 0
                border-radius: 0 20px 20px 0

            &_active
                background-color: $light-blue

            &_ellipsis
              display: grid
              place-self: center
              background-color: $cyan-alpha
              padding: 5px 0
              width: 40px
              text-align: center
              margin-right: 1px
              user-select: none

.transfers-table
    width: 100%

    &__items
        margin-top: 30px
        width: 100%
        font-size: .8rem

        &__title
          background-color: $cyan-alpha
          border-radius: 8px 8px 0 0
          margin-bottom: 10px
          letter-spacing: .07em

        &__item, &__title
            color: white
            width: 100%
            height: 40px
            display: grid
            grid-gap: 8px
            grid-template-columns: 1.3fr 1fr 1fr 1fr

            *
              display: grid
              align-content: center

        &__item
          &-date, &-amount
            font-size: .7rem

          &-status
            display: flex
            justify-content: center
            align-items: center
            height: 90%

            *
              color: $light-blue
              height: 20px
              font-size: .7rem

            div
              font-size: .85rem
              color: white
</style>
