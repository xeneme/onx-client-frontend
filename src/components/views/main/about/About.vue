<template>
  <section class="about">
    <div class="container">
      <div class="about__wrapper">
        <img
          src="../../../../assets/svg/about/crypto--module.svg"
          class="about__image"
          alt="crypto"
        />
        <div class="about__description">
          <div @click="prevParagraph" class="about__description-prev">
            <div></div>
          </div>
          <div class="about__description-text">
            <h1 v-if="!currentParagraph">About</h1>
            {{ paragraphs[currentParagraph] }}
          </div>
          <div
            :class="['about__description-full-text', hidden ? 'hidden' : '']"
          >
            <h1 v-if="!currentParagraph">About</h1>
            <div v-for="p in paragraphs" :key="p">{{ p }}</div>
            <div class="hidden-text-cover">
              <div @click="showDescription" class="hidden-text-cover-show">
                <div></div>
              </div>
            </div>
          </div>
          <div @click="nextParagraph" class="about__description-next">
            <div></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'About',
  data() {
    return {
      currentParagraph: 0,
      hidden: true,
    }
  },
  computed: {
    host() {
      return this.$store.getters.host
    },
    paragraphs() {
      return [
        `Among the numerous websites providing Bitcoin exchange services, the
          positive reputation of ${this.host} makes it worth the trust of the users
          all over the world. With the customer base of over 1,000,000, the
          platform can be recognized as the one that can be relied on. Starting
          your Bitcoin trading on a platform with substantial history, you will
          benefit from a deep understanding of the market and customers’ needs.
          We are constantly working on enhancing the security, ensuring the high
          level of customer support, and providing our users with new
          opportunities for trading on the Bitcoin market. `,
        `${this.host} is regularly
          considering the addition of new coins, which was not so long the case
          with Dash, Zcash, and Bitcoin Cash. Still, every cryptocurrency has to
          pass a thorough check to be listed. Our due diligence and concerns
          about the quality of the service yield results. Now, we are moving
          forward to achieve the status of the best cryptocurrency exchange.
          Best Cryptocurrency Exchange: What does It Mean for Us? For you to be
          able to recognize a reliable online exchange and sort out those that
          appear to be too weak, we list several features, paying attention to
          which would help you to make the right choice. `,
        `Service safety and
          security. It is critical to ensure that your data will not be leaked
          to any other parties. Thus, the availability of certificates, like the
          PCI DSS, serves as the proof of service’s safety. Besides, the
          regulation of exchanges is also important. For example, ${this.host} is
          officially registered in the UK; has a Money Services Business status
          in FinCEN; complies with the legal requirements of the countries where
          it functions. In addition, the two-factor authentication, anti-hacker
          protection, and use of multisignature Bitcoin addresses turn it into a
          BTC exchange that can be trusted. Quality of customer support. `,
        `For the
          customers, receiving answers to their questions is always an indicator
          of the quality of work. Making everything possible to ensure fast
          processing of your inquiries, the customer support at ${this.host} works
          24/7. And each member of the support team goes through the carefully
          designed intensive training to be able to deal with any possible
          issues. In such a way the platform may often be identified as the most
          responsive among Bitcoin exchanges. The availability of options. Many
          options for trading cryptocurrencies on the exchanges serve as a
          benefit for the users. In particular, ${this.host} offers trading
          opportunities for Bitcoin, Bitcoin Cash, Bitcoin Gold, Ethereum,
          Zcash, Dash. They can be traded for USD, EUR, GBP, or RUB.`,
        `Additionally, the variety of payment options, including cards like
          Visa and Mastercard, as well as wire transfers, contributes to the
          convenience of the service. Website interface. User experience on the
          website is also of importance for the customers. The best Bitcoin
          exchange will always strive to ensure easy navigation through a simple
          and clear structure serving for the consistency. Besides, since the
          launch, we have tried to reduce the amount of steps required for the
          purchase. Now, some operations can be filled in several clicks only.
          BTC Exchange that Meets Your Needs While looking for a reliable online
          exchange might be a complicated task, trusting a platform with
          extensive coverage and positive reputation among its users might save
          your time. `,
        `${this.host} is the Bitcoin trading platform that combines the
          crucial features: enhanced security, variety of options and high
          market liquidity. The team applies every effort to make your trading
          on the platform as convenient and safe as possible. With ${this.host}, you
          can always be sure that you will find what you are looking for. Just
          try the service on your own and ensure that it fits your needs!`,
      ]
    },
  },
  methods: {
    throughFade() {
      return new Promise(resolve => {
        var el = this.$el.querySelector('.about__description-text')
        var el2 = this.$el.querySelector('.about__description-next')
        el.style.opacity = 0
        el2.style.opacity = 0
        setTimeout(() => {
          el.style.opacity = 1
          el2.style.opacity = 1
          resolve()
        }, 300)
      })
    },
    nextParagraph() {
      this.throughFade().then(() => {
        this.currentParagraph++

        if (this.currentParagraph >= this.paragraphs.length)
          this.currentParagraph = 0
      })
    },
    prevParagraph() {
      this.throughFade().then(() => {
        this.currentParagraph--

        if (this.currentParagraph < 0)
          this.currentParagraph = this.paragraphs.length - 1
      })
    },
    showDescription() {
      this.hidden = !this.hidden
    },
  },
  mounted() {},
}
</script>

<style lang="sass" scoped>
@import "@/scss/_smart-grid"
@import "@/scss/_variables"

.about
  width: 100vw
  height: 100vh
  padding: 0 0 60px 0

  @include to(30rem)
    margin: 25px 0
    background: none
  @include xs-block
    margin: 25px 0
    background: none
  @include sm-block
    margin: 30px 0
    background: none
  @include md-block
    margin: 80px 0
    background-position: center
  @include lg-block
    margin: 80px 0
    background-position: center
  @include xl-block
    margin: 80px 0
    background-position: center

  &__wrapper
    display: flex
    justify-content: center
    align-content: center
    flex-wrap: wrap
    @include to(50rem)
      height: auto
    @include from(50rem)
      height: 100vh

  &__description
    color: #C2C2FF
    font-style: normal
    font-weight: 300
    font-family: Montserrat
    line-height: 1.1rem
    min-width: 300px
    max-width: 500px
    text-align: justify
    letter-spacing: .04rem
    font-size: .83rem
    display: grid
    grid-template-columns: 40px 1fr 40px
    margin: 50px 30px
    @include to(50rem)
      display: block
      margin: 0 30px
    @include from(50rem)
      display: grid
      margin: 50px 30px

    &-text
      transition: opacity .3s
      width: calc(100% - 40px)
      min-width: 200px
      padding: 20px
      box-shadow: inset 0 0px 10px $cyan
      border-radius: 5px
      background:  linear-gradient(90deg, #0075ff22 0%, #0075ff55 100%)
      border: 1px solid $cyan
      @include to(50rem)
        display: none
      @include from(50rem)
        display: block

      h1
        margin-bottom: 10px

    &-full-text
      width: calc(100% - 40px)
      padding: 20px
      margin-bottom: 100px
      position: relative
      transition: all 1s
      @include to(50rem)
        display: flex
        flex-direction: column
      @include from(50rem)
        display: none

      h1
        margin-bottom: 10px

      .hidden-text-cover
        position: absolute
        left: 0
        width: 100%
        height: 100%
        display: flex
        align-items: flex-end
        background: none


        &-show
          width: 100%
          position: relative
          display: flex
          justify-content: center
          height: 60px
          cursor: pointer
          &:hover
            background-color: #ffffff33

          &:hover div
            opacity: 1
          div
            margin-top: 20px
            width: 20px
            height: 20px
            opacity: .4
            border-bottom: 2px #C2C2FF solid
            border-right: 2px #C2C2FF solid
            transform: rotate(-135deg)
            align-self: center
            transition: all .3s

      &.hidden
        height: 320px
        overflow: hidden

        .hidden-text-cover
          background: linear-gradient(180deg, transparent 0%, transparent 50%, #000023 86%, #000023 100%)

          &-show
            div
              margin-top: -30px
              transform: rotate(45deg)

    &-next, &-prev
      @include to(50rem)
        display: none
      @include from(50rem)
        display: grid
      width: 100%
      height: 100%
      display: grid
      justify-items: start
      cursor: pointer
      transition: all .2s
      &:hover
        background-color: #ffffff33

      &:hover div
        opacity: 1

      div
        width: 20px
        height: 20px
        opacity: .4
        border-bottom: 2px #C2C2FF solid
        border-right: 2px #C2C2FF solid
        transform: rotate(-45deg)
        align-self: center
        transition: all .3s

    &-prev
      justify-items: end

      div
        transform: rotate(135deg)

  &__image
    animation: upDown 2.5s ease-in infinite alternate
    display: block
    pointer-events: none
    user-select: none

    @include to(30rem)
      width: 260px
      height: 227px
      margin-right: 0
      margin-bottom: 50px
    @include xs-block
      width: 320px
      height: 227px
      margin-right: 0
      margin-bottom: 50px
    @include sm-block
      width: 420px
      height: 327px
      margin-right: 0
      margin-bottom: 100px
    @include md-block
      width: 378px
      height: 316.4px
      margin-bottom: 0
      margin-right: 50px
    @include lg-block
      width: 540px
      height: 452px
      margin-bottom: 0
      margin-right: 50px

  @keyframes upDown
    from
      transform: translateY(0)
    to
      transform: translateY(30px)
</style>
