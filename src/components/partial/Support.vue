<template>
  <div class="support">
    <div class="support__title">
      <fa icon="times" class="support__title-close" @click="close" />
      <fa icon="user" class="support__title-icon" style="color: #0075ff" />
      <p class="support__title-text">Support chat</p>
    </div>
    <div class="support__chat">
      <div
        class="support__chat_body"
        ref="messagesBox"
        :style="{
          position: !!messages.length ? 'relative' : 'initial',
        }"
      >
        <div
          class="empty"
          :style="{
            opacity: +!messages.length,
          }"
        >
          <fa
            v-if="!loading"
            icon="life-ring"
            class="empty-icon"
            style="color: #0075ff33"
          />
          <fa
            v-else
            icon="spinner"
            class="empty-icon fa-spin"
            style="color: #0075ff33"
          />
          <div v-if="!loading">You have troubles? Text us!</div>
          <div v-else>Loading...</div>
        </div>
        <div
          v-for="(message, i) in messages"
          :key="i"
          :style="{
            paddingTop: '0.657rem',
          }"
          :class="[
            !message.newDivider
              ? 'support__chat_body_message'
              : 'support__chat_body_divider',
            !message.yours ? 'support__chat_body_message-yours' : '',
          ]"
        >
          <!-- <fa -->
          <!-- class="support__chat_body_message-info" -->
          <!-- v-if="!message.newDivider" -->
          <!-- :style="{ -->
          <!-- left: message.yours ? 'auto' : '0.5rem', -->
          <!-- right: message.yours ? '0.5rem' : 'auto', -->
          <!-- }" -->
          <!-- icon="spinner" -->
          <!-- spin -->
          <!-- ></fa> -->
          {{ !message.newDivider ? message.text : 'New messages' }}
          <a
            v-if="message.attached"
            target="_blank"
            :href="message.attached.image"
            class="attached"
          >
            <fa icon="file-image" style="margin-right: 6px"></fa
            >{{ clampString(message.attached.filename, 15) }}</a
          >
          <!-- <div v-else-if="!message.delivered" class="attached"> -->
          <!-- <fa icon="file-image" style="margin-right: 6px"></fa>Uploading -->
          <!-- image... -->
          <!-- </div> -->

          <span
            class="support__chat_body_message-date"
            :style="{
              opacity: 0.4,
              textAlign: message.yours ? 'right' : 'left',
            }"
          >
            {{ formatTime(message.date, true) }}
          </span>
        </div>
        <div
          v-for="(message, i) in queue"
          :key="i"
          :style="{
            paddingTop: '0.657rem',
          }"
          :class="[
            !message.newDivider
              ? 'support__chat_body_message'
              : 'support__chat_body_divider',
            message.yours ? 'support__chat_body_message-yours' : '',
          ]"
        >
          <!-- <fa -->
          <!-- class="support__chat_body_message-info" -->
          <!-- :style="{ -->
          <!-- left: message.yours ? 'auto' : '0.5rem', -->
          <!-- right: message.yours ? '0.5rem' : 'auto', -->
          <!-- }" -->
          <!-- icon="spinner" -->
          <!-- spin -->
          <!-- ></fa> -->
          {{ !message.newDivider ? message.text : 'New messages' }}
          <a
            v-if="message.image"
            target="_blank"
            :href="message.image.url"
            class="attached"
          >
            <fa icon="file-image" style="margin-right: 6px"></fa
            >{{ clampString(message.image.name, 15) }}</a
          >
          <span
            class="support__chat_body_message-date"
            :style="{
              opacity: 0.4,
              textAlign: message.yours ? 'right' : 'left',
            }"
          >
            {{ formatTime(message.at, true) }}
          </span>
        </div>
      </div>
      <div class="support__chat_input">
        <form action="" id="supportForm">
          <input
            readonly
            ref="input"
            onfocus="this.removeAttribute('readonly');"
            v-model="messageInput"
            placeholder="Enter you message..."
            type="text"
            @keydown.enter="send"
          />
        </form>
        <button
          :disabled="uploading"
          :class="{ disabled: uploading }"
          class="attach"
          @click="uploadImage"
        >
          <fa
            v-if="uploading"
            icon="spinner"
            class="fa-spin"
            style="opacity: .4; font-size: 1.1rem"
          ></fa>
          <fa
            v-else-if="attached"
            icon="file-image"
            style="opacity: .4; font-size: 1.1rem"
          ></fa>
          <fa v-else icon="plus" style="opacity: .7"></fa>
        </button>
        <button class="send" @click="send">send</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import axios from 'axios'
import moment from 'moment'

const base = window.location.protocol + '//' + window.location.host

export default {
  name: 'Support',
  props: {
    show: Boolean,
  },
  data: () => ({
    messageInput: '',
    queue: [],
    needToRefresh: true,
    uploading: false,
    loading: false,
    attached: null,
  }),
  computed: {
    ...mapGetters({
      profile: 'auth/profile',
      messages: 'auth/messages',
      // socket: 'auth/socket',
    }),
  },
  watch: {
    show(yes) {
      if (yes) {
        this.readSupport()

        this.scrollToLast()
        this.focus()
        document.body.style.overflowY = 'hidden'
        this.$el.style.opacity = 1
        this.$el.style.pointerEvents = 'all'
        this.messageInput = ''
      } else {
        if (this.profile) this.profile.newMessages = 0
        if (this.$route.name != 'Main') document.body.style.overflowY = 'auto'
        this.$el.style.opacity = 0
        this.$el.style.pointerEvents = 'none'
      }
    },
    messages() {
      this.scrollToLast()
    },
    attached(val) {
      this.$root.emit('image-attached', val)
    },
  },
  methods: {
    send() {
      const input = this.cleanedInput()

      if (!this.profile || !input) return

      if (this.socket && this.socket.connected) {
        this.socket.emit('support-message', {
          token: localStorage.getItem('auth-token'),
          message: input,
        })
      } else {
        const message = {
          text: input,
          date: null,
          yours: false,
          attached: this.attached,
        }

        let attached = this.attached
        this.attached = null

        axios
          .post(
            '/api/user/support',
            { message: input, attached },
            {
              headers: {
                Authorization: localStorage.getItem('auth-token'),
              },
            },
          )
          .then(({ data }) => {
            message.date = data.date
          })

        this.$store.commit('auth/NEW_MESSAGE', message)
        this.scrollToLast()
      }

      this.clear()
      this.focus()
    },
    readSupport() {
      axios.get('/api/user/support/read', {
        headers: {
          Authorization: localStorage.getItem('auth-token'),
        },
      })
    },
    clear() {
      // this.$refs.input.innerHTML = ''
      this.messageInput = ''
      // this.updateInput()
    },
    focus() {
      this.$refs.input.focus()
    },
    cleanedInput() {
      return this.messageInput
        .replace(/<br>/g, '\n')
        .replace(/^[\n\s]+|[\n\s]+$/g, '')
    },
    clampString(s, max) {
      const match = s.match(`.{${max}}`)
      return match && match[0] != s ? match[0] + '...' : s
    },
    async uploadImage() {
      if (this.attached) {
        this.detachImage()
        return
      }

      const [fileHandle] = await window.showOpenFilePicker({
        types: [
          {
            description: 'Images',
            accept: {
              'image/*': ['.png', '.gif', '.jpeg', '.jpg'],
            },
          },
        ],
        excludeAcceptAllOption: true,
        multiple: false,
      })

      if (!fileHandle) return

      var image = await fileHandle.getFile()
      var fileReader = new FileReader()

      this.uploading = true

      const self = this

      fileReader.onload = function() {
        var b64 = fileReader.result.replace(/^data:.+;base64,/, '')
        axios
          .post(
            '/api/support/upload',
            {
              image: b64,
              filename: image.name,
            },
            {
              headers: {
                Authorization: localStorage.getItem('auth-token'),
              },
            },
          )
          .then(({ data }) => {
            self.uploading = false
            self.attached = data
          })
          .catch(function(err) {
            self.uploading = false
            self.handleError(err)
          })
      }

      fileReader.readAsDataURL(image)
    },
    detachImage() {
      this.attached = null
    },
    formatTime(ts, expand) {
      if (!ts) return 'Sending...'

      const d = moment(ts)

      return expand ? d.format('MMMM Do YYYY, h:mm a') : d.format('LT')
    },
    fetchMessages() {
      if (this.loading || this.queue.length) return
      this.loading = true

      axios
        .get(base + '/api/support', {
          headers: {
            Authorization: localStorage.getItem('auth-token'),
          },
        })
        .then(({ data }) => {
          this.loading = false
          setTimeout(this.fetchMessages, 2000)
          if (this.queue.length || this.needToRefresh) return
          this.$store.commit('auth/SET_MESSAGES', data.messages)
        })
        .catch(err => {
          this.loading = false
          console.log(err)
        })
    },
    scrollToLast() {
      const t = this
      setTimeout(() => {
        t.$refs.messagesBox.scrollTop = t.$refs.messagesBox.scrollHeight
      })
    },
    sendMessage() {
      this.messageInput = this.messageInput.replace(/^[\n\s]+|[\n\s]+$/g, '')

      if (!this.messageInput && !this.attached) return

      var message = {
        yours: true,
        text: this.messageInput,
        delivered: false,
        date: +new Date(),
      }

      this.queue.push(message)

      this.needToRefresh = false

      let attached = this.attached
      this.attached = null

      this.axios
        .post(base + '/api/support', {
          token: localStorage.getItem('auth-token'),
          message: this.messageInput,
          attached,
        })
        .then(({ data }) => {
          this.queue = this.queue.filter(m => m.date != message.date)

          message.delivered = true
          message.date = data.message.date
          if (data.message.image) message.image = data.message.image
          this.needToRefresh = true

          this.messages.push(message)

          this.$store.commit('auth/SET_MESSAGES', [...this.messages])
          if (this.profile) this.profile.newMessages = 0
          this.scrollToLast()
          this.fetchMessages()
        })
        .catch(err => {
          this.needToRefresh = true
          this.handleError(err.response)
        })

      this.messageInput = ''
      this.scrollToLast()
    },
    handleError() {
      this.$store.commit('popups/ADD_ALERT', {
        type: 'error',
        message: 'Attachment has not been accepted',
        stage: 'Support Chat',
      })
    },
    close() {
      this.$store.commit('popups/SUPPORT', false)
    },
  },
  mounted() {
    this.scrollToLast()

    this.$el.querySelector('#supportForm').onsubmit = e => {
      e.preventDefault()
    }
  },
}
</script>

<style lang="sass" scoped>
@import "@/scss/_smart-grid"
@import "@/scss/_variables"

$chat-message-br: 0.65rem
$chat-padding: 10px
$mobile: 55rem

.support
  position: fixed
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center
  z-index: 200
  top: 0
  left: 0
  opacity: 0
  width: 100vw
  height: 100vh
  background-color: #00002299
  backdrop-filter: blur(2px)
  pointer-events: none
  transition: opacity .4s
  &__title
    height: 30px
    display: flex
    align-items: center
    justify-content: center
    padding: 10px
    background-color: $blue
    border-radius: 5px 5px 0 0
    border: 1px $cyan-alpha solid
    position: relative
    @include to($mobile)
      width: 90vw
    @include from($mobile)
      width: 50vw
    &-icon
      margin-right: 10px
    &-close
      position: absolute
      height: 100%
      right: 20px
      justify-self: end
      color: #0075ff
      cursor: pointer
      font-size: 1.1rem

      &:hover
        color: white
    &-text
      color: white
  &__chat
    background-color: #001155aa
    padding: $chat-padding
    z-index: 200
    width: 50vw
    height: 50vh
    display: flex
    flex-direction: column
    border-radius: 0 0 5px 5px
    border: 1px $blue solid

    @include to($mobile)
      width: 90vw
      height: 80vh
    @include from($mobile)
      width: 50vw
      height: 50vh
    &_body
      font-family: 'Montserrat'
      width: calc(100% - 20px)
      height: 100%
      border-radius: 10px
      display: flex
      flex-direction: column
      align-items: flex-end
      overflow-y: auto
      padding: 20px 10px
      font-size: .9rem
      position: relative

      .empty
        color: $cyan-alpha
        position: absolute
        width: 100%
        height: 100%
        top: 0
        left: 0
        text-align: center
        display: grid
        align-content: center
        transition: all 1s
        user-select: none
        pointer-events: none
        display: flex
        flex-direction: column
        align-items: center
        justify-content: center

        &-icon
          font-size: 5rem
          margin-bottom: 20px

        @include to($mobile)
          font-size: 1rem
        @include from($mobile)
          font-size: 1.4rem

      &_divider
        width: 100%
        text-align: center
        color: $cyan-alpha
        border-bottom: 1px $cyan-alpha solid
        margin-bottom: 15px
        user-select: none
        cursor: default

      &_message
        color: white
        position: relative
        padding: 0.657rem 1.375rem
        margin-bottom: $chat-message-br
        max-width: 70%
        min-width: 175px
        overflow-wrap: break-word
        border-radius: 0.5rem
        border-top-left-radius: 0
        align-self: flex-start
        background-color: $light-blue
        text-align: justify
        display: flex
        flex-direction: column

        .attached
          margin-top: 10px
          opacity: .7
          color: white
          &:hover
            opacity: 1

        &-yours
          background-color: $cyan
          align-self: flex-end
          border-top-right-radius: 0
          border-top-left-radius: 0.5rem

        &-info
          position: absolute
          top: 0.4rem
          font-size: 0.6rem

        &-date
          font-family: sans-serif
          font-size: 0.7rem
          opacity: 0
          transition: opacity 0.5s
          margin-top: .5rem

    &_input
      width: 100%
      margin-top: 1.3rem
      display: grid
      grid-gap: 10px

      @include to(30rem)
        grid-template-areas: "input attach" "send send"
        grid-template-rows: 40px 35px
        grid-template-columns: 1fr 35px
      @include from(30rem)
        grid-template-areas: "input attach send"
        grid-template-columns: 1fr 35px 100px
        grid-template-rows: 1fr

      input, button
        font-family: 'Montserrat'
        color: white
        border-radius: 5px
        outline: none
        border: none

      .send
        grid-area: send
      .attach
        grid-area: attach

      input
        grid-area: input
        width: 100%
        font-size: .9rem
        letter-spacing: .05rem
        padding: 10px 0
        text-indent: 1rem
        background-color: $blue
        color: $light-blue
        transition: box-shadow .2s
        box-shadow: inset 0 0 1px $cyan-alpha

        &:focus
          box-shadow: inset 0 0 8px $cyan-alpha

        &::placeholder
          color: $cyan-alpha

      button
        text-transform: uppercase
        width: 100%
        background-color: $cyan-alpha
        transition: box-shadow .3s, background-color .3s

        &:hover
          box-shadow: 0 2px 15px $cyan-alpha
          background-color: $cyan
          cursor: pointer
        &:active
          background-color: $light-blue
        .disabled:hover
          box-shadow: none
          cursor: default
          background-color: $cyan-alpha
</style>
