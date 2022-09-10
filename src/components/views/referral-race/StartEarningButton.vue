<template>
  <div class="ref-button" @click="handleClick">
    <svg
      v-if="loading"
      class="spinner spin"
      width="32"
      height="32"
      viewBox="0 0 24 24"
    >
      <path
        fill="currentColor"
        d="M12 21a9 9 0 1 1 6.18-15.55a.75.75 0 0 1 0 1.06a.74.74 0 0 1-1.06 0A7.51 7.51 0 1 0 19.5 12a.75.75 0 0 1 1.5 0a9 9 0 0 1-9 9Z"
      />
    </svg>
    <span :class="['label', { loading: _loading || loading }]">Start Earning Now</span>
  </div>
</template>

<script>
import { startReferralRace } from '@/api'

export default {
  props: {
    loading: Boolean
  },
  data: () => ({
    _loading: false,
  }),
  methods: {
    async handleClick() {
      if(this._loading) return
      this._loading = true
      try {
        let response = await startReferralRace()
        this.$emit('data', response.data.data)
      } catch (err) {
        console.log(err.response)
        let { status, statusText } = err.response
        this.$store.commit('popups/ADD_ALERT', {
          type: 'error',
          title: 'Error ' + status,
          message: statusText,
        })
      }
      this._loading = false
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/scss/_variables';

.ref-button {
  position: relative;
  cursor: pointer;
  padding: 1rem 2rem;
  margin: 1rem auto;
  background-color: $cyan-alpha;
  font-size: 1.2rem;
  color: white;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 5px;
  overflow: hidden;
  user-select: none;
  border: 1px transparent solid;
  transition: box-shadow 200ms ease, transform 200ms ease;
  box-shadow: 0px 80px 114px rgba(0, 0, 0, 0.07),
    0px 33.4221px 47.6265px rgba(0, 0, 0, 0.0503198),
    0px 17.869px 25.4634px rgba(0, 0, 0, 0.0417275),
    0px 10.0172px 14.2746px rgba(0, 0, 0, 0.035),
    0px 5.32008px 7.58112px rgba(0, 0, 0, 0.0282725),
    0px 2.21381px 3.15467px rgba(0, 0, 0, 0.0196802);

  .label.loading {
    opacity: 0;
  }

  .spinner {
    position: absolute;
    left: calc(50% - 12px);
  }

  &:hover {
    border: 1px rgba(255, 255, 255, 0.247) solid;
    box-shadow: 0 0 50px 1px $cyan-alpha, 0px 80px 114px rgba(0, 0, 0, 0.07),
      0px 33.4221px 47.6265px rgba(0, 0, 0, 0.0503198),
      0px 17.869px 25.4634px rgba(0, 0, 0, 0.0417275),
      0px 10.0172px 14.2746px rgba(0, 0, 0, 0.035),
      0px 5.32008px 7.58112px rgba(0, 0, 0, 0.0282725),
      0px 2.21381px 3.15467px rgba(0, 0, 0, 0.0196802);
  }

  &:hover::before {
    left: 200%;
    transition: left 1000ms ease;
  }

  &::before {
    transition: none;
    content: '';
    display: block;
    height: 250%;
    width: 2rem;
    position: absolute;
    background-color: #ffffff22;
    left: -10%;
    top: 0;
    transform: rotate(-50deg) translate(-50%, -60%);
    filter: blur(20px);
  }
}
</style>
