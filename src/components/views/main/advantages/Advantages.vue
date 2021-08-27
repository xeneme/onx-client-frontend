<template>
  <section
    class="advantages"
    v-waypoint="{
      active: true,
      callback: onWaypoint,
      options: waypointOptions,
    }"
  >
    <img
      src="../../../../assets/svg/advantages/bg-inner.svg"
      class="bg__inner"
    />
    <div class="advantages-group">
      <Advantage
        title="Payment Options"
        icon="protection"
        description="Most popular methods: electronic wallets, blockchain, cryptocurrency"
      />
      <Advantage
        title="Strong security"
        icon="safety"
        description="Protection against DDoS attacks, full data encryption, compliant with PCI DSS standarts."
      />
      <Advantage
        title="World Coverage"
        icon="stability"
        description="Providing services in 99% countries around the globe, including 24 states of USA"
      />
      <Advantage
        title="Legal Compliance"
        icon="support"
        description="Registration in UK, MSB status in FinCEN, essential licenses and strong relations with banks"
      />
      <Advantage
        title="Margin Trading"
        icon="stability"
        description="1:2 and 1:3 leverages, automatic funds borrowing, no extra accounts needed, negative balance protection"
      />
      <Advantage
        title="Competitive Commissions"
        icon="stability"
        description="Reasonable trading fees for takers and makers, special conditions for high volume traders, strong offers for market makers"
      />
      <Advantage
        title="Cross-Platform Trading"
        icon="stability"
        description="Trading via website, mobile app, WebSocket and REST API. FIX API for institutional traders"
      />
      <Advantage
        title="High Liquidity"
        icon="stability"
        description="Fast order execution, low spread, access to high liquidity orderbook for top currency pairs"
      />
    </div>
  </section>
</template>

<script>
import Advantage from './Advantage.vue';

export default {
  name: 'Advantages',
  components: { Advantage },
  data() {
    return {
      waypointOptions: {
        root: null,
        rootMargin: '0px 0px 0px 0px',
        threshold: [0, 0.5],
      },
      isShow: false,
    };
  },
  methods: {
    onWaypoint({ going }) {
      const advantages = document.querySelectorAll('.advantage');
      if (going === this.$waypointMap.GOING_IN) {
        let time = 0;
        advantages.forEach((advantage) => {
          setTimeout(() => {
            advantage.classList.add('animated', 'fadeInUp', 'visible');
          }, time);
          time += 100;
        });
      }
    },
  },
};
</script>

<style lang="sass" scoped>
@import "@/scss/_smart-grid"

.advantages
  position: relative
  display: grid
  justify-items: center
  align-items: center
  @include xs-block
    padding: 10px 0 50px 0
  @include sm-block
    padding: 10px 0 80px 0
  @include md-block
    height: auto
    padding: 80px 0 280px 0
  @include lg-block
    height: 100vh
    padding: 80px 0 0 0
  background-color: #0075ff

  .advantages-group
    display: flex
    flex-wrap: wrap
    justify-content: center
    max-width: 80rem

  .bg__inner
    position: absolute
    pointer-events: none
    user-select: none
    left: -30%
    @include xs-block
      top: -120px
      min-width: 250%
    @include sm-block
      top: -120px
      min-width: 200%
    @include md-block
      top: -120px
      min-width: 130%
    @include lg-block
      top: -180px
      min-width: 130%

</style>
