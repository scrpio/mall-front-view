<template>
  <div>
    <div class="crumb">
      <div class="w">
        <div class="crumb-con">
          <a class="link" href="javascript:void(0)" @click.prevent="goHome">首页</a>
          <span>></span>
          <span class="link-text">{{ $route.meta.name }}</span>
        </div>
      </div>
    </div>
    <div class="list-wrap w">
      <!-- 排序 -->
      <ul class="sort-con">
        <li v-for="(item, index) in sortList" :key="index" :class="{'sort-item': true, 'active': sortSpan===index}" data-type="item.type" @click="changeSort(index)">
          <span>{{ item.name }}</span>
          <span v-show="index!==0">
            <i class="el-icon-caret-top sort-top" :class="{'active': sortSpan===index&&!isAsc}"/>
            <i class="el-icon-caret-bottom sort-bottom" :class="{'active': sortSpan===index&&isAsc}"/>
          </span>
        </li>
      </ul>
      <!-- list 容器 -->
      <ul class="p-list-con">
        <li class="p-item" v-show="product.productId !== ''" v-for="product in productList" :key="product.productId">
          <div class="p-img-con" @click="goProductDetailPage(product.productId)">
            <a class="link">
              <img class="p-img" v-lazy="product.productImageBig"/>
            </a>
          </div>
          <div class="p-name-con" @click="goProductDetailPage(product.productId)">
            <a class="p-name">{{product.productName}}</a>
          </div>
          <div class="p-price-con">
            <span class="p-price">￥{{product.salePrice}}</span>
          </div>
          <div class="p-cart">
            <a class="link" @click="_addCart(product.productId,product.salePrice,product.productName,product.limitNum,product.productImageBig)">
              <i class="el-icon-shopping-cart-full"/>
            </a>
          </div>
        </li>
        <p class="err-tip" v-show="productList === null || productList.length < 1">很抱歉，找不到您要的商品。</p>
      </ul>
      <!-- 分页容器 -->
      <div style="text-align: right">
        <el-pagination :current-page.sync="page" :page-size="100" layout="prev, pager, next, jumper" :total="total"/>
      </div>
    </div>
  </div>
</template>

<script>
import { getAllGoods, addCart } from '@/api/goods'
import { getStore } from '@/util/storage'
import { mapMutations, mapState } from 'vuex'

export default {
  data () {
    return {
      isAsc: false,
      page: 1,
      total: 0,
      sortList: [
        { type: 'default', name: '默认排序' },
        { type: 'price', name: '价格' },
        { type: 'sale', name: '销量' },
        { type: 'shelf', name: '上架时间' }
      ],
      sortSpan: 0,
      productList: []
    }
  },
  created () {
    var categoryId = this.$route.query.categoryId
    if (categoryId !== null) {
      this.queryProductList(categoryId)
    }
  },
  computed: {
    ...mapState(['login', 'showCart'])
  },
  mounted () {
  },
  methods: {
    ...mapMutations(['ADD_CART', 'SHOW_CART']),
    queryProductList (categoryId) {
      getAllGoods({cid: categoryId}).then(res => {
        if (res.success === false) {
          alert('加载商品列表失败')
          return
        }
        var result = res.data
        this.total = result.total
        this.productList = result.data
      })
    },
    changeSort (index) {
      var temp = this.isAsc
      if (this.sortSpan === index) {
        this.isAsc = !temp
      } else {
        this.isAsc = true
      }
      this.sortSpan = index
    },
    goProductDetailPage (pId) {
      this.loadPage('goods-detail', {'productId': pId})
    },
    _addCart (id, price, name, stock, img) {
      if (this.login) {
        addCart({userId: getStore('userId'), productId: id, productNum: 1}).then(res => {
          this.ADD_CART({
            productId: id,
            salePrice: price,
            productName: name,
            productImg: img,
            productStock: stock
          })
        })
      } else {
        this.ADD_CART({
          productId: id,
          salePrice: price,
          productName: name,
          productImg: img,
          productStock: stock
        })
      }
      if (!this.showCart) {
        this.SHOW_CART({showCart: true})
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
/* 排序按钮 */
.sort-con{
  overflow: auto;
}
.sort-con .sort-item{
  float: left;
  display: inline-block;
  position: relative;
  padding: 0 18px 0 8px;
  height: 24px;
  line-height: 24px;
  border: 1px solid #ccc;
  margin-right: -1px;
  background: #fff;
  color: #333;
  cursor: pointer;
}
.sort-con li:first-child {
  padding: 0 8px;
}
.sort-con .sort-item:hover {
  border: 1px solid #c60023;
  color: #c60023;
  z-index: 100;
}
.sort-con .sort-item.active{
  background: #c60023;
  border: 1px solid #c60023;
  color: #fff;
}
.sort-top {
  position: absolute;
  top: 4px;
  right: 5px;
}
.sort-bottom {
  position: absolute;
  top: 10px;
  right: 5px;
}
.sort-top.active{
  opacity: .6;
}
.sort-bottom.active{
  opacity: .6;
}

/* 列表 */
.p-list-con{
  margin-top: 15px;
  margin-right: -20px;
  overflow: hidden;
}
.p-list-con .p-item{
  position: relative;
  width: 180px;
  float: left;
  padding: 10px;
  margin: 0 20px 20px 0;
  background: #fff;
}
.p-list-con .p-item .p-img-con{
  width: 180px;
  height: 200px;
}
.p-list-con .p-item .p-img-con .p-img{
  width: 100%;
  height: 100%;
}
.p-list-con .p-item .p-price-con{
  height: 30px;
  line-height: 30px;
}
.p-list-con .p-item .p-price-con .p-price{
  font-size: 16px;
  color: #e7380d;
}
.p-list-con .p-item .p-name-con{
  height: 40px;
  cursor: pointer;
  overflow: hidden;
}
.p-list-con .p-item .p-name-con .p-name{
  line-height: 20px;
  margin-bottom: 10px;
  color: #666;
  text-decoration: none;
}
.p-list-con .p-item .p-name-con .p-name:hover{
  color: #e80012;
  text-decoration: underline;
}
.p-cart {
  text-align: right;
  height: 30px;
  line-height: 30px;
  padding-right: 15px;
}
.p-cart a i {
  font-size: 18px;
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
