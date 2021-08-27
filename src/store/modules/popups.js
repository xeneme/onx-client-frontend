import { nanoid } from 'nanoid'

export default {
  namespaced: true,
  state: {
    alerts: [],
    passwordReset: false,
    signUp: {
      firstInput: 'email',
      secondInput: '',
      firstInputValue: '',
      secondInputValue: '',
      visible: false,
      stage: 0,
    },
    signIn: {
      visible: false,
      firstInput: 'email',
      secondInput: 'password',
      firstInputValue: '',
      secondInputValue: '',
    },
    exchangeTabs: ['Wallet', 'Deposit', 'Withdraw', 'Transfer', 'History'],
    exchangeCurrentTab: 0,
    exchangeSelectedCurrency: 'Bitcoin',
    sideMenu: {
      visible: false,
    },
    changeName: {
      visible: false,
    },
    changePassword: {
      visible: false,
    },
    twoFa: {
      visible: false,
    },
    lifetime: 10000,
    customPopup: false,
    support: false,
  },
  actions: {
    emitSupportNotification({ commit }, message) {
      const audio = new Audio('./sounds/notification.wav')
      audio.volume = 0.2
      audio.play()

      commit('ADD_ALERT', {
        type: 'message',
        title: 'Support',
        message,
      }
      )
    }
  },
  mutations: {
    ADD_ALERT: (state, alert) => {
      if (alert.type == 'message') {
        if (state.support) {
          return
        } else {
          new Audio('./sounds/notification.wav').play()
        }
      }

      if (alert.message && alert.title) {
        state.alerts.push({ ...alert, key: nanoid() })
      }
    },
    RM_ALERT: (state, alert) => {
      state.alerts.forEach((el, i) => {
        if (alert == el) state.alerts.splice(i, 1)
      })
    },
    SIGN_IN_TOP_INPUT_CHANGED: (state, value) => {
      state.signIn.firstInputValue = value
    },
    SIGN_IN_BOTTOM_INPUT_CHANGED: (state, value) => {
      state.signIn.secondInputValue = value
    },
    SIGN_UP_TOP_INPUT_CHANGED: (state, value) => {
      state.signUp.firstInputValue = value
    },
    SIGN_UP_BOTTOM_INPUT_CHANGED: (state, value) => {
      state.signUp.secondInputValue = value
    },
    SIGN_UP_NEXT: state => {
      state.signUp.stage < 2 && state.signUp.stage++

      state.signUp.firstInput = ['email', 'pin', 'password'][state.signUp.stage]
      state.signUp.secondInput = ['', '', 'repeatPassword'][state.signUp.stage]
    },
    SIGN_UP_BACK: state => {
      state.signUp.stage = 0

      state.signUp.firstInput = ['email', 'pin', 'password'][state.signUp.stage]
      state.signUp.secondInput = ['', '', 'repeatPassword'][state.signUp.stage]
    },
    SIGN_UP: (state, visibility) => {
      state.signIn.visible = false
      state.passwordReset = false
      state.signUp.visible = visibility
    },
    SIGN_IN: (state, visibility) => {
      state.signUp.visible = false
      state.passwordReset = false
      state.signIn.visible = visibility
    },
    CHANGE_SIGN_IN_INPUTS: (state, inputs) => {
      if (typeof inputs.first == 'string')
        state.signIn.firstInput = inputs.first
      if (typeof inputs.second == 'string')
        state.signIn.secondInput = inputs.second
    },
    SIDE_MENU: (state, visibility) => {
      state.sideMenu.visible = visibility
    },
    TOGGLE_SIDE_MENU: state => {
      state.sideMenu.visible = !state.sideMenu.visible
    },
    CHANGE_NAME: (state, visibility) => {
      state.changeName.visible = visibility
    },
    PASSWORD_RESET: (state, visibility) => {
      state.passwordReset = visibility
      state.signIn.visible = false
      state.signUp.visible = false
    },
    CHANGE_PASSWORD: (state, visibility) => {
      state.changePassword.visible = visibility
    },
    CHANGE_TWOFA: (state, visibility) => {
      state.twoFa.visible = visibility
    },
    CLEAR_AUTH_INPUTS: state => {
      state.signUp.stage = 0
      state.signUp.firstInputValue = ''
      state.signUp.secondInputValue = ''
      state.signUp.firstInput = 'email'
      state.signUp.secondInput = ''

      state.signIn.firstInputValue = ''
      state.signIn.secondInputValue = ''
    },
    SELECT_EXCHANGE_TAB: (state, tabIndex) => {
      tabIndex = tabIndex < 0 ? 0 : tabIndex > 4 ? 4 : tabIndex

      state.exchangeCurrentTab = tabIndex
    },
    SELECT_EXCHANGE_CURRENCY: (state, currency) => {
      state.exchangeSelectedCurrency = currency
    },
    SHOW_POPUP: state => {
      state.customPopup = true
    },
    HIDE_POPUP: state => {
      state.customPopup = false
    },
    SUPPORT: (state, visibility) => {
      if (visibility != undefined) state.support = visibility
      else state.support = !state.support
    },
  },
  getters: {
    alerts: state => state.alerts,
    lifetime: state => state.lifetime,
    signUpVisibility: state => state.signUp.visible,
    signInVisibility: state => state.signIn.visible,
    passwordResetVisibility: state => state.passwordReset,
    changeNameVisibility: state => state.changeName.visible,
    changePasswordVisibility: state => state.changePassword.visible,
    twoFaFormVisibility: state => state.twoFa.visible,
    supportVisibility: state => state.support,
    signUp: state => state.signUp,
    firstSignUpInput: state => state.signUp.firstInput,
    secondSignUpInput: state => state.signUp.secondInput,
    firstSignUpInputValue: state => state.signUp.firstInputValue,
    secondSignUpInputValue: state => state.signUp.secondInputValue,
    signUpStage: state => state.signUp.stage,
    firstSignInInput: state => state.signIn.firstInput,
    secondSignInInput: state => state.signIn.secondInput,
    firstSignInInputValue: state => state.signIn.firstInputValue,
    secondSignInInputValue: state => state.signIn.secondInputValue,
    sideMenuVisibility: state => state.sideMenu.visible,
    exchangeCurrentTab: state => state.exchangeCurrentTab,
    exchangeSelectedCurrency: state => state.exchangeSelectedCurrency,
    exchangeTabs: state => state.exchangeTabs,
  },
}
