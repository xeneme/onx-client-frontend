<template>
  <div class="chat">
    <div class="chat__body">
      <div
        :class="[
          'chat__body__message',
          message.side,
          !message.sending || 'sending',
        ]"
        v-for="message in allMessages"
        :key="message.at"
      >
        <div class="chat__body__message-text">
          <fa
            class="chat__body__message-text-icon"
            v-if="message.icon"
            :icon="message.icon"
          />{{ message.text }}
        </div>
        <div
          class="chat__body__message-date"
          v-if="message.sending && message.side != 'system'"
        >
          {{ message.side }}
        </div>
        <div class="chat__body__message-date" v-else>
          {{
            (message.side != 'system' ? message.side + ', ' : '') +
              $time.format(message.at)
          }}
        </div>
      </div>
    </div>
    <div class="chat__typing" v-if="false">
      Seller is typing...
    </div>
    <div class="chat__input">
      <input
        @keydown.enter="sendMessage"
        v-model="message"
        @input="$emit('typing')"
        placeholder="Enter a message..."
        class="chat__input-text"
      />
      <button @click="sendMessage" class="chat__input-button">
        Send
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    value: {
      type: Array,
      default: () => [
        {
          text: 'Negotiations are under way!',
          at: 1607075195449,
          side: 'system',
          icon: 'envelope',
        },
      ],
    },
  },
  data: () => ({
    message: '',
    messagesQueue: [],
  }),
  computed: {
    ...mapGetters({
      contract: 'guard/CONTRACT',
    }),
    allMessages() {
      return this.value.concat(this.messagesQueue)
    },
  },
  methods: {
    sendMessage() {
      if (!this.message.trim()) return

      let message = {
        id: this.$nanoid(),
        text: this.message.trim(),
        side: this.contract.side,
        sending: true,
      }

      this.messagesQueue.push(message)

      this.$emit('send', message)
      this.message = ''
    },
    messageSent(id) {
      this.scrollToLast()

      this.messagesQueue = this.messagesQueue.filter(msg => msg.id != id)
    },
    scrollToLast() {
      setTimeout(() => {
        this.$el.querySelector('.chat__input-text').focus()
        const msgs = this.$el.querySelectorAll('.chat__body__message')

        if (!msgs.length) {
          return
        } else {
          const last = msgs[msgs.length - 1]
          last.parentNode.scrollTop = last.offsetTop
        }
      }, 10)
    },
  },
  mounted() {
    this.$root.$on('message', this.messageSent)
    this.scrollToLast()
  },
  beforeDestroy() {
    this.$root.$off('message', this.messageSent)
  },
}
</script>

<style lang="scss">
$chat-message-br: 0.85rem;
$body-padding: 5px;
$mobile: 55rem;

@keyframes sending {
  0% {
    opacity: 0.4;
  }

  20% {
    opacity: 0.9;
  }

  100% {
    opacity: 0.4;
  }
}

.chat {
  width: 100%;
  height: calc(100% - 2.5rem);
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  &__typing {
    position: absolute;
    bottom: 60px;
    font-size: .8rem;
    text-align: left;
    text-indent: 20px;
    left: 0;
    width: 100%;
    height: 20px;
    color: $light-blue;
    animation: sending 2s ease-in-out infinite;
  }

  &__body {
    max-height: 550px;
    padding: 20px 0;
    font-family: 'Montserrat';
    width: calc(100% - #{$body-padding});
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    overflow-y: auto;
    padding: $body-padding;
    font-size: 0.8rem;
    line-height: 1.1rem;
    position: relative;
    // border: 1px solid $cyan-alpha;

    &__message.sending {
      animation-name: sending;
      animation-iteration-count: infinite;
      animation-duration: 2s;
      animation-timing-function: ease-in-out;
    }

    &__message {
      position: relative;
      display: flex;
      width: 100%;
      flex-direction: column;
      margin-bottom: $chat-message-br;

      &-text {
        align-self: flex-start;
        max-width: 70%;
        padding: 0.657rem 1.375rem;
        border-radius: 0.5rem;
        border-top-left-radius: 0;
        background-color: $cyan-alpha;
        overflow-wrap: break-word;
        color: white;
        text-align: left;
        margin-bottom: 0.3rem;

        &-icon {
          display: none;
        }
      }

      &-date {
        align-self: flex-start;
        opacity: 0.4;
        font-family: Consolas;
        font-size: 0.65rem;
        color: $light-blue;
      }
    }

    &__message.seller {
      .chat__body__message-text {
        background-color: $cyan;
        align-self: flex-end;
        border-top-right-radius: 0;
        border-top-left-radius: 0.5rem;
      }

      .chat__body__message-date {
        align-self: flex-end;
      }
    }

    &__message.system {
      width: 100%;
      margin-top: 10px 0;
      border-top: 1px $cyan-alpha solid;
      border-bottom: 1px $cyan-alpha solid;
      background-color: #00000043;

      .chat__body__message-text {
        width: 100%;
        background: none;
        color: $light-blue;
        font-weight: bold;
        align-self: flex-start;
        justify-self: center;
        font-size: 0.8rem;
        border-radius: 0.5rem;
        display: flex;

        &-icon {
          font-size: 1.1rem;
          display: block;
          color: $cyan;
          margin-right: 10px;
        }
      }

      .chat__body__message-date {
        display: none;
        align-self: center;
      }
    }
  }

  &__input {
    width: 100%;
    display: grid;
    padding-top: 10px;
    grid-template-columns: 1fr 4rem;
    grid-gap: 5px;
    border-top: 1px solid $cyan-alpha;

    * {
      outline: none;
      border: none;
      color: white;
    }

    &-text {
      width: 100%;
      background: #00000053;
      border-radius: 4px;
      font-size: 0.9rem;
      text-indent: 0.4rem;
      transition: all 0.3s;

      &::placeholder {
        color: $cyan;
      }

      &:focus::placeholder {
        color: $light-blue;
      }

      &:focus {
        background: $cyan-alpha;
      }
    }

    &-button {
      background-color: $cyan;
      width: 100%;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
      height: 2rem;
      transition: all 0.3s;

      &:hover {
        background-color: $light-blue;
        color: black;
      }
    }
  }
}
</style>
