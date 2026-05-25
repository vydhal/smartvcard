import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _4bf55568 = () => interopDefault(import('../pages/acceptable-use-policy/index.vue' /* webpackChunkName: "pages/acceptable-use-policy/index" */))
const _be9dc5d0 = () => interopDefault(import('../pages/admin/index.vue' /* webpackChunkName: "pages/admin/index" */))
const _35f02fee = () => interopDefault(import('../pages/appsumo/index.vue' /* webpackChunkName: "pages/appsumo/index" */))
const _3c80fa96 = () => interopDefault(import('../pages/booked/index.vue' /* webpackChunkName: "pages/booked/index" */))
const _2fc3a7a3 = () => interopDefault(import('../pages/cadastro.vue' /* webpackChunkName: "pages/cadastro" */))
const _0cce6818 = () => interopDefault(import('../pages/contact-us/index.vue' /* webpackChunkName: "pages/contact-us/index" */))
const _f7eb7cf8 = () => interopDefault(import('../pages/cookie-policy/index.vue' /* webpackChunkName: "pages/cookie-policy/index" */))
const _175dcc66 = () => interopDefault(import('../pages/customer-support/index.vue' /* webpackChunkName: "pages/customer-support/index" */))
const _72270b1d = () => interopDefault(import('../pages/dashboard/index.vue' /* webpackChunkName: "pages/dashboard/index" */))
const _9feffd22 = () => interopDefault(import('../pages/easy/index.vue' /* webpackChunkName: "pages/easy/index" */))
const _224e3c18 = () => interopDefault(import('../pages/edit.vue' /* webpackChunkName: "pages/edit" */))
const _0769801c = () => interopDefault(import('../pages/hosting-guide/index.vue' /* webpackChunkName: "pages/hosting-guide/index" */))
const _afda8cc6 = () => interopDefault(import('../pages/landing.vue' /* webpackChunkName: "pages/landing" */))
const _10ba8d22 = () => interopDefault(import('../pages/login.vue' /* webpackChunkName: "pages/login" */))
const _781465fa = () => interopDefault(import('../pages/next-steps/index.vue' /* webpackChunkName: "pages/next-steps/index" */))
const _7de68bc4 = () => interopDefault(import('../pages/privacy-policy/index.vue' /* webpackChunkName: "pages/privacy-policy/index" */))
const _3546654c = () => interopDefault(import('../pages/success/index.vue' /* webpackChunkName: "pages/success/index" */))
const _fe62773e = () => interopDefault(import('../pages/terms-and-conditions/index.vue' /* webpackChunkName: "pages/terms-and-conditions/index" */))
const _4b77c372 = () => interopDefault(import('../pages/terms-of-service/index.vue' /* webpackChunkName: "pages/terms-of-service/index" */))
const _60303945 = () => interopDefault(import('../pages/thank-you/index.vue' /* webpackChunkName: "pages/thank-you/index" */))
const _28c9bf47 = () => interopDefault(import('../pages/training/index.vue' /* webpackChunkName: "pages/training/index" */))
const _6a58c02f = () => interopDefault(import('../pages/admin/login.vue' /* webpackChunkName: "pages/admin/login" */))
const _20b58a62 = () => interopDefault(import('../pages/c/_chave.vue' /* webpackChunkName: "pages/c/_chave" */))
const _9758d4de = () => interopDefault(import('../pages/dashboard/_chave.vue' /* webpackChunkName: "pages/dashboard/_chave" */))
const _2dfb1658 = () => interopDefault(import('../pages/index.vue' /* webpackChunkName: "pages/index" */))

const emptyFn = () => {}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: '/',
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/acceptable-use-policy",
    component: _4bf55568,
    name: "acceptable-use-policy"
  }, {
    path: "/admin",
    component: _be9dc5d0,
    name: "admin"
  }, {
    path: "/appsumo",
    component: _35f02fee,
    name: "appsumo"
  }, {
    path: "/booked",
    component: _3c80fa96,
    name: "booked"
  }, {
    path: "/cadastro",
    component: _2fc3a7a3,
    name: "cadastro"
  }, {
    path: "/contact-us",
    component: _0cce6818,
    name: "contact-us"
  }, {
    path: "/cookie-policy",
    component: _f7eb7cf8,
    name: "cookie-policy"
  }, {
    path: "/customer-support",
    component: _175dcc66,
    name: "customer-support"
  }, {
    path: "/dashboard",
    component: _72270b1d,
    name: "dashboard"
  }, {
    path: "/easy",
    component: _9feffd22,
    name: "easy"
  }, {
    path: "/edit",
    component: _224e3c18,
    name: "edit"
  }, {
    path: "/hosting-guide",
    component: _0769801c,
    name: "hosting-guide"
  }, {
    path: "/landing",
    component: _afda8cc6,
    name: "landing"
  }, {
    path: "/login",
    component: _10ba8d22,
    name: "login"
  }, {
    path: "/next-steps",
    component: _781465fa,
    name: "next-steps"
  }, {
    path: "/privacy-policy",
    component: _7de68bc4,
    name: "privacy-policy"
  }, {
    path: "/success",
    component: _3546654c,
    name: "success"
  }, {
    path: "/terms-and-conditions",
    component: _fe62773e,
    name: "terms-and-conditions"
  }, {
    path: "/terms-of-service",
    component: _4b77c372,
    name: "terms-of-service"
  }, {
    path: "/thank-you",
    component: _60303945,
    name: "thank-you"
  }, {
    path: "/training",
    component: _28c9bf47,
    name: "training"
  }, {
    path: "/admin/login",
    component: _6a58c02f,
    name: "admin-login"
  }, {
    path: "/c/:chave?",
    component: _20b58a62,
    name: "c-chave"
  }, {
    path: "/dashboard/:chave",
    component: _9758d4de,
    name: "dashboard-chave"
  }, {
    path: "/",
    component: _2dfb1658,
    name: "index"
  }],

  fallback: false
}

export function createRouter (ssrContext, config) {
  const base = (config.app && config.app.basePath) || routerOptions.base
  const router = new Router({ ...routerOptions, base  })

  // TODO: remove in Nuxt 3
  const originalPush = router.push
  router.push = function push (location, onComplete = emptyFn, onAbort) {
    return originalPush.call(this, location, onComplete, onAbort)
  }

  const resolve = router.resolve.bind(router)
  router.resolve = (to, current, append) => {
    if (typeof to === 'string') {
      to = normalizeURL(to)
    }
    return resolve(to, current, append)
  }

  return router
}
