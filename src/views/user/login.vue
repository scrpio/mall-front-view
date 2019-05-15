<template>
  <div class="wrap">
    <div class="w-panel">
      <div class="panel h-panel">
        <span>欢迎登陆</span>
      </div>
    </div>
    <div class="login-container">
      <div class="panel">
        <div class="login-img">
          <img class="login-banner" src="../../assets/images/banner.png" alt="MALL">
        </div>
        <div class="login-box">
          <div class="login-tab">
            <div :class="{'login-tab-l': true, 'active': isActive}" @click="isActive=true">
              <span class="account_login">账户登录</span>
            </div>
            <div :class="{'login-tab-r': true, 'active': !isActive}" @click="isActive=false">
              <span class="phone_login">快速登录</span>
            </div>
            <div class="clear" />
          </div>
          <div class="msg-wrap">
            <div :class="{'msg-error': true, 'hide': isTips}">
              {{ errMsg }}
            </div>
          </div>
          <div class="container-form" v-show="isActive">
            <div class="user-form-item">
              <label class="user-form-label"><i class="el-icon-user"/></label>
              <input type="text" v-model="accountForm.username" class="user-form-input" placeholder="请输入帐号"/>
            </div>
            <div class="user-form-item">
              <label class="user-form-label"><i class="el-icon-lock"/></label>
              <input type="password" v-model="accountForm.password" class="user-form-input" placeholder="请输入密码"/>
            </div>
            <div class="user-form-item forget-pw">
              <a href="#" target="_blank">忘记密码?</a>
            </div>
            <div class="user-form-item">
              <button class="user-form-btn" @click="handleLogin">登&nbsp;&nbsp;&nbsp;&nbsp;录</button>
            </div>
          </div>
          <div class="container-form" v-show="!isActive">
            <div class="user-form-item">
              <label class="user-form-label"><i class="el-icon-mobile-phone"/></label>
              <input type="text" v-model="phoneForm.phone" class="user-form-input" placeholder="请输入手机号"/>
            </div>
            <div class="user-form-item form-input-code">
              <label class="user-form-label"><i class="el-icon-edit"/></label>
              <input type="text" v-model="phoneForm.captcha" class="user-form-input" placeholder="请输入验证码"/>
              <button class="captcha-btn" v-show="!send">获取验证码</button>
              <button class="captcha-btn" v-show="send" disabled>{{ countButton }}</button>
            </div>
            <div class="user-form-item">
              <button class="user-form-btn" @click="handleLogin">登&nbsp;&nbsp;&nbsp;&nbsp;录</button>
            </div>
          </div>
          <div class="coagent">
            <ul>
              <li><a href="#"><img src="../../assets/images/01.png" alt=""></a></li>
              <li><a href="#"><img src="../../assets/images/02.png" alt=""></a></li>
              <li class="extra-r"><a href="javascript:void(0)" @click="goSignUp">立即注册 <i class="el-icon-arrow-right"/></a></li>
            </ul>
          </div>
        </div>
      </div>
      <div class="clear" />
    </div>
    <pc-footer/>
  </div>
</template>

<script>
import pcFooter from '@/components/layout/footer'
import { userLogin } from '@/api/index.js'
import { addCart } from '@/api/goods.js'
import { setStore, getStore, removeStore } from '@/util/storage.js'

const validatePassword = (rule, value, callback) => {
  if (value.length < 6) {
    callback(new Error('密码长度不得小于6位'))
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
      isActive: true,
      isTips: false,
      errMsg: '',
      send: false,
      count: 60,
      countButton: '60 s',
      accountForm: {
        username: 'Admin',
        password: 'test'
      },
      phoneForm: {
        phone: '',
        captcha: ''
      },
      cart: [],
      rules: {
        username: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { validator: validatePassword, trigger: 'blur' }
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
    // 登陆时将本地的添加到用户购物车
    login_addCart () {
      let cartArr = []
      let locaCart = JSON.parse(getStore('buyCart'))
      if (locaCart && locaCart.length) {
        locaCart.forEach(item => {
          cartArr.push({
            userId: getStore('userId'),
            productId: item.productId,
            productNum: item.productNum
          })
        })
      }
      this.cart = cartArr
    },
    handleLogin () {
      if (!this.accountForm.username) {
        this.errMsg = '账号不能为空!'
        return false
      }
      if (!this.accountForm.password) {
        this.errMsg = '密码不能为空!'
        return false
      }
      var params = {
        username: this.accountForm.username,
        password: this.accountForm.password
      }
      userLogin(params).then(res => {
        if (res.data.state === 1) {
          setStore('token', res.data.token)
          setStore('userId', res.data.id)
          // 登录后添加当前缓存中的购物车
          if (this.cart.length) {
            for (var i = 0; i < this.cart.length; i++) {
              addCart(this.cart[i]).then(res => {
                if (res.success === true) {
                }
              })
            }
            removeStore('buyCart')
            this.goBack()
          } else {
            this.goBack()
          }
        } else {
          this.errMsg = res.data.message
          return false
        }
      })
    },
    phoneLogin () {
      if (!this.phoneForm.phone) {
        this.errMsg = '手机号不能为空!'
        return false
      }
      if (!this.phoneForm.captcha) {
        this.errMsg = '验证码不能为空!'
        return false
      }
      var params = {
        username: this.phoneForm.phone,
        password: this.phoneForm.captcha
      }
      userLogin(params).then(res => {
        if (res.data.state === 1) {
          setStore('token', res.data.token)
          setStore('userId', res.data.id)
          // 登录后添加当前缓存中的购物车
          if (this.cart.length) {
            for (var i = 0; i < this.cart.length; i++) {
              addCart(this.cart[i]).then(res => {
                if (res.success === true) {
                }
              })
            }
            removeStore('buyCart')
            this.$router.push({
              path: '/'
            })
          } else {
            this.$router.push({
              path: '/'
            })
          }
        } else {
          this.errMsg = res.data.message
          return false
        }
      })
    }
  },
  mounted () {
    this.login_addCart()
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.login-container {
  margin: 0 auto;
  height: 480px;
  margin-bottom: 259px;
  background-color: #fff;
}
.login-img {
  float: left;
}
.login-img img {
  height: 475px;
  width: 475px;
}
.login-box {
  float: right;
  width: 346px;
  margin-top: 42px;
  margin-bottom: 42px;
  background-color: #fff;
  border: 1px solid #ddd;
  box-shadow: 1px 1px 7px #ddd;
}
.login-tab {
  height: 54px;
  line-height: 54px;
  text-align: center;
}
.login-tab-l {
  float: left;
  width: 50%;
  border-bottom: 1px solid #ebebeb;
}
.login-tab-r {
  float: right;
  width: 50%;
  border-bottom: 1px solid #ebebeb;
}
.login-tab span {
  color: #666;
  font-size: 18px;
  font-family: "microsoft yahei";
  cursor: pointer;
}
.login-tab-l span:hover {
  color: #e43937;
}
.login-tab-r span:hover {
  color: #e43937;
}
.msg-wrap {
  min-height: 25px;
  margin-top: 10px;
  margin-bottom: 10px;
  height: auto!important;
}
.msg-error {
  color: #e4393c;
  line-height: 25px;
  height: auto;
}
.login-tab-l.active {
  border-bottom: 2px solid #e43937;
}
.login-tab-r.active {
  border-bottom: 2px solid #e43937;
}
.login-tab-l.active span {
  color: #e43937;
}
.login-tab-r.active span {
  color: #e43937;
}
.forget-pw {
  text-align: right;
}
.forget-pw a {
  color: #666;
}
.forget-pw a:hover {
  color: #E4393C;
  text-decoration: underline;
}
.coagent li {
  float: left;
  height: 50px;
}
.coagent li img {
  margin: 9px 10px 9px 0px;
}
.coagent li.extra-r {
  float: right;
}
.extra-r a {
  color: #b61d1d;
}
.extra-r a:hover {
  text-decoration: underline;
}
</style>
