<template>
  <div class="container">
    <div class="w">
      <div class="sub">
        <nav-side></nav-side>
      </div>
      <div class="main">
        <div class="mod-main">
          <div class="mt">修改密码</div>
          <div class="mc">
              <div class="form-item">
                <span class="form-label">原密码：</span>
                <input type="password" v-model="memberForm.pwdOld" class="form-input"/>
              </div>
              <div class="form-item">
                <span class="form-label">新密码：</span>
                <input type="password" v-model="memberForm.password" class="form-input"/>
              </div>
              <div class="form-item">
                <span class="form-label">确认密码：</span>
                <input type="password" v-model="memberForm.pwdRepeat" class="form-input"/>
              </div>
              <div class="form-item">
                <span class="form-label"></span>
                <a href="javascript:void(0)" class="btn">提交</a>
              </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavSide from '@/components/layout/nav-side'

export default {
  data () {
    return {
      memberForm: {
        pwdOld: '',
        password: '',
        pwdRepeat: ''
      }
    }
  },
  components: {
    NavSide
  },
  methods: {
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
