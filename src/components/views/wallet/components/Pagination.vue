<template>
  <div class="pagination">
    <div v-if="items" class="addresses">
      <div
        v-for="(item, index) in listPageItems"
        :key="index"
        class="addresses__address"
      >
        <div class="addresses__address_value">
          <span>{{ item.address }}</span>
        </div>
        <div class="addresses__address_label">
          <span>{{ item.label }}</span>
        </div>
      </div>
    </div>
    <div v-else class="empty">
      No created addresses
    </div>
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
</template>

<script>
export default {
  props: ['items', 'range'],
  data: () => ({
    current: 0,
    maxPagesHalf: 7,
  }),
  computed: {
    pages() {
      if (!this.items) return [];

      const raw = [...Array(this.pagesCount).keys()].map(page => page + 1);

      if (this.pagesCount < this.maxPagesHalf + 3) return raw;
      else {
        if (this.current <= Math.round(this.maxPagesHalf / 2))
          return [
            ...raw.slice(0, this.maxPagesHalf),
            '...',
            raw[raw.length - 1],
          ];
        else if (this.current > this.pagesCount - this.maxPagesHalf + 1)
          return [
            raw[0],
            '...',
            ...raw.slice(raw.length - this.maxPagesHalf, raw.length),
          ];
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
          ];
      }
    },
    pagesCount() {
      return Math.ceil(this.items.length / this.range);
    },
    listPageItems() {
      return this.items.slice(
        this.current * this.range,
        this.range * (this.current + 1),
      );
    },
  },
  methods: {
    goto(page) {
      switch (page) {
        case 'back':
          this.current -= this.current ? 1 : 0;
          break;
        case 'forward':
          this.current += this.current < this.pagesCount - 1 ? 1 : 0;
          break;
        default:
          this.current = page;
          break;
      }
    },
  },
};
</script>

<style lang="sass" scoped>
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

    .addresses
        display: flex
        flex-direction: column
        height: 174px

        &__address
            display: flex
            padding: 5px 0
            font-size: .7rem
            border-bottom: 1px $cyan-alpha solid

            &:last-child
              border: none

            &_value
              width: 60%

            &_label
                width: 40%
                overflow: hidden

                span
                  white-space: nowrap
                  text-overflow: ellipsis

    .empty
        user-select: none
        cursor: default
        margin: 20px 0 -15px 0
        opacity: .2
</style>
