<template>
  <div class="profile-tab__identity holo-panel">
    <div class="holo-panel__header">
      <fa class="holo-panel__icon" icon="id-card" />
      <span class="holo-panel__title">Identity</span>
      <profile-visibility />
    </div>
    <transition name="avatar-popup" mode="out-in">
      <div
        key="1"
        v-if="!choosingAvatar"
        class="profile-tab__identity__content"
      >
        <div class="profile-tab__identity__avatar">
          <div
            @click="choosingAvatar = true"
            :class="{ default: !profile.pic }"
            class="profile-tab__identity__avatar-frame"
          >
            <img :src="profile.pic || defaultPic" />
          </div>
          <div class="profile-tab__identity__status">
            <div class="profile-tab__identity__status-stages">
              <div
                class="profile-tab__identity__status-stage"
                v-for="i of [0, 1, 2]"
                :key="i"
                :class="{ active: i <= profile.status.stage }"
              ></div>
            </div>
            <span class="profile-tab__identity__status-name">
              {{ profile.status.value }}
            </span>
          </div>
        </div>
        <div class="profile-tab__identity__info">
          <div class="profile-tab__identity__name">
            <span>{{ name }}</span>
            <i-button size="xs" icon="pencil-alt" @click="changeName" />
          </div>
          <div class="profile-tab__identity__email">
            <span>{{ profile.email }}</span>
          </div>
          <about-input
            class="profile-tab__identity__about"
            @input="changeAbout"
            :loading="savingAbout"
          />
        </div>
      </div>
      <div key="2" v-else class="profile-tab__identity__avatar-menu">
        <i-button
          @click="choosingAvatar = false"
          icon="arrow-left"
          class="profile-tab__identity__avatar-menu__back"
        />
        <div class="profile-tab__identity__avatars">
          <div
            v-for="(avatar, i) in avatars"
            :key="i"
            class="profile-tab__identity__avatars-item"
            @click="changeAvatar(i)"
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
import ProfileVisibility from './components/ProfileVisibility.vue'

export default {
  components: {
    IButton,
    AboutInput,
    ProfileVisibility,
  },
  data() {
    return {
      choosingAvatar: false,
      savingAbout: false,
      savingProfileVisibility: false,
      defaultPic: require('@/assets/img/avatar.png'),
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
    changeAbout(value) {
      this.savingAbout = true
      this.$axios
        .post('api/user/update/about', { about: value })
        .then(() => {
          this.savingAbout = false
        })
        .catch(() => {
          this.savingAbout = false
        })
    },
    changeAvatar(i) {
      this.profile.pic = this.avatars[i]
      this.choosingAvatar = false

      this.$axios
        .get('api/user/update/avatar?n=' + i)
        .then(() => {})
        .catch(({ response }) => {
          if (response) {
            this.$store.commit('popups/ADD_ALERT', {
              type: 'error',
              title: response.data.stage,
              message: response.data.message,
            })
          }
        })
    },
  },
}
</script>

<style lang="scss">
$mobile-break: 130rem;

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

  @include to($mobile-break) {
    font-size: 16px;
  }
  @include from($mobile-break) {
    font-size: 18px;
  }

  &__avatar-menu,
  &__content {
    padding: 1.2em;
    padding-top: 0.6em;
    text-align: left;
  }

  &__content {
    display: grid;
    grid-template-columns: 6.1em 1fr;
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
    gap: 5px;
    grid-column: 2 / 3;
    grid-row: 1 / 2;

    &-item {
      width: 70px;
      height: 70px;
      border-radius: 100%;
      overflow: hidden;
      cursor: pointer;
      box-sizing: border-box;
      transition: box-shadow 0.5s ease;
      position: relative;

      &:hover img {
        transform: scale(1.4);
      }
      &:hover {
        box-shadow: 0 0 5px 5px $light-blue;
      }

      img {
        transition: transform 0.2s ease;
        user-select: none;
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
      width: 4.9em;
      height: 4.9em;
      border-radius: 100%;
      background-color: #5599ff33;
      overflow: hidden;

      img {
        height: 100%;
      }

      &.default {
        img {
          opacity: 0.5;
          mix-blend-mode: multiply;
        }
      }
    }
  }

  &__info {
    display: flex;
    letter-spacing: 0.05em;
    flex-direction: column;
    min-width: 5rem;
    overflow: hidden;
    margin-left: -0.6em;
  }

  &__name {
    font-size: 1.2em;
    box-sizing: border-box;
    font-weight: 500;
    gap: 0.25em;
    margin-right: 1.6em;
  }

  &__name,
  &__email {
    padding-left: 0.6em;
    display: flex;
    width: 100%;
    span {
      overflow: hidden;
      max-width: 90%;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }

  &__status {
    margin-top: 0.95em;
    width: 4.9em;
    text-align: center;

    &-stages {
      display: flex;
      gap: 0.4em;
    }

    &-stage {
      width: 100%;
      height: 0.3em;
      border-radius: 0.1em;
      background-color: transparentize($cyan-alpha, 0.3);

      &.active {
        background-color: $cyan;
      }
    }

    &-name {
      font-size: 0.6em;
      color: $cyan-alpha;
      font-weight: bold;
      text-transform: uppercase;
    }
  }
}
</style>
