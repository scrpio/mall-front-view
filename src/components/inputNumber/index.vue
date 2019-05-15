<template>
  <!--数量-->
  <div class="item-cols-num clearfix">
    <div class="select">
      <span class="down"
            :class="{'down-disabled':Num<=1}"
            @click.stop.prevent="down()">-
      </span>
      <span class="num">
        <input type="text"
               v-model="Num"
               maxlength="2"
               :class="{show:show}"
               @blur="blur()">
                  <ul ref="ul">
                    <li v-for="i in numList" :key="i">{{i}}</li>
                  </ul>
      </span>
      <span class="up"
            :class="{'up-disabled':Num>=limit}"
            @click.stop.prevent="up()">+</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    num: {
      type: [Number],
      default: 1
    },
    id: {
      type: [Number, String]
    },
    checked: {
      type: [String, Boolean]
    },
    limit: {
      type: Number,
      default: 10
    }
  },
  data () {
    return {
      show: true,
      flag: true,
      Num: this.num,
      numList: []
    }
  },
  methods: {
    up () {
      if (this.flag && this.Num < this.limit) {
        this.ani('up')
      }
      return false
    },
    down () {
      if (this.flag && this.Num > 1) {
        this.ani('down')
      }
      return false
    },
    blur () {
      this.Num = this.Num > this.limit ? Number(this.limit) : Number(this.Num)
      this.$emit('edit-num', this.Num, this.id, this.checked)
    },
    ani (opera) {
      this.flag = false
      let n = this.Num
      this.numList = [n - 1, n, n + 1]
      let ul = this.$refs.ul
      let ulStyle = ul.style
      this.show = false
      ulStyle.zIndex = '99'
      ulStyle.transition = 'all .2s ease-out'
      if (opera === 'up') {
        this.Num++
        ulStyle.transform = 'translateY(-54px)'
      } else {
        this.Num--
        ulStyle.transform = `translateY(-18px)`
      }
      ul.addEventListener('transitionend', () => {
        this.show = true
        this.domInt(ulStyle)
        this.flag = true
      })
      ul.addEventListener('webkitAnimationEnd', () => {
        this.show = true
        this.domInt(ulStyle)
        this.flag = true
      })
      this.$emit('edit-num', this.Num, this.id, this.checked)
    },
    domInt (domStyle) {
      domStyle.zIndex = '1'
      domStyle.transition = 'all 0s'
      domStyle.transform = 'translateY(-36px)' // 回到原位
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.select {
  input {
    z-index: 10;
    width: 36px;
    height: 38px;
    border: none;
    text-align: center;
    line-height: 38px;
    font-size: 14px;
    padding: 0;
    color: #666;
    visibility: hidden;
    position: relative;
    border: none;
    &.show {
      visibility: visible;
    }
  }
  ul {
    position: absolute;
    left: 0;
    padding: 0;
    width: 36px;
    line-height: 38px;
    font-size: 14px;
    font-family: system-ui;
    z-index: 1;
    list-style: none;
    display: inline-block;
    transform: translateY(-38px);
  }
  ul li {
    color: #666;
  }
  .up.up-disabled, .up.up-disabled:hover {
    cursor: not-allowed !important;
  }
}

/*数量*/
.item-cols-num {
  display: inline-block;
}

.select {
  height: 38px;
  border: 1px solid #ccc;
  input {
    height: 38px;
    width: 100%;
    text-align: center;
  }
  .down, .up {
    overflow: hidden;
    float: left;
    width: 26px;
    height: 38px;
    line-height: 38px;
    text-align: center;
    cursor: pointer;
    user-select: none;
  }
  .num {
    position: relative;
    overflow: hidden;
    text-align: center;
    float: left;
    width: 38px;
    height: 38px;
    border: none;
    border-left: 1px solid #ccc;
    border-right: 1px solid #ccc;
    line-height: 38px;
    text-align: center;
    font-size: 14px;
  }
}

.down.down-disabled {
  cursor: not-allowed;
}
.down.down-disabled:hover {
  cursor: not-allowed;
}
</style>
