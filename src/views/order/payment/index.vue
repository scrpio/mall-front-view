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
    <div class="pay-wrap w">
      <p class="payment-tips">订单提交成功，请尽快支付！订单号：{{orderId}}</p>
      <p class="payment-tips enhance">请使用支付宝沙箱App扫描如下二维码进行支付：</p>
      <div class="img-con">
        <img class="qr-code" v-lazy="optUploadFileRespDto.attachmentUrl" alt="支付二维码"/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      optUploadFileRespDto: {},
      pollTimes: 0,
      orderId: '',
      paymentTimer: null
    }
  },
  created () {
    this.orderId = this.$route.query.orderId
  },
  activated () {
    this.listenOrderStatus(this.orderId)
    this.queryOrderItemVoList(this.orderId)
  },
  deactivated () {
    clearInterval(this.paymentTimer)
  },
  methods: {
    listenOrderStatus (orderId) {
      if (!orderId) {
        return
      }
      let paymentTimer = setInterval(() => {
        console.info('this.pollTimes', this.pollTimes)
        this.pollTimes++
        if (this.pollTimes > 500) {
          clearInterval(paymentTimer)
          alert('支付超时')
          this.loadPage('user-order')
        }
        this.ajax({
          url: `/omc/order/queryOrderPayStatus/` + orderId,
          isUnMusk: true,
          success: (res) => {
            if (res.result) {
              alert('支付成功')
              this.goHome()
            }
          }
        })
      }, 5e3)
      this.paymentTimer = paymentTimer
    },
    queryOrderItemVoList (orderId) {
      if (!orderId) {
        alert('订单号不存在')
        return
      }
      this.ajax({
        url: `/omc/pay/createQrCodeImage/` + orderId,
        success: (res) => {
          if (res.code === 200) {
            this.optUploadFileRespDto = res.result
          }
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.page-wrap{
    padding: 10px 0 25px 0;
    background: #fff;
}
.payment-tips{
    height: 40px;
    line-height: 40px;
    font-size: 18px;
    font-weight: bold;
    color: #666;
    text-align: center;
}
.payment-tips.enhance{
    color: #c60023;
}
.img-con{
    margin: 0 auto;
    width: 300px;
    height: 300px;
    background: #fff;
    border: 1px solid #ddd;
}
.img-con .qr-code{
    width: 100%;
    height: 100%;
}
</style>
