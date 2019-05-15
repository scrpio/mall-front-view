import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import action from './action'
Vue.use(Vuex)

const state = {
  login: false,
  userInfo: null,
  cartList: [],
  showMoveImg: false,
  elLeft: 0,
  elTop: 0,
  moveImgUrl: null,
  cartPositionT: 0,
  cartPositionL: 0,
  receiveInCart: false,
  showCart: false
}

export default new Vuex.Store({
  state,
  action,
  mutations
})
