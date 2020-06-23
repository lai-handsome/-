<template>
  <div class="top">
    <div class="top-left">
      <!-- <el-button type="danger"
                 @click="openDeleteDialog"
                 round>删除</el-button> -->

      <div class="btn"
           @click="openDeleteDialog"
           v-if="btnPermission($route.name,'delete')">
        <img src="../../../assets/icon/icon-delete.png"
             alt="">
        <span>删除</span>
      </div>
      <div class="btn"
           v-if="btnPermission($route.name,'delete')"
           v-permission="{name:$route.name,btnName:'import'}">
        <el-upload class="upload-demo"
                   ref="upload"
                   :action="importUrl"
                   :before-upload="beforeImportExcel"
                   :file-list="fileList"
                   :show-file-list="false"
                   :http-request="replaceData"
                   :on-success="successImportExcel"
                   :on-exceed="onExceed"
                   :auto-upload="true"
                   multiple
                   :limit="3">
          <!-- <el-button plain>导入</el-button> -->

          <img src="../../../assets/icon/icon-import.png"
               alt="">
          <span>导入</span>
          <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
        </el-upload>
      </div>

      <!-- <el-button type="success"
                 round
                 @click="openExportDialog">导出</el-button> -->

      <div class="btn"
           @click="openExportDialog"
           v-if="btnPermission($route.name,'delete')"
           v-permission="{name:$route.name,btnName:'export'}">
        <img src="../../../assets/icon/icon-export.png"
             alt="">
        <span>导出</span>
      </div>
      <!-- <el-button type="info"
                 round
                 @click="generateExcelTemplate">Excel模板</el-button> -->

      <div class="btn"
           @click="generateExcelTemplate"
           v-if="btnPermission($route.name,'delete')"
           v-permission="{name:$route.name,btnName:'excelTemplate'}">
        <span>Excel模板</span>
      </div>
    </div>

    <div class="top-right">
      <div class="btn"
           v-if="btnPermission($route.name,'delete')"
           v-permission="{name:$route.name,btnName:'addData'}">

        <el-button type="primary"
                   @click="addData">新增</el-button>
      </div>
      <slot name="insertBtn"></slot>
      <div class="btn"
           v-if="$route.name !== 'definedModule' && btnPermission($route.name,'delete')">
        <el-button type="success"
                   @click="queryData">查询</el-button>
      </div>
      <slot></slot>
    </div>

    <el-dialog title="删除提示"
               :visible.sync="deleteDialogVisible"
               :before-close="closeDeleteDialog"
               width="300px">
      <span>确定要删除这些数据吗？</span>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="closeDeleteDialog">取 消</el-button>
        <el-button type="primary"
                   @click="deleteDatas">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="选取提示"
               :visible.sync="deleteTip"
               width="300px">
      <span>您还没有选择数据哟！,请先选取数据</span>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="deleteTip = false">取 消</el-button>
        <el-button type="danger"
                   @click="deleteTip = false">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="导出提示"
               :visible.sync="exportDialog"
               width="300px">
      <span>{{exportMessage}}</span>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="exportDialog = false">取 消</el-button>
        <el-button type="danger"
                   @click="export2Excel">继 续</el-button>
      </span>
    </el-dialog>

    <el-dialog :visible.sync="replaceDialog"
               width="300px">
      <span>系统中已存在相同数据，即将替换</span>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="replaceDialog = false">取 消</el-button>
        <el-button type="danger"
                   @click="replaceData">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import request from '@/request/request'
import axios from 'axios'
// import Blob from '@/utils/Blob.js';
// import Export2Excel from '@/utils/Export2Excel.js';
import { ROOT } from '@/request/request'
import deepClone from '@/utils/deepClone'
export default {
  props: {
    importExcelUrl: String,
    exportExcelUrl: String,
    excelTemplateUrl: String,
    exportExcelData: {
      type: Object,
      default: () => { }
    },
    importExcelData: {
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {
      token: localStorage.token,
      exportDialog: false,
      exportMessage: '',
      importDialogVisible: false,
      deleteTip: false,
      formCopy: null,
      fileList: [],
      file: null,
      dataType: 0,// 添加数据0，替换数据1
      replaceDialog: false //导入替换数据
    }
  },
  computed: {
    deleteDialogVisible () {
      return this.$store.state.crud.deleteDatasDialog
    },
    importUrl () {
      return ROOT + this.importExcelUrl
    },
    routeTitle () {
      return this.$route.meta.title || this.$route.query.title
    },
    moduleTypeId () {
      return this.$route.query.routeId
    },
    dataList () {
      return this.$store.state.crud.dataList
    }
  },
  watch: {
    replaceDialog (to, oldValue) {
      if (to) {
        this.dataType = 1
      } else {
        this.dataType = 0
      }
    }
  },
  mounted () {
    this.formCopy = deepClone(this.$parent.form);
  },
  methods: {
    openExportDialog () {
      if (this.dataList.length > 0) {
        if (this.$parent.selectedItemsIds.length == 0) {
          this.exportMessage = '即将导出全部数据'
        } else {
          this.exportMessage = '将导出所筛选的数据'
        }
        this.exportDialog = true
      } else {
        this.$message({
          type: 'error',
          message: '暂无可导出数据，不能导出成功',
          showClose: true,
        })
      }

    },
    //数据写入excel
    export2Excel () {
      let data = this.exportExcelData

      if (this.$parent.selectedItemsIds.length === 0) {
        data.type = 1
      } else {
        data.type = 0
      }
      let tHeader
      let filterVal
      let tableData
      request({
        url: this.exportExcelUrl,
        method: 'post',
        data
      }).then(res => {
        if (res.code == '10000') {
          this.$message({
            message: res.msg,
            type: 'success',
            showClose: true,
          })
          this.exportDialog = false
          tHeader = res.data.tHeader  // 导出的表头名信息
          filterVal = res.data.filterVal // 导出的表头字段名，需要导出表格字段名
          //  for (i; i < filterVal.length; i++) {
          //     let key = filterVal[i]
          //     tableData[0][key]
          //   }
          this.$parent.selectedItemsIds = []
          //   if (this.$parent.changeTableData) {
          //     tableData = this.$parent.changeTableData(res.data.tableData)
          //   } else {
          tableData = res.data.tableData
          //   }  
        }
      }).then(() => {
        require.ensure([], () => {
          const { export_json_to_excel } = require('@/utils/Export2Excel'); //这里必须使用绝对路径，使用@/+存放export2Excel的路径

          const data = this.formatJson(filterVal, tableData);
          //   const data = this.formatJson(tableData)
          // export_json_to_excel(tHeader, filterVal, data, this.routeTitle);// 导出的表格名称，根据需要自己命名
          let title = this.$parent.tableTitle || this.routeTitle
          export_json_to_excel(tHeader, data, title);// 导出的表格名称，根据需要自己命名
        })
      })

    },
    // 格式转换，直接复制即可
    formatJson (filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },

    generateExcelTemplate () {
      let data
      if (this.exportExcelData.moduleTypeId) {
        data = {
          moduleTypeId: this.exportExcelData.moduleTypeId
        }
      }
      request({
        url: this.excelTemplateUrl,
        method: 'post',
        data
      }).then(res => {
        if (res.code == '10000') {
          this.$message({
            message: res.msg,
            type: 'success',
            showClose: true
          })
          let tHeader = res.data.tHeader  // 导出的表头名信息
          let filterVal = res.data.filterVal // 导出的表头字段名，需要导出表格字段名
          let tableData = [{}]  //
          let i = 0
          for (i; i < filterVal.length; i++) {
            let key = filterVal[i]
            tableData[0][key]
          }

          require.ensure([], () => {
            const { export_json_to_excel } = require('@/utils/Export2Excel'); //这里必须使用绝对路径，使用@/+存放export2Excel的路径
            const data = this.formatJson(filterVal, tableData);
            let title = this.$parent.tableTitle || this.routeTitle
            export_json_to_excel(tHeader, data, title);// 导出的表格名称，根据需要自己命名
          })
        }
      })
    },

    openDeleteDialog () {// 打开删除弹框
      if (this.$parent.selectedItemsIds.length === 0) {
        return this.deleteTip = true
      }

      this.$store.commit('crud/ONOFF_DELETE_DATAS', true)
    },

    closeDeleteDialog () {// 关闭删除弹框
      this.$store.commit('crud/ONOFF_DELETE_DATAS', false)
    },

    addData () {
      this.$parent.isCompile = false
      this.$parent.form = deepClone(this.formCopy)
      this.$store.commit('crud/ONOFF_ADDDATA_DIALOG', true)
    },
    queryData () {// 查询数据
      this.$parent.getDataList()
    },

    deleteDatas () {
      let ids = this.$parent.selectedItemsIds.join(',')
      this.$parent.deleteData(ids)
    },

    importData () {
      this.importDialogVisible = true
    },
    beforeImportExcel (item) {
      let name = item.name.split('.')[1]
      if (name === 'xls' || name == 'xlsx') {
        return true
      } else {
        this.$message({
          message: '请您选择excel文件进行上传',
          type: 'error'
        })
        return false
      }
    },

    successImportExcel (res) {
      if (res.code == '10000') {
        if (res.replace) {
          this.replaceDialog = true
          return
        }
        this.$message({
          message: res.msg,
          type: 'success'
        })
        this.$parent.selectedItemsIds.length = 0
        this.$parent.getDataList()
      } else {
        this.$message({
          message: res.msg,
          type: 'error'
        })
      }
    },

    onExceed (files, fileList) { //文件导入达到限制
      this.$refs.upload.clearFiles()
      this.replaceData(files)
    },

    replaceData (file) {
      const loading = this.$loading({
        text: '拼命导入中！',
      });

      if (file.hasOwnProperty('file')) {
        this.file = file.file
      }
      let importUrl = this.importUrl
      let data = new FormData
      data.append('file', this.file)
      data.append('type', this.dataType)
      let moduleTypeId = this.moduleTypeId
      if (this.$route.name === 'definedModule') moduleTypeId = this.exportExcelData.moduleTypeId

      data.append('moduleTypeId', moduleTypeId)

      let config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          'token': this.token
        }
      }

      axios.post(importUrl, data, config).then(res => {
        loading.close()
        if (res.data.code == '10000') {

          if (res.data.replace) {
            this.replaceDialog = true
            return
          }
          this.$message({
            message: res.data.msg,
            type: 'success',
            showClose: true
          })
          this.$parent.selectedItemsIds.length = 0
          this.$parent.getDataList()
          this.replaceDialog = false
        } else if (res.data.code == '10001' || res.data.code == '10002') {
          this.$message({
            message: res.data.msg,
            type: 'error',
            showClose: true
          })
        }
      })
    }
  },
}
</script>

<style lang="scss" scoped>
.top {
  padding: 20px 0;
  font-size: 18px;
  overflow: hidden;
  height: 40px;
  line-height: 40px;
}
.upload-demo {
  display: inline-block;
  margin: 0 20px;
}
.top-left {
  overflow: hidden;
  float: left;
  color: #0174ff;
  .btn {
    width: 90px;
    height: 40px;
    border: 1px solid #0174ff;
    box-sizing: border-box;
    border-radius: 4px;
    text-align: center;
    float: left;
    cursor: pointer;
    margin-right: 20px;
    .upload-demo {
      margin: 0;
    }
    img {
      width: 20px;
      height: 18px;
      vertical-align: middle;
    }
    span {
      vertical-align: middle;
    }
  }
}
.top-right {
  //   overflow: hidden;
  float: right;
  div {
    float: right;
  }
  .pull-down {
    margin-left: 20px;
    line-height: 40px;
  }
  .margin40 {
    margin-left: 40px;
  }
  .btn {
    margin-left: 40px;
  }
}
</style>