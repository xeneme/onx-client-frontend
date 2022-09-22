<template>
  <div class="ref-link-card">
    <div class="col">
      <svg width="32" height="32" viewBox="0 0 256 256">
        <path
          fill="currentColor"
          d="m212.9 122.3l-30.3 30.3a56 56 0 0 1-79.2 0a12 12 0 1 1 16.9-16.9a32.2 32.2 0 0 0 45.3 0l30.3-30.3a32 32 0 0 0-45.3-45.3l-9.6 9.7a12 12 0 0 1-17-17l9.7-9.7a56 56 0 1 1 79.2 79.2ZM115 186.2l-9.6 9.7a32 32 0 0 1-45.3-45.3l30.3-30.3a32.2 32.2 0 0 1 45.3 0a12 12 0 0 0 16.9-16.9a55.9 55.9 0 0 0-79.2 0l-30.3 30.3a56 56 0 0 0 79.2 79.2l9.7-9.7a12 12 0 0 0-17-17Z"
        />
      </svg>
      <div class="label">
        Share Your Link:
      </div>
      <div class="ref-link tooltip" tooltip="copy" @click="copy">
        <span>{{ link }}</span>
      </div>
    </div>
    <div class="col">
      <svg width="32" height="32" viewBox="0 0 32 32">
        <path
          fill="currentColor"
          d="M16 5a2 2 0 1 0 0 4a2 2 0 0 0 0-4Zm-4 2a4 4 0 1 1 8 0a4 4 0 0 1-8 0Zm13.5-1a1.5 1.5 0 1 0 0 3a1.5 1.5 0 0 0 0-3ZM22 7.5a3.5 3.5 0 1 1 7 0a3.5 3.5 0 0 1-7 0Zm-17 0a1.5 1.5 0 1 1 3 0a1.5 1.5 0 0 1-3 0ZM6.5 4a3.5 3.5 0 1 0 0 7a3.5 3.5 0 0 0 0-7Zm2.151 20.505A3 3 0 0 1 4 22v-6.5a.5.5 0 0 1 .5-.5h4.031a3.981 3.981 0 0 1 .846-2H4.5A2.5 2.5 0 0 0 2 15.5V22a5 5 0 0 0 7.327 4.427a7.446 7.446 0 0 1-.676-1.922Zm14.022 1.922A5 5 0 0 0 30 22v-6.5a2.5 2.5 0 0 0-2.5-2.5h-4.877a3.99 3.99 0 0 1 .846 2H27.5a.5.5 0 0 1 .5.5V22a3 3 0 0 1-4.651 2.505a7.447 7.447 0 0 1-.676 1.922ZM12.5 13a2.5 2.5 0 0 0-2.5 2.5V23a6 6 0 0 0 12 0v-7.5a2.5 2.5 0 0 0-2.5-2.5h-7Zm-.5 2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5V23a4 4 0 0 1-8 0v-7.5Z"
        />
      </svg>
      <div class="label">
        People joined: <span class="value">{{ referrals }}</span>
      </div>
    </div>
    <div class="col">
      <svg width="32" height="32" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M12.025 21q-.425 0-.713-.288q-.287-.287-.287-.712v-1.15Q9.9 18.6 9.05 17.975q-.85-.625-1.375-1.75q-.175-.35-.013-.737q.163-.388.588-.563q.35-.15.725.013q.375.162.575.537q.425.75 1.075 1.138q.65.387 1.6.387q1.025 0 1.738-.462q.712-.463.712-1.438q0-.875-.55-1.388q-.55-.512-2.55-1.162q-2.15-.675-2.95-1.612q-.8-.938-.8-2.288q0-1.625 1.05-2.525q1.05-.9 2.15-1.025V4q0-.425.287-.713Q11.6 3 12.025 3t.713.287q.287.288.287.713v1.1q.95.15 1.65.613q.7.462 1.15 1.137q.225.325.088.725q-.138.4-.563.575q-.35.15-.725.012q-.375-.137-.7-.487q-.325-.35-.762-.538q-.438-.187-1.088-.187q-1.1 0-1.675.488q-.575.487-.575 1.212q0 .825.75 1.3q.75.475 2.6 1q1.725.5 2.613 1.587q.887 1.088.887 2.513q0 1.775-1.05 2.7q-1.05.925-2.6 1.15V20q0 .425-.287.712q-.288.288-.713.288Z"
        />
      </svg>
      <div class="label">
        Earned: <span class="value">{{ earnedAmount }}$</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: Object,
  },
  data: () => ({
    loading: false,
  }),
  computed: {
    profile() {
      return this.$store.getters['auth/profile']
    },
    link() {
      return window.location.host + '/?uref=' + this.value?.uref
    },
    earnedAmount() {
      return Number(
        this.value.earned
          .reduce(
            (b, t) => b + t.amount * this.profile.wallets[t.currency].price,
            0,
          )
          .toFixed(2),
      )
    },
    referrals() {
      return this.value?.referrals || 0
    },
  },
  methods: {
    copy() {
      this.$copy(window.location.protocol + '//' + this.link)
      this.$store.commit('popups/ADD_ALERT', {
        type: 'info',
        title: 'Copied',
        message: 'Your referral link is copied! Now start sharing it.',
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.ref-link-card {
  width: 100%;
  background-color: transparentize($dark-blue, 0.4);
  border-radius: 18px;
  padding: 0.6rem 1.2rem;
  box-sizing: border-box;
  border: 1px $cyan-alpha solid;
  margin: 1rem auto;
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: space-around;
  gap: 10px;
  user-select: none;
  flex-wrap: wrap;

  .col {
    gap: 10px;
    align-items: center;
    display: flex;
    span.value {
      color: $light-blue;
    }
  }

  svg path {
    fill: $cyan;
  }

  .label {
    letter-spacing: 0.02rem;
    color: white;
    // font-size: .9rem;
  }

  .ref-link {
    position: relative;
    width: min-content;
    padding: 0.6rem;
    height: min-content;
    background-color: $dark-blue;
    border: 1px $cyan-alpha solid;
    border-radius: 10px;
    color: $light-blue;
    display: flex;
    align-items: center;
    gap: 5px;
    cursor: pointer;

    span {
      max-width: 15rem;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }

    &:hover {
      background-color: $blue;
      border-color: $cyan;
      color: white;
    }
    &:active {
      background-color: $cyan-alpha;
      border-color: $cyan;
      color: white;
    }
  }
}
</style>
