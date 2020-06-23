<template>
  <div class="dialog">

    <el-dialog :title="formTitle"
               width="600px"
               :visible.sync="$parent.dialogFormVisible"
               @close="closeDialog"
               :close-on-click-modal="false">
      <!-- <div class="map-icon">
        <i class="el-icon-map-location"></i>
      </div> -->
      <!-- <button id="click-select"
              @click="clicks"
              ref="closeSelect">点击</button> -->
      <div style="height:400px; overflow-y:auto;padding-right:20px"
           ref="formScroll">
        <slot></slot>
        <div class="el-form-item"
             v-if="$route.meta.hasMap && $route.name !== 'definedModule' && $route.name !== 'country'">
          <label class="el-form-item__label"
                 ref="jingduLabel">经度</label>
          <div class="el-form-item__content"
               ref="jingduInput">
            <el-input v-model="$parent.form.jingdu"
                      @input="$parent.form.jingdu = toDecimals($parent.form.jingdu)"></el-input>
          </div>
        </div>

        <div class="el-form-item"
             v-if="$route.meta.hasMap && $route.name !== 'definedModule' && $route.name !== 'country'">
          <label class="el-form-item__label"
                 ref="weiduLabel">纬度</label>
          <div class="el-form-item__content"
               ref="weiduInput">
            <el-input v-model="$parent.form.weidu"
                      @input="$parent.form.weidu = toDecimals($parent.form.weidu)"></el-input>
          </div>
        </div>

      </div>

      <template v-slot:footer
                v-if="!$parent.viewUserInfor"
                class="dialog-footer">
        <el-button class="map-btn"
                   v-if="$route.meta.hasMap && hasMap"
                   @click="openMapDialog"
                   type="info">
          <i class="el-icon-map-location"></i>&nbsp;&nbsp;获取当前地理位置信息
        </el-button>
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary"
                   @click="addData">确 定</el-button>
      </template>

    </el-dialog>

    <el-dialog title="替换数据"
               :visible.sync="replaceDialog"
               width="20%"
               :before-close="closeReplaceDialog">
      <span>系统中已存在相同数据，即将替换</span>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="closeReplaceDialog">取 消</el-button>
        <el-button type="primary"
                   @click="replaceData">确 定</el-button>
      </span>
    </el-dialog>
    <Map v-if="mapDialog && $route.meta.hasMap"></Map>
  </div>
</template>

<script>
import BaiduMap from '@/utils/mapInit.js'
import Map from '@/views/dataManagement/components/map'
export default {
  components: {
    Map,
  },
  props: {
    formTitle: String,
    jingduName: String,
    weiduName: String,
    hasTownAndCountry: {  //判断有没有乡镇村庄下拉框
      type: Boolean,
      default: false
    },
    hasMap: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      mapDialog: false,//地图弹框
      scrollDom: null,
      sureCloseDialog: false,
    }
  },

  computed: {
    replaceDialog () {
      return this.$store.state.crud.replaceDialog
    },
    stateWeidu () {
      return this.$store.state.crud.weidu
    },
    stateJingdu () {
      return this.$store.state.crud.jingdu
    }
  },

  watch: {
    stateWeidu (to, from) {
      if (to && this.$route.name !== 'definedModule') {
        this.$parent.form.jingdu = this.stateJingdu
        this.$parent.form.weidu = this.stateWeidu
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.scrollDom = this.$refs.formScroll
      this.scrollDom.addEventListener('scroll', this.closeSelect);
    })
    if (this.$route.meta.hasMap && this.$route.name !== 'definedModule' && this.$route.name !== 'country') {
      let formLable = document.getElementsByClassName('el-form-item__label')
      setTimeout(() => {
        let width = Array.from(formLable)[0].style.width
        this.$refs.jingduLabel.style.width = width
        this.$refs.weiduLabel.style.width = width
        this.$refs.jingduInput.style.marginLeft = width
        this.$refs.weiduInput.style.marginLeft = width
      })
    }
  },

  destroyed () {
    let form = this.$parent.form
    for (const key in form) {
      form[key] = ''
    }
    this.scrollDom.removeEventListener('scroll', this.closeSelect)
  },

  methods: {
    openMapDialog () {//打开地图开关
      if (this.$parent.form.jingdu && this.$parent.form.weidu && this.$route.name !== 'definedModule') {
        this.$store.commit('crud/GET_LONGITUDE_AND_LATITUDE', { jingdu: this.$parent.form.jingdu, weidu: this.$parent.form.weidu })
      } else if (this.$route.name === 'definedModule') {
        this.$store.commit('crud/GET_LONGITUDE_AND_LATITUDE', { jingdu: this.$parent.form[this.jingduName], weidu: this.$parent.form[this.weiduName] })
      }
      this.mapDialog = true
    },
    closeReplaceDialog () { //关闭替换开关
      this.$store.commit('crud/ONOFF_REPLACE_DIALOG', false)
    },
    closeSelect () {
      let type = Object.prototype.toString.call(this.$parent.$refs.mySelect)
      if (type === '[object Object]') {
        this.$parent.$refs.mySelect.handleClose()

        this.$parent.$refs.mySelect.blur()
      } else if (type === '[object Array]') {
        this.$parent.$refs.mySelect.forEach(item => {
          item.handleClose()
          item.blur()
        })
      }
    },

    closeDialog () {
      if (this.stateJingdu && this.stateWeidu) {
        this.$store.commit('crud/CLEAR_LONGITUDE_AND_LATITUDE')
      }
      this.$store.commit('crud/ONOFF_ADDDATA_DIALOG', false)
    },
    replaceData () {
      this.$parent.form.type = 1
      this.$parent.addData()
    },
    addData () {
      this.$parent.addData()
    },

  },
}
</script>

<style lang="scss" scoped>
.dialog {
  //   .el-input {
  //     width: 400px;
  //   }
  .left-btn {
    float: left;
  }
  .el-form-item__label {
    text-align: right;
    vertical-align: middle;
    float: left;
    color: #606266;
    // width: 140px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }
  .el-form-item__content {
    // margin-left: 140px;
    position: relative;
  }
}
</style>