<template>
  <nav class="dropdown" ref="dropdown">
    <button
      type="button"
      ref="caller"
      :class="['dropdown-auth', isOpen ? 'active' : '']"
    >
      <a
        class="message"
        ref="newMessageIndicator"
        v-if="!itsAdmin && newMessages && isLoggedIn"
        title="New message from support"
      >
        <fa icon="envelope" class="message-icon" />
        <div class="message-count">{{ formatedMessagesCount }}</div>
      </a>
      <span class="name" v-show="isLoggedIn">{{ name }}</span>
      <span class="balance" v-show="isLoggedIn">{{ balance }}$</span>
      <span class="angle" v-show="isLoggedIn">
        <fa :icon="isOpen ? 'angle-up' : 'angle-down'" />
      </span>
    </button>
    <ul :class="[isOpen ? 'active' : '']" @click="close">
      <li v-if="itsAdmin">
        <a :href="links.adminPanel">Admin Panel</a>
      </li>
      <li>
        <router-link :to="links.profile">Profile</router-link>
      </li>
      <li>
        <a @click="updateExchangeTab('wallet')" :href="links.wallet">Wallet</a>
      </li>
      <li>
        <a @click="updateExchangeTab('history')" :href="links.history"
          >History</a
        >
      </li>
      <li>
        <a @click="toggleSupport" v-if="!itsAdmin" :href="links.support"
          >Support</a
        >
      </li>
      <li class="divider"></li>
      <li>
        <a href="javascript: void(0)" @click="logout">Sign Out</a>
      </li>
    </ul>
  </nav>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dropdown',
  data() {
    return {
      name: 'Username',
      balance: '0',
      isOpen: false,
      links: {
        profile: '/account',
        wallet: '/wallet#',
        history: '/wallet#history',
        adminPanel: '/admin',
      },
    }
  },
  computed: {
    ...mapGetters({
      profile: 'auth/profile',
      wallets: 'auth/wallets',
      isLoggedIn: 'auth/isLoggedIn',
      itsAdmin: 'auth/itsAdmin',
    }),
    formatedMessagesCount() {
      let count = this.profile ? this.profile.newMessages : 0
      return count < 10 ? count : '9+'
    },
    adminToken() {
      return localStorage.getItem('admin-token')
    },
    newMessages() {
      return this.profile && this.profile.newMessages
    },
  },
  watch: {
    profile(value) {
      this.updateName(value)
      this.updateBalance(value)
    },
    wallets(value, prev) {
      let balance = Object.values(value).reduce(
        (b, w) => b + w.balance * w.price,
        0,
      )

      let prevBalance = Object.values(prev).reduce(
        (b, w) => b + w.balance * w.price,
        0,
      )

      if (prevBalance != balance) {
        this.$anime({
          targets: this.$el,
          scale: [0.9, 1],
          duration: 700,
          easing: 'easeInOutSine',
        })
      }

      this.balance = Number(balance.toFixed(2))
    },
  },
  methods: {
    updateName(profile) {
      const addLimit = this.balance.toString().length

      if (profile) {
        if (profile.lastName && profile.firstName) {
          this.name =
            this.profile.firstName.toLowerCase().capitalize() +
            ' ' +
            this.profile.lastName[0].toUpperCase() +
            '.'
        } else if (profile.firstName) {
          let separatedEmail = this.profile.firstName.split('@')
          this.name =
            separatedEmail.length > 1
              ? separatedEmail[0]
              : this.profile.firstName
        }

        if (this.name.length >= 16 - addLimit)
          this.name =
            this.name.match(new RegExp(`.{${16 - addLimit}}`))[0] + '...'
      } else {
        this.name = 'Username'
      }
    },
    updateBalance(profile) {
      if (!profile) return

      this.balance = Number(
        Object.values(profile.wallets)
          .reduce((b, w) => b + w.balance * w.price, 0)
          .toFixed(2),
      )

      profile.balance = this.balance
    },
    toggle() {
      this.isOpen = !this.isOpen
    },
    closeOutside(event) {
      const { dropdown } = this.$refs

      if (!dropdown || dropdown.contains(event.target)) return
      this.isOpen = false
    },
    close() {
      this.isOpen = false
    },
    logout() {
      this.$store.dispatch('auth/logout', {
        redirect: ['Profile', 'Wallet'].includes(this.$route.name),
        ghostToken: this.adminToken,
      })
    },
    updateExchangeTab(hash) {
      if (hash === 'wallet') {
        this.$store.commit('popups/SELECT_EXCHANGE_TAB', 0)
      } else if (hash === 'history') {
        this.$store.commit('popups/SELECT_EXCHANGE_TAB', 4)
      }
    },
    toggleSupport() {
      this.$store.commit('popups/SUPPORT')
    },
  },
  mounted() {
    document.addEventListener('click', this.closeOutside)

    let profile = this.$store.getters['auth/profile']
    let self = this

    this.$refs.caller.addEventListener('click', e => {
      if (self.$refs.newMessageIndicator?.contains(e.target)) {
        self.toggleSupport()
        self.close()
      } else {
        self.toggle()
      }
    })

    if (profile) {
      this.updateName(profile)
      this.updateBalance(profile)
    }
  },
  destroyed() {
    document.removeEventListener('click', this.closeOutside)
  },
}
</script>

<style lang="scss" scoped>
@import "@/scss/_smart-grid";
@import "@/scss/_variables";

nav {
  position: relative;
  display: flex;
  width: 210px;
  z-index: 100;
  pointer-events: all;

  button {
    display: flex;
    justify-content: space-around;
    align-items: center;
    background: rgba(0, 106, 255, 0.5);
    border: none;
    height: 40px;
    color: #fff;
    outline: none;
    cursor: pointer;
    border-radius: 8px;
    padding: 8px;
    width: 100%;
    outline: none;
    transition: background-color 0.1s, border-radius .3s;

    &:hover {
      background: rgba(0, 106, 255, 0.7);
    }
    &:active {
      background: rgba(0, 106, 255, 1);
    }
    &.active {
      border-radius: 8px 8px 0 0;
    }
    .name {
      font-weight: bold;
      text-align: left;
      justify-self: start;
    }
    .offset {
      width: 18px;
    }
    .message {
      width: 18px;
      height: 18px;
      padding: 0;
      font-size: 10px;
      background: white;
      color: black;
      border-radius: 100%;
      justify-content: center;
      align-items: center;
      display: grid;
      text-indent: 0;
      transition: all 0.2s;

      &-count {
        text-align: center;
        display: none;
        font-weight: 700;
        font-size: 0.68rem;
      }
    }
    .message:hover .message-icon {
      display: none;
    }
    .message:hover .message-count {
      display: block;
    }
    .balance {
      color: #68b1ff;
      font-size: 12px;
      font-weight: bold;
      justify-self: end;
      text-align: right;
    }
    .angle {
      align-items: center;
      font-size: 10px;
    }
  }
  ul {
    position: absolute;
    background: rgba(0, 81, 194, 0.5);
    width: 100%;
    list-style: none;
    top: 40px;
    z-index: 99;
    // height: 0;
    padding: 0;
    overflow: hidden;
    transition: all 0.2s;
    opacity: 0;
    border-radius: 0 0 8px 8px;

    &.active {
      opacity: 1;
      // height: 10.5rem;
      padding: 8px 0;
    }
    li.divider {
      height: 1px;
      background: #68b1ff;
      margin: 8px;
    }
    // li:last-child,
    a {
      display: flex;
      height: 34px;
      text-indent: 14px;
      text-decoration: none;
      align-items: center;
      color: #fff;
      font-size: 12px;
      outline: none;
      transition: all 0.2s;
      cursor: pointer;

      &:hover {
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.6);
        background: rgba(0, 81, 194, 0.8);
      }
      &.message:hover {
        background: white;
        transform: scale(1.3);
      }
      &:active {
        background: rgb(0, 81, 194);
      }
    }
  }
}
</style>
