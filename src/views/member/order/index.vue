<template>
  <div class="container">
    <div class="w">
      <div class="sub">
        <nav-side></nav-side>
      </div>
      <div class="main">
        <div class="mod-main">
          <div class="mt">我的订单</div>
          <div class="mc">
            <div v-if="orders.length">
              <table class="order-tb" style="width:100%;">
                <thead>
                  <tr>
                    <th>订单详情</th>
                    <th>收货人</th>
                    <th>金额</th>
                    <th>状态</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody v-for="(item, i) in orders" :key="i">
                  <tr class="tr-blank">
                    <td colspan="5"></td>
                  </tr>
                  <tr class="tr-head">
                    <td colspan="5">
                      <div class="dealtime">{{ item.createDate }}</div>
                      <div class="number">
                        订单号:<a href="javascript:void(0)" class="link" @click="toDetailPage(item.orderId)">{{ item.orderId }}</a>
                      </div>
                      <a title="删除" class="link icon-del" @click="del(item.orderId, i)">
                        <i class="el-icon-delete"/>
                      </a>
                    </td>
                  </tr>
                  <tr class="tr-body">
                    <td class="p-list">
                      <ul>
                        <li v-for="(good,j) in item.goodsList" :key="j">
                          <div class="goods-img">
                            <a class="link" @click="loadPage('goods-detail', {'productId': good.productId})"><img :src="good.productImg" class="img-inner"></a>
                          </div>
                          <p class="goods-msg">
                            <a class="link" @click="loadPage('goods-detail', {'productId': good.productId})">{{ good.productName }}</a>
                          </p>
                          <div class="goods-number">×{{ good.productNum }}</div>
                          <div class="clear" />
                        </li>
                      </ul>
                    </td>
                    <td>
                      <span class="consignee">
                        <el-tooltip placement="left" style="border: 0">
                          <div slot="content">
                            {{ item.addressInfo.userName }}
                            <br/>
                            {{ item.addressInfo.streetName }}
                            <br/>
                            {{ item.addressInfo.tel }}
                          </div>
                          <el-button>{{ item.addressInfo.userName }}<i class="el-icon-user"/></el-button>
                        </el-tooltip>
                      </span>
                    </td>
                    <td>
                      <p class="amount">{{ item.orderTotal | formatMoney}}</p>
                      <p class="payment">{{ Number(item.paymentType) | getPaymentType }}</p>
                    </td>
                    <td>
                      <span class="status">{{ Number(item.orderStatus) | getOrderStatusName }}</span>
                    </td>
                    <td>
                      <a href="javascript:void(0)" class="link" @click="toDetailPage(item.orderId)">查看详情<i class="el-icon-d-arrow-right"/></a>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div class="tool-page">
                <div style="float:right">
                  <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[5, 10, 20, 50]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next"
                    :total="total">
                  </el-pagination>
                </div>
                <div class="clear"/>
              </div>
            </div>
            <div v-else class="order-empty">
              你还未创建过订单
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavSide from '@/components/layout/nav-side'
import { orderList, delOrder } from '@/api/goods'
import { getStore } from '@/util/storage'

export default {
  data () {
    return {
      orders: [],
      userId: '',
      orderStatus: '',
      loading: true,
      currentPage: 1,
      pageSize: 5,
      total: 0
    }
  },
  created () {
    this.userId = getStore('userId')
    this.dataList()
    console.log(this.orders.length)
  },
  components: {
    NavSide
  },
  methods: {
    toDetailPage (orderId) {
      this.loadPage('order-detail', {'orderId': orderId})
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.dataList()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.dataList()
    },
    dataList () {
      let params = {
        userId: this.userId,
        size: this.pageSize,
        page: this.currentPage
      }
      orderList(params).then(res => {
        this.orders = res.data.data
        this.total = res.data.total
      })
    },
    del (orderId, i) {
      let params = {
        orderId: orderId
      }
      delOrder(params).then(res => {
        if (res.success === true) {
          this.orders.splice(i, 1)
        } else {
          this.$message.error({ showClose: true, message: res.message, duration: 2000 })
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
table td {
  overflow: hidden;
  white-space: nowrap;
}
.order-tb thead th {
  height: 32px;
  line-height: 32px;
  text-align: center;
  background: #f5f5f5;
  color: #666;
  font-weight: 400;
}
.tr-blank {
  height: 20px;
}
.tr-blank td {
  border: 0;
}
.tr-head {
  background: #f5f5f5;
  height: 31px;
  line-height: 31px;
  color: #aaa;
  overflow: hidden;
}
.tr-head td {
  padding-left: 15px;
  padding-right: 15px;
  border-bottom-color: #f5f5f5;
}
tbody td {
  border: 1px solid #e5e5e5;
}
.dealtime {
  float: left;
  margin-right: 30px;
  font-family: verdana;
}
.number {
  float: left;
  width: 226px;
  font-family: verdana;
}
.tr-body {
  text-align: center;
  vertical-align: top;
  width: 100%;
}
.tr-body td {
  padding-top: 15px;
  width: auto;
}
td.p-list {
  width: 494px;
  text-align: left;
}
.p-list li {
  padding: 5px 10px;
  border-bottom: 1px solid #e5e5e5;
}
.p-list li:last-child {
  border-bottom: none;
}
.goods-img {
  width: 60px;
  height: 60px;
  border: 1px solid #efefef;
  margin: 0 14px;
  float: left;
}
.goods-img:hover {
  border: 1px solid #C0C4CC;
}
.img-inner {
  width: 60px;
  height: 60px;
}
.goods-msg {
  width: 240px;
  margin-right: 74px;
  float: left;
}
.goods-number {
  width: 60px;
  text-align: left;
  color: #aaa;
  font-family: verdana;
  float: left;
}
.consignee {
  color: #333;
  width: 100px;
  margin: 7px auto;
  cursor: pointer;
}
.amount {
  color: #aaa;
}
.payment {
  color: #aaa;
  display: block;
  margin: 0 8px;
  margin-top: 5px;
  padding-top: 1px;
  border-top: solid 1px #E5E5E5;
  line-height: 19px;
  height: 19px;
  overflow: hidden;
}
.status {
  color: #aaa;
}
.tool-page {
  margin-top: 20px;
}
.icon-del {
  float: right;
  visibility: hidden;
}
tbody:hover .icon-del {
  visibility: visible;
}
.order-empty {
  text-align: center;
  font-size: 16px;
  padding-top: 20px;
  padding-bottom: 20px;
}
</style>
