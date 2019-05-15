import {
  INIT_BUYCART,
  ADD_CART,
  GET_USERINFO,
  RECORD_USERINFO,
  ADD_ANIMATION,
  SHOW_CART,
  REDUCE_CART,
  EDIT_CART
} from './mutations_types'

export default {
  // 网页初始化时从本地缓存获取购物车数据
  init_buycart: ({commit}) => {
    commit(INIT_BUYCART)
  },
  // 加入购物车
  add_cart: ({commit}) => {
    commit(ADD_CART)
  },
  // 获取用户信息
  get_userinfo: ({commit}) => {
    commit(GET_USERINFO)
  },
  // 记录用户信息
  record_userinfo: ({commit}) => {
    commit(RECORD_USERINFO)
  },
  // 加入购物车动画
  add_animation: ({commit}) => {
    commit(ADD_ANIMATION)
  },
  // 是否显示购物车
  show_cart: ({commit}) => {
    commit(SHOW_CART)
  },
  // 移除商品
  reduce_cart: ({commit}) => {
    commit(REDUCE_CART)
  },
  // 修改购物车
  edit_cart: ({commit}) => {
    commit(EDIT_CART)
  }
}
