<template>
  <div class="input_worm">
    <svg xmlns="http://www.w3.org/2000/svg" version="1.0" viewBox="0 0 595 46">
      <path
        fill="none"
        stroke-miterlimit="10"
        stroke-width="3"
        d="M538 44H57c-11 0-21-9-21-21v0C36 11 46 2 57 2h481c12 0 21 9 21 21v0c0 12-9 21-21 21z"
      />
    </svg>
  </div>
</template>

<script>
export default {
  name: 'InputWorm',
  data() {
    return {
      speed: 500,
    };
  },
  props: ['top', 'bottom', 'compare'],
  watch: {
    top(val, oldVal) {
      this.compareValues();

      if (!this.bottom) {
        this.$el.style.transform = 'rotate(180deg)';
        if (!oldVal) {
          this.halfFilled();
        } else if (!val) {
          this.everythingRemoved();
        }
      } else {
        if (!oldVal) {
          this.everythingFilled();
        } else if (!val) {
          if (this.$el.style.transform === 'rotate(180deg)') {
            let self = this;

            this.$anime({
              targets: '.input_worm svg path',
              strokeDashoffset: [68, 0],
              easing: 'easeInOutSine',
              duration: self.speed,
              complete() {
                self.$el.style.transform = 'rotate(0deg)';
                if (self.bottom) self.halfRemoved();
                else self.everythingRemoved();
              },
            });
          } else {
            this.halfRemoved();
          }
        }
      }
    },
    bottom(val, oldVal) {
      this.compareValues();

      if (!this.top) {
        this.$el.style.transform = 'rotate(0deg)';
        if (!oldVal) {
          this.halfFilled();
        } else if (!val) {
          this.everythingRemoved();
        }
      } else {
        if (!oldVal) {
          this.everythingFilled();
        } else if (!val) {
          if (this.$el.style.transform === 'rotate(0deg)') {
            let self = this;

            this.$anime({
              targets: '.input_worm svg path',
              strokeDashoffset: [68, 0],
              easing: 'easeInOutSine',
              duration: self.speed,
              complete() {
                self.$el.style.transform = 'rotate(180deg)';
                if (self.top) self.halfRemoved();
                else self.everythingRemoved();
              },
            });
          } else {
            this.halfRemoved();
          }
        }
      }
    },
  },
  methods: {
    hideWorm(immediately) {
      this.$anime({
        targets: '.input_worm svg path',
        strokeDashoffset: [68, this.$anime.setDashoffset],
        easing: 'easeInOutSine',
        duration: !immediately ? this.speed : 0,
      });
    },
    halfFilled() {
      let self = this;

      this.$anime({
        targets: '.input_worm svg path',
        strokeDashoffset: [this.$anime.setDashoffset, 613],
        easing: 'easeInOutSine',
        duration: self.speed,
      });
    },
    everythingFilled() {
      let self = this;

      this.$anime({
        targets: '.input_worm svg path',
        strokeDashoffset: 68,
        easing: 'easeInOutSine',
        duration: self.speed,
      });
    },
    everythingRemoved() {
      let self = this;

      this.$anime({
        targets: '.input_worm svg path',
        strokeDashoffset: [613, this.$anime.setDashoffset],
        easing: 'easeInOutSine',
        duration: self.speed,
      });
    },
    halfRemoved() {
      let self = this;

      this.$anime({
        targets: '.input_worm svg path',
        strokeDashoffset: [68, 613],
        easing: 'easeInOutSine',
        duration: self.speed,
      });
    },
    compareValues() {
      if (!this.compare) return;

      const stroke = this.$el.querySelector('.input_worm svg path');

      this.$anime({
        targets: stroke,
        stroke: this.top == this.bottom && this.top ? '#0075ff' : '#ff0000',
        duration: this.speed * 2,
      });
    },
  },
  mounted() {
    this.hideWorm(true);
  },
};
</script>

<style lang="scss" scoped>
.input_worm {
  transform: rotate(180deg);
  height: 38.65px;
  width: 500px;

  @include xs-block {
    height: 38.65px;
  }
  @include sm-block {
    height: 38.65px;
  }
  svg {
    @include xs-block {
      display: none;
    }
    @include sm-block {
      display: block;
    }
    path {
      stroke: $cyan;
    }
  }
}
</style>
