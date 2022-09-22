<template>
  <div :class="['authinput', place]">
    <div class="authinput_icon_wrap">
      <div class="authinput_icon">
        <fa :icon="icon" />
      </div>
    </div>
    <input
      autofocus
      class="authinput_input"
      :type="parsedType"
      :placeholder="prompt"
      v-model="inputValue"
      :disabled="busy"
    />
  </div>
</template>

<script>
export default {
  name: 'AuthInput',
  props: ['type', 'place', 'busy', 'extend'],
  data() {
    return {
      inputValue: '',
      mounted: false,
    }
  },
  watch: {
    inputValue(value) {
      this.$emit('input', value)

      if (this.extend == 'signup') {
        this.$store.commit(
          this.place == 'top'
            ? 'popups/SIGN_UP_TOP_INPUT_CHANGED'
            : 'popups/SIGN_UP_BOTTOM_INPUT_CHANGED',
          value,
        )
      } else if (this.extend == 'signin') {
        this.$store.commit(
          this.place == 'top'
            ? 'popups/SIGN_IN_TOP_INPUT_CHANGED'
            : 'popups/SIGN_IN_BOTTOM_INPUT_CHANGED',
          value,
        )
      }
    },
    type() {
      this.inputValue = ''
    },
  },
  computed: {
    icon() {
      if (this.mounted) {
        this.$anime({
          targets: this.$el.querySelector('.authinput_icon *'),
          scale: [0, 1],
          duration: 1200,
        })
      }

      return {
        email: 'envelope',
        password: 'lock',
        repeatPassword: 'lock',
        pin: 'calculator',
        code: 'calculator',
      }[this.type]
    },
    parsedType() {
      return {
        email: 'email',
        code: 'text',
        password: 'password',
        repeatPassword: 'password',
        pin: 'text',
      }[this.type]
    },
    prompt() {
      return {
        email: 'E-mail',
        code: '6-digit code',
        password: 'Password',
        repeatPassword: 'Repeat password',
        pin: 'Confirmation code',
      }[this.type]
    },
  },
  mounted() {
    this.mounted = true

    this.$store.subscribe(mutation => {
      if (
        ['popups/SIGN_UP', 'popups/SIGN_UP_NEXT'].includes(mutation.type) &&
        mutation.payload &&
        this.place === 'top' &&
        this.extend === 'signup'
      ) {
        setTimeout(() => {
          this.$el.querySelector('.authinput_input').focus()
        }, 200)
      } else if (
        mutation.type === 'popups/SIGN_IN' &&
        mutation.payload &&
        this.place === 'top' &&
        this.extend === 'signin'
      ) {
        setTimeout(() => {
          this.$el.querySelector('.authinput_input').focus()
        }, 200)
      } else if (mutation.type === 'popups/CLEAR_AUTH_INPUTS') {
        this.inputValue = ''
        this.$el.querySelector('.authinput_input').value = ''
      }
    })
  },
}
</script>

<style lang="scss" scoped>
input[type='password']:not(:placeholder-shown) + .authinput_input {
  width: 80%;
  background: linear-gradient(90deg, $cyan, $cyan-alpha);
}
.top {
  .authinput_icon_wrap {
    border-radius: 10px 0 0 0;
  }
  .authinput_input {
    border-radius: 0 10px 0 0;
  }
}
.bottom {
  .authinput_icon_wrap {
    border-radius: 0 0 0 10px;
  }
  .authinput_input {
    border-radius: 0 0 10px 0;
  }
}
.authinput {
  z-index: 2;
  display: grid;
  grid-template-columns: 48px 1fr;
  grid-template-rows: 48px;
  margin: 0 auto;
  justify-content: end;
  overflow: hidden;

  @include to(33rem) {
    font-size: 0.6rem;
    width: 80%;
  }
  @include from(33rem) {
    width: 405px;
    font-size: 1rem;
  }
  &_icon_wrap {
    width: calc(100% - 2px);
    height: calc(100% - 2px);
    border: 1px #0075ff22 solid;
    display: grid;
    background-color: #0075ff22;
  }
  &_icon {
    display: grid;
    width: 40%;
    height: 40%;
    place-self: center;
    color: #0075ff88;

    * {
      place-self: center;
    }
  }
  &_input {
    color: #0094ff;
    text-indent: 21px;
    line-height: 45px;
    width: 99.7%;
    font-size: 1.1rem;
    letter-spacing: 0.04rem;
    background: darken($blue, 3);
    transition: background-color 0.3s;
    border: none;
    box-shadow: 10px 0 20px #00002344 inset;

    &:focus {
      background: darken($blue, 7);
      outline: none;
    }
    &::selection {
      background: $cyan-alpha;
      color: white;
    }
    &::placeholder {
      transition: all 0.3s;
      text-align: left;
      color: #0094ff55;
    }
  }
}
</style>
