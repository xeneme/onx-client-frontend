<template>
  <div class="ref-button" @click="handleClick" v-if="!created">
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
    <span :class="['label', { loading }]">Start Earning Now</span>
  </div>
  <div class="ref-link__wrapper" ref="link" v-else>
    <div class="ref-link tooltip" tooltip="Copy" @click="created = false">
      <svg width="24" height="24" viewBox="0 0 256 256">
        <path
          fill="currentColor"
          d="m212.9 122.3l-30.3 30.3a56 56 0 0 1-79.2 0a12 12 0 1 1 16.9-16.9a32.2 32.2 0 0 0 45.3 0l30.3-30.3a32 32 0 0 0-45.3-45.3l-9.6 9.7a12 12 0 0 1-17-17l9.7-9.7a56 56 0 1 1 79.2 79.2ZM115 186.2l-9.6 9.7a32 32 0 0 1-45.3-45.3l30.3-30.3a32.2 32.2 0 0 1 45.3 0a12 12 0 0 0 16.9-16.9a55.9 55.9 0 0 0-79.2 0l-30.3 30.3a56 56 0 0 0 79.2 79.2l9.7-9.7a12 12 0 0 0-17-17Z"
        />
      </svg>
      <div>{{ link }}</div>
    </div>
    <div
      class="ref-button"
      @click="$router.push({ path: '/profile/referrals' })"
    >
      <span class="label">Go to Profile</span>
      <svg width="24" height="24" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M13.3 17.275q-.3-.3-.288-.725q.013-.425.313-.725L16.15 13H5q-.425 0-.713-.288Q4 12.425 4 12t.287-.713Q4.575 11 5 11h11.15L13.3 8.15q-.3-.3-.3-.713q0-.412.3-.712t.713-.3q.412 0 .712.3L19.3 11.3q.15.15.213.325q.062.175.062.375t-.062.375q-.063.175-.213.325l-4.6 4.6q-.275.275-.687.275q-.413 0-.713-.3Z"
        />
      </svg>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    link: 'localhost.com/ref=pgK2O001',
    created: false,
    loading: false,
  }),
  methods: {
    handleClick() {
      this.created = true
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/scss/_variables';

.ref-link__wrapper {
  display: flex;
  gap: 2px;
  margin: 0 auto;
  align-items: center;

  .ref-button {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
  .ref-link {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
}

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
.ref-link {
  padding: 1rem 2rem;
  height: min-content;
  background-color: $dark-blue;
  border: 1px $cyan-alpha solid;
  border-radius: 10px;
  color: white;
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;

  &:hover {
    background-color: $blue;
    border-color: $cyan;
  }

  svg path {
    fill: $cyan;
  }
}
</style>
