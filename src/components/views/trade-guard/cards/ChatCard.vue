<template>
  <card class="chat-card">
    <div class="chat-card__title">
      Chat
      <fa icon="headphones" v-if="false" class="chat-card__title-icon" />
    </div>
    <chat @send="e => $emit('send', e)" @typing="$emit('typing')" :value="messages" />
  </card>
</template>

<script>
import Card from '../components/Card'
import Chat from '../components/Chat'
import { mapGetters } from 'vuex'

export default {
  name: 'chat-card',
  components: { Card, Chat },
  props: {
    messages: {
      type: Array,
      default: () => [
        {
          text: 'Negotiations are under way.',
          at: 1607075195449,
          side: 'system',
          icon: 'podcast',
        },
        {
          text: 'Hey there!',
          at: 1607075196783,
          side: 'seller',
          icon: 'user-secret',
        },
        {
          text: 'Hey!',
          at: 1607075199861,
          side: 'buyer',
          icon: 'user',
        },
        {
          text: "I'm gonna buy this stuff.",
          at: 1607075199761,
          side: 'buyer',
          icon: 'user',
        },
        {
          text: 'Sure! Go ahead.',
          at: 1607075390907,
          side: 'seller',
          icon: 'user-secret',
        },
        {
          text: 'The product was successfully purchased!',
          at: 1607075413907,
          side: 'system',
          icon: 'check',
        },
        {
          text: 'Thank you so much! Have a good one.',
          at: 1607075414907,
          side: 'seller',
          icon: 'user-secret',
        },
        {
          text: "You're welcome.",
          at: 1607075415907,
          side: 'buyer',
          icon: 'user',
        },
      ],
    },
  },
  computed: {
    ...mapGetters({
      isLoggedIn: 'auth/isLoggedIn',
    }),
  },
}
</script>

<style lang="scss" scoped>
.chat-card {
  grid-area: chat;

  &__title {
    padding: 10px;
    border-bottom: 1px solid $cyan-alpha;
    text-align: left;
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;

    &-icon {
      font-size: 1.3rem;
      color: $cyan;
      cursor: pointer;

      &:hover {
        color: white;
      }
    }
  }
}
</style>
