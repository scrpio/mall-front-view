<template>
  <div class="container">
    <div class="w">
      <div class="sub">
        <nav-side></nav-side>
      </div>
      <div class="main">
        <div class="mod-main">
          <div class="mt">收货地址</div>
          <div class="mc">
            <div v-if="addList.length">
              <div v-for="(item, index) in addList" :key="index" class="address-box">
                <div class="form-item">
                  <a class="icon-del" title="删除" @click="del(item.addressId, index)">
                    <i class="el-icon-error icon-btn"/>
                  </a>
                </div>
                <div class="form-item">
                  <span class="form-label">收货人：</span>
                  <span>{{ item.userName }}</span>
                </div>
                <div class="form-item">
                  <span class="form-label">电&nbsp;&nbsp;&nbsp;话：</span>
                  <span>{{ item.tel }}</span>
                </div>
                <div class="form-item">
                  <span class="form-label">地&nbsp;&nbsp;&nbsp;址：</span>
                  <span>{{ item.streetName }}</span>
                </div>
                <div class="form-item fr">
                  <span v-if="item.acquiescence" class="default-txt">默认地址</span>
                  <a v-else href="javascript:void(0)" class="link" @click="changeDef(item)">设为默认</a>
                  <a href="javascript:void(0)" class="link ml10" @click="showDialog(item)">编辑</a>
                </div>
              </div>
            </div>
            <div v-else class="address-empty">
              你还未添加收货地址
            </div>
            <div>
              <a href="javascript:void(0)" class="btn" @click="showDialog()">添加地址</a>
            </div>
            <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" :close-on-click-modal="false" width="32%">
              <div class="form-item">
                <span class="form-label">收货人：</span>
                <input type="text" v-model="addressData.userName" class="form-input"/>
              </div>
              <div class="form-item">
                <span class="form-label">电话：</span>
                <input type="text" v-model="addressData.tel" class="form-input"/>
              </div>
              <div class="form-item">
                <span class="form-label">地址：</span>
                <input type="text" v-model="addressData.streetName" class="form-input"/>
              </div>
              <div class="form-item">
                <span class="form-label">设为默认：</span>
                <el-switch v-model="addressData.acquiescence" active-color="#13ce66"/>
              </div>
              <div class="form-item">
                <span class="form-label"></span>
                <a class="btn" @click="save(addressData)">提交</a>
              </div>
            </el-dialog>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavSide from '@/components/layout/nav-side'
import { addressList, addressUpdate, addressAdd, addressDel } from '@/api/goods'
import { getStore } from '@/util/storage'

export default {
  data () {
    return {
      dialogVisible: false,
      dialogTitle: '管理收货地址',
      addList: [],
      userId: '',
      addressData: {
        userId: this.userId,
        addressId: '',
        userName: '',
        tel: '',
        streetName: '',
        acquiescence: false
      }
    }
  },
  created () {
    this.userId = getStore('userId')
    this._addressList()
  },
  components: {
    NavSide
  },
  methods: {
    _addressList () {
      addressList({userId: this.userId}).then(res => {
        let data = res.data
        if (data.length) {
          this.addList = res.data
          this.addressId = res.data[0].addressId || '1'
        } else {
          this.addList = []
        }
      })
    },
    _addressUpdate (params) {
      addressUpdate(params).then(res => {
        this._addressList()
      })
    },
    _addressAdd (params) {
      addressAdd(params).then(res => {
        if (res.success === true) {
          this._addressList()
        } else {
          this.$message.error({ showClose: true, message: res.message, duration: 2000 })
        }
      })
    },
    save (data) {
      this.dialogVisible = false
      if (data.addressId) {
        this._addressUpdate(data)
      } else {
        this._addressAdd(data)
      }
    },
    del (addressId, i) {
      addressDel({addressId: addressId}).then(res => {
        if (res.success === true) {
          this.addList.splice(i, 1)
        } else {
          this.$message.error({ showClose: true, message: res.message, duration: 2000 })
        }
      })
    },
    changeDef (item) {
      if (!item.acquiescence) {
        item.acquiescence = true
        this._addressUpdate(item)
      }
      return false
    },
    showDialog (item) {
      this.dialogVisible = true
      if (item) {
        this.dialogTitle = '编辑收货地址'
        this.addressData = item
      } else {
        this.dialogTitle = '添加收货地址'
        this.addressData = {
          userId: this.userId,
          addressId: '',
          userName: '',
          tel: '',
          streetName: '',
          acquiescence: false
        }
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.address-box {
  border: 2px solid #e6e6e6;
  margin: 0 0 10px;
  padding-right: 20px;
  overflow: hidden;
}
.default-txt {
  color: #E6A23C;
}
.icon-del {
  float: right;
  margin-top: 20px;
  visibility: hidden;
}
.address-box:hover .icon-del {
  visibility: visible;
}
.address-empty {
  text-align: center;
  font-size: 16px;
  padding-top: 20px;
  padding-bottom: 20px;
}
</style>
