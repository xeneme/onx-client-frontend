<template>
  <div class="preloader" v-show="visible">
    <div class="reflection"></div>
    <div class="preloader__logo">
      <img class="bitcoin-logo" src="@/assets/svg/logo/logo--bitcoin.svg" />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 85 85"
        class="stroke-logo"
      >
        <path
          fill="none"
          stroke="#fff"
          stroke-miterlimit="10"
          d="M46.4 12.3c8.1 0 15.9 3.3 21.7 9.2s9 13.8 9 22.1-3.2 16.3-9 22.1a30.1
        30.1 0 01-21.7 9.2v-9.7c5.6 0 11-2.3 15-6.3 4-4.1 6.2-9.6 6.2-15.3
        0-5.7-2.2-11.2-6.2-15.3-4-4.1-9.4-6.3-15-6.3v-9.7z"
        />
        <path
          fill="none"
          stroke="#fff"
          stroke-miterlimit="10"
          d="M66.9 38.5H41.3V7.2c-6.1 0-12 1.8-17 5.3-5 3.4-9 8.3-11.3 14-2.3 5.7-2.9
        12-1.7 18.1 1.2 6.1 4.1 11.6 8.4 16C24 65 29.4 68 35.4 69.2c3.6.8 7.3.8 11 .2"
        />
        <path fill="none" d="M57.5-32.1h14.7v20.2H57.5z" />
      </svg>
      <img class="logo__star" src="@/assets/svg/logo/star.svg" />
      <img class="logo__star" src="@/assets/svg/logo/star.svg" />
      <img class="logo__star" src="@/assets/svg/logo/star.svg" />
      <img class="logo__star" src="@/assets/svg/logo/star.svg" />
      <img class="logo__star" src="@/assets/svg/logo/star.svg" />
      <img class="logo__star" src="@/assets/svg/logo/star.svg" />
    </div>
    <div class="caterpillar">
      <span class="point"></span>
      <span class="point"></span>
      <span class="point"></span>
      <span class="point"></span>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Preloader',
  computed: {
    ...mapGetters({
      visited: 'preloader/VISITED',
    }),
  },
  data() {
    return { visible: !this.$dev }
  },
  methods: {
    show() {
      this.visible = true
      this.$el.classList.remove('preload-done')
      this.$el.style.zIndex = 9999

      if (!this.visited) {
        this.$el.querySelector('.preloader__logo').style.opacity = 1

        // stroke-logo animation
        this.$anime({
          targets: '.stroke-logo path',
          strokeDashoffset: [this.$anime.setDashoffset, 0],
          delay: this.$anime.stagger(950),
          easing: 'easeInOutSine',
          duration: 1500,
        })

        // bitcoin animation
        this.$anime({
          targets: '.bitcoin-logo',
          delay: 1500,
          scale: [0, 1],
          duration: 1500,
        })

        // star animation
        setTimeout(() => {
          this.$anime({
            targets: '.logo__star',
            opacity: [0, 1],
            translateX: () => {
              let x =
                this.$anime.random(50, 100) * (Math.random() >= 0.5 ? -1 : 1)
              return [x, x]
            },
            translateY: () => {
              let y =
                this.$anime.random(50, 100) * (Math.random() >= 0.5 ? -1 : 1)
              return [y + 20, y]
            },
            delay: this.$anime.stagger(200),
            duration: 900,
          })

          this.$store.commit('preloader/MARK_VISITED')
        }, 1500)
      } else {
        this.$el.querySelector('.caterpillar').style.bottom = '50%'
        this.$el.querySelector('.preloader__logo').style.opacity = 0
      }

      // caterpillar animation
      setTimeout(
        () => {
          this.caterpillarTimeline.add({
            targets: '.caterpillar .point',
            translateY: [-20, 0],
            translateX: [-20, 0],
            delay: this.$anime.stagger(200),
            scale: [0, 1],
            duration: 900,
            easing: 'easeOutElastic(.2, .2)',
          })

          this.caterpillarTimeline.add({
            targets: '.caterpillar .point',
            delay: this.$anime.stagger(200, { from: 'last' }),
            scale: [1, 0],
            translateY: [0, 20],
            translateX: [0, 20],
            endDelay: 400,
            duration: 300,
            easing: 'easeInExpo',
          })
        },
        !this.visited ? 1800 : 300,
      )
    },
    hide() {
      this.$el.classList.add('preload-done')
      setTimeout(() => {
        this.$el.style.zIndex = -9999
        this.$el.querySelector('.caterpillar').style.bottom = '50%'
        this.$el.querySelector('.preloader__logo').style.opacity = 0
        this.visible = false
      }, 250)
    },
  },
  created() {
    this.caterpillarTimeline =
      this.caterpillarTimeline ||
      this.$anime.timeline({
        loop: true,
      })

    this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'preloader/PAGE_IS_LOADING') {
        if (state.preloader.isLoading) {
          this.caterpillarTimeline.play()
          this.show()
        } else {
          setTimeout(() => {
            this.hide()
            this.caterpillarTimeline.reset()
            this.caterpillarTimeline.pause()
          }, state.preloader.afterDelay)
        }
      }
    })
  },
  mounted() {
    if (this.$store.getters['preloader/PAGE_IS_LOADING']) {
      this.caterpillarTimeline.play()
      this.show()
    }
  },
}
</script>

<style lang="scss" scoped>
.preload-done {
  opacity: 0;
}
.preloader {
  position: fixed;
  background-color: $dark-blue;

  width: 100vw;
  height: 100vh;
  left: 0;
  top: 0;
  z-index: 9998;
  transition: opacity 0.25s;
  display: grid;
  place-items: center;
  overflow: hidden;

  &__logo {
    position: absolute;
    opacity: 0;
  }
  .reflection {
    background: rgb(0, 0, 35);

    background: linear-gradient(
      90deg,
      transparent,
      rgba(33, 33, 68, 0.5) 40%,
      transparent
    );

    position: relative;
    left: -100vw;
    top: 0;
    width: 100vw;
    height: 100vh;
    z-index: -1;
    animation: glitter 2s infinite ease-out;
  }
  .stroke-logo {
    width: 200px;
    height: 200px;
    position: absolute;
    top: calc(50% - 100px);
    left: calc(50% - 100px);
  }
  .bitcoin-logo {
    position: absolute;
    width: 180px;
    height: 180px;
    top: calc(50% - 90px);
    left: calc(50% - 90px);
  }
  .logo__star {
    position: absolute;
    width: 25px;
    height: 25px;
    opacity: 0;
    top: calc(50% - 12.5px);
    left: calc(50% - 12.5px);
  }
  .caterpillar {
    position: absolute;
    display: grid;
    justify-items: center;
    align-items: center;
    width: 150px;
    height: 30px;
    grid-template-columns: repeat(4, 1fr);
    bottom: 60px;

    .point {
      transform: scale(0);
      width: 15px;
      height: 15px;
      background: linear-gradient(45deg, #23c3fa, #1477c9);
      border-radius: 100%;
    }
  }
}
@keyframes glitter {
  0% {
    transform: translateX(-130vw);
  }
  50% {
    transform: translateX(130vw);
  }
  100% {
    transform: translateX(130vw);
  }
}
</style>
