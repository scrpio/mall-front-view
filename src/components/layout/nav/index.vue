<template>
  <div class="nav">
    <div class="w">
      <div v-if="login" class="user">
        <el-dropdown>
          <span class="el-dropdown-link" style="color: #999">
            你好，
            <a class="link" @click.prevent="loadPage('user-center')">{{userInfo.info.username}}</a>
          </span>
          <el-dropdown-menu slot="dropdown">
            <div class="user-item">
              <img class="avatar" :src="userInfo.info.file"/>
              <p class="name">{{userInfo.info.username}}</p>
            </div>
            <el-dropdown-item>
              <router-link to="/center">个人信息</router-link>
            </el-dropdown-item>
            <el-dropdown-item>
              <router-link to="/passUpdate">修改密码</router-link>
            </el-dropdown-item>
            <el-dropdown-item>
              <router-link to="/order">我的订单</router-link>
            </el-dropdown-item>
            <el-dropdown-item>
              <router-link to="/address">收货地址</router-link>
            </el-dropdown-item>
            <el-dropdown-item>
              <a href="javascript:void(0)" @click="_loginOut">退出</a>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <a href="javascript:void(0)" class="link" @click="_loginOut">退出</a>
      </div>
      <div v-else class="user">
        <a href="javascript:void(0)" class="link" @click="goSignIn">请登录</a>
        <a href="javascript:void(0)" class="link" @click="goSignUp">免费注册</a>
      </div>
      <ul class="nav-list">
        <li class="nav-item">
          <a class="link" @click="goHome">首页</a>
        </li>
        <li class="nav-item nav-cart" @mouseover="cartShowState(true)" @mouseout="cartShowState(false)">
          <a href="javascript:void(0)" class="link">
            <i class="el-icon-shopping-cart-2"></i>
            购物车(<span class="cart-count">{{totalNum}}</span>)
          </a>
          <!--购物车显示块-->
          <div class="nav-cart-wrapper" v-show="showCart">
            <div class="nav-cart-list">
              <div class="full" v-show="totalNum">
                <!--购物列表-->
                <div class="nav-cart-items">
                  <ul>
                    <li v-for="(item,i) in cartList" :key="i">
                      <div class="cart-item">
                        <div class="cart-item-inner">
                          <a @click="loadPage('goods-detail', {'productId': item.productId})">
                            <div class="item-thumb">
                              <img :src="item.productImg">
                            </div>
                            <div class="item-desc">
                              <div class="cart-cell">
                                <h4><a href="javascript:void(0)" v-text="item.productName" class="link"></a></h4>
                                <h6>
                                  <span class="price-icon">¥</span>
                                  <span class="price-num">{{item.salePrice}}</span>
                                  <span class="item-num">x {{item.productNum}}</span>
                                </h6>
                              </div>
                            </div>
                          </a>
                          <a href="javascript:void(0)" class="del-btn" title="删除" @click="delGoods(item.productId)">
                            <i class="el-icon-error icon-btn"/>
                          </a>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
                <!--总件数-->
                <div class="nav-cart-total">
                  <p>共 <strong>{{totalNum}}</strong> 件商品</p>
                  <h5>合计：<span class="price-icon">¥</span><span class="price-num">{{totalPrice}}</span></h5>
                  <h6><a class="btn" @click="goCart">去购物车</a></h6>
                </div>
              </div>
              <div v-show="!totalNum" class="cart-empty">
                <p><i class="el-icon-shopping-cart-2"/></p>
                <p>您的购物车竟然是空的!</p>
              </div>
            </div>
          </div>
        </li>
        <li class="nav-item">
          <a class="link" @click.prevent="loadPage('user-order')">我的订单</a>
        </li>
        <li class="nav-item">
          <a class="link" href="javascript:void(0)">售后服务</a>
        </li>
        <li class="nav-item">
          <a class="link" href="javascript:void(0)">关于我们</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import { loginOut } from '@/api/index'
import { getStore, setStore, removeStore } from '@/util/storage'
import { getCartList, cartDel } from '@/api/goods'

export default {
  data () {
    return {
      token: ''
    }
  },
  methods: {
    ...mapMutations([ 'RECORD_USERINFO', 'EDIT_CART', 'SHOW_CART', 'INIT_BUYCART' ]),
    _loginOut () {
      let params = {
        token: this.token
      }
      loginOut(params).then(res => {
        removeStore('buyCart')
        window.location.href = '/'
      })
    },
    cartShowState (state) {
      this.SHOW_CART({showCart: state})
    },
    // 登陆时获取一次购物车商品
    _getCartList () {
      getCartList({userId: getStore('userId')}).then(res => {
        if (res.success === true) {
          setStore('buyCart', res.data)
        }
        // 重新初始化一次本地数据
      }).then(this.INIT_BUYCART)
    },
    delGoods (productId) {
      if (this.login) { // 登陆了
        cartDel({userId: getStore('userId'), productId}).then(res => {
          this.EDIT_CART({productId})
        })
      } else {
        this.EDIT_CART({productId})
      }
    },
    goCart () {
      this.loadPage('user-cart')
      this.SHOW_CART({showCart: false})
    }
  },
  computed: {
    ...mapState(['login', 'userInfo', 'showCart', 'cartList']),
    // 计算价格
    totalPrice () {
      var totalPrice = 0
      this.cartList && this.cartList.forEach(item => {
        totalPrice += (item.productNum * item.salePrice)
      })
      return totalPrice
    },
    // 计算数量
    totalNum () {
      var totalNum = 0
      this.cartList && this.cartList.forEach(item => {
        totalNum += (item.productNum)
      })
      return totalNum
    }
  },
  mounted () {
    this.token = getStore('token')
    if (this.login) {
      this._getCartList()
    } else {
      this.INIT_BUYCART()
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss">
.user-item {
  padding: 0 20px;
  margin: 0;
  font-size: 14px;
  color: #606266;
  text-align: center;
  border-bottom: 1px solid #f5f5f5;
}
.avatar {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  border: 1px solid #DCDFE6;
}
.name {
  font-size: 12px;
  color: #757575;
}
.nav-cart {
  position: relative;
  display: block;
}
.nav-cart-wrapper {
  position: absolute;
  right: 0;
  width: 360px;
  padding-top: 8px;
  z-index: 99;
}
.nav-cart-list {
  padding: 0;
  width: 100%;
  background: #fff;
  position: relative;
}
.nav-cart-list:before {
  content: "";
  position: absolute;
  top: -7px;
  right: 34px;
  width: 20px;
  height: 8px;
  margin-left: -10px;
  background: url(../../../assets/images/account-icon.png) no-repeat -49px -43px;
  background-size: 240px 107px;
}
.nav-cart-list li:first-child .cart-item:first-child {
  border-top: none;
  overflow: hidden;
}
.full {
  overflow: hidden;
}
.nav-cart-items {
  max-height: 363px;
  overflow-x: hidden;
  overflow-y: auto;
}
.cart-item {
  height: 120px;
  width: 100%;
  overflow: hidden;
  border-top: 1px solid #f0f0f0;
}
.cart-item:hover {
  background: #fcfcfc;
}
.cart-item-inner {
  padding: 20px;
  position: relative;
}
.item-thumb {
  position: relative;
  float: left;
  width: 80px;
  height: 80px;
  border-radius: 3px;
  img {
    width: 80px;
    height: 80px;
    display: block;
    border-radius: 3px;
    overflow: hidden;
  }
}
.item-thumb:before {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 2;
  border: 1px solid #f0f0f0;
  border: 0 solid transparent;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, .06);
  border-radius: 3px;
}
.item-desc {
  margin-left: 98px;
  display: table;
  h4 {
    color: #000;
    width: 185px;
    overflow: hidden;
    word-break: keep-all;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: 14px;
    line-height: 16px;
    margin-bottom: 10px;
  }
  .attrs span {
    position: relative;
    display: inline-block;
    margin-right: 20px;
    font-size: 14px;
    line-height: 14px;
    color: #999;
  }
  .attrs span:last-child {
    margin-right: 0;
  }
  h6 {
    color: #cacaca;
    font-size: 12px;
    line-height: 14px;
    margin-top: 20px;
    span {
      display: inline-block;
      font-weight: 700;
      color: #cacaca;
    }
    .price-icon, .price-num {
      color: #d44d44;
    }
    .price-num {
      margin-left: 5px;
      font-size: 14px;
    }
    .item-num {
      margin-left: 10px;
    }
  }
}
.cart-cell {
  display: table-cell;
  vertical-align: middle;
}
.price-icon {
  color: #d44d44;
}
.price-num {
  margin-left: 5px;
  font-size: 14px;
}
.item-num {
  margin-left: 10px;
}
.del-btn {
  overflow: hidden;
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  visibility: hidden;
}
a.del-btn {
  border: none;
}
.cart-item:hover .del-btn {
  visibility: visible;
}
.nav-cart-total {
  box-sizing: content-box;
  position: relative;
  padding: 20px;
  height: 40px;
  background: #fafafa;
  border-top: 1px solid #f0f0f0;
  box-shadow: inset 0 -1px 0 hsla(0, 0%, 100%, .5), 0 -3px 8px rgba(0, 0, 0, .04);
  background: -webkit-linear-gradient(#fafafa, #f5f5f5);
  background: linear-gradient(#fafafa, #f5f5f5);
  p {
    margin-bottom: 4px;
    line-height: 16px;
    font-size: 12px;
    color: #c1c1c1;
  }
  h5 {
    line-height: 20px;
    font-size: 14px;
    color: #6f6f6f;
    span {
      font-size: 18px;
      color: #de4037;
      display: inline-block;
      font-weight: 700;
    }
    span:first-child {
      font-size: 12px;
      margin-right: 5px;
    }
  }
  h6 {
    position: absolute;
    right: 20px;
    top: 20px;
    width: 108px;
  }
}
.cart-empty {
  text-align: center;
  vertical-align: middle;
  padding-top: 60px;
  padding-bottom: 60px;
  p {
    color: #333;
    font-size: 16px;
    i {
      color: #aaa;
      font-size: 80px;
    }
  }
}
</style>
