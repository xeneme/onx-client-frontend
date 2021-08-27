<template>
  <div class="profile-tab__identity holo-panel">
    <div class="holo-panel__header">
      <fa class="holo-panel__icon" icon="id-card" />
      <span class="holo-panel__title">Identity</span>
    </div>
    <transition name="avatar-popup" mode="out-in">
      <div key="1" v-if="!changingPic" class="profile-tab__identity__content">
        <div @click="changingPic = true" class="profile-tab__identity__avatar">
          <div class="profile-tab__identity__avatar-frame">
            <img :src="profile.pic" />
          </div>
          <div class="profile-tab__identity__status">
            <div class="profile-tab__identity__status-stages">
              <div
                class="profile-tab__identity__status-stage"
                :class="{ active: true }"
              ></div>
              <div class="profile-tab__identity__status-stage"></div>
              <div class="profile-tab__identity__status-stage"></div>
            </div>
            <span class="profile-tab__identity__status-name">not verified</span>
          </div>
        </div>
        <div class="profile-tab__identity__info">
          <div class="profile-tab__identity__name">
            {{ name }}
            <i-button size="xs" icon="pencil-alt" @click="changeName" />
          </div>
          <div class="profile-tab__identity__email">{{ profile.email }}</div>
          <about-input
            class="profile-tab__identity__about"
            :value="profile.about"
            default-value="About me"
            @input="changeAbout"
            :loading="savingAbout"
          />
        </div>
      </div>
      <div key="2" v-else class="profile-tab__identity__avatar-menu">
        <i-button
          @click="changingPic = false"
          icon="arrow-left"
          class="profile-tab__identity__avatar-menu__back"
        />
        <div class="profile-tab__identity__avatars">
          <div
            v-for="(avatar, i) in avatars"
            :key="i"
            class="profile-tab__identity__avatars-item"
          >
            <img :src="avatar" alt="" />
          </div>
        </div>
        <div class="profile-tab__identity__avatar-menu__more">
          * You can access more avatars with
          <span class="premium">Premium</span> status
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import AboutInput from './components/AboutInput.vue'
import IButton from '@/components/partial/IconButton.vue'

export default {
  components: {
    IButton,
    AboutInput,
  },
  data() {
    return {
      changingPic: false,
      savingAbout: false,
      avatars: [
        'https://i.ibb.co/yycbt3F/USDT.jpg',
        'https://i.ibb.co/jytq3hH/XRP.jpg',
        'https://i.ibb.co/d0xVzD0/BNB.jpg',
        'https://i.ibb.co/Sv7cqvB/BTC.jpg',
        'https://i.ibb.co/wNZW3Jd/ETH.jpg',
        'https://i.ibb.co/Mkmkmw8/LTC.jpg',
      ],
    }
  },
  computed: {
    profile() {
      return this.$store.state.auth.profile
    },
    name() {
      let { firstName, lastName } = this.$store.state.auth.profile
      return firstName + ' ' + lastName
    },
  },
  methods: {
    changeName() {
      this.$store.commit('popups/CHANGE_NAME', true)
    },
    changeAbout(val) {
      const t = this
      t.savingAbout = true
      setTimeout(() => {
        t.savingAbout = false
      }, 2000)
      this.profile.about = val
      console.log(val)
    },
  },
}
</script>

<style lang="scss">
@import '@/scss/_variables';

.avatar-popup-enter-active,
.avatar-popup-leave-active {
  transition: opacity 0.15s;
}

.avatar-popup-enter,
.avatar-popup-leave-to {
  opacity: 0;
}

.profile-tab__identity {
  grid-area: identity;

  &__avatar-menu,
  &__content {
    padding: 20px;
    padding-top: 10px;
    text-align: left;
  }

  &__content {
    display: grid;
    grid-template-columns: 100px 1fr;
  }

  &__avatar-menu {
    display: grid;
    grid-template-columns: min-content 1fr;
    grid-template-rows: 1fr min-content;
    gap: 5px;

    &__back {
      grid-column: 1 / 2;
      grid-row: 1 / 2;
    }

    &__more {
      grid-column: 1 / 3;
      grid-row: 2 / 3;
      width: 100%;
      border-radius: 100%;
      font-size: 0.7rem;
      margin-top: 10px;
      color: $light-blue;

      .premium {
        color: white;
        text-shadow: 0px 0px 15px $light-blue;
        font-weight: 500;
      }
    }
  }

  &__avatars {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    height: 100%;
    gap: 2px;
    grid-column: 2 / 3;
    grid-row: 1 / 2;

    &-item {
      width: 70px;
      height: 70px;
      border-radius: 100%;
      overflow: hidden;
      cursor: pointer;
      box-sizing: border-box;
      transition: border 0.3s ease;
      border: 4px transparentize(white, 1) solid;
      position: relative;

      &:hover {
        transition: none;
        border: 4px $light-blue solid;
      }

      img {
        width: 100%;
        height: 100%;
      }
    }
  }

  &__avatar {
    &-frame {
      position: relative;
      cursor: pointer;
      transition: box-shadow 0.3s ease;

      &:hover {
        box-shadow: 0 0 10px 1px white;

        &::before {
          content: 'CHANGE';
          letter-spacing: 0.01rem;
          color: #ffffff55;
          text-align: center;
          display: grid;
          align-content: center;
          position: absolute;
          font-weight: bold;
          font-size: 0.8rem;
          width: 100%;
          height: 100%;
          background-color: #00000099;
          top: 0;
          left: 0;
        }
      }
      width: 80px;
      height: 80px;
      border-radius: 100%;
      background-color: #5599ff33;
      overflow: hidden;

      img {
        height: 100%;
      }
    }
  }

  &__info {
    display: flex;
    letter-spacing: 0.05rem;
    flex-direction: column;
    min-width: 10rem;
    overflow: hidden;
    margin-left: -10px;
  }

  &__name {
    font-size: 1.2rem;
    font-weight: 500;
    padding-left: 10px;
    display: flex;
    gap: 5px;
  }
  &__email {
    padding-left: 10px;
  }

  &__status {
    margin-top: 15px;
    width: 80px;
    text-align: center;

    &-stages {
      display: flex;
      gap: 10px;
    }

    &-stage {
      width: 30px;
      height: 5px;
      border-radius: 3px;
      background-color: transparentize($cyan-alpha, 0.3);

      &.active {
        background-color: $cyan;
      }
    }

    &-name {
      font-size: 0.6rem;
      color: $cyan-alpha;
      font-weight: bold;
      text-transform: uppercase;
    }
  }
}
</style>
