<template>
  <div :class="['alert', alert.type]" @click="openSupport">
    <div class="alert__title">
      <fa
        :icon="alertType"
        class="alert__title__icon"
        v-if="alertType"
      />
      <h3>{{ alert.title }}</h3>
      <fa
        @click="remove"
        icon="times"
        class="alert__title__close"
      />
    </div>
    <div class="alert__message">{{ alert.message }}</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Alert',
  data() {
    return {
      mounted: false,
    };
  },
  props: ['alert'],
  mounted() {
    this.mounted = true;

    var timeToDestroy = setTimeout(() => {
      this.remove();
    }, this.lifetime + this.alert.message.length * 30);

    var timeToDestroyAfterHover = null;

    this.$el.onmouseover = () => {
      clearTimeout(timeToDestroy);
    };

    this.$el.onmouseleave = () => {
      if (!timeToDestroyAfterHover) {
        timeToDestroyAfterHover = setTimeout(() => {
          this.remove();
        }, this.lifetime / 5);
      }
    };
  },
  methods: {
    remove() {
      this.$store.commit('popups/RM_ALERT', this.alert);
    },
    openSupport() {
      if(this.alert.type != 'message') return
      this.$store.commit('popups/SUPPORT', true)
      this.remove()
    }
  },
  computed: {
    ...mapGetters({
      lifetime: 'popups/lifetime',
    }),
    alertType() {
      let res = '';

      if (this.mounted) {
        const alertTitle = this.$el.querySelector('.alert__title');

        alertTitle.style.gridTemplateColumns = '30px 1fr 15px';

        switch (this.alert.type) {
          case 'message':
            res = 'envelope';
            break;
          case 'error':
            res = 'exclamation-circle';
            break;
          case 'warning':
            res = 'exclamation';
            break;
          case 'info':
            res = 'info-circle';
            break;
          default:
            alertTitle.style.gridTemplateColumns = '1fr 15px';
        }
      }
      return res;
    },
  },
};
</script>

<style lang="sass" scoped>
@import "@/scss/_smart-grid"
@import "@/scss/_variables"

*
    padding: 0
    margin: 0

.page
  overflow-x: hidden

@keyframes appeared
  from
    filter: brightness(1000%)

  to
    filter: brightness(100%)


.alert
    width: 365px
    min-height: 50px
    border-radius: 8px
    background-color: #000F5D
    // background: linear-gradient(125deg, #627AF6, #627AF6aa)
    color: white
    padding: 15px
    text-align: left
    font-size: .9em
    animation: appeared .5s 0s ease-out
    pointer-events: all
    cursor: default
    user-select: none
    overflow: hidden

    @include to(30rem)
      width: calc(100% - 30px)
      border-radius: 0px
      margin: 0
      box-shadow: 0 -10px 30px darken($blue-alpha, 10)
      border: 0
    @include from(30rem)
      width: 365px
      border-radius: 8px
      margin-top: 20px
      border: 2px solid #102074


    &__title
        display: grid
        justify-content: space-between;
        grid-template-columns: 30px 1fr 15px
        max-height: 30px

        &__icon
            opacity: .5
            margin-left: 5px
            transform: scale(1.3)
            height: calc(100% - 15px)

        &__default
            opacity: .5
            margin-left: 5px
            transform: scale(1.3)
            height: calc(100% - 15px)

        &__close
            height: calc(100% - 15px)
            cursor: pointer
            opacity: .5

            &:hover
              opacity: 1

            &:active
              transform: scale(1.3)

        h3
            letter-spacing: 0.03em
            margin-bottom: 15px

    &__message
        font-size: .9rem
        letter-spacing: 0.03em
        text-indent: 5px
        opacity: .6
        text-overflow: fade
        max-height: 200px

.error
  background-color: #7F1D0F
  border-color: #CC341E

.warning
  border-color: #FFD231
  background-color: #C19700

.message
  border-color: #627AF6
  background-color: #3352F688
  transition: opacity .1s
  cursor: pointer
  &:hover
    background-color: #3352F6aa

.info
  border-color: #627AF6
  background-color: #3352F6
</style>
