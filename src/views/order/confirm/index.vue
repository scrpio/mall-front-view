<template>
  <div>
    <div class="crumb">
      <div class="w">
        <div class="crumb-con">
          <a class="link" href="javascript:void(0)" @click.prevent="goHome">首页</a>
          <span>></span>
          <span class="link-text">{{$route.meta.name}}</span>
        </div>
      </div>
    </div>
    <div class="confirm-wrap w">
      <div class="panel panel-color panel-padding">
        <h1 class="panel-title panel-padding">收货地址</h1>
        <div class="panel-body address-list panel-padding">
          <template v-if="addList.length">
            <address-list :addressList="addList" :selectAddress="selectAddress"/>
          </template>
        </div>
      </div>
      <div class="panel panel-color panel-padding">
        <h1 class="panel-title panel-padding">商品清单</h1>
        <div class="panel-body product-con panel-padding">
          <product-list :orderItemList="orderItemList"/>
        </div>
        <div class="submit-con" v-show="orderItemList.length > 0">
          <span>订单总价:</span>
          <span class="submit-total">￥{{checkPrice}}</span>
          <span class="btn order-submit" @click="createOrderDoc">提交订单</span>
        </div>
      </div>
    </div>
    <div class="modal-wrap">
    </div>
  </div>
</template>

<script>
import ProductList from '@/components/productList'
import AddressList from '@/components/addressList'
import { getCartList, addressList, submitOrder, cartDel } from '@/api/goods'
import { getStore } from '@/util/storage'
import { mapMutations, mapState } from 'vuex'

export default {
  data () {
    return {
      userId: '',
      addList: [],
      orderItemList: [],
      addressData: {
        addressId: '',
        userName: '',
        tel: '',
        streetName: '',
        acquiescence: false
      }
    }
  },
  computed: {
    ...mapState(['login']),
    // 选中的总价格
    checkPrice () {
      let totalPrice = 0
      this.orderItemList && this.orderItemList.forEach(item => {
        if (item.checked === 'checked') {
          totalPrice += (item.productNum * item.salePrice)
        }
      })
      return totalPrice
    }
  },
  created () {
    this.userId = getStore('userId')
    this.queryAddressList()
    this.queryOrderItemList()
  },
  methods: {
    ...mapMutations(['EDIT_CART']),
    selectAddress (address) {
      console.info(address)
      this.addressData = address
    },
    queryAddressList () {
      addressList({userId: this.userId}).then(res => {
        let data = res.data
        if (data.length) {
          this.addList = res.data
          this.addressId = res.data[0].addressId || '1'
        } else {
          this.addList = []
        }
      })
    },
    queryOrderItemList () {
      getCartList({userId: this.userId}).then(res => {
        var list = res.data
        list.forEach(item => {
          if (item.checked === 'checked') {
            this.orderItemList.push(item)
          }
        })
      })
    },
    createOrderDoc () {
      if (!this.addressId) {
        this.$message.error({ showClose: true, message: '请选择收货地址', duration: 2000 })
        return
      }
      var array = []
      for (var i = 0; i < this.orderItemList.length; i++) {
        if (this.orderItemList[i].checked === 'checked') {
          array.push(this.orderItemList[i])
        }
      }
      let params = {
        userId: this.userId,
        tel: this.addressData.tel,
        userName: this.addressData.userName,
        streetName: this.addressData.streetName,
        goodsList: array,
        orderTotal: this.checkPrice
      }
      submitOrder(params).then(res => {
        if (res.success === true) {
          for (var i = 0; i < array.length; i++) {
            this.delGoods(array[i].productId)
          }
          this.loadPage('order-payment', {'orderId': res.data})
        } else {
          this.loadPage('user-order')
        }
      })
    },
    delGoods (productId) {
      if (this.login) { // 登陆了
        cartDel({userId: getStore('userId'), productId}).then(res => {
          this.EDIT_CART({productId})
        })
      } else {
        this.EDIT_CART({productId})
      }
    }
  },
  components: {
    ProductList,
    AddressList
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
/* 订单提交 */
.submit-con{
    background: #eee;
    text-align: right;
}
.submit-con .submit-total{
    margin-right: 20px;
    font-size: 18px;
    color: #c60023;
    font-weight: bold;
    vertical-align: middle;
}
.submit-con .order-submit{
    height: 50px;
    line-height: 50px;
    width: 100px;
    text-align: center;
}

/* modal部分 */
.modal{
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: #eee;
    background: rgba(0,0,0,.4);
    z-index: 1000;
    overflow-x: hidden;
    overflow-y: auto;
}
.modal .modal-container{
    width: 700px;
    margin: 50px auto;
    background: #fff;
    border-radius: 2px;
}
.modal .modal-container .modal-header{
    position: relative;
    padding: 15px;
    border-bottom: 1px solid #ccc;
}
.modal .modal-container .modal-header .modal-title{
    font-size: 14px;
}
.modal .modal-container .modal-header .close{
    position: absolute;
    padding: 10px;
    right: 10px;
    top: 10px;
    cursor: pointer;
}
.modal .modal-container .modal-body{
    padding: 15px;
}

/* form部分 */
.form .form-line{
    margin: 5px 0;
    overflow: hidden;
}
.form .form-line .label{
    display: block;
    float: left;
    width: 85px;
    text-align: right;
    height: 30px;
    line-height: 30px;
    margin-right: 10px;
    cursor: pointer;
}
.form .form-line .label .required{
    color: red;
}
.form .form-line .form-item{
    padding: 0 5px;
    height: 30px;
    line-height: 30px;
    outline: none;
    margin-right: 10px;
}
.form .form-line .btn{
    margin-left: 95px;
    height: 30px;
    line-height: 30px;
    font-size: 13px;
}
</style>
