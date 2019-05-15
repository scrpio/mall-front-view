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
    <div class="page-container w">
      <p v-show="!isShowProduct" class="err-tip">很抱歉，实在找不到您要的商品。</p>
      <div v-show="isShowProduct">
        <div class="intro-wrap">
          <div class="p-img-con">
            <div class="main-img-con">
              <img class="main-img" v-lazy="mainImage"/>
            </div>
            <ul class="p-img-list">
              <li class="p-img-item" v-for="url in subImages" :key="url">
                <img @mouseenter="changeMainImg(url)" class="p-img" v-lazy="url"/>
              </li>
            </ul>
          </div>
          <div class="p-info-con">
            <h1 class="p-name">{{product.productName}}</h1>
            <p class="p-subtitle">{{product.subTitle}}</p>
            <div class="p-info-item p-price-con">
              <span class="label">价格:</span>
              <span class="info">{{product.salePrice | formatMoney}}</span>
            </div>
            <div class="p-info-item">
              <span class="label">库存:</span>
              <span class="info">{{product.limitNum}}</span>
            </div>
            <div class="p-info-item p-count-con">
              <span class="label">数量:</span>
              <input-number :limit="product.limitNum" @edit-num="editNum"/>
            </div>
            <div class="p-info-item">
              <a class="btn cart-add" @click="_addCart(product.productId,product.salePrice,product.productName,product.limitNum,product.productImageBig)">加入购物车</a>
            </div>
          </div>
        </div>
        <div class="detail-wrap">
          <div class="detail-tab-con">
            <ul class="tab-list">
              <li class="tab-item active">详细描述</li>
            </ul>
          </div>
          <div class="detail-con">
            <div v-html="product.detail"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { productDet, addCart } from '@/api/goods'
import { getStore } from '@/util/storage'
import { mapMutations, mapState } from 'vuex'
import InputNumber from '@/components/inputNumber'

export default {
  name: 'goods-detail',
  data () {
    return {
      isShowProduct: true,
      buyCount: 1,
      product: {},
      mainImage: '',
      subImages: [],
      userId: ''
    }
  },
  components: {
    InputNumber
  },
  computed: {
    ...mapState(['login'])
  },
  created () {
    var productId = this.$route.query.productId
    if (productId !== null) {
      this.loadDetail(productId)
    }
  },
  mounted () {
    this.userId = getStore('userId')
  },
  methods: {
    ...mapMutations(['ADD_CART']),
    editNum (num) {
      this.buyCount = num
    },
    _addCart (id, price, name, stock, img) {
      if (this.login) {
        addCart({userId: this.userId, productId: id, productNum: this.buyCount}).then(res => {
          this.ADD_CART({
            productId: id,
            salePrice: price,
            productName: name,
            productImg: img,
            productStock: stock,
            productNum: this.buyCount
          })
        })
      } else {
        this.ADD_CART({
          productId: id,
          salePrice: price,
          productName: name,
          productImg: img,
          productStock: stock,
          productNum: this.buyCount
        })
      }
      this.loadPage('oper-result', {'type': 'user-cart'})
    },
    changeMainImg (img) {
      console.log(img)
      this.mainImage = img
    },
    loadDetail (productId) {
      if (!productId) {
        this.goHome()
        return
      }
      productDet({productId: productId}).then(res => {
        if (res.success === false) {
          alert('加载商品详情失败')
          return
        }
        this.product = res.data
        this.mainImage = res.data.productImageBig
        this.subImages = res.data.productImageSmall
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
/* 图片区 */
.intro-wrap{
    overflow: hidden;
}
.intro-wrap .p-img-con{
    float: left;
    width: 420px;
}
/* 主图 */
.intro-wrap .p-img-con .main-img-con{
    height: 400px;
    border: 1px solid #ddd;
}
.intro-wrap .p-img-con .main-img-con .main-img{
    height: 100%;
    width: 100%;
}
/* 缩略图 */
.intro-wrap .p-img-con .p-img-list{
    overflow: hidden;
    height: 76px;
    margin-top: 5px;
    margin-right: -10px;
}
.intro-wrap .p-img-con .p-img-item{
    float: left;
    margin-right: 10px;
    width: 72px;
    height: 72px;
    border: 2px solid #eee;
    cursor: pointer;
}
.intro-wrap .p-img-con .p-img-item:hover{
    border: 2px solid #c60023;
}
.intro-wrap .p-img-con .p-img-item .p-img{
    width: 100%;
    height: 100%;
}
/* 商品信息 */
.intro-wrap .p-info-con{
    float: left;
    width: 640px;
    margin-left: 20px;
}
.intro-wrap .p-info-con .p-name{
    font-size: 20px;
    color: #333;
}
.intro-wrap .p-info-con .p-subtitle{
    font-size: 15px;
    color: #c60023;
    line-height: 30px;
}
.intro-wrap .p-info-con .p-info-item{
    position: relative;
    padding: 0 10px;
    margin-top: 20px;
}
.intro-wrap .p-info-con .p-info-item .label{
    display: inline-block;
    width: 50px;
    color: #999;
}
/* 价格部分 */
.intro-wrap .p-info-con .p-price-con{
    background: #eee;
    padding: 10px;
}
.intro-wrap .p-info-con .p-count-con .label {
  float: left;
  line-height: 40px;
}
.intro-wrap .p-info-con .p-price-con .info{
    color: #c60023;
    font-size: 18px;
}
/* 数量部分 */
.el-input-number {
  width: 100px;
}
.el-input-number .el-icon-arrow-up:before {
  content: "\e6d9";
}
.el-input-number .el-icon-arrow-down:before {
  content: "\e6d8";
}
/* 商品详细信息 */
.detail-wrap{
    margin-top: 15px;
}
.detail-wrap .tab-list{
    background: #eee;
    border: 1px solid #ddd;
    overflow: hidden;
    border-bottom: 1px solid #c60023;
}
.detail-wrap .tab-list .tab-item{
    float: left;
    width: 100px;
    height: 50px;
    line-height: 50px;
    font-size: 16px;
    text-align: center;
    cursor: pointer;
}
.detail-wrap .tab-list .tab-item.active{
    background: #c60023;
    color: #fff;
}
.detail-wrap .detail-con{
    padding-top: 20px;
    background: #fff;
}
.detail-wrap .detail-con img{
    display: block;
    margin: 0 auto;
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
