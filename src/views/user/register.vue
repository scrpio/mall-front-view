<template>
  <div class="wrap">
    <div class="w-panel">
      <div class="panel h-panel">
        <span>欢迎注册</span>
        <div class="have-account">
          已有账号？<a href="javascript:void(0)" @click="goSignIn">请登录 <i class="el-icon-arrow-right"/></a>
        </div>
      </div>
    </div>
    <div class="register-container">
      <div class="panel">
          <el-steps align-center :active="active" finish-status="success">
            <el-step title="验证手机号"/>
            <el-step title="填写账号信息"/>
            <el-step title="注册成功"/>
          </el-steps>
        <div class="register-box">
          <div class="container-form">
            <form id="formRegister" method="post" :class="{'hidden-form': true, 'active': active===0}">
              <div class="user-form-item">
                <label class="user-form-label"><i class="el-icon-mobile-phone"/></label>
                <input type="text" name="register.phone" class="user-form-input" placeholder="请输入手机号"/>
              </div>
              <div class="user-form-item form-input-code">
                <label class="user-form-label"><i class="el-icon-edit"/></label>
                <input type="text" name="register.captcha" class="user-form-input" placeholder="请输入验证码"/>
                <button class="captcha-btn" v-show="!send">获取验证码</button>
                <button class="captcha-btn" v-show="send" disabled>{{ countButton }}</button>
              </div>
              <div class="user-form-item">
                <button class="user-form-btn" @click="next">下一步</button>
              </div>
            </form>
            <form id="formRegister" method="post" :class="{'hidden-form': true, 'active': active===1}">
              <div class="user-form-item form-item-top">
                <label class="user-form-label"><i class="el-icon-user"/></label>
                <input type="text" name="register.username" class="user-form-input" placeholder="请输入帐号"/>
              </div>
              <div class="user-form-item">
                <label class="user-form-label"><i class="el-icon-lock"/></label>
                <input type="password" name="register.password" class="user-form-input" placeholder="设置密码"/>
              </div>
               <div class="user-form-item">
                <label class="user-form-label"><i class="el-icon-refresh"/></label>
                <input type="password" name="register.pwdRepeat" class="user-form-input" placeholder="确认密码"/>
              </div>
              <div class="user-form-item">
                <button class="user-form-btn" @click="next">注&nbsp;&nbsp;&nbsp;&nbsp;册</button>
              </div>
            </form>
            <span :class="{'hidden-form': true, 'active': active===2}">注册成功</span>
          </div>
        </div>
      </div>
    </div>
    <pc-footer/>
  </div>
</template>

<script>
import pcFooter from '@/components/layout/footer'

const validatePassword = (rule, value, callback) => {
  if (value.length < 6) {
    callback(new Error('密码长度不得小于6位'))
  } else {
    callback()
  }
}
const validateConfirmPass = (rule, value, callback) => {
  if (value.length < 6) {
    callback(new Error('密码长度不得小于6位'))
  } else if (value !== this.register.password) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}
const validateMobile = (rule, value, callback) => {
  var reg = /^[1][3,4,5,7,8][0-9]{9}$/
  if (!reg.test(value)) {
    callback(new Error('手机号格式错误'))
  } else {
    callback()
  }
}

export default {
  data () {
    return {
      active: 0,
      isActive: true,
      send: false,
      count: 60,
      countButton: '60 s',
      register: {
        username: '',
        password: '',
        pwdRepeat: '',
        phone: '',
        captcha: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { validator: validatePassword, trigger: 'blur' }
        ],
        pwdRepeat: [
          { required: true, message: '请确认密码', trigger: 'blur' },
          { validator: validateConfirmPass, trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: validateMobile, trigger: 'blur' }
        ],
        captcha: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ]
      }
    }
  },
  components: {
    pcFooter
  },
  methods: {
    countDown () {
      var that = this
      if (this.count === 0) {
        this.send = false
        this.count = 60
        return
      } else {
        this.countButton = this.count + ' s'
        this.count--
      }
      setTimeout(function () { that.countDown() }, 1000)
    },
    next () {
      if (this.active++ > 2) this.active = 0
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.register-container {
  height: 480px;
  margin: 0 auto;
  padding-top:  42px;
  padding-bottom:  42px;
  margin-bottom: 175px;
  background-color: #fff;
}
.register-box {
  width: 346px;
  margin: 50px auto;
  background-color: #fff;
}
.hidden-form {
  display: none;
}
.hidden-form.active {
  display: block;
}
.have-account {
  font-size: 16px;
  margin-top: 20px;
  float: right;
  color: #999;
}
.have-account>a {
  color: #b61d1d;
}
.have-account>a:hover {
  text-decoration: underline;
}
</style>
