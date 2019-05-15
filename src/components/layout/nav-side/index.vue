<template>
  <div class="nav-side">
    <dl class="side-dl">
      <dt>设置</dt>
      <dd v-for="item in navList" :key="item.id" class="side-item">
        <router-link class="link" :to="item.path">{{item.desc}}</router-link>
      </dd>
    </dl>
  </div>
</template>

<script>
export default {
  data () {
    return {
      name: '',
      navList: [
        {path: '/center', desc: '个人信息'},
        {path: '/passUpdate', desc: '修改密码'},
        {path: '/order', desc: '我的订单'},
        {path: '/address', desc: '收货地址'}
      ]
    }
  },
  created () {
  },
  methods: {
  },
  components: {}
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.nav-side {
  width: 100px;
  padding-left: 10px;
}
.side-dl {
  padding-bottom: 15px;
}
.side-dl dt {
  height: 28px;
  line-height: 28px;
  color: #333;
  font-weight: 700;
}
.side-item {
  color: #666;
  line-height: 24px;
}
</style>
