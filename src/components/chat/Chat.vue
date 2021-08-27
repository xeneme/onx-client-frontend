<template>
  <div
    class="chat"
    :class="{ 'chat-opened': chatOpened, 'mobile-chat': !$isDesktop }"
    rel="nofollow"
  >
    <div
      class="chat_header"
      @click="toggleChat"
      @mouseenter="firstTime = false"
      :class="{ 'first-time': firstTime && !chatOpened, opened: chatOpened }"
    >
      <svg
        class="chat_header-icon"
        fill="white"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
      >
        <path
          d="M304 96H112a16 16 0 000 32h192a16 16 0 000-32zM240 160H112a16 16 0 000 32h128a16 16 0 000-32z"
        />
        <path
          d="M352 0H64C29 0 0 29 0 64v320a16 16 0 0026 12l92-76h234c35 0 64-29 64-64V64c0-35-29-64-64-64zm32 256c0 18-14 32-32 32H112c-4 0-7 1-10 4l-70 58V64c0-18 14-32 32-32h288c18 0 32 14 32 32v192z"
        />
        <path
          d="M448 128a16 16 0 000 32c18 0 32 14 32 32v271l-54-44c-3-2-6-3-10-3H192c-18 0-32-14-32-32v-16a16 16 0 00-32 0v16c0 35 29 64 64 64h218l76 61a16 16 0 0017 1c5-2 9-8 9-14V192c0-35-29-64-64-64z"
        />
      </svg>
      <div
        :class="{ enabled: support }"
        class="chat_header-maximize-icon"
        @click="maximizeSupport"
      >
        <fa icon="window-maximize"></fa>
      </div>
      <div class="chat_header-title">
        {{ general ? 'General chat' : 'Support chat' }}
      </div>
      <div
        class="chat_header-divider"
        v-if="supportEnabled && generalEnabled"
      ></div>
      <div
        class="chat_header-switch-chat"
        @click="switchChat"
        v-if="supportEnabled && generalEnabled"
      >
        <fa
          class="chat_header-switch-chat-icon"
          :icon="support ? 'comments' : 'headphones'"
        ></fa>
      </div>
      <fa class="chat_header-close-icon" icon="caret-down"></fa>
    </div>
    <div ref="messagesBox" v-if="general" class="chat_messages-box">
      <div
        v-for="(msg, i) in generalMessages"
        :key="i"
        class="chat_messages-box_item"
      >
        <div class="chat_messages-box_item-pic">
          <img v-if="msg.user && msg.user.pic" :src="msg.user.pic" alt="" />
          <span v-else>{{ getAlt(msg.user) }}</span>
        </div>
        <div
          @click="reply(msg.user.firstName)"
          class="chat_messages-box_item-name"
        >
          {{ getNickname(msg.user) }}
        </div>
        <div class="chat_messages-box_item-time">
          <span class="expanded">
            {{ formatTime(msg.at, true) }}
          </span>
          <span class="collapsed">
            {{ formatTime(msg.at) }}
          </span>
        </div>
        <div class="chat_messages-box_item-text">{{ msg.text }}</div>
      </div>
    </div>
    <div ref="supportMessagesBox" v-else class="chat_messages-box_support">
      <div
        v-for="(msg, i) in supportMessages"
        :key="i"
        :class="{ support: msg.yours }"
        class="chat_messages-box_support_item"
      >
        <div class="chat_messages-box_support_item-pic">
          <fa
            class="chat_messages-box_support_item-pic_icon"
            v-if="msg.yours"
            icon="headphones"
          ></fa>
          <fa
            class="chat_messages-box_support_item-pic_icon"
            v-else
            icon="user"
          ></fa>
        </div>
        <div class="chat_messages-box_support_item-name">
          {{ msg.yours ? 'Support' : 'Me' }}
        </div>
        <div class="chat_messages-box_support_item-time">
          <span class="expanded">
            {{ formatTime(msg.date, true) }}
          </span>
          <span class="collapsed">
            {{ formatTime(msg.date) }}
          </span>
        </div>
        <div class="chat_messages-box_support_item-text">{{ msg.text }}</div>
      </div>
    </div>
    <div
      :class="{
        opened: chatOpened,
        disabled: !profile,
      }"
      class="chat_message-input"
    >
      <div
        ref="input"
        class="chat_message-input_editor"
        :contenteditable="!!profile"
        @keypress="handleInputKeypress"
        @input="updateInput"
        spellcheck="false"
      >
        <div v-if="!profile" class="chat_message-input_editor_need-auth">
          <div class="log-in" @click="login">Log In</div>
          <div>or</div>
          <div class="register" @click="signup">Register</div>
        </div>
      </div>
    </div>
    <div
      :class="{ disabled: !profile }"
      @click="handleSending"
      class="chat_send"
    >
      <fa icon="paper-plane"></fa>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import axios from 'axios'
import { mapGetters } from 'vuex'

export default {
  name: 'chat',
  data() {
    return {
      input: '',
      firstTime: true,
      chatOpened: false,
      chat: 0,
      messages: [],
      replyingTo: '',
      attached: null,
    }
  },
  computed: {
    ...mapGetters({
      profile: 'auth/profile',
      token: 'auth/token',
      // socket: 'auth/socket',
      supportMessages: 'auth/messages',
      itsAdmin: 'auth/itsAdmin',
      support: 'popups/supportVisibility',
    }),
    generalMessages() {
      return this.messages?.filter(m => m.user)
    },
    lobby() {
      return this.profile ? this.profile.lobby : 'total'
    },
    generalEnabled() {
      return this.profile?.generalChat
    },
    supportEnabled() {
      return !this.itsAdmin && this.profile
    },
    support() {
      return this.chat == 1
    },
    general() {
      return this.chat == 0
    },
    connected() {
      return this.socket && this.socket.connected
    },
  },
  watch: {
    socket: {
      immediate: true,
      handler() {
        this.$store.commit('auth/SET_MESSAGES', this.profile?.messages)
        this.scrollToBottom()

        if (!this.socket) return

        const t = this

        this.socket.on('set-general-messages', messages => {
          if (messages?.length) t.messages = messages
          t.scrollToBottom()
        })

        this.socket.on('general-message', message => {
          t.messages.push(message)
          t.scrollToBottom()
        })

        this.socket.on('support-message', message => {
          t.$store.commit('auth/NEW_MESSAGE', message)
          t.scrollToBottom(message.yours)

          if (!t.chatOpened && message.yours && !this.support) {
            t.$store.dispatch('auth/newSupportMessage', message.text)
          }
        })
      },
    },
    profile: {
      handler(p) {
        if (p) this.messages = p.generalChatMessages
        else return
        if (!p.generalChat) this.chat = 1
      },
      immediate: true,
    },
    supportMessages() {
      this.scrollToBottom()
    },
    chatOpened(val) {
      if (val) {
        this.readSupport()
      }
    },
    chat(val) {
      if (val) {
        this.readSupport()
      }
    },
  },
  methods: {
    readSupport() {
      axios.get('/api/user/support/read', {
        headers: {
          Authorization: localStorage.getItem('auth-token'),
        },
      })
    },
    switchChat(e) {
      if (
        this.$el.querySelector('.chat_header-switch-chat')?.contains(e.target)
      ) {
        this.chat = !this.chat
      }

      this.focus()
      const t = this

      localStorage.setItem('which-chat', this.chat)
      if (this.chatOpened && this.chat) this.profile.newMessages = 0

      setTimeout(() => {
        t.scrollToBottom()
      })
    },
    maximizeSupport() {
      this.$store.commit('popups/SUPPORT')
    },
    handleSending() {
      const input = this.cleanedInput()

      if (!this.profile || !input) return

      if (this.general) {
        const message = {
          text: input,
          user: {
            firstName: this.profile.firstName,
            lastName: this.profile.lastName,
            pic: this.profile.pic,
          },
        }

        this.sendGeneral(message)
      } else if (this.support) {
        let attached = this.attached
        this.atached = null

        this.sendSupport({
          token: localStorage.getItem('auth-token'),
          message: input,
          attached,
        })
      }

      this.clear()
      this.focus()
    },
    sendSupport(payload) {
      if (this.connected) {
        this.socket.emit('support-message', payload)
      } else {
        const message = {
          text: payload.message,
          date: null,
          yours: false,
        }

        this.$store.commit('auth/NEW_MESSAGE', message)

        this.scrollToBottom()

        axios
          .post('/api/user/support', payload, {
            headers: {
              Authorization: localStorage.getItem('auth-token'),
            },
          })
          .then(({ data }) => {
            message.date = data.date
          })
      }
    },
    sendGeneral(payload) {
      if (this.connected) {
        this.socket.emit('message', { message: payload })
      } else {
        const message = {
          ...payload,
          real: true,
          at: null,
          userid: this.profile.id,
        }

        this.messages.push(message)
        this.scrollToBottom()

        axios
          .post('/api/user/general', payload, {
            headers: {
              Authorization: localStorage.getItem('auth-token'),
            },
          })
          .then(({ data }) => {
            message.at = data
          })
      }
    },
    handleInputKeypress(e) {
      if (e.charCode == 13 || e.keyCode == 13 || e.which == 13) {
        e.preventDefault()
        this.handleSending()
        return
      } else if (
        (e.charCode == 10 || e.keyCode == 10 || e.which == 10) &&
        e.ctrlKey
      ) {
        e.preventDefault()
        this.enterNewLine()
      }
    },
    enterNewLine() {
      document.execCommand('insertHTML', false, '<br>')
      this.updateInput()
    },
    login() {
      this.$store.commit('popups/SIGN_IN', true)
    },
    signup() {
      this.$store.commit('popups/SIGN_UP', true)
    },
    toggleChat(e) {
      if (
        this.$el.querySelector('.chat_header-switch-chat')?.contains(e.target)
      ) {
        return
      }

      this.chatOpened = !this.chatOpened
      this.scrollToBottom()

      if (this.chatOpened) {
        this.$refs.input.focus()
      } else {
        this.$refs.input.blur()
      }

      if (this.chatOpened && this.chat) this.profile.newMessages = 0
    },
    clear() {
      this.$refs.input.innerHTML = ''
      this.updateInput()
    },
    focus() {
      this.$refs.input.focus()
    },
    caretToEnd(el) {
      var range = document.createRange()
      var sel = window.getSelection()

      range.setStart(el, 2)
      range.collapse(true)

      sel.removeAllRanges()
      sel.addRange(range)
    },
    reply(name) {
      let prev = this.replyingTo
      this.replyingTo = name + ', '
      this.$refs.input.innerHTML =
        this.replyingTo +
        this.input.slice(prev.length, this.input.length) +
        '&nbsp;<br>'
      this.updateInput()
      this.focus()
      this.caretToEnd(this.$refs.input)
    },
    cleanedInput() {
      return this.$refs.input.innerText
        .replace(/<br>/g, '\n')
        .replace(/^[\n\s]+|[\n\s]+$/g, '')
    },
    updateInput() {
      this.input = this.cleanedInput()
    },
    formatTime(ts, expand) {
      if (!ts) return 'Sending...'

      const d = moment(ts)

      return expand ? d.format('MMMM Do YYYY, h:mm a') : d.format('LT')
    },
    getAlt(user) {
      if (!user) return 'AN'

      let fer = user.firstName[0].toUpperCase()
      let sec = user.lastName
        ? user.lastName[0].toUpperCase()
        : user.firstName[1]?.toUpperCase()

      return fer + (sec || '')
    },
    getNickname(user) {
      if (!user) return 'anonymous'

      return (
        user.firstName.split('@')[0] +
        (user.lastName ? ' ' + user.lastName : '')
      )
    },
    reachedBottom() {
      const el =
        this.chat == 0 ? this.$refs.messagesBox : this.$refs.supportMessagesBox
      return el?.scrollTop == el?.scrollHeight - el?.clientHeight
    },
    scrollToBottom(support) {
      const el =
        this.chat == 0 ? this.$refs.messagesBox : this.$refs.supportMessagesBox

      if (!support || this.reachedBottom()) {
        setTimeout(() => {
          if (el) el.scrollTop = el.scrollHeight
        })
      }
    },
    handlePasteEvent(e) {
      const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
      }

      const escape_text = text => text.replace(/[&<>"']/g, m => map[m])

      e.preventDefault()
      var text = (e.originalEv0ent || e).clipboardData.getData('text/plain')
      document.execCommand('insertHtml', false, escape_text(text))
    },
    imageAttached(image) {
      this.attached = image
    },
  },
  created() {
    const t = this
    document.addEventListener('click', e => {
      if (!t.$el.contains(e.target)) {
        t.chatOpened = false
      }
    })

    this.$root.$on('image-attached', this.imageAttached)
  },
  mounted() {
    if (this.$refs.input) {
      this.$refs.input.addEventListener('paste', this.handlePasteEvent)
      this.scrollToBottom()
    }

    this.chat = +localStorage.getItem('which-chat') || 0

    // if (!this.connected) {
    // this.$store.dispatch('auth/startRefreshingSupport')
    // }
  },
  beforeDestroy() {
    if (this.$refs.input) {
      this.$refs.input.removeEventListener('paste', this.handlePasteEvent)
    }

    this.$root.$off('image-attached', this.imageAttached)
  },
}
</script>

<style lang="scss" scoped>
@import '@/scss/_variables';
@import '@/scss/_smart-grid';

@keyframes attractor {
  0% {
    box-shadow: 0 0 0px 0px $light-blue;
  }
  80% {
    box-shadow: 0 0 0px 0px $light-blue;
    transform: scale(1);
  }
  95% {
    box-shadow: 0 0 200px 10px $light-blue;
    transform: scale(0.9);
  }
  100% {
    box-shadow: 0 0 500px 0px $light-blue;
    transform: scale(1);
  }
}

@keyframes sent {
  from {
    background-color: #ffffff55;
  }

  to {
    background-color: #ffffff00;
  }
}

$mobile-break: 30rem;

.chat {
  position: fixed;
  z-index: 100;
  right: 0;
  max-width: 350px;
  min-height: 200px;
  max-height: 500px;
  height: 500px;
  pointer-events: none;
  bottom: 0;

  @include to($mobile-break) {
    width: 100%;
    max-width: 100%;
  }
  @include from($mobile-break) {
    width: 350px;
    max-width: 30rem;
  }

  * {
    pointer-events: all;
  }

  &_messages-box,
  &_messages-box_support {
    height: 0;
    position: absolute;
    bottom: 80px;
    background-color: $cyan-alpha;
    backdrop-filter: blur(10px);
    opacity: 0;
    pointer-events: none;
    transition: all 0.35s;
    color: white;
    overflow-x: hidden;
    overflow: auto;

    @include to($mobile-break) {
      right: 15px;
      width: calc(100% - 30px);
    }
    @include from($mobile-break) {
      right: 115px;
      width: 100%;
    }

    &_item {
      width: calc(100% - 1.2rem);
      padding: 0.2rem;
      text-align: left;
      font-size: 0.9rem;
      font-family: Montserrat;
      display: flex;
      flex-wrap: wrap;
      padding: 10px;
      border-bottom: $cyan 1px solid;
      animation-name: sent;
      animation-duration: 0.4s;
      animation-iteration-count: 1;

      &-pic {
        overflow: hidden;
        width: 30px;
        height: 30px;
        border-radius: 100%;
        display: flex;
        justify-content: center;
        border: 2px solid $cyan-alpha;
        align-items: center;
        font-size: 0.6rem;
        font-weight: 800;
        background-color: #00000066;

        img {
          height: 100%;
        }

        span {
          user-select: none;
          pointer-events: none;
        }
      }

      &-name {
        display: grid;
        align-content: center;
        text-indent: 0.4rem;
        font-weight: 500;
        cursor: pointer;

        &:hover {
          color: #ffffff88;
        }
      }

      &-time {
        display: grid;
        align-content: center;
        margin-top: 3px;
        opacity: 0.9;
        color: $light-blue;
        text-indent: 0.4rem;
        font-size: 0.7rem;
      }

      &:hover &-time .expanded {
        display: block;
      }
      &:hover &-time .collapsed {
        display: none;
      }
      &-time .expanded {
        display: none;
      }
      &-time .collapsed {
        display: block;
      }

      &-text {
        width: 100%;
        margin-top: 6px;
        // word-break: break-all;
        word-wrap: break-word;
      }

      &:hover {
        background-color: $cyan-alpha;
      }
    }
  }

  &_messages-box_support {
    &_item {
      &-pic {
        &_icon {
          font-size: 1.1rem;
          color: $cyan;
          opacity: 0.8;
        }
      }
    }
    &-time {
      &-name {
        color: #ffffffbb;
      }
      &:hover &-name {
        color: white;
      }
    }
  }

  &_message-input {
    position: absolute;
    overflow: auto;
    color: white;
    backdrop-filter: blur(10px);
    border: 1px solid $cyan-alpha;
    box-shadow: 0 0 0px 0px #00000099;
    border-radius: 0 0 0 10px;
    min-height: 30px;
    transform: scaleY(0);
    transition: transform 0.3s, box-shadow 0.1s;
    max-height: 100px;
    padding: 10px;
    bottom: 60px;

    @include to($mobile-break) {
      right: 59px;
      width: calc(100% - 95px);
    }

    @include from($mobile-break) {
      right: 114px;
      width: calc(100% - 20px);
    }

    &_editor {
      text-align: left;
      width: 100%;
      height: 100%;

      &:focus {
        outline: none;
      }

      &_need-auth {
        position: absolute;
        left: 28%;
        bottom: 30%;
        display: flex;
        .log-in,
        .register {
          user-select: none;
          margin: 0 7px;
          cursor: pointer;
          color: $cyan;
          &:hover {
            color: white;
          }
        }
      }
    }

    &.opened {
      transition: transform 0.3s, box-shadow 0.4s;
      box-shadow: 0 0 40px 1px #00000099;
      transform: scaleY(1);
    }
    &.disabled {
      background: $blue-alpha;
    }
  }

  &_send {
    position: absolute;
    color: white;
    display: grid;
    align-content: center;
    justify-items: center;
    cursor: pointer;
    opacity: 0;
    border-radius: 100%;
    height: 70px;
    width: 70px;
    bottom: 50px;
    right: 55px;
    background: $cyan-alpha;
    transition: border-radius 0.5s, width 0.2s, height 0.2s, padding 0.2s,
      right 0.2s, bottom 0.2s, transform 0.2s;

    &:hover {
      background-color: $cyan;
    }
  }

  &_header.opened ~ &_send {
    transform: scale(1);
    width: 40px;
    height: 52px;
    padding-right: 5px;
    opacity: 1;

    &.disabled {
      pointer-events: none;
      cursor: default;
      background: $cyan;
      opacity: 0.5;
    }

    @include to($mobile-break) {
      border-radius: 0 0 10px 0;
      bottom: 58px;
      right: 14px;
    }

    @include from($mobile-break) {
      border-radius: 0 10px 10px 0;
      bottom: 60px;
      right: 69px;
    }
  }

  &_header.opened + &_messages-box,
  &_header.opened + &_messages-box_support {
    opacity: 1;
    bottom: 110px;
    height: 350px;
    pointer-events: all;
  }

  &_header {
    position: absolute;
    background-color: $cyan-alpha;
    cursor: pointer;
    border-radius: 100%;
    transition: border-radius 0.3s, background-color 0.2s;
    box-shadow: 0 0 10px 1px #00000099;
    z-index: 100;
    overflow: hidden;
    display: flex;

    @include to($mobile-break) {
      bottom: 30px;
      right: 25px;
      width: 55px;
      height: 55px;
    }
    @include from($mobile-break) {
      width: 70px;
      height: 70px;
      bottom: 50px;
      right: 55px;
    }

    &-title {
      font-family: Montserrat, sans-serif;
      color: white;
      display: grid;
      align-content: center;
      padding-right: 5px;
      opacity: 0;
    }

    &-divider {
      padding: 0 8px;
      padding-left: 0;
      height: 80%;
      margin-left: 8px;
      border-left: 1px #ffffff66 solid;
      align-self: center;
      opacity: 0;
    }

    &-switch-chat {
      opacity: 0;
      pointer-events: all;
      * {
        color: white;
        font-size: 1.1rem;
        padding: 10px 10px;
      }

      &:hover {
        background-color: #ffffff33;
      }
    }

    &-icon {
      pointer-events: none;
      transform: scale(0.5);
      opacity: 1;
      position: absolute;
      top: 0;
      left: 0;
    }

    &.opened {
      transition: width 0.1s, height 0.3s, border-radius 0.3s, transform 0.2s,
        background-color 0.2s;
      background-color: $cyan;
      border-radius: 10px 10px 0 0;
      bottom: 460px;
      height: 40px;

      @include to($mobile-break) {
        right: 15px;
        width: calc(100% - 30px);
      }
      @include from($mobile-break) {
        right: 115px;
        width: 100%;
      }

      .chat_header-icon {
        opacity: 0;
        transform: scale(0.01);
      }

      svg.chat_header-close-icon,
      .chat_header-title,
      .chat_header-switch-chat,
      .chat_header-divider {
        transition: opacity 2s;
        opacity: 1;
        pointer-events: none;
      }
    }

    .chat_header-close-icon {
      position: absolute;
      top: 10px;
      right: 20px;
      transform: scale(1);
      opacity: 0;
      color: white;
    }

    .chat_header-maximize-icon {
      align-self: center;
      padding: 10px;
      margin-right: 4px;
      transform: scale(1);
      color: $light-blue;
      pointer-events: none;
      visibility: hidden;
      display: none;

      &:hover {
        background-color: $light-blue;
        color: white;
      }

      &.enabled {
        pointer-events: all;
        visibility: visible;
      }
    }

    &.first-time {
      animation-name: attractor;
      animation-duration: 8s;
      animation-timing-function: ease-in-out;
      animation-iteration-count: infinite;
    }

    &:hover {
      background-color: $cyan;
    }
    &.opened {
      .chat_header-maximize-icon {
        display: block;
      }
    }
    &:active {
      .chat_header-title {
        pointer-events: all;
      }
      transform: scale(0.9);
    }
    &.opened:active {
      transform: scale(1);
    }
  }
}
</style>
