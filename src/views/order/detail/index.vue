<template>
    <div class="container">
    <div class="w">
      <div class="sub">
        <nav-side></nav-side>
      </div>
      <div class="main">
        <div class="mod-main">
          <div class="mc">
            <div class="panel-title">订单信息</div>
            <div class="panel-body">
              <div class="order-info">
                <div class="text-line">
                  <p class="text">订单号：{{orderId}}</p>
                </div>
                <div class="text-line">
                  <p class="text">创建时间：{{orderData.createDate}}</p>
                </div>
                <div class="text-line">
                  <span class="text">收件人：{{address.userName}}</span>
                </div>
                <div class="text-line">
                  <span class="text">订单状态：{{Number(orderData.orderStatus) | getOrderStatusName}}</span>
                </div>
                <div class="text-line">
                  <span class="text">支付方式：{{Number(orderData.paymentType) | getPaymentType}}</span>
                </div>
                <div class="text-line" v-if="orderData.orderStatus === '0'">
                  <a class="btn" @click="loadPage('order-payment', {'orderId': orderId})">去支付</a>
                  <a class="btn order-cancel" @click="_cancelOrder(orderId)">取消订单</a>
                </div>
              </div>
            </div>
            <div class="panel-title">商品清单</div>
            <div class="panel-body">
              <table class="product-table">
                <tr>
                  <th class="cell-th cell-img">&nbsp;</th>
                  <th class="cell-th cell-info">商品信息</th>
                  <th class="cell-th cell-price">单价</th>
                  <th class="cell-th cell-count">数量</th>
                  <th class="cell-th cell-total">小计</th>
                </tr>
                <tr v-for="(detail, index) in goodsList" :key="index">
                  <td class="cell cell-img">
                    <a href="javascript:void(0)" @click="goProductDetailPage(detail.productId)" target="_blank">
                      <img class="p-img" :src="detail.productImg"/>
                    </a>
                  </td>
                  <td class="cell cell-info">
                    <a class="link" href="javascript:void(0)" @click="goProductDetailPage(detail.productId)" target="_blank">{{detail.productName}}</a>
                  </td>
                  <td class="cell cell-price">{{detail.salePrice | formatMoney}}</td>
                  <td class="cell cell-count">{{detail.productNum}}</td>
                  <td class="cell cell-total">{{Number(detail.salePrice * detail.productNum) | formatMoney}}</td>
                </tr>
              </table>
              <p class="total">
                <span>订单总价：</span>
                <span class="total-price">{{orderData.orderTotal | formatMoney}}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavSide from '@/components/layout/nav-side'
import { getOrderDet, cancelOrder } from '@/api/goods'
import { getStore } from '@/util/storage'

export default {
  data () {
    return {
      orderData: {},
      goodsList: [],
      address: {},
      orderId: '',
      userId: ''
    }
  },
  created () {
    this.orderId = this.$route.query.orderId
    this.userId = getStore('userId')
    this.queryOrderItemList()
  },
  activated () {
  },
  methods: {
    goProductDetailPage (productId) {
      this.loadPage('goods-detail', {'productId': productId})
    },
    queryOrderItemList () {
      getOrderDet({orderId: this.orderId}).then(res => {
        this.orderData = res.data
        this.goodsList = res.data.goodsList
        this.address = res.data.addressInfo
      })
    },
    _cancelOrder () {
      cancelOrder({orderId: this.orderId}).then(res => {
        if (res.success === true) {
          this.queryOrderItemList()
        } else {
          this.$message.error({ showClose: true, message: res.message, duration: 2000 })
        }
      })
    }
  },
  components: {
    NavSide
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
/* 订单信息 */
.order-info .text-line{
    height: 30px;
    line-height: 30px;
}
.order-info .text-line .text{
    margin-right: 30px;
}
.order-info .btn{
    width: 80px;
    padding: 0;
    height: 30px;
    line-height: 30px;
    font-size: 12px;
    margin-right: 10px;
    text-align: center;
}

/* 商品清单 */
.product-table{
    width: 100%;
    border-collapse: collapse;
}
.product-table .cell-th{
    background: #eee;
}
.product-table .cell{
    border-bottom: 1px dashed #eee;
    background: #fafafa;
}
.product-table .cell-img{
    padding: 10px;
    width: 10%;
    text-align: center;
}
.product-table .cell-img .p-img{
    width: 80px;
    height: 80px;
    border: 1px solid #ddd;
}
.product-table .cell-info{
    width: 45%;
    text-align: left;
}
.product-table .cell-price{
    width: 15%;
    text-align: center;
}
.product-table .cell-count{
    width: 15%;
    text-align: center;
}
.product-table .cell-total{
    width: 15%;
    text-align: center;
}

/* 总价钱 */
.total{
    text-align: right;
    font-size: 14px;
    height: 40px;
    line-height: 40px;
    margin-top: 10px;
    margin-right: 20px;
}
.total .total-price{
    font-weight: bold;
    color: #c60023;
}
</style>
