<template>
  <div class="container">
    <div class="w">
      <div class="banner-wrap">
        <div class="fl">
          <ul class="keywords-list">
            <li class="keywords-item" v-for="item in goods" :key="item.id">
              <h3>
                <a class="link" href="javascript:void(0)" @click="goGoodsList(item.id)">{{ item.title }}</a>
              </h3>
              <div class="item-list clearfix">
                <div class="subitem">
                  <dl v-for="item2 in item.children" :key="item2.id">
                    <dt>
                      <a href="javascript:void(0)" @click="goGoodsList(item2.id)">{{ item2.title }}<i class="el-icon-arrow-right"/></a>
                    </dt>
                    <dd v-if="item2.children">
                      <em v-for="item3 in item2.children" :key="item3.id">
                        <a href="javascript:void(0)" @click="goGoodsList(item3.id)">{{ item3.title }}</a>
                      </em>
                    </dd>
                  </dl>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div class="fl">
          <el-carousel height="370px" :interval="5000" class="banner-con">
            <el-carousel-item v-for="(item, index) in banner" :key="index">
              <a href="javascript:void(0)">
                <img :src="item.picUrl" />
              </a>
            </el-carousel-item>
          </el-carousel>
        </div>
        <div class="clear"/>
      </div>
    </div>
    <div class="w">
      <div class="floor-wrap" v-for="item in home" :key="item.id">
        <div v-if="item.type !== 0">
          <div class="floorhd"  v-if="item.type !== 1">
            <div class="grid_c1 floorhd_inner">
              <h3 class="floorhd_tit">{{ item.name }}</h3>
            </div>
          </div>
          <ul class="floor-list">
            <li class="floor-item" v-for="panel in item.panelContents" :key="panel.id">
              <div class="floor-img">
                <img :src="panel.picUrl"/>
              </div>
              <div class="floor-text">
                <p class="floor-name">{{ panel.productName }}</p>
                <div class="floor-btn">
                  <el-button size="mini" @click="goProductDetailPage(panel.productId)">查看详情</el-button>
                  <el-button type="primary" size="mini" @click="_addCart(panel.productId,panel.salePrice,panel.productName,panel.limitNum,panel.picUrl)">加入购物车</el-button>
                </div>
                <p class="floor-money">¥{{ panel.salePrice }}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { productHome, productCat } from '@/api/index'
import { addCart } from '@/api/goods'
import { getStore } from '@/util/storage'
import { mapMutations, mapState } from 'vuex'

export default {
  name: 'home',
  data () {
    return {
      banner: [],
      home: [],
      goods: []
    }
  },
  mounted () {
    productHome().then(res => {
      if (res.success === false) {
        alert('加载主页面失败')
        return
      }
      let data = res.data
      this.home = data
      for (let i = 0; i < data.length; i++) {
        if (data[i].type === 0) {
          this.banner = data[i].panelContents
        }
      }
    })

    productCat().then(res => {
      if (res.success === false) {
        alert('加载商品分类失败')
        return
      }
      this.goods = res.data
    })
  },
  computed: {
    ...mapState(['login', 'showCart'])
  },
  methods: {
    ...mapMutations(['ADD_CART', 'SHOW_CART']),
    goProductDetailPage (pId) {
      this.loadPage('goods-detail', {'productId': pId})
    },
    goGoodsList (cid) {
      this.loadPage('goods-list', {'categoryId': cid})
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
/* keywords-list */
.banner-wrap {
  position: relative;
  height: 370px;
  margin-left: 8px;
  margin-right: 8px;
}
.keywords-list {
  width: 232px;
  height: 350px;
  padding: 10px 0;
  margin-right: 10px;
  background: #fefefe;
  color: #fff;
  overflow: hidden;
}
.keywords-list .keywords-item {
  padding-left: 10px;
  height: 35px;
  line-height: 35px;
  font-size: 14px;
}
.keywords-list .keywords-item:hover {
  background: #d9d9d9;
}
.keywords-list .keywords-item .link {
  margin-right: 6px;
  color: #626262;
}
.keywords-list .keywords-item .link:hover {
  color: #c60023;
}
.clearfix {
  display: none;
}
.keywords-item:hover .clearfix{
  display: inline-block;
  z-index: 99;
}
.item-list {
  position: absolute;
  left: 240px;
  top: 0;
  bottom: 0;
  width: 838px;
  height: 350px;
  padding: 10px 0;
  margin-right: 10px;
  background: #fefefe;
  color: #666;
  border: 1px solid #f7f7f7;
  box-shadow: 2px 0 5px rgba(0,0,0,.3);
  overflow-x: hidden;
  overflow-y: auto;
}
.item-list .subitem{
  float: left;
  width: 820px;
  padding: 0px 4px 0px 8px;
}
.item-list .subitem dl{
  border-top: 1px solid #EEE;
  padding: 6px 0px;
  overflow: hidden;
  zoom: 1;
}
.item-list .subitem dl:first-child{
  border-top: none;
}
.item-list .subitem dt{
  float: left;
  width: 80px;
  line-height: 22px;
  text-align: right;
  padding: 3px 6px 0px 0px;
  font-weight: 700;
}
.item-list .subitem dt a{
  color: #666;
}
.item-list .subitem dt a:hover{
  color: #E4393C;
}
.item-list .subitem dd{
  float: left;
  width: 730px;
  padding: 3px 0px 0px;
  overflow: hidden;
}
.item-list .subitem dd em{
  float: left;
  height: 14px;
  line-height: 14px;
  padding: 0px 8px;
  margin-top: 5px;
  border-left: 1px solid #CCC;
}
.item-list .subitem dd em a{
  color: #666;
}
.item-list .subitem dd em a:hover{
  font-weight: normal;
  color: #c60023;
}
/* banner-con */
.banner-con {
  width: 822px;
  height: 370px;
  background: #eee;
}
.banner-con img {
  width: 100%;
  height: 100%;
}
/* floor */
.floor-wrap {
  margin: 0;
  padding: 0;
}
.floorhd {
  height: 65px;
}
.grid_c1 {
  margin: 0 auto;
  width: 100%;
}
.floorhd_tit::after {
  right: 0;
}
.floorhd_tit::before, .floorhd_tit::after {
  content: '';
  position: absolute;
  width: 50px;
  height: 3px;
  display: block;
  background: #222;
  top: 19px;
}
.floorhd_tit::before {
  left: 0;
}
.floorhd_tit, .floorhd_tit_empty {
  position: relative;
  width: 150px;
  height: 45px;
  font-size: 28px;
  font-family: 'fzzzh', sans-serif;
  font-weight: normal;
  text-align: center;
  line-height: 45px;
  padding: 0 50px;
  margin: 20px auto;
  overflow: hidden;
  color: #222;
}

.floor-list {
  margin-right: -20px;
  overflow: hidden;
}
.floor-item {
  width: 200px;
  height: 300px;
  margin: 8px;
  float: left;
  cursor: pointer;
  background: #fff;
}
.floor-item:hover {
  box-shadow: 1px 1px 7px #ddd;
}
.floor-item:hover .floor-btn {
  display: block;
  text-align: center;
  height: 65px;
}
.floor-item:hover .floor-money {
  display: none;
}
.floor-btn {
  display: none;
}
.floor-btn button {
  margin: 0 4px;
  padding: 8px;
}
.floor-img {
  width: 150px;
  height: 150px;
  margin: 18px auto;
}
.floor-img img {
  width: 100%;
  height: 100%;
}
.floor-text {
  padding: 0 16px 0;
}
.floor-name {
  font-size: 12px;
  height: 50px;
  color: #7d7d7d;
  word-break: break-all;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
}
.floor-money {
  font-size: 16px;
  height: 65px;
  color: #e33333;
  display: block;
}
</style>
