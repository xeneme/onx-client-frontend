<template>
  <div
    class="need-to-sign-in"
    v-if="!loggedIn"
    :class="[attention ? 'attention' : '']"
  >
    <div class="log-in" @click="login">Log In</div>
    <div>or</div>
    <div class="register" @click="signup">Register</div>
  </div>
  <div class="need-to-verify" :class="[attention ? 'attention' : '']" v-else>
    <div>Verify your account</div>
  </div>
</template>

<script>
export default {
  name: 'trade-denied',
  props: {
    loggedIn: Boolean,
    attention: Boolean,
  },
  methods: {
    login() {
      this.$store.commit('popups/SIGN_IN', true)
    },
    signup() {
      this.$store.commit('popups/SIGN_UP', true)
    },
  },
}
</script>

<style lang="scss" scoped>
@keyframes attention {
  0% {
    border: transparent 1px solid;
  }

  20% {
    border: $cyan 1px solid;
  }

  100% {
    border: transparent 1px solid;
  }
}

.need-to-sign-in,
.need-to-verify {
  display: flex;
  user-select: none;
  width: calc(100% - 80px);
  margin: 20px;
  padding: 10px 20px;
  justify-content: center;

  &.attention {
    border-radius: 3px;
    background: transparentize($cyan-alpha, 0.4);
    animation-name: attention;
    animation-duration: 2s;
    animation-iteration-count: infinite;
    animation-timing-function: ease-in-out;
  }

  div {
    padding: 0 3px;
    color: $cyan-alpha;
  }

  .log-in,
  .register {
    cursor: pointer;
    color: $cyan;
    &:hover {
      color: white;
    }
  }
}

.need-to-verify {
  div {
    color: $cyan;
  }
}
</style>
