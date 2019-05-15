// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/'

import { userInfo } from './api'
import { getStore } from './util/storage'

import ElementUI from 'element-ui'
import Mixin from './mixins'
import filters from './filters'
import VueLazyload from 'vue-lazyload'

import '@/assets/styles/layout.scss'
import '@/assets/styles/main.scss'
import '@/assets/styles/login.scss'
import '@/assets/styles/member.scss'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI)
Vue.mixin(Mixin)
Object.keys(filters).forEach(k => Vue.filter(k, filters[k]))
Vue.use(VueLazyload, {
  loading: 'static/loading-svg/loading-spinning-bubbles.svg',
  try: 3 // default 1
})
Vue.config.productionTip = false

router.beforeEach(function (to, from, next) {
  let params = {
    token: getStore('token')
  }
  userInfo(params).then(res => {
    if (res.data.state !== 1) {
      if (to.meta.requestAuth) {
        next('/login')
      } else {
        next()
      }
    } else {
      store.commit('RECORD_USERINFO', {info: res.data})
      if (to.path === '/login') {
        next({path: '/'})
      }
      next()
    }
  })
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})
