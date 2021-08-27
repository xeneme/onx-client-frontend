<template>
  <div class="profile-tabs">
    <router-link
      class="profile-tabs__item holo-panel"
      :class="{ active: i == activeTab }"
      v-for="(tab, i) in tabs"
      :key="i"
      :to="'/account' + tab.path"
    >
      <fa :icon="tab.icon" />
    </router-link>
  </div>
</template>

<script>
export default {
  data: () => ({
    tabs: [
      {
        name: 'profile',
        path: '',
        icon: 'user',
      },
      {
        name: 'charts',
        path: '/charts',
        icon: 'chart-area',
      },
      {
        name: 'support',
        path: '/support',
        icon: 'info-circle',
      },
    ],
  }),
  computed: {
    activeTab() {
      return {
        Profile: 0,
        Charts: 1,
        Support: 2,
      }[this.$route.name]
    },
  },
}
</script>

<style lang="scss">
@import '@/scss/_smart-grid';
@import '@/scss/_variables';

$tab-size: 4rem;
$tab-gap: 0.7rem;
$mobile-break: 62rem;

@keyframes selected {
  0% {
    transform: scale(1);
  }
  5% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(1);
  }
}

.profile-tabs {
  display: flex;
  flex-direction: column;
  gap: $tab-gap;

  @include to($mobile-break) {
    flex-direction: row;
  }
  @include from($mobile-break) {
    flex-direction: column;
  }

  &__item {
    width: $tab-size;
    height: $tab-size;
    display: grid;
    align-content: center;
    justify-items: center;
    color: $cyan;
    font-size: 2rem;
    cursor: pointer;
    // transition: box-shadow 200ms ease, background-color 500ms ease-out,
    // transform 50ms ease-out, color 800ms;

    &:hover {
      // transition: background-color 500ms ease-out, transform 50ms ease-out,
      // box-shadow 200ms ease;
      box-shadow: inset 0 0px 20px $light-blue;
    }
    &:active {
      color: $light-blue;
    }

    &.active {
      border: 1px solid transparent;
      color: white;
      background-color: $cyan;
      // box-shadow: 0 0 5px $light-blue;
      @include from($mobile-break) {
        animation: selected 0.5s ease;
        animation-play-state: running;
      }
    }
  }
}
</style>
