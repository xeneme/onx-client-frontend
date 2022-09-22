<template>
  <div class="tabs">
    <div
      class="tabs_wrap"
      :style="{ 'justify-content': arrange ? 'space-between' : 'flex-start' }"
    >
      <div
        v-for="tab in tabs"
        :key="tab.name"
        :class="['tabs_wrap_tab', currentTab == tab.name ? 'active' : '']"
        @click="
          () => {
            currentTab = tab.name
            $emit('change', tab.name)
          }
        "
      >
        <div><fa icon="info-circle" v-if="tab.info" /></div>
        <div>
          {{ tab.name }}
        </div>
        <div>
          <fa icon="caret-down" v-if="tab.replacement" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'tabs',
  props: {
    tabs: Array,
    arrange: Boolean,
  },
  data: () => ({
    currentTab: '',
  }),
  mounted() {
    this.currentTab = this.tabs[0].name
  },
}
</script>

<style lang="scss" scoped>
.tabs {
  border-bottom: 1px solid $cyan-alpha;
  height: 30px;
  padding: 0 20px;
  color: white;
  margin: 10px auto;

  &_wrap {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;

    &_tab {
      width: 100%;
      height: 100%;
      color: $cyan;
      transition: all 0.2s;
      user-select: none;
      display: grid;
      align-content: center;
      justify-content: center;
      overflow: hidden;
      border-bottom: 4px transparent solid;
      cursor: pointer;

      @include to(33rem) {
        font-size: 0.7rem;
      }

      @include from(33rem) {
        font-size: 0.9rem;
      }

      div {
        color: $cyan;
        min-width: 30px;
        height: 100%;
        padding-bottom: 5px;

        * {
          color: $cyan;
        }
      }

      &:hover {
        background-color: transparentize($cyan-alpha, .3);
        div {
          color: white;
        }
      }

      &.active div {
        color: white;
      }

      &.active {
        border-bottom: 4px $light-blue solid;
      }
    }
  }
}
</style>
