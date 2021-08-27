<template>
  <div class="page">
    <Background />
    <div class="container">
      <contract-card />
      <div class="actions">
        <a
          v-if="profile.role.name == 'user'"
          title="Call Support"
          href="javascript:void(0)"
          @click="callSupport"
          ><fa icon="headphones"
        /></a>
        <a title="Go Back" href="javascript:void(0)" @click="goBack">
          <fa icon="sign-out-alt" style="transform: rotate(180deg)" />
        </a>
      </div>
      <chat-card
        @typing="typing"
        @send="sendMessage"
        :messages="contract.messages"
      />
    </div>
    <Footer />
  </div>
</template>

<script>
import Footer from '@/components/footer/Footer.vue'
import Background from '@/components/views/wallet/Background.vue'
import ContractCard from '@/components/views/trade-guard/cards/ContractCard'
import ChatCard from '@/components/views/trade-guard/cards/ChatCard'

import { mapGetters } from 'vuex'

export default {
  name: 'trade-guard',
  components: { Footer, Background, ContractCard, ChatCard },
  computed: {
    ...mapGetters({
      profile: 'auth/profile',
      contract: 'guard/CONTRACT', // UNCOMMENT
      socket: 'auth/socket',
    }),
  },
  methods: {
    typing() {
      this.socket.emit('typing', {
        contract: this.contract,
        email: this.profile.email,
      })
    },
    sendMessage(msg) {
      this.socket.emit('message', msg)
    },
    callSupport() {
      this.$store.commit('popups/SUPPORT')
    },
    goBack() {
      this.$router.push({ path: '/wallet' })
    },
    disconnect() {
      if (this.$route.name == 'TradeGuard') {
        this.goBack()
        this.$store.commit('popups/ADD_ALERT', {
          type: 'error',
          title: 'Contract Connection',
          message: "For some reason, you've been diconnected",
        })
      }
    },
  },
  mounted() {
    this.socket.emit('join-contract', {
      email: this.profile.email,
      contract: this.contract,
    })

    this.socket.on('message', message => {
      this.contract.messages.push(message)
      this.$root.$emit('message', message.id)
    })

    this.socket.on('connected', () => {
      this.$store.dispatch('preloader/startAfterLoading')
    })

    this.socket.on('disconnected', () => {
      this.disconnect()
    })

    this.socket.on('progress', stage => {
      this.$root.$emit('update-progress', stage)
    })

    this.socket.on('cancel', () => {
      this.$root.$emit('reset-ready')
    })

    this.socket.on('disconnect', () => {
      this.disconnect()
    })
  },
}
</script>

<style lang="scss" scoped>
@import "@/scss/_smart-grid";
@import "@/scss/_variables";

.page {
  position: relative;
  background: $v-grad;
  background-size: contain;
  padding-top: $header-slot;

  .container {
    z-index: 1;
    justify-content: center;
    padding: 0 20px;
    padding-bottom: 150px;
    display: grid;

    @include to(100rem) {
      max-width: 600px;
      grid-template-columns: 1fr;
      grid-template-rows: 4rem 1fr 1rem 1fr;
      grid-template-areas: '.' 'contract' '.' 'chat';
    }

    @include from(100rem) {
      grid-template-columns: 1.2fr 8rem 1fr;
      grid-template-rows: 1fr;
      grid-template-areas: 'contract . chat';
    }

    .actions {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      padding: 5px;
      overflow: hidden;

      @include to(100rem) {
        flex-direction: row;
      }
      @include from(100rem) {
        flex-direction: column;
      }

      a {
        justify-content: center;
        align-items: center;
        cursor: pointer;
        display: flex;
        width: 100%;
        height: 120px;
        font-size: 2rem;
        color: $cyan;
        background: #ffffff00;
        transition: all 0.2s;

        &:hover {
          color: white;
          background: #ffffff33;
        }
      }
    }
  }
}
</style>
