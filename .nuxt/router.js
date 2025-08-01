import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _23665b70 = () => interopDefault(import('..\\pages\\acceptable-use-policy\\index.vue' /* webpackChunkName: "pages/acceptable-use-policy/index" */))
const _523ecd64 = () => interopDefault(import('..\\pages\\appsumo\\index.vue' /* webpackChunkName: "pages/appsumo/index" */))
const _2a0b26d9 = () => interopDefault(import('..\\pages\\booked\\index.vue' /* webpackChunkName: "pages/booked/index" */))
const _550cbd54 = () => interopDefault(import('..\\pages\\contact-us\\index.vue' /* webpackChunkName: "pages/contact-us/index" */))
const _6e570590 = () => interopDefault(import('..\\pages\\cookie-policy\\index.vue' /* webpackChunkName: "pages/cookie-policy/index" */))
const _fbad28fe = () => interopDefault(import('..\\pages\\customer-support\\index.vue' /* webpackChunkName: "pages/customer-support/index" */))
const _42ac04c2 = () => interopDefault(import('..\\pages\\easy\\index.vue' /* webpackChunkName: "pages/easy/index" */))
const _58b34c8a = () => interopDefault(import('..\\pages\\hosting-guide\\index.vue' /* webpackChunkName: "pages/hosting-guide/index" */))
const _5a194098 = () => interopDefault(import('..\\pages\\next-steps\\index.vue' /* webpackChunkName: "pages/next-steps/index" */))
const _e4fe32ac = () => interopDefault(import('..\\pages\\privacy-policy\\index.vue' /* webpackChunkName: "pages/privacy-policy/index" */))
const _7b5de0a0 = () => interopDefault(import('..\\pages\\success\\index.vue' /* webpackChunkName: "pages/success/index" */))
const _0d5766ed = () => interopDefault(import('..\\pages\\terms-and-conditions\\index.vue' /* webpackChunkName: "pages/terms-and-conditions/index" */))
const _0fd7f67c = () => interopDefault(import('..\\pages\\terms-of-service\\index.vue' /* webpackChunkName: "pages/terms-of-service/index" */))
const _5874e117 = () => interopDefault(import('..\\pages\\thank-you\\index.vue' /* webpackChunkName: "pages/thank-you/index" */))
const _22578e47 = () => interopDefault(import('..\\pages\\training\\index.vue' /* webpackChunkName: "pages/training/index" */))
const _1cf4b7a1 = () => interopDefault(import('..\\pages\\index.vue' /* webpackChunkName: "pages/index" */))

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
    component: _23665b70,
    name: "acceptable-use-policy"
  }, {
    path: "/appsumo",
    component: _523ecd64,
    name: "appsumo"
  }, {
    path: "/booked",
    component: _2a0b26d9,
    name: "booked"
  }, {
    path: "/contact-us",
    component: _550cbd54,
    name: "contact-us"
  }, {
    path: "/cookie-policy",
    component: _6e570590,
    name: "cookie-policy"
  }, {
    path: "/customer-support",
    component: _fbad28fe,
    name: "customer-support"
  }, {
    path: "/easy",
    component: _42ac04c2,
    name: "easy"
  }, {
    path: "/hosting-guide",
    component: _58b34c8a,
    name: "hosting-guide"
  }, {
    path: "/next-steps",
    component: _5a194098,
    name: "next-steps"
  }, {
    path: "/privacy-policy",
    component: _e4fe32ac,
    name: "privacy-policy"
  }, {
    path: "/success",
    component: _7b5de0a0,
    name: "success"
  }, {
    path: "/terms-and-conditions",
    component: _0d5766ed,
    name: "terms-and-conditions"
  }, {
    path: "/terms-of-service",
    component: _0fd7f67c,
    name: "terms-of-service"
  }, {
    path: "/thank-you",
    component: _5874e117,
    name: "thank-you"
  }, {
    path: "/training",
    component: _22578e47,
    name: "training"
  }, {
    path: "/",
    component: _1cf4b7a1,
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
