<template>
  <div class="deposits-table" v-if="value && value.length">
    <div
      class="deposits-table__items"
      :style="{
        height: range * 46 + 30 + 'px',
      }"
    >
      <div class="deposits-table__items__title">
        <div
          v-for="column in columns"
          :key="column"
          :class="'deposits-table__items__title-' + column"
        >
          {{ column }}
        </div>
      </div>
      <div
        :class="['deposits-table__items__item', 'deposit-' + i]"
        v-for="(item, i) in listPageItems"
        :key="i"
      >
        <div class="deposits-table__items__item-date">
          {{ formatDate(item.at) }}
        </div>
        <div class="deposits-table__items__item-amount">
          {{ item.amount + ' ' + item.network }}
        </div>
        <div class="deposits-table__items__item-address">
          <Address
            :index="i"
            :deposit="item"
            :value="item.address"
          />
        </div>
        <div class="deposits-table__items__item-status">
          <fa
            :icon="formatStatus(item.status).icon"
            :style="{
              marginTop: '2px',
              marginRight: '3px',
            }"
          />
          <div>{{ item.status }}</div>
        </div>
      </div>
    </div>
    <div class="pagination">
      <div v-if="pagination.length > 1" class="pages">
        <span class="page_back" @click="goto('back')"
          ><fa icon="arrow-left"
        /></span>
        <span
          v-for="(page, index) in pagination"
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
    :css="{
      height: range * 40 + 30 + 'px',
    }"
    LT="Your deposits are loading..."
    ET="There is nothing to list"
  />
</template>

<script>
import Address from './Address'
import NoData from './NoData'
import { chunk } from 'lodash'

export default {
  name: 'Deposits',
  components: {
    Address,
    NoData,
  },
  data: () => ({
    current: 0,
    maxPagesHalf: 3,
    range: 7,
    columns: ['Date', 'Amount', 'Address', 'Status'],
  }),
  props: {
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
        targets: '.deposits-table__items__item',
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
            targets: '.deposits-table__items__item',
            opacity: [0, 1],
            duration: 200,
            easing: 'easeOutSine',
          })
        },
      })
    },
  },
  computed: {
    pagination() {
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
    pages() {
      return chunk(this.value, this.range)
    },
    pagesCount() {
      return this.pages.length
    },
    listPageItems() {
      return this.pages[this.current]
    },
  },
}
</script>

<style lang="sass">
@import "@/scss/_smart-grid"
@import "@/scss/_variables"

$break: 55rem

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

.deposits-table
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
            border-bottom: none
            grid-template-columns: 1.3fr 2fr 3fr 1.3fr

            *
              display: grid
              align-content: center

        &__item
          margin-bottom: 6px
          &-date, &-amount
            font-size: .7rem

          &-status
            display: flex
            justify-content: center
            align-items: center
            height: 90%

            div
              @include to(30rem)
                display: none
              @include from(30rem)
                display: block

            *
              color: $light-blue
              height: 20px
              font-size: .7rem

            div
              font-size: .85rem
              color: white
</style>
