<template>
  <div>
    <pc-nav/>
    <div class="header">
      <div class="w">
        <div class="logo fl"><a class="logo-txt" href="javascript:void(0)">Mall</a></div>
        <div class="search-con fl">
          <el-autocomplete
            placeholder="请输入商品信息"
            v-model="searchInfo"
            class="search-input"
            :fetch-suggestions="querySearchAsync"
            @select="handleSelect"
            @keydown.enter.native="handleClick">
          </el-autocomplete>
          <button class="btn search-btn" id="search-btn" @click="handleClick">搜索</button>
        </div>
        <div class="clear"/>
      </div>
    </div>
  </div>
</template>

<script>
import pcNav from '../nav'
import { getQuickSearch } from '@/api/goods'

export default {
  data () {
    return {
      searchInfo: '',
      searchResults: []
    }
  },
  components: {
    pcNav
  },
  methods: {
    loadWords () {
      if (this.searchInfo === '' || this.searchInfo === undefined) {
        this.searchResults = []
        return
      }
      let params = { key: this.searchInfo }
      getQuickSearch(params).then(res => {
        if (res === null || res === '') {
          return
        }
        if (res.error) {
          this.$message.error({ showClose: true, message: res.error.reason, duration: 2000 })
          return
        }
        var array = []
        var maxSize = 5
        if (res.hits.hits.length <= 5) {
          maxSize = res.hits.hits.length
        }
        for (var i = 0; i < maxSize; i++) {
          var obj = {}
          obj.value = res.hits.hits[i]._source.productName
          array.push(obj)
        }
        if (array.length !== 0) {
          this.searchResults = array
        } else {
          this.searchResults = []
        }
      })
    },
    querySearchAsync (queryString, cb) {
      this.loadWords()
      setTimeout(() => {
        cb(this.searchResults)
      }, 3000)
    },
    handleSelect (item) {
      this.searchInfo = item.value
      this.handleClick()
    },
    handleClick (ev) {
      if (this.$route.path === '/search') {
        this.loadPage('refresh-search', {'key': this.searchInfo})
      } else {
        this.loadPage('Search', {'key': this.searchInfo})
      }
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss">
.el-autocomplete input {
  border: none;
  height: 36px;
  margin: 0;
  padding: 0;
  line-height: 36px;
  background-color: inherit;
}
</style>
