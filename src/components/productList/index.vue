<template>
  <div>
    <table class="product-table">
      <tr>
        <th class="cell-img">&nbsp;</th>
        <th class="cell-info">商品描述</th>
        <th class="cell-price">价格</th>
        <th class="cell-count">数量</th>
        <th class="cell-total">小计</th>
      </tr>
      <tr v-for="order in orderItemList" :key="order.productId">
        <td class="cell-img">
          <a href="detail.html" target="_blank">
            <img class="p-img" v-lazy="order.productImg" :alt="order.productName"/>
          </a>
        </td>
        <td class="cell-info">
          <a class="link" @click="loadPage('goods-detail', {'productId': order.productId})">{{order.productName}}</a>
        </td>
        <td class="cell-price">{{order.salePrice | formatMoney}}</td>
        <td class="cell-count">{{order.productNum}}</td>
        <td class="cell-total">{{order.salePrice * order.productNum | formatMoney}}</td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    orderItemList: {
      type: Array,
      required: false
    }
  },
  data () {
    return {}
  },
  created () {
  },
  methods: {},
  components: {}
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.product-table{
    width: 100%;
    margin: 10px 0;
    border-collapse: collapse;
}
.product-table th,
.product-table td{
    border-bottom: 1px dotted #ddd;
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
    width: 30%;
    text-align: left;
}
.product-table .cell-price{
    width: 20%;
    text-align: center;
}
.product-table .cell-count{
    width: 20%;
    text-align: center;
}
.product-table .cell-total{
    width: 20%;
    text-align: center;
}
</style>
