import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: () => import('@/views/index.vue'),
      redirect: '/home',
      children: [
        {
          path: 'home',
          name: 'Home',
          meta: {
            requestAuth: false,
            hideMainHeader: false
          },
          component: () => import('@/views/home/index.vue')
        },
        {
          path: 'list',
          name: 'goods-list',
          meta: {
            name: '商品列表',
            requestAuth: false,
            hideMainHeader: false
          },
          component: () => import('@/views/goods/list/index.vue')
        },
        {
          path: 'detail',
          name: 'goods-detail',
          meta: {
            name: '商品详情',
            requestAuth: false,
            hideMainHeader: false
          },
          component: () => import('@/views/goods/detail/index.vue')
        },
        {
          path: 'search',
          name: 'Search',
          meta: {
            requestAuth: false,
            hideMainHeader: false
          },
          component: () => import('@/views/search/index.vue')
        },
        {
          path: '/refreshsearch',
          name: 'refresh-search',
          meta: {
            requestAuth: false,
            hideMainHeader: false
          },
          component: () => import('@/views/search/refreshsearch.vue')
        },
        {
          path: 'result',
          name: 'oper-result',
          meta: {
            name: '操作结果',
            hideMainHeader: true
          },
          component: () => import('@/views/result')
        },
        {
          path: 'center',
          name: 'user-center',
          meta: {
            name: '个人中心',
            requestAuth: true,
            hideMainHeader: false
          },
          component: () => import('@/views/member/center/index.vue')
        },
        {
          path: 'passUpdate',
          name: 'user-pass-update',
          meta: {
            name: '修改密码',
            requestAuth: true,
            hideMainHeader: false
          },
          component: () => import('@/views/member/passUpdate/index.vue')
        },
        {
          path: 'cart',
          name: 'user-cart',
          meta: {
            name: '我的购物车',
            requestAuth: false,
            hideMainHeader: false
          },
          component: () => import('@/views/member/cart/index.vue')
        },
        {
          path: 'order',
          name: 'user-order',
          meta: {
            name: '我的订单',
            requestAuth: true,
            hideMainHeader: false
          },
          component: () => import('@/views/member/order/index.vue')
        },
        {
          path: 'address',
          name: 'user-address',
          meta: {
            name: '收货地址',
            requestAuth: true,
            hideMainHeader: false
          },
          component: () => import('@/views/member/address/index.vue')
        },
        {
          path: 'confirm',
          name: 'order-confirm',
          meta: {
            name: '订单确认',
            requestAuth: true,
            hideMainHeader: false
          },
          component: () => import('@/views/order/confirm/index.vue')
        },
        {
          path: 'payment',
          name: 'order-payment',
          meta: {
            name: '支付订单',
            requestAuth: true,
            hideMainHeader: false
          },
          component: () => import('@/views/order/payment/index.vue')
        },
        {
          path: 'orderDetail',
          name: 'order-detail',
          meta: {
            name: '订单详情',
            requestAuth: true,
            hideMainHeader: false
          },
          component: () => import('@/views/order/detail/index.vue')
        }
      ]
    },
    {
      path: 'login',
      name: 'Login',
      meta: {
        requestAuth: false,
        hideMainHeader: false
      },
      component: () => import('@/views/user/login.vue')
    },
    {
      path: 'register',
      name: 'Register',
      meta: {
        requestAuth: false,
        hideMainHeader: false
      },
      component: () => import('@/views/user/register.vue')
    },
    {
      path: '*',
      name: 'error',
      component: () => import('@/views/index.vue'),
      redirect: '/404',
      children: [
        {
          path: '404',
          name: 'ErrorPage',
          meta: {
            requestAuth: false,
            hideMainHeader: false
          },
          component: () => import('@/views/error/404.vue')
        }
      ]
    }
  ]
})
