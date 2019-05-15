<template>
  <div>
    <div class="crumb">
      <div class="w">
        <div class="crumb-con">
          <a class="link" href="/">首页</a>
          <span>></span>
          <span class="link-text">{{$route.meta.name}}</span>
        </div>
      </div>
    </div>
    <div class="cart-wrap w">
      <div>
        <div id="cart_table" v-show="cartList.length !== 0">
          <div class="cart-header">
            <table class="cart-table">
              <tr>
                <th class="cart-cell cell-check">
                  <label class="cart-label">
                    <input type="checkbox" class="cart-select-all" v-model="checkedAllFlag" @click="editCheckAll"/>
                    <span>全选</span>
                  </label>
                </th>
                <th class="cart-cell cell-info">商品信息</th>
                <th class="cart-cell cell-price">单价</th>
                <th class="cart-cell cell-count">数量</th>
                <th class="cart-cell cell-total">合计</th>
                <th class="cart-cell cell-opera">操作</th>
              </tr>
            </table>
          </div>
          <div class="cart-list">
            <table class="cart-table" data-product-id="productId">
              <tr v-for="cart in cartList" :key="cart.productId">
                <td class="cart-cell cell-check">
                  <label class="cart-label">
                    <input type="checkbox" v-model="cart.checked" class="cart-select" @click="editCart('check',cart)"/>
                  </label>
                </td>
                <td class="cart-cell cell-img">
                  <a class="link" @click="loadPage('goods-detail', {'productId': cart.productId})">
                    <img class="p-img" :src="cart.productImg"/>
                  </a>
                </td>
                <td class="cart-cell cell-info">
                  <a class="link" @click="loadPage('goods-detail', {'productId': cart.productId})">{{cart.productName}}</a>
                </td>
                <td class="cart-cell cell-price">{{cart.salePrice | formatMoney}}</td>
                <td class="cart-cell cell-count">
                  <input-number :num="cart.productNum"
                           :id="cart.productId"
                           :checked="cart.checked"
                           :limit="cart.productStock"
                           @edit-num="editNumber"/>
                </td>
                <td class="cart-cell cell-total">{{cart.salePrice * cart.productNum | formatMoney}}</td>
                <td class="cart-cell cell-opera">
                  <span class="link cart-delete" @click="delCart(cart.productId)">删除</span>
                </td>
              </tr>
            </table>
          </div>
          <div class="cart-footer">
            <div class="select-con">
              <label>
                <input type="checkbox" class="cart-select-all" v-model="checkedAllFlag" @click="editCheckAll"/>
                <span>全选</span>
              </label>
            </div>
            <div class="delete-con">
              <span class="link delete-selected">
              <i class="fa fa-trash-o"></i>
              <span @click="delChecked">删除选中</span>
              </span>
            </div>
            <div class="submit-con">
              <div>
                <span>已选择<i v-text="checkNum"></i>件商品</span>
                <span>总价：</span>
                <span class="submit-total">￥<i v-text="checkPrice"></i></span>
                <span @click="goConfirm" class="btn btn-submit">去结算</span>
              </div>
            </div>
          </div>
        </div>
        <p v-show="cartList.length === 0" class="err-tip">
          <span>您的购物车空空如也，</span>
          <a style="cursor: pointer;" @click="goHome">立即去购物</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { getCartList, cartEdit, editCheckAll, cartDel, delCartChecked } from '@/api/goods'
import { getStore } from '@/util/storage'
import { mapMutations, mapState } from 'vuex'
import InputNumber from '@/components/inputNumber'

export default {
  data () {
    return {
      checkedAllFlag: '',
      userId: 0
    }
  },
  components: {
    InputNumber
  },
  mounted () {
    this.userId = getStore('userId')
    this.INIT_BUYCART()
    this.isCheckAll()
  },
  computed: {
    ...mapState(['login', 'cartList']),
    // 计算总数量
    totalNum () {
      var totalNum = 0
      this.cartList && this.cartList.forEach(item => {
        totalNum += (item.productNum)
      })
      return Number(totalNum)
    },
    // 选中的总价格
    checkPrice () {
      var totalPrice = 0
      this.cartList && this.cartList.forEach(item => {
        if (item.checked === 'checked') {
          totalPrice += (item.productNum * item.salePrice)
        }
      })
      return totalPrice
    },
    // 选中的商品数量
    checkNum () {
      var checkNum = 0
      this.cartList && this.cartList.forEach(item => {
        if (item.checked === 'checked') {
          checkNum += (item.productNum)
        }
      })
      return checkNum
    }
  },
  methods: {
    ...mapMutations([
      'INIT_BUYCART', 'EDIT_CART'
    ]),
    goodsDetails (id) {
      this.loadPage('goods-detail', {'productId': id})
    },
    goConfirm () {
      if (this.login) {
        this.loadPage('order-confirm')
      } else {
        this.loadPage('Login')
      }
    },
    isCheckAll () {
      this.checkedAllFlag = 'checked'
      var carts = this.cartList
      if (carts) {
        for (var i in carts) {
          if (typeof carts[i].checked === 'undefined' || carts[i].checked === '') {
            this.checkedAllFlag = ''
          }
        }
      }
    },
    // 全选
    editCheckAll (event) {
      let checkedAll = event.currentTarget.checked
      editCheckAll({userId: this.userId, checked: checkedAll}).then(res => {
        this.EDIT_CART({checked: checkedAll})
      })
    },
    // 修改购物车
    _cartEdit (userId, productId, productNum, checked) {
      cartEdit({userId, productId, productNum, checked}).then(res => {
        if (res.success === true) {
          this.EDIT_CART({productId, productNum, checked})
          this.isCheckAll()
        }
      })
    },
    // 修改购物车
    editCart (type, item) {
      if (type && item) {
        let checked = item.checked
        let productId = item.productId
        let productNum = item.productNum
        // 勾选
        if (type === 'check') {
          let newChecked = (checked ? '' : 'checked')
          this._cartEdit(this.userId, productId, productNum, newChecked)
        }
      } else {
        console.log('缺少所需参数')
      }
    },
    editNumber (productNum, productId, checked) { // 数量
      this._cartEdit(this.userId, productId, productNum, checked)
    },
    // 清空购物车
    delCart (productId) {
      if (this.login) { // 登陆了
        cartDel({userId: this.userId, productId}).then(res => {
          this.EDIT_CART({productId})
        })
      } else {
        this.EDIT_CART({productId})
      }
    },
    delChecked () {
      getCartList({userId: getStore('userId')}).then(res => {
        if (res.success === true) {
          res.data.forEach(item => {
            if (item.checked === 'checked') {
              let productId = item.productId
              this.EDIT_CART({productId})
            }
          })
        }
      })
      delCartChecked({userId: this.userId}).then(res => {
        if (res.success !== true) {
          this.$message.error({ showClose: true, message: res.message, duration: 2000 })
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.cart-table{
    width: 100%;
    border-collapse: collapse;
    border: 1px solid #ebebeb;
    margin-bottom: 10px;
}
/* header */
.cart-header{
    background: #eee;
}
.cart-header .cart-cell{
    height: 40px;
    line-height: 40px;
}
.cart-table .cell-check{
    width: 6%;
    text-align: left;
    padding-left: 20px;
}
.cart-table .cell-img{
    width: 10%;
    text-align: left;
}
.cart-table .cell-img .p-img{
    margin: 10px 0;
    width: 80px;
    height: 80px;
    border: 1px solid #ddd;
}
.cart-table .cell-info{
    width: 35%;
    text-align: left;
}
.cart-header .cell-info{
    width: 45%;
    padding-left: 106px;
}
.cart-table .cell-price{
    width: 10%;
    text-align: center;
}
.cart-table .cell-count{
    width: 15%;
    text-align: center;
}
.cart-table .cell-count .count-input{
    width: 60px;
    height: 28px;
    line-height: 28px;
    border: 1px solid #ddd;
    text-align: center;
    vertical-align: middle;
    outline: none;
    color: #333;
}
.cart-table .cell-count .count-btn{
    display: inline-block;
    width: 20px;
    height: 28px;
    line-height: 28px;
    border: 1px solid #ddd;
    vertical-align: middle;
    cursor: pointer;
    background: #fff;
    -moz-user-select : none;
    -webkit-user-select : none;
    -ms-user-select : none;
    user-select : none;
}
.cart-table .cell-total{
    width: 14%;
    text-align: center;
    font-weight: bold;
}
.cart-table .cell-opera{
    width: 10%;
    text-align: center;
}

/* footer */
.cart-footer{
    position: relative;
    line-height: 50px;
    background: #eee;
    overflow: hidden;
}
.cart-footer .select-con{
    float: left;
    padding-left: 20px;
}
.cart-footer .delete-con{
    float: left;
    margin-left: 20px;
}
.cart-footer .submit-con{
    float: right;
}
.cart-footer .submit-con .submit-total{
    font-size: 18px;
    color: #c60023;
    font-weight: bold;
    margin-right: 30px;
    vertical-align: middle;
}
.cart-footer .submit-con .btn-submit{
    width: 80px;
    text-align: center;
    height: 50px;
    line-height: 50px;
}
/* 错误信息 */
.err-tip{
    height: 60px;
    line-height: 60px;
    color: #f60;
    font-size: 16px;
    font-weight: bold;
    text-align: center;
    background: #eee;
}
</style>
