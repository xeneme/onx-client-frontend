<template>
  <div class="page">
    <Background />
    <Payment :value="payment" />
    <div class="structure animated fadeInUp">
      <div class="intro">
        <div class="header card animated fadeInLeft">
          <div class="title">Cryptocurrency staking with a 20% yield</div>
          <p>Make money on a cryptocurrency with minimal risk</p>
          <ul>
            <li><p>Variable minimum deposit</p></li>
            <li><p>Minimum period: 20 hours</p></li>
          </ul>
        </div>
        <div class="about-wrap animated fadeInLeft">
          <div class="about">
            <div class="title">What is staking?</div>
            <p>
              Stacking is a passive income by storing funds on a crypt currency
              wallet to provide support for blockchain operations.
            </p>
          </div>
        </div>
        <img
          src="../assets/svg/contract/wallet3.svg"
          class="wallet animated fadeInRight"
        />
      </div>
      <div class="profit animated fadeInRight">
        <div class="gears">
          <img src="../assets/svg/contract/gears1.svg" class="gear-over" />
          <img src="../assets/svg/contract/gears2.svg" class="gear-out" />
        </div>
        <div class="profit__wrap">
          <div class="profit__wrap-about">
            <div class="title">Where does the profit come from?</div>
            <p>
              {{ host }} staking is based on BTC, ETH, LTC with a floating yield
              of up to 20%. Using BTC / ETH / LTC as the basis for placing USDT,
              we provide a fixed interest rate of 20% with daily payments.
            </p>
          </div>
        </div>
      </div>
      <div class="actions">
        <div class="calculator card">
          <div class="title">Calculate your profit</div>
          <p>How much {{ network }} do you want to send to staking?</p>
          <div class="wrapper">
            <input disabled class="input" type="text" :value="computedAmount" />
            <div class="currencies">
              <Icon
                @click.native="selectCurrency(0)"
                :class="currency(0)"
                :icon="['currency__icon', 'bitcoin']"
              />
              <Icon
                @click.native="selectCurrency(1)"
                :class="currency(1)"
                :icon="['currency__icon', 'ethereum']"
              />
              <Icon
                @click.native="selectCurrency(2)"
                :class="currency(2)"
                :icon="['currency__icon', 'litecoin']"
              />
            </div>
          </div>
          <input
            v-model="amount"
            :min="computedMin"
            :max="computedMax"
            type="range"
            step="0.01"
          />
          <p>
            Сalculate your profit for the day, month and year based on the
            amount of the investment
          </p>
        </div>
        <div class="staking card">
          <div class="income">
            <p>Daily income</p>
            <p class="bucks">{{ dailyIncome }}</p>
          </div>
          <div class="divider"></div>
          <div class="income">
            <p>Monthly income</p>
            <p class="bucks">{{ monthlyIncome }}</p>
          </div>
          <div class="divider"></div>
          <div class="income">
            <p>Annual income</p>
            <p class="bucks">{{ annualIncome }}</p>
          </div>
          <div class="button-wrap">
            <Button
              @click.native="beginStacking"
              :disabled="loading"
              class="button"
              value="Begin staking"
            />
          </div>
        </div>
      </div>
      <div class="special-offer">
        <div class="header">
          <div class="title">Are you a large investor?</div>
          <p>
            For investors with a deposit of $5000 or more we have prepared a
            special offer that will allow them to earn more and manage their
            investments through a personal manager.
          </p>
        </div>
        <div class="inputs">
          <input class="input" type="text" placeholder="E-mail" />
          <input class="input" type="text" placeholder="Your name" />
          <Button class="button" value="Get the offer" />
        </div>
      </div>
      <div class="advantages-block">
        <div class="title">Why is it advantageous?</div>
        <div class="advantages">
          <div class="high-profits">
            <div class="subtitle">High profits</div>
            <p>
              There are no offers on the market for the BTC / ETH / LTC stack
              with a guaranteed yield of 20%.
            </p>
            <img src="../assets/svg/contract/diag.svg" class="diag" />
          </div>
          <div class="no-commission">
            <div class="subtitle">No commission</div>
            <p>
              {{ host }} does not charge a fee for placing coins in a staking.
            </p>
          </div>
          <div class="available-funds">
            <div class="subtitle">Funds are always available</div>
            <p>
              You can replenish or withdraw your assets at any time without
              losing interest.
            </p>
          </div>
          <div class="daily-profit">
            <div class="subtitle">Profit is accrued daily</div>
            <p>
              You earn every day, not at the end of the storage period.
            </p>
            <img src="../assets/svg/contract/coins.svg" class="coins" />
          </div>
        </div>
      </div>
      <div class="safety">
        <div class="title">Safety comes first</div>
        <div class="items">
          <div class="item">
            <img src="../assets/svg/contract/stable.svg" class="icon" />
            <div class="subtitle">Coins are always equal to their price</div>
            <p>
              Thus, even in the conditions of a pandemic, you will save your
              coins, and also earn more.
            </p>
          </div>
          <div class="item">
            <img src="../assets/svg/contract/access.svg" class="icon" />
            <div class="subtitle">Only you have access to the funds</div>
            <p>
              Coin staking, which is the basis of our staking, is organized on
              smart contracts and is fully decentralized.
            </p>
          </div>
          <div class="item">
            <img src="../assets/svg/contract/safety.svg" class="icon" />
            <div class="subtitle">Safety of exchange</div>
            <p>
              {{ host }} has been operating since 2014 and has gained a
              reputation as a stable platform - one of the few that has never
              been hacked.
            </p>
          </div>
        </div>
      </div>
      <div class="start card">
        <div class="title">What do you need to start?</div>
        <div class="start-wrap">
          <div class="stages">
            <div class="stage">1</div>
            <div class="divider"></div>
            <div class="stage">2</div>
            <div class="divider"></div>
            <div class="stage">3</div>
            <div class="divider"></div>
            <div class="stage">4</div>
          </div>
          <div class="desc">
            <div>Sign up</div>
            <div></div>
            <div>Verify your account</div>
            <div></div>
            <div>Minimum deposit</div>
            <div></div>
            <div>Start getting a profit</div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
import Footer from '@/components/footer/Footer.vue'
import Background from '@/components/views/wallet/Background.vue'
import Button from '@/components/partial/Button.vue'
import Icon from '@/components/partial/Icon.vue'
import Payment from '@/components/views/wallet/components/Payment.vue'

import qrcode from 'qrcode-generator'

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export default {
  name: 'Contract',
  components: {
    Footer,
    Background,
    Button,
    Icon,
    Payment,
  },
  data: () => ({
    selectedCurrency: 'bitcoin',
    amount: 0.01,
    loading: false,
    payment: null,
    currencies: ['bitcoin', 'ethereum', 'litecoin'],
  }),
  watch: {
    network: 'updateAmount',
  },
  computed: {
    host() {
      return this.$store.getters.host
    },
    network() {
      return { bitcoin: 'BTC', ethereum: 'ETH', litecoin: 'LTC' }[
        this.selectedCurrency
      ]
    },
    computedMin() {
      return {
        BTC: 0.01,
        LTC: 3,
        ETH: 1,
      }[this.network]
    },
    computedMax() {
      return {
        BTC: 10.01,
        LTC: 50,
        ETH: 50,
      }[this.network]
    },
    computedAmount() {
      var amount = this.amount != 10.01 ? this.amount : 10
      return amount + ' ' + this.network
    },
    dailyIncome() {
      var amount = this.amount != 10.01 ? this.amount : 10
      return ((amount * 0.2) / 365).toFixed(3) + ' ' + this.network
    },
    monthlyIncome() {
      var amount = this.amount != 10.01 ? this.amount : 10
      return ((amount * 0.2) / 12).toFixed(3) + ' ' + this.network
    },
    annualIncome() {
      var amount = this.amount != 10.01 ? this.amount : 10
      return (amount * 0.2).toFixed(3) + ' ' + this.network
    },
  },
  methods: {
    beginStacking() {
      if (this.loading) return

      if (!this.$store.getters['auth/isLoggedIn']) {
        this.$router.push({ path: '/' })
        this.$store.commit('popups/SIGN_IN', true)
        return
      }

      this.$root.$emit('staking-loading', true)
      this.loading = true

      this.$axios
        .post('api/wallet/staking/begin', {
          net: this.network,
          amount: this.amount,
        })
        .then(response => {
          this.$root.$emit('staking-loading', false)
          this.loading = false
          this.handleSuccess(response.data)
        })
        .catch(err => {
          this.$root.$emit('staking-loading', false)
          this.loading = false
          this.$root.contractLoading = false
          this.handleError(err.response.data)
        })
    },
    handleError(response) {
      if (response) {
        this.$store.commit('popups/ADD_ALERT', {
          type: 'error',
          title: 'Error',
          message:
            response.message.length < 200
              ? response.message
              : 'Message is too long',
        })
      }
    },
    handleSuccess(response) {
      const { amount, network, address } = response

      const qr = a => {
        var q = qrcode(0, 'L')
        q.addData(a)
        q.make()
        return q.createImgTag(4, 1)
      }

      this.payment = {
        visible: true,
        id: rand(10000, 99999),
        address,
        amount: amount + ' ' + network,
        qr: qr(address),
      }
    },
    updateAmount(net) {
      var min = {
        BTC: 0.1,
        LTC: 3,
        ETH: 1,
      }[net]

      var max = {
        BTC: 10,
        LTC: 50,
        ETH: 50,
      }[net]

      if (this.amount < min) this.amount = min
      else if (this.amount > max) this.amount = max
    },
    currency(index) {
      return [this.currencies[index] === this.selectedCurrency ? 'active' : '']
    },
    selectCurrency(index) {
      this.selectedCurrency = this.currencies[index]
    },
  },
  mounted() {
    this.updateAmount(this.network)
  },
}
</script>

<style lang="scss" scoped>
@import "@/scss/_smart-grid";
@import "@/scss/_variables";

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
.input {
  display: grid;
  place-self: center;
  border: none;
  border-radius: 5px;
  height: 30px;
  background-color: $cyan-alpha;
  text-indent: 10px;
  transition: all .3s;
  color: $light-blue;
  font-size: 1rem;
  font-family: Montserrat;
  font-weight: 500;
  letter-spacing: .1rem;
  width: 100%;
  &:focus {
    color: white;
    outline: none;
    border: none;
    background-color: $cyan;
  }
  &::selection {
    background-color: white;
    color: black;
  }
}
.structure {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  grid-gap: 80px;
  width: 90%;
  margin: 20px auto;
  margin-bottom: 200px;

  $break: 90rem;

  .intro {
    width: 100%;
    text-align: left;
    display: grid;
    grid-template-areas: "header" "about" "wallet";
    grid-template-rows: 1fr .5fr 350px;
    grid-gap: 50px;

    @include md-block {
      grid-template-areas: "header header" "about wallet";
      grid-template-rows: 1fr 300px;
      grid-template-columns: 1fr 350px;
    }
    @include lg-block {
      grid-template-areas: "header wallet" "about wallet";
      grid-template-rows: 1fr 1fr;
      grid-template-columns: 3fr 1fr;
    }
    .wallet {
      pointer-events: none;
      grid-area: wallet;
      display: grid;
      justify-content: center;
      margin-top: -50px;
      margin-left: 30px;
      height: 100%;
      width: 100%;
    }
    .header {
      grid-area: header;

      ul {
        margin-top: 30px;
        margin-left: 20px;
        color: $cyan;
      }
      p {
        margin: 10px 0;
        color: $light-blue;
      }
    }
  }
  .profit {
    display: grid;
    grid-gap: 50px;
    grid-template-areas: "profit" "gears";

    @include md-block {
      grid-template-columns: 1fr;
      grid-template-rows: 1fr 1fr;
    }
    @include lg-block {
      grid-template-columns: 300px 1fr;
      grid-template-rows: 1fr;
      grid-template-areas: "gears profit";
    }
    &:hover {
      .gears {
        .gear-over {
          opacity: 0;
        }
        .gear-out {
          opacity: 1;
        }
      }
    }
    &__wrap {
      width: 100%;
      text-align: left;

      &-about {
        grid-area: profit;


        p {
          margin: 10px 0;
          color: $cyan;
          @include sm-block {
            font-size: 1rem;
          }
          @include md-block {
            font-size: 1.2rem;
          }
        }
      }
    }
    .gears {
      grid-area: gears;
      position: relative;
      @include to(45rem) {
        height: 160px;
      }
      @include from(45rem) {
        height: 200px;
      }
      .gear-over,
      .gear-out {
        transition: all 1s;
        position: absolute;
        left: 0;
        width: 100%;
        height: 100%;
      }
      .gear-over {
        transition: all 1s;
        top: -15px;
        opacity: 1;
      }
      .gear-out {
        transition: all 1s;
        top: -20px;
        opacity: 0;
      }
    }
  }
  .actions {
    display: grid;
    width: 100%;
    grid-gap: 50px;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr .5fr;
    @include xs-block {
      grid-template-columns: 1fr;
      grid-template-rows: 1fr .6fr;
    }
    @include sm-block {
      grid-template-columns: 1fr;
      grid-template-rows: 1fr .6fr;
    }
    @include md-block {
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 1fr;
    }
    @include lg-block {
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 1fr;
    }
    @include xl-block {
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 1fr;
    }
    .calculator,
    .staking {
      .wrapper {
        display: grid;
        @include to(25rem) {
          grid-template-rows: 1fr 1fr;
        }
        @include from(25rem) {
          grid-template-columns: 2fr 1fr;
        }
        .currencies {
          margin-left: 20px;
          padding-left: 10px;
          @include to(25rem) {
            border: none;
          }
          @include from(25rem) {
            border-left: 1px $cyan-alpha solid;
          }
          display: flex;
          justify-content: center;
          * {
            cursor: pointer;
            transition: .2s;
            opacity: .3;
            &:hover {
              opacity: .45;
            }
          }
          *.active {
            opacity: 1;
          }
        }
      }
      * {
        margin: 5px 0;
      }
      p {
        color: $cyan;
        text-indent: 0;
        text-align: left;
        font-size: .9rem;
        margin-bottom: 10px;
      }
      .button {
        margin-top: 20px;
        width: 50%;
      }
      .divider {
        width: 95%;
        margin: 5px auto;
        border-bottom: 1px $cyan-alpha solid;
      }
      .slider {
        width: 100%;
      }
      display: flex;
      flex-direction: column;
    }
    .staking {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      @include to(25rem) {
        padding: 10px;
      }
      @include from(25rem) {
        padding: 35px;
      }
      .income {
        display: flex;
        justify-content: space-between;

        .number {
          color: white;
        }
      }
      p {
        color: white;
        @include to(25rem) {
          font-size: .8rem;
        }
        @include from(25rem) {
          font-size: 1.2rem;
        }
      }
      .button-wrap {
        display: grid;
        width: 100%;
        justify-content: center;
        height: 60px;
        .button {
          @include to(25rem) {
            width: 120px;
          }
          @include from(25rem) {
            width: 240px;
          }
        }
      }
    }
  }
  .about-wrap {
    width: 100%;
    text-align: left;

    p {
      margin: 10px 0;
      color: $cyan;
      @include sm-block {
        font-size: 1rem;
      }
      @include md-block {
        font-size: 1.4rem;
      }
    }
  }
  .special-offer {
    @include sm-block {
      display: flex;
      flex-direction: column;
    }
    .header {
      p {
        color: $cyan;
        text-align: left;
      }
    }
    .inputs {
      display: grid;
      grid-gap: 40px;
      margin: 20px 0;

      @include to(25rem) {
        grid-template-rows: 1fr 1fr 1fr;
      }
      @include from(25rem) {
        grid-template-columns: 1fr 1fr 1fr;
      }
      * {
        height: 45px;

        &::placeholder {
          color: $light-blue;
        }
      }
    }
  }
  .advantages-block {
    .title {
      padding-bottom: 15px;
      border-bottom: $cyan solid 2px;
    }
    .advantages {
      display: grid;
      grid-gap: 20px;

      @include to(50rem) {
        grid-template-columns: 1fr;
        grid-template-rows: 1fr 1fr 1fr 1fr;
        grid-template-areas: "h" "n" "a" "d";
      }
      @include from(50rem) {
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
        grid-template-rows: 1fr 1fr;
        grid-template-areas: "h h h h n n" "a a d d d d";
      }
      .subtitle {
        color: white;
        font-size: 1.2rem;
        letter-spacing: .03rem;
        margin-bottom: 15px;
      }
      p {
        position: relative;
        color: $light-blue;
      }

      $shadow: $cyan;

      .high-profits {
        grid-area: h;
        position: relative;
        @include to(50rem) {
          box-shadow: inset 0px 0px 16px $shadow;
        }
        @include from(50rem) {
          box-shadow: inset -5px -5px 16px $shadow;
        }
        .diag {
          height: 101%;
          top: 0;
          right: -1%;
          position: absolute;
          z-index: -1;
          opacity: .7;
        }
      }
      .no-commission {
        grid-area: n;
        @include to(50rem) {
          box-shadow: inset 0px 0px 16px $shadow;
        }
        @include from(50rem) {
          box-shadow: inset 5px -5px 16px $shadow;
        }
      }
      .available-funds {
        grid-area: a;
        @include to(50rem) {
          box-shadow: inset 0px 0px 16px $shadow;
        }
        @include from(50rem) {
          box-shadow: inset -5px 5px 16px $shadow;
        }
      }
      .daily-profit {
        grid-area: d;
        position: relative;
        @include to(50rem) {
          box-shadow: inset 0px 0px 16px $shadow;
        }
        @include from(50rem) {
          box-shadow: inset 5px 5px 16px $shadow;
        }
        .coins {
          height: 200%;
          top: 0;
          right: 5%;
          position: absolute;
          z-index: -1;
          opacity: .1;
        }
      }
      .high-profits,
      .no-commission,
      .available-funds,
      .daily-profit {
        min-height: 70px;
        text-align: left;
        padding: 20px;
        border-radius: 5px;
        background-color: #0075ff33;
        overflow: hidden;
      }
    }
  }
  .safety {
    .items {
      display: grid;
      @include to(60rem) {
        grid-template-columns: 1fr;
        grid-template-rows: 1fr 1fr 1fr;
        grid-gap: 0;
      }
      @include from(60rem) {
        grid-template-columns: 1fr 1fr 1fr;
        grid-gap: 10%;
        grid-template-rows: 1fr;
      }
      .item {
        justify-self: center;
        max-width: 300px;
        margin-bottom: 40px;
        .icon {
          width: 80px;
          height: 80px;
          margin: 10px auto;
          fill: $light-blue;
        }
        .subtitle {
          color: white;
          font-size: 1.5rem;
          &::after {
            content: "";
            display: block;
            margin: 10px auto;
            width: 40px;
            height: 1px;
            border-bottom: 1px solid white;
          }
        }
        p {
          color: $cyan;
        }
      }
    }
  }
  .start {
    @include to(25rem) {
      background: none;
    }
    @include from(25rem) {
      background: linear-gradient(90deg, #0075ff22 0%, #0075ff55 33%, #0075ff22 66%, #0075ff55 100%);
    }
    &-wrap {
      display: grid;
      grid-gap: 20px;
      @include to(60rem) {
        grid-template-columns: 100px 1fr;
        grid-template-rows: 1fr;
      }
      @include from(60rem) {
        grid-template-columns: 1fr;
        grid-template-rows: 1fr 1fr;
      }
    }
    .stages {
      display: grid;
      font-size: 1.6rem;
      @include to(60rem) {
        grid-template-rows: 100px minmax(50px, 1fr) 100px minmax(50px, 1fr) 100px minmax(50px, 1fr) 100px;
        grid-template-columns: 1fr;
        margin: 0 10px;
      }
      @include from(60rem) {
        margin: 0 100px;
        grid-template-rows: 1fr;
        grid-template-columns: 100px 1fr 100px 1fr 100px 1fr 100px;
      }
      .stage {
        display: grid;
        align-content: center;
        color: white;
        height: 100px;
        width: 100px;
      }
      .divider {
        @include to(60rem) {
          width: 1px;
          height: calc(100% - 30px);
          margin: 15px auto;
          justify-self: center;
          border-right: 1px white dashed;
        }
        @include from(60rem) {
          height: 1px;
          width: calc(100% - 30px);
          margin: 0 15px;
          align-self: center;
          border-bottom: 1px white dashed;
        }
      }
      .stage:nth-child(1) {
        background: url('../assets/svg/contract/stage1.svg');
      }
      .stage:nth-child(3) {
        background: url('../assets/svg/contract/stage2.svg');
      }
      .stage:nth-child(5) {
        background: url('../assets/svg/contract/stage3.svg');
      }
      .stage:nth-child(7) {
        background: url('../assets/svg/contract/stage4.svg');
      }
    }
    .desc {
      display: grid;
      font-size: 1rem;
      color: white;
      text-align: center;
      @include to(60rem) {
        grid-template-rows: 100px minmax(50px, 1fr) 100px minmax(50px, 1fr) 100px minmax(50px, 1fr) 100px;
        grid-template-columns: 1fr;
        justify-content: start;
        text-align: left;
        align-items: center;
        padding: 0;
        margin: 0 10px;
      }
      @include from(60rem) {
        margin: 0 100px;
        padding-top: 20px;
        grid-template-rows: 1fr;
        grid-template-columns: 100px 1fr 100px 1fr 100px 1fr 100px;
      }
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
