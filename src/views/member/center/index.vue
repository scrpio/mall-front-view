<template>
  <div class="container">
    <div class="w">
      <div class="sub">
        <nav-side></nav-side>
      </div>
      <div class="main">
        <div class="mod-main">
          <div class="mt">我的信息</div>
          <div class="mc">
            <div class="user-info">
              <div class="form-item">
                <span class="form-label">登录名：</span>
                <input type="text" v-model="memberForm.username" class="form-input"/>
              </div>
              <div class="form-item">
                <span class="form-label">性别：</span>
                <input type="radio" name="sex" v-model="memberForm.sex" class="form-radio" value="0">
                <label class="mr">男</label>
                <input type="radio" name="sex" v-model="memberForm.sex" class="form-radio" value="1">
                <label class="mr">女</label>
                <input type="radio" name="sex" v-model="memberForm.sex" class="form-radio" value="2">
                <label class="mr">保密</label>
              </div>
              <div class="form-item">
                <span class="form-label">生日：</span>
                <el-date-picker type="date" v-model="memberForm.birthday"/>
              </div>
              <div class="form-item">
                <span class="form-label">电话：</span>
                <input type="text" v-model="memberForm.phone" class="form-input"/>
              </div>
              <div class="form-item">
                <span class="form-label">邮箱：</span>
                <input type="email" v-model="memberForm.email" class="form-input"/>
              </div>
              <div class="form-item">
                <span class="form-label"></span>
                <a href="javascript:void(0)" class="btn">提交</a>
              </div>
            </div>
            <div class="user-avatar">
              <p class="avatar-label">个人头像</p>
              <el-upload
                :with-credentials="true"
                :action="doUpload"
                :show-file-list="false"
                :before-upload="handleBeforeUpload"
                :on-success="handleSuccess"
                class="avatar-uploader">
                <img v-if="userInfo.info.file" :src="userInfo.info.file" class="avatar-img">
                <i v-else class="el-icon-upload avatar-icon"/>
              </el-upload>
            </div>
            <div class="clear"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavSide from '@/components/layout/nav-side'
import { mapState } from 'vuex'

export default {
  data () {
    return {
      imageUrl: '',
      doUpload: process.env.BASE_API + '/upload/file',
      memberForm: {
        username: '',
        sex: '',
        birthday: '',
        phone: '',
        email: '',
        file: ''
      }
    }
  },
  computed: {
    ...mapState(['userInfo']),
    getUserInfo () {
      return this.userInfo.info
    }
  },
  components: {
    NavSide
  },
  mounted () {
    this.currentUser()
  },
  methods: {
    currentUser () {
      this.memberForm = this.getUserInfo
    },
    handleBeforeUpload (file) {
      var that = this
      const isLt2M = file.size / 1024 / 1024 < 2
      const isFlag = file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/png'
      if (!isFlag) {
        that.$message.error({ showClose: true, message: '所选文件‘ ' + file.name + ' ’格式不正确, 请选择 .jpg 或 .png格式文件.', duration: 2000 })
      }
      if (!isLt2M) {
        that.$message.error({ showClose: true, message: '上传头像图片大小不能超过 5M.', duration: 2000 })
      }
      return isFlag && isLt2M
    },
    handleSuccess (res, file) {
      if (res.success) {
        this.imageUrl = URL.createObjectURL(file.raw)
        this.memberForm.avatar = res.data
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.user-info {
  float: left;
  width: 680px;
  padding: 20px 5px 0 15px;

  input.form-radio {
    float: none;
    vertical-align: -2px;
    margin: 0 3px 0 0;
    padding: 0;
  }
  .mr {
    float: none;
    margin-right: 10px;
  }
}
.user-avatar {
  float: left;
  overflow: hidden;
  width: 160px;
  padding: 20px 10px;
  color: #666;
}
.avatar-label {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 10px;
}
.avatar-uploader {
  width: 162px;
  height: 162px;
  background: #f9f9f9;
  border-radius: 6px;
  border: 1px solid #DCDFE6;
  box-sizing: border-box;
  cursor: pointer;
  overflow: hidden;
}
.avatar-uploader:hover {
  border-color: #C0C4CC;
}
.avatar-img {
  width: 160px;
  height: 160px;
  display: block;
}
.avatar-icon {
  font-size: 67px;
  color: #8c939d;
  width: 160px;
  height: 160px;
  line-height: 160px !important;
  text-align: center;
}
</style>
