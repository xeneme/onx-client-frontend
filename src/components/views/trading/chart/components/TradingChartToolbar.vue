<script>
export default {
  data: () => ({
    items: ['1D', '5D', '1M', 'YTD', '1Y', '5Y', 'All'],
    active: 0,
    autoScale: false,
    ts: 0,
  }),
  computed: {
    formattedTime() {
      let d = new Date(this.ts)
      let h = d
        .getUTCHours()
        .toString()
        .padStart(2, '0')
      let m = d
        .getUTCMinutes()
        .toString()
        .padStart(2, '0')
      let s = d
        .getUTCSeconds()
        .toString()
        .padStart(2, '0')
      return `${h}:${m}:${s}`
    },
  },
  created() {
    setTimeout(() => {
      this.ts = +new Date()
      setInterval(() => {
        this.ts = +new Date()
      }, 1000)
    }, 1000 - new Date().getMilliseconds())
  },
}
</script>

<template>
  <div class="toolbar">
    <div class="toolbar__range">
      <div
        :class="[
          'toolbar__range--item',
          'toolbar__button',
          { active: active == i },
        ]"
        v-for="(range, i) in items"
        @click="active = i"
        :key="i"
      >
        {{ range }}
      </div>
      <!-- <div class="toolbar__range--item">
        <svg
          class="iconify iconify--material-symbols"
          width="20"
          height="20"
          preserveAspectRatio="xMidYMid meet"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M8 14q-.425 0-.713-.288Q7 13.425 7 13t.287-.713Q7.575 12 8 12t.713.287Q9 12.575 9 13t-.287.712Q8.425 14 8 14Zm4 0q-.425 0-.712-.288Q11 13.425 11 13t.288-.713Q11.575 12 12 12t.713.287Q13 12.575 13 13t-.287.712Q12.425 14 12 14Zm4 0q-.425 0-.712-.288Q15 13.425 15 13t.288-.713Q15.575 12 16 12t.712.287Q17 12.575 17 13t-.288.712Q16.425 14 16 14ZM5 22q-.825 0-1.413-.587Q3 20.825 3 20V6q0-.825.587-1.412Q4.175 4 5 4h1V2h2v2h8V2h2v2h1q.825 0 1.413.588Q21 5.175 21 6v14q0 .825-.587 1.413Q19.825 22 19 22Zm0-2h14V10H5v10Z"
          ></path>
        </svg>
      </div> -->
    </div>
    <div class="toolbar__spacer"></div>
    <div class="toolbar__time">{{ formattedTime }} (UTC)</div>
    <div class="toolbar__divider"></div>
    <div
      :class="['toolbar__button', { active: autoScale }]"
      @click="autoScale = !autoScale"
    >
      auto
    </div>
  </div>
</template>

<style lang="scss" scoped>
.toolbar {
  display: flex;
  flex-direction: row;
  color: $cyan;
  border-top: 1px #2e2d3a solid;
  font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande',
    'Lucida Sans', Arial, sans-serif;
  user-select: none;
  white-space: nowrap;
  padding: 5px;

  &__spacer {
    width: 100%;
  }

  &__divider {
    height: 100%;
    border-right: 1px solid #ffffff44;
  }

  &__button {
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 2px;
    &.active {
      background-color: #ffffff11;
    }
    &:hover {
      background-color: #ffffff22;
    }
    &:active {
      background-color: #ffffff44;
    }
  }

  &__range {
    display: flex;
  }

  &__time {
    display: flex;
    padding: 5px;
    border-right: 1px #2e2d3a solid;
    padding-right: 15px;
  }
}
</style>
