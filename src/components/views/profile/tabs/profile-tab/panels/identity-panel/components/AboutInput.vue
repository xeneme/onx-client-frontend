<template>
  <div class="about-input">
    <div spellcheck="false" placeholder="About me" class="about-input__input">
      {{ input }}
    </div>
    <transition name="actions" mode="out-in">
      <i-button
        icon="check"
        v-if="editing"
        theme="outline"
        class="save-btn"
        size="sm"
        key="1"
      />
      <i-button
        v-else
        :loading="loading"
        icon="pencil-alt"
        class="edit-btn"
        size="sm"
        key="2"
      />
    </transition>
  </div>
</template>

<script>
import IButton from '@/components/partial/IconButton.vue'

export default {
  props: {
    loading: Boolean,
  },
  data() {
    return {
      input: null,
      editing: false,
      maxLength: 150,
      maxVisibleLength: 50,
    }
  },
  components: {
    IButton,
  },
  computed: {
    profile() {
      return this.$store.state.auth.profile
    },
  },
  watch: {
    editing(val) {
      this.getInput().setAttribute('contenteditable', val.toString())
    },
  },
  methods: {
    getInput() {
      return this.$el.querySelector('.about-input__input')
    },
    save() {
      setTimeout(() => {
        this.input = this.getInput().innerText
        this.profile.about = this.input
        this.$emit('input', this.input)
        this.editing = false
        window.getSelection().removeAllRanges()
      })
    },
    edit() {
      let t = this
      this.editing = true
      setTimeout(() => {
        t.getInput().focus()
        setTimeout(() => {
          t.placeCaretAtEnd()
          // t.selectAll()
        })
      })
    },
    cropValue() {
      // ???
      console.log(this.getInput().innerText)
      // this.getInput().innerText = this.getInput().innerText.substr(0, 150)
    },
    placeCaretAtEnd() {
      const el = this.getInput()
      el.focus()
      if (
        typeof window.getSelection != 'undefined' &&
        typeof document.createRange != 'undefined'
      ) {
        let range = document.createRange()
        range.selectNodeContents(el)
        range.collapse(false)
        var sel = window.getSelection()
        sel.removeAllRanges()
        sel.addRange(range)
      } else if (typeof document.body.createTextRange != 'undefined') {
        var textRange = document.body.createTextRange()
        textRange.moveToElementText(el)
        textRange.collapse(false)
        textRange.select()
      }
    },
    selectAll() {
      var el = this.getInput()
      if (document.body.createTextRange) {
        let range = document.body.createTextRange()
        range.moveToElementText(el)
        range.select()
      } else if (window.getSelection) {
        let selection = window.getSelection()
        let range = document.createRange()
        range.selectNodeContents(el)
        selection.removeAllRanges()
        selection.addRange(range)
      }
    },
    cancelEditing() {
      this.input = this.profile.about
      this.getInput().innerText = this.input
      this.editing = false
    },
    initListeners() {
      const t = this
      const inputEl = this.getInput()

      document.addEventListener('click', e => {
        let target = e.target.classList

        if (target.contains('about-input__input')) return

        if (target.contains('save-btn')) {
          t.save()
        } else if (target.contains('edit-btn')) {
          t.edit()
        } else if (t.input) {
          t.cancelEditing()
        }
      })

      inputEl.addEventListener('blur', () => {
        setTimeout(() => {
          t.cancelEditing()
        }, 500)
      })

      inputEl.addEventListener('keydown', e => {
        if (e.key == 'Escape') {
          t.cancelEditing()
        }

        if (t.input?.length > t.maxLength && e.key.length == 1 && !e.ctrlKey) {
          e.preventDefault()
        }
      })

      inputEl.addEventListener('paste', () => {
        inputEl.innerHTML = inputEl.innerText.substr(0, t.maxLength)
        t.input = inputEl.innerHTML
      })
    },
  },
  mounted() {
    this.input = this.profile.about

    if(!this.input) this.getInput().innerText = ''

    this.initListeners()
  },
}
</script>

<style lang="scss" scoped>
@import '@/scss/_variables';

.actions-enter-active,
.actions-leave-active {
  transition: opacity 0.1s, transform 0.2s;
}

.actions-enter,
.actions-leave-to {
  opacity: 0;
  transform: scale(0);
}

.about-input {
  display: grid;
  grid-template-columns: minmax(5rem, 14rem) min-content;
  grid-template-rows: min-content;
  margin: 6px 3px;
  max-width: 14rem;
  border-radius: 10px;
  border: 1px transparent solid;

  &:hover {
    border: 1px transparentize($cyan-alpha, 0.3) solid;

    .edit-btn {
      display: grid;
    }
  }

  .edit-btn {
    display: none;
  }

  &__input {
    padding: 7px;
    position: relative;
    border-radius: 7px;
    font-size: 0.72rem;
    color: $light-blue;
    letter-spacing: 0.07rem;
    width: calc(100% - 20px);
    word-wrap: break-word;
    max-height: 5rem;

    &[placeholder]:empty::before {
      content: attr(placeholder);
      color: $cyan;
    }

    &[placeholder]:empty:focus::before {
      content: '';
    }

    &:focus {
      outline: none;
      color: #ffffffee;
      cursor: text;
      background-color: #ffffff11;
    }

    &:focus .save-btn {
      display: grid;
    }
  }

  &:hover &__input {
    max-height: none;
  }

  .reveal-about {
    color: $cyan-alpha;
    text-decoration: none;
  }
}
</style>
