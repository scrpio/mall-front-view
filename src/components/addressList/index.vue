<template>
  <div>
    <div data-id="address.id"
         v-for="(address, index) in  addressList"
         :key="index"
         :class="{'address-item': true, 'active': index === currentAddressIndex}"
         @click="currentAddressIndex = index">
      <div class="address-title">
        收货人：{{address.userName}}
      </div>
      <div class="address-detail">
        <p>收货地址：{{address.streetName}}</p>
        <p>手机号码：{{address.tel}}</p>
      </div>
      <div class="address-opera">
        <span v-if="address.acquiescence" class="address-default">默认地址</span>
        <span v-else class="link" @click="changeDef(address)">设置默认</span>
        <span class="link" @click="showDialog(address)">编辑</span>
        <span class="link" @click="del(address.addressId, index)">删除</span>
      </div>
    </div>
    <div class="address-add" @click="showDialog()">
      <div class="address-new">
        <i class="el-icon-plus"/>
        <p class="text">使用新地址</p>
      </div>
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
</template>

<script>
import { addressUpdate, addressAdd, addressDel } from '@/api/goods'
import { getStore } from '@/util/storage'

export default {
  props: {
    addressList: {
      type: Array,
      required: false
    },
    selectAddress: {
      type: Function,
      required: true
    }
  },
  data () {
    return {
      dialogVisible: false,
      dialogTitle: '管理收货地址',
      userId: '',
      addressData: {
        userId: this.userId,
        addressId: '',
        userName: '',
        tel: '',
        streetName: '',
        acquiescence: false
      },
      currentAddressIndex: -1
    }
  },
  created () {
    this.userId = getStore('userId')
    this.setCurrentAddressIndex()
  },
  activated () {
    this.setCurrentAddressIndex()
  },
  methods: {
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
          this.addressList.splice(i, 1)
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
    },
    setCurrentAddressIndex () {
      for (let i = 0; i < this.addressList.length; i++) {
        if (this.addressList[i].acquiescence) {
          this.currentAddressIndex = i
        }
      }
      if (this.currentAddressIndex === -1) {
        this.currentAddressIndex = 0
      }
    }
  },
  components: {},
  watch: {
    currentAddressIndex: {
      handler: function (val, oldVal) {
        if (this.addressList[val]) {
          this.selectAddress(this.addressList[val])
        }
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.address-item,
.address-add{
    margin:20px 20px 0 0;
    width: 200px;
    padding: 5px 8px;
    float: left;
    border: 3px dashed #ccc;
    cursor: pointer;
}
.address-item.active{
    border: 3px dashed #c60023;
}
.address-item:hover,
.address-add:hover{
    background: #fff;
}
.address-item .address-title{
    color: #666;
    height: 20px;
    line-height: 20px;
    overflow: hidden;
    border-bottom: 1px solid #ddd;
}
.address-item .address-detail{
    margin-top: 5px;
    height: 60px;
    line-height: 20px;
    overflow: hidden;
    color: #666;
}
.address-item .address-opera{
    text-align: right;
    visibility: hidden;
}
.address-item:hover .address-opera{
    visibility: visible;
}
.address-item .address-opera .link{
    margin-right: 5px;
}
.address-add .address-new{
    text-align: center;
    color: #ccc;
    padding-top: 18px;
    padding-bottom: 18px;
}
.address-add .address-new i{
    font-size: 50px;
}
.address-add .address-new .text{
    font-size: 12px;
}
.address-default {
  color: #E6A23C;
}
</style>
