<template>
  <div class="page">
    <Background />
    <div class="structure animated fadeInUp">
      <div class="text animated fadeInLeft">
        <div class="introduction card">
          <div class="title">Introduction</div>
          <div class="paragraph">
            Established in 2014 as the first cloud mining provider,
            {{ Host }} has become a multi-functional cryptocurrency exchange,
            trusted by over a million users.
          </div>
          <div class="paragraph">
            {{ Host }} offers cross-platform trading via website, mobile app,
            WebSocket and REST API, providing access to high liquidity orderbook
            for top currency pairs on the market. Instant Bitcoin buying and
            selling is available via simplified bundle interface.
          </div>
          <div class="paragraph">
            The exchange has developed a multi-level account system with
            individual approach to each customer, from Bitcoin beginners to
            institutional traders. Worldwide coverage, multiple payment options,
            and 24/7 support are accompanied by time-proven platform stability
            that guarantees safety of assets and data.
          </div>
        </div>
        <div class="summary card">
          <div class="title">Legal and Security</div>
          <div class="paragraph">
            Stability is of the highest priority for {{ Host }}. We give all
            efforts to provide trouble-free services backed by system and user
            account security, safe cold cryptocurrency storage, financial
            viability, and profound legal compliance.
          </div>
          <div class="paragraph">
            Throughout the history of our company, none of our users ever
            experienced account funds theft, and practical support of such
            reputation is an affair of honour for us.
          </div>
        </div>
      </div>
      <div class="overview animated fadeInRight">
        <div class="overview-background">
          <div @click="prev" class="up"></div>
          <div class="desc"></div>
          <div class="path"></div>
          <div class="years"></div>
          <div @click="next" class="down"></div>
        </div>
        <div class="overview-foreground">
          <div class="description">
            <div
              class="description-text"
              v-for="(el, i) in computedYears"
              :key="i"
              @click="goTo(i)"
              :style="{ cursor: 'pointer', opacity: el.opacity }"
            >
              {{ el.desc }}
            </div>
          </div>
          <div class="places">
            <div
              class="place-wrap"
              @click="goTo(i)"
              v-for="(el, i) in computedYears"
              :key="i"
            >
              <div
                class="place"
                :style="{ cursor: 'pointer', opacity: el.opacity }"
              ></div>
            </div>
          </div>
          <div class="years">
            <div
              class="years-year"
              v-for="(el, i) in computedYears"
              :key="i"
              @click="goTo(i)"
              :style="{ cursor: 'pointer', opacity: el.opacity }"
            >
              {{ el.year }}
            </div>
          </div>
        </div>
      </div>
      <div
        class="services"
        v-waypoint="{
          active: true,
          callback: onServicesWaypoint,
          options: waypointOptions,
        }"
      >
        <div class="service">
          <fa icon="shield-alt" />
          <div class="title">System & Account Security</div>
          <div class="desc">
            <div>Two-factor authentication</div>
            <div>SSL certificate</div>
            <div>Encrypted data</div>
          </div>
        </div>
        <div class="service">
          <fa icon="fingerprint" />
          <div class="title">Financial Security</div>
          <div class="desc">
            <div>Cold storage for cryptocurrency funds</div>
            <div>PCI DSS certificate</div>
            <div>Strong relations with banks</div>
          </div>
        </div>
        <div class="service">
          <fa icon="newspaper" />
          <div class="title">Legal Compliance</div>
          <div class="desc">
            <div>MSB status in FinCEN (USA)</div>
            <div>Registered with the ICO in the UK (EU)</div>
            <div>Internal AML/KYC policy and procedures</div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="contact card hidden"
      v-waypoint="{
        active: true,
        callback: onContactWaypoint,
        options: waypointOptions,
      }"
    >
      <div class="title">Contact Us</div>
      <div class="email">
        Email for business inquiries: <span>admin@{{ host }}.com</span>
      </div>
      <div class="email">
        Email for account-related issues and cardholder correspondence:
        <span>support@{{ host }}.com</span>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
import Footer from '@/components/footer/Footer.vue'
import Background from '@/components/views/wallet/Background.vue'

export default {
  name: 'About',
  components: {
    Footer,
    Background,
  },
  data: () => ({
    scrollPermit: true,
    waypointOptions: {
      root: null,
      rootMargin: '0px 0px 0px 0px',
      threshold: [0, 0.5],
    },
    years: [
      {
        year: 'Jan 2015',
        desc: `Cloud mining services suspended.`,
        selected: true,
        opacity: 1,
      },
      {
        year: 'Mar 2015',
        desc: `MSB status in FinCEN obtained.`,
        selected: false,
        opacity: 0.1,
      },
      {
        year: 'Apr 2015',
        desc: `Simple Buy/Sell service launched.`,
        selected: false,
        opacity: 0,
      },
      {
        year: 'Oct 2015',
        selected: false,
        desc: `Integration with TradingView platform.`,
        opacity: 0,
      },
      {
        year: 'Dec 2015',
        desc: `Mobile application released.`,
        selected: false,
        opacity: 0,
      },
      {
        year: 'Apr 2016',
        desc: `ETH market added to N. Withdrawals to cards launched.`,
        selected: false,
        opacity: 0,
      },
      {
        year: 'Dec 2017',
        desc: `Maker Taker Fee Schedule Launched`,
        selected: false,
        opacity: 0,
      },
      {
        year: 'Jan 2017',
        desc: `PCI DSS Certificate Upgraded to Level 2`,
        selected: false,
        opacity: 0,
      },
      {
        year: 'Oct 2017',
        desc: `Variable Trade Fee Schedule Launched`,
        selected: false,
        opacity: 0,
      },
      {
        year: 'Mar 2018',
        desc: `Margin Trading Launched`,
        selected: false,
        opacity: 0,
      },
      {
        year: 'Jun 2018',
        desc: `Bitcoin Affiliate Program Launched`,
        selected: false,
        opacity: 0,
      },
      {
        year: 'May 2019',
        desc: `Opening the trade guard system`,
        selected: false,
        opacity: 0,
      },
      {
        year: 'Jan 2020',
        desc: `Added new coins to the trading`,
        selected: false,
        opacity: 0,
      },
      {
        year: 'Dec 2021',
        desc: `Integration of the pre-sale system.`,
        selected: false,
        opacity: 0,
      },
      {
        year: 'Dec 2022',
        desc: `IEO launch of a new exchange-traded coin on Polkadot`,
        selected: false,
        opacity: 0,
      },
    ],
  }),
  computed: {
    Host() {
      return this.$store.getters.host
    },
    host() {
      return window.location.host.split('.')[0]
    },
    computedYears() {
      return this.years
    },
  },
  methods: {
    onServicesWaypoint({ going }) {
      const services = document.querySelectorAll('.service')
      if (going === this.$waypointMap.GOING_IN) {
        let time = 0
        services.forEach(advantage => {
          setTimeout(() => {
            advantage.classList.add('animated', 'fadeInUp', 'visible')
          }, time)
          time += 100
        })
      }
    },
    onContactWaypoint({ going }) {
      const services = document.querySelectorAll('.contact')
      if (going === this.$waypointMap.GOING_IN) {
        let time = 0
        services.forEach(advantage => {
          setTimeout(() => {
            advantage.classList.add('animated', 'fadeInRight', 'visible')
          }, time)
          time += 100
        })
      }
    },
    next() {
      if (this.scrollPermit) {
        this.go(1)
        this.scrollPermit = false
        let self = this
        setTimeout(() => {
          self.scrollPermit = true
        }, 700)
      }
    },
    prev() {
      if (this.scrollPermit) {
        this.go(-1)
        this.scrollPermit = false
        let self = this
        setTimeout(() => {
          self.scrollPermit = true
        }, 700)
      }
    },
    go(direction) {
      for (let i = 0; i < this.years.length; i++) {
        if (this.years[i].selected) {
          this.years[i].selected = false

          var next =
            i + direction < 0
              ? this.years.length - 1
              : i + direction > this.years.length - 1
              ? 0
              : i + direction

          this.years[next].selected = true

          break
        } else {
          continue
        }
      }

      this.updateOpacity()
      this.updatePosition()
    },
    goTo(index) {
      this.years.forEach(year => {
        year.selected = false
      })

      this.years[index].selected = true

      this.updateOpacity()
      this.updatePosition()
    },
    updateYearsPosition() {
      var start = 28
      var step = 8
      for (let i = 0; i < this.years.length; i++) {
        this.years[i].position = start + 'rem'
        start -= step
      }
    },
    updatePosition() {
      for (let i = 0; i < this.years.length; i++) {
        if (this.years[i].selected) {
          this.$el.querySelector('.overview-foreground').style.top = this.years[
            i
          ].position
          break
        } else {
          continue
        }
      }
    },
    updateOpacity() {
      for (let i = 0; i < this.years.length; i++) {
        if (this.years[i].selected) {
          this.years[i].opacity = 1
        }

        if (this.years[i - 1]?.selected || this.years[i + 1]?.selected) {
          this.years[i].opacity = 0.1
        }

        if (
          !this.years[i].selected &&
          !this.years[i - 1]?.selected &&
          !this.years[i + 1]?.selected
        ) {
          this.years[i].opacity = 0
        }
      }
    },
  },
  mounted() {
    this.updateYearsPosition()
    document.body.style.overflowY = 'auto'

    let self = this

    setInterval(() => {
      if (self.scrollPermit) self.go(1)
    }, 5000)
  },
}
</script>

<style lang="scss" scoped>
* {
  font-family: Montserrat;
}
.page {
  position: relative;
}
.card {
  @include to(25rem) {
    box-shadow: none;
    border: none;
    border-radius: 0;
    padding: 10px;
    background: none;
  }
  @include from(25rem) {
    box-shadow: inset 0 0px 10px $cyan;
    border-radius: 5px;
    background: linear-gradient(90deg, #0075ff22 0%, #0075ff55 100%);
    border: 1px solid $cyan;
    padding: 20px;
  }
}
.title {
  border-bottom: $cyan solid 2px;
  padding-bottom: 15px;
  margin-bottom: 20px;
  text-align: left;
  color: white;
  @include to(25rem) {
    font-size: 1.3rem;
  }
  @include from(25rem) {
    font-size: 2rem;
  }
}
.structure {
  display: grid;
  grid-template-columns: 1fr 1.1fr 1fr;
  justify-content: space-between;
  grid-gap: 50px;
  width: 90%;
  margin: 20px auto;

  $break: 90rem;

  @include to($break) {
    grid-template-columns: 1fr;
    grid-template-areas: 'text' 'overview' 'services';
  }
  @include from($break) {
    grid-template-columns: 1fr 1.1fr;
    grid-template-areas: 'text overview' 'services services';
  }
  .text {
    grid-area: text;
  }
  .overview {
    grid-area: overview;
  }
  .services {
    grid-area: services;
  }
  .services {
    margin-top: 80px;
    display: grid;
    @include xs-block {
      grid-template-columns: 1fr;
      grid-template-rows: 1fr 1fr 1fr;
    }
    @include sm-block {
      grid-template-columns: 1fr;
      grid-template-rows: 1fr 1fr 1fr;
    }
    @include md-block {
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 1fr 2fr;
    }
    @include lg-block {
      grid-template-columns: 1fr 1fr 1fr;
    }
    .service {
      opacity: 0;
      color: $cyan;
      display: grid;
      justify-items: center;
      padding-top: 80px;
      @include md-block {
        height: 200px;
      }
      @include lg-block {
        height: 100px;
      }
      svg {
        font-size: 3rem;
        color: $cyan-alpha;
        margin-bottom: 10px;
      }
      .title {
        height: 50px;
        margin-bottom: 15px;
        color: white;
        font-size: 1.2rem;
        display: grid;
        border: none;
        &::after {
          margin: auto;
          content: ' ';
          display: block;
          width: 20px;
          height: 2px;
          margin-top: 10px;
          background-color: $cyan;
        }
      }
      .desc {
        width: 70%;
        text-align: left;
        div {
          margin-bottom: 7px;
          &::before {
            content: ' ';
            display: inline-block;
            margin: auto 2px;
            margin-bottom: 4px;
            margin-right: 6px;
            width: 5px;
            height: 5px;
            border-radius: 100%;
            background-color: $cyan;
          }
        }
      }
    }
  }
  .text {
    .summary,
    .introduction {
      font-size: 2rem;
      margin: 50px auto;
      margin-bottom: 20px;
      text-align: left;
      color: white;
      display: grid;
      justify-content: end;
      .paragraph {
        text-align: justify;
        margin-bottom: 10px;
        font-size: 0.9rem;
        color: $light-blue;
        text-indent: 1rem;
      }
    }
  }
  .overview {
    position: relative;
    height: 33rem;
    overflow: hidden;
    display: grid;
    justify-content: end;
    grid-area: overview;

    &-background {
      position: absolute;
      z-index: 0;
      height: 33rem;
      width: 100%;
      display: grid;
      align-content: center;
      justify-content: center;
      justify-items: center;
      grid-template-areas: '. up .' 'desc places years' '. down .';
      pointer-events: none;

      .up,
      .down {
        width: 40px;
        position: absolute;
        border-bottom: 1px $cyan solid;
        border-right: 1px $cyan solid;
        height: 40px;
        right: -18px;
        opacity: 0.4;
        transition: 0.25s;
        cursor: pointer;

        &:hover {
          opacity: 1;
        }
      }
      .up {
        top: 0;
        grid-area: up;
        transform: rotate(-135deg);

        &:active {
          top: -20px;
        }
      }
      .down {
        transform: rotate(45deg);
        bottom: 0;
        grid-area: down;
        &:active {
          bottom: -20px;
        }
      }
      .desc {
        grid-area: desc;
      }
      .years {
        grid-area: years;
      }
      .places {
        grid-area: places;
      }
      .path {
        width: 5px;
        display: grid;
        justify-self: center;
        height: 30rem;
        background: linear-gradient(
          45deg,
          transparent 0%,
          $cyan 50%,
          transparent 100%
        );
      }
    }
    &-foreground {
      position: absolute;
      z-index: 1;
      top: 28rem;
      transition: top 1s;
      height: 79rem;
      z-index: 10;
      width: 100%;
      display: grid;
      align-content: center;
      justify-content: center;
      justify-items: center;
      grid-template-columns: 1fr 50px 1fr;

      .first-slide {
        opacity: 1;
      }
      .second-slide {
        opacity: 0;
      }
      .places {
        display: grid;
        align-content: center;
        justify-content: center;
        .place-wrap {
          height: 8rem;
          display: grid;
          align-content: center;
          cursor: pointer;
          .place {
            transition: opacity 1s;
            width: 10px;
            height: 10px;
            background-color: white;
            border-radius: 100%;
          }
        }
      }
      .description,
      .years {
        display: grid;
        justify-items: center;
        color: white;
        width: 100%;
        position: relative;
        grid-auto-rows: auto;
        grid-gap: -20px;
        cursor: default;
        user-select: none;
        &-text {
          justify-self: end;
          height: 8rem;
          width: 80%;
          text-align: right;
          align-self: center;
          display: grid;
          align-content: center;
          transition: opacity 1s;
          @include to(20rem) {
            font-size: 0.7rem;
          }
          @include from(20rem) {
            font-size: 1.1rem;
          }
        }
        &-year {
          transition: opacity 1s;
          @include xs-block {
            font-size: 2rem;
          }
          @include sm-block {
            font-size: 2rem;
          }
          @include md-block {
            font-size: 2rem;
          }
          @include lg-block {
            font-size: 4rem;
          }
          height: 8rem;
          display: grid;
          align-content: center;
          justify-self: start;
          align-self: center;
          font-weight: 500;
          font-family: Montserrat;
        }
      }
    }
  }
}
.contact {
  opacity: 0;
  color: $cyan;
  text-align: left;
  width: 90%;
  margin: 100px auto;
  color: $light-blue;
  .title {
    text-align: center;
  }
  .email {
    font-size: 1.1rem;
    margin-top: 10px;
    span {
      color: white;
    }
  }
}
.page {
  position: relative;
  background: $v-grad;
  background-size: contain;
  padding-top: $header-slot;

  .container {
    display: flex;
    z-index: 1;
    grid-template-rows: minmax(170px, 20vh) 4fr 200px;
    grid-gap: 20px;
    justify-content: center;

    &.last {
      margin-bottom: 300px;
      min-height: 65vh;
    }
    @include xs-block {
      padding: 0;
      padding-left: 6px;
    }
    @include sm-block {
      padding: 0;
      padding-left: 15px;
    }
    @include md-block {
      padding: 0 40px;
    }
    @include lg-block {
      padding: 0 40px;
    }
  }
}
</style>
