import Vue from 'vue'
import anime from 'animejs'
import { nanoid } from 'nanoid'
import moment from 'moment'
import axios from 'axios'


String.prototype.capitalize = function () {
  return this[0].toUpperCase() + this.slice(1)
}

String.prototype.toSymbol = function () {
  return {
    bitcoin: 'BTC',
    litecoin: 'LTC',
    ethereum: 'ETH',
    'usd coin': 'USDC',
  }[this.toLowerCase()]
}

String.prototype.toCurrency = function (lower) {
  return {
    BTC: lower ? 'bitcoin' : 'Bitcoin',
    LTC: lower ? 'litecoin' : 'Litecoin',
    ETH: lower ? 'ethereum' : 'Ethereum',
    USDC: lower ? 'usd coin' : 'Usd coin',
  }[this.toUpperCase()]
}

const clearAndUpper = s => s.replace(/-/, "").toUpperCase()
String.prototype.toKebabCase = function () { return this.replace(/([a-z0–9])([A-Z])/g, "$1-$2").toLowerCase() }
String.prototype.toCamelCase = function () { return this.replace(/-\w/g, clearAndUpper) }
String.prototype.toPascalCase = function () { return this.replace(/(^\w|-\w)/g, clearAndUpper) }

Vue.prototype.$time = {
  getExpiration: (from, additionalMinutes) => {
    let min = typeof additionalMinutes === 'number' ? additionalMinutes : 0
    return from + 1000 * 60 * min
  },
  toLocale: ts => {
    return new Date(ts)
  },
  format: date => {
    let d = new Date(date)
    let year = d.getFullYear() - 2000
    let month = d.getMonth() + 1
    let day = d.getDate()
    let hours = d.getHours()
    let minutes = d.getMinutes()

    minutes = minutes < 10 ? '0' + minutes : minutes
    hours = hours < 10 ? '0' + hours : hours
    day = day < 10 ? '0' + day : day
    month = month < 10 ? '0' + month : month

    return `${day}.${month}.${year}, ${hours}:${minutes}`
  },
}

Vue.prototype.$axios = {
  post: (api, body) =>
    axios.post(
      '/' + api,
      body,
      {
        headers: {
          Authorization: localStorage.getItem('auth-token'),
        },
      },
    ),
  get: api =>
    axios.get('/' + api, {
      headers: {
        Authorization: localStorage.getItem('auth-token'),
      },
    }),
}

Vue.prototype.$anime = anime
Vue.prototype.$nanoid = nanoid
Vue.prototype.$moment = moment
Vue.prototype.$dev = process.env.NODE_ENV == 'development'

Vue.prototype.$copy = text => {
  let dummy = document.createElement('textarea')
  document.body.appendChild(dummy)
  dummy.value = text
  dummy.select()
  document.execCommand('copy')
  document.body.removeChild(dummy)
}

Vue.prototype.$isDesktop = !navigator.userAgent.match(
  /(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/,
)