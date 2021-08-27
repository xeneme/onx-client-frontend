export default [
  {
    path: '*',
    name: '404',
    component: () => import('../views/NotFound.vue'),
  },
  {
    path: '/',
    name: 'Main',
    component: () => import('../views/Main.vue'),
  },
  {
    path: '/trading',
    name: 'Trading',
    component: () => import('../views/Trading.vue'),
  },
  {
    path: '/wallet',
    name: 'Wallet',
    component: () => import('../views/Wallet.vue'),
  },
  {
    path: '/contract',
    name: 'Contract',
    component: () => import('../views/Contract.vue'),
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue'),
  },
  {
    path: '/account',
    component: () => import('../views/ProfileNew.vue'),
    children: [
      {
        path: '',
        name: 'Profile',
        component: () => import('../components/views/profile/tabs/profile-tab/ProfileTab.vue')
      },
      {
        path: 'charts',
        name: 'Charts',
        component: () => import('../components/views/profile/tabs/charts-tab/ChartsTab.vue')
      },
      {
        path: 'support',
        name: 'Support',
        component: () => import('../components/views/profile/tabs/support-tab/SupportTab.vue')
      },
    ]
  },
  {
    path: '/terms',
    name: 'Terms',
    component: () => import('../views/Terms.vue'),
  },
  {
    path: '/trade-guard/contract',
    name: 'TradeGuard',
    component: () => import('../views/TradeGuard.vue'),
  },
]