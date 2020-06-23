<template>
  <div class="content-main">
    <contentHeaderBtns :importExcelUrl="'/diyData/importExcel'"
                       :excelTemplateUrl="'/diyData/excelModle'"
                       :exportExcelUrl="'/diyData/exportExcel'"
                       :exportExcelData="{ids:selectedItemsIds.join(','),moduleTypeId:moduleTypeId}">
      <div class="btn">
        <el-button type="danger"
                   @click="$parent.componentName = 'hasTableList'">返回</el-button>
      </div>
    </contentHeaderBtns>
    <!-- <my-table :columns="columns"
              :selectedItemsIds.sync="selectedItemsIds"></my-table> -->
    <div class="table-container"
         v-if="dataList !== null && Array.isArray(dataList)">
      <el-table :data="dataList"
                :header-cell-style="{background: '#f5f5f5',color: '#333'}"
                style="width: 100%"
                :empty-text="dataList.length === 0 ? '暂无数据':''"
                max-height="560"
                @selection-change="checkItems">
        <el-table-column type="selection"
                         :fixed="$parent.formList && $parent.formList.length > 5 ? 'left' :false "
                         width="46">
        </el-table-column>
        <el-table-column :fixed="$parent.formList && $parent.formList.length > 5 ? 'left' :false "
                         label="序号"
                         type="index"
                         align="center"
                         :width="$parent.formList && $parent.formList.length > 0 ? '80' : '600'">
        </el-table-column>
        <el-table-column v-for="(item,index) in $parent.formList"
                         min-width="220"
                         :key="index"
                         :prop="item.engName"
                         :label="item.chineseName"
                         align="center"></el-table-column>

        <el-table-column align="center"
                         fixed="right"
                         :width="$parent.formList && $parent.formList.length > 0 ? '300' : '600'"
                         label="操作">
          <template slot-scope="scope">
            <el-button @click="changeData(scope.row)"
                       v-permission="{name:$route.name,btnName:'compile'}">编辑</el-button>
            <el-button @click="checkItemDetails(scope.row)"
                       v-permission="{name:$route.name,btnName:'checkDetails'}">查看</el-button>
            <!-- <el-button type="danger"
                       @click="openDeleteDialog(scope.row.id)">
              删除
            </el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-if="total >= 10"
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="page"
                     :page-sizes="[5,10, 20]"
                     :page-size="pageSize"
                     background
                     style="margin-top:40px;float:right"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total"></el-pagination>
    </div>

    <formDialog v-if="dialogFormVisible"
                :formTitle="tableTitle"
                :jingduName="$parent.longitudeName"
                :weiduName="$parent.latitudeName"
                :hasMap="hasMap">
      <el-form label-width="100px"
               :disabled="viewUserInfor"
               ref="ruleForm"
               :model="form">
        <el-form-item v-for="item in $parent.formList"
                      :prop="item.engName"
                      :rules="item.chineseName === '乡/镇/街道' || item.chineseName  === '村' || item.format ? 
                     { required: true, message: '文本框不能为空', trigger: ['blur','change']} : []"
                      :key="item.id"
                      :label="item.chineseName">
          <el-select v-if="item.chineseName === '乡/镇/街道'"
                     v-model="form[item.engName]"
                     ref="mySelect"
                     @focus="mySelect1 = 'mySelect'"
                     @blur="mySelect1 = ''"
                     placeholder="请选择乡镇"
                     value-key="id"
                     @change="(i) => getTownItem(i,item.engName)"
                     @visible-change="getCountrySelectDataList($event,1)">
            <el-option v-for="i in townList"
                       :key="i.id"
                       :label="i.name"
                       :value="i">
            </el-option>
          </el-select>
          <el-select v-else-if="item.chineseName === '村'"
                     v-model="form[item.engName]"
                     :ref="mySelect2"
                     @focus="mySelect2 = 'mySelect'"
                     @blur="mySelect2 = ''"
                     placeholder="请选择村庄"
                     value-key="id"
                     @change="(i) => getCountryItem(i,item.engName)"
                     @visible-change="getCountrySelectDataList($event,2)">
            <el-option v-for="i in countryList"
                       :key="i.id"
                       :label="i.name"
                       :value="i.name">
            </el-option>
          </el-select>
          <el-date-picker v-else-if="item.chineseName.includes('年') && item.format"
                          v-model="form[item.engName]"
                          :ref="mySelect3"
                          @focus="mySelect3 = 'mySelect'"
                          @blur="mySelect3 = ''"
                          :type="item.type"
                          :value-format="item.format"
                          :placeholder="'选择'+item.chineseName">
          </el-date-picker>
          <!-- <el-input v-else-if="item.disabled"
                    v-model="form[item.engName]"
                    @input="form[item.engName] = toDecimals(item.engName)"></el-input> -->
          <el-input v-model="form[item.engName]"
                    v-else></el-input>
        </el-form-item>
      </el-form>
    </formDialog>

    <el-dialog title="删除提示"
               :visible.sync="deleteDialogVisible"
               :before-close="closeDeleteDialog"
               width="300px">
      <span>确定要删除这条数据吗？</span>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="closeDeleteDialog">取 消</el-button>
        <el-button type="primary"
                   @click="deleteData(id)">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="提示"
               :visible.sync="mustDialog"
               width="15%">
      <span>您还有必填项没填哦</span>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="mustDialog = false">取 消</el-button>
        <el-button type="primary"
                   @click="mustDialog = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import contentHeaderBtns from '@/views/dataManagement/components/contentHeaderBtns'
import formDialog from '@/views/formDialog'
import request from '@/request/request'
export default {
  components: {
    formDialog,
    contentHeaderBtns,
  },

  props: {
    tableItem: {
      type: Object,
      default: () => { }
    },
    columns: {
      type: Array,
      default: () => []
    },
    tableTitle: String,
    hasMap: Boolean,
    moduleTypeId: [Number, String]
  },

  data () {
    return {
      mustDialog: false, //必填弹框
      mySelect1: '',
      mySelect2: '',
      mySelect3: '',
      selectedItemsIds: [],
      page: 1,
      pageSize: 10,
      form: {},
      //   formCopy: {},
      emptyText: '',
      townItem: null,
      countryName: '',//存储村名
      townName: '', //存储镇名
      countryside: sessionStorage.countryId,// 一级乡镇id
      isCompile: false, //是否是编辑的开关
      viewUserInfor: false,//查看
      id: ''//单条数据的id
    }
  },

  computed: {
    deleteDialogVisible () {  //删除弹框
      return this.$store.state.crud.deleteDialog
    },

    dialogFormVisible: {
      get () {
        return this.$store.state.crud.addDialog
      },
      set (val) {

      }
    },

    dataList () {
      return this.$store.state.crud.dataList
    },

    total () {
      return this.$store.state.crud.total
    },

    countryList () {
      return this.$store.state.townAndCountry.countryList
    },

    townList () {
      return this.$store.state.townAndCountry.townList
    },

    jingdu () {
      return this.$store.state.crud.jingdu
    },

    weidu () {
      return this.$store.state.crud.weidu
    }
  },

  watch: {
    dialogFormVisible (to, from) {
      if (!to) {
        this.viewUserInfor = false
        this.townItem = null
        this.townName = ''
        this.countryName = ''
      }
    },

    jingdu (to, from) {
      if (to) {
        let jingduName = this.$parent.longitudeName
        this.form[jingduName] = this.jingdu
        this.$forceUpdate()
      }
    },
    weidu (to, from) {
      if (to) {
        let weiduName = this.$parent.latitudeName
        this.form[weiduName] = this.weidu
      }
    }
  },

  mounted () {
    let list = this.$parent.formList
    for (const item of list) {
      this.$set(this.form, item.engName, '')
      //   this.$set(this.formCopy, item.engName, '')
    }
    this.getDataList()
  },

  methods: {
    checkItems (selection) {
      this.selectedItemsIds = selection.map(item => item.id)
    },

    closeDeleteDialog () {// 关闭删除弹框
      this.$store.commit('crud/ONOFF_DELETE_DATA', false)
    },

    getTownItem (item, townName) {
      this.form[townName] = item.name
      this.townName = item.name
      this.townItem = item
      this.$forceUpdate()
      if (this.countryName) this.form[this.countryName] = ''
      this.$store.commit('townAndCountry/GET_TOWN_ITEM', { item: item })
    },

    getCountryItem (item, countryName) {
      this.$forceUpdate()
      this.countryName = countryName
    },

    getDataList () {
      let data = {
        page: this.page,
        pageSize: this.pageSize,
        moduleTypeId: this.moduleTypeId
        // moduleTypeId: 83
      }
      this.$store.dispatch('crud/getDataList', { url: '/diyData/find', method: 'get', params: { params: data } })
    },

    addData () {
      let isRequest = true
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {

        } else {
          isRequest = false
          return false
        }
      });

      let jingduName = this.$parent.longitudeName
      let weiduName = this.$parent.latitudeName

      if (this.hasMap && (!this.form[jingduName] || !this.form[weiduName])) {
        this.$message({
          message: '请标注地图上的位置，再提交数据！',
          type: 'error',
          showClose: true,
        })
        return
      }

      this.$store.commit('crud/GET_LONGITUDE_AND_LATITUDE', { weidu: this.form[weiduName], jingdu: this.form[jingduName] })
      if (isRequest) {
        let data = {
          moduleTypeId: this.moduleTypeId
        }
        let url
        if (this.isCompile) {
          data.id = this.form.id
          delete this.form.id
          url = '/diyData/update'
        } else {
          url = '/diyData/add'
        }

        data.jsonData = JSON.stringify(this.form),
          this.$store.dispatch('crud/addData', { url: url, method: 'post', params: data, hasMap: this.hasMap })
      } else {
        this.mustDialog = true
      }
    },

    openDeleteDialog (id) {// 打开删除弹框
      this.id = id
      this.$store.commit('crud/ONOFF_DELETE_DATA', true)
    },

    deleteData (id) {
      let data = {
        ids: id
      }
      this.$store.dispatch('crud/deleteData', { url: '/diyData/delete', method: 'post', params: data })
    },

    getCountrySelectDataList (event, val, townName) {
      if (event) {
        if (val == 1) { //打开town的下拉框
          let data = {
            id: this.countryside
          }
          this.$store.dispatch('townAndCountry/getTownOrCountryList', { data: data, val: val })
        } else {
          //   console.log(this.townItem, this.townId, this.form[this.$parent.townName]);
          if (!this.townItem && !this.form[this.$parent.townName]) {
            this.$message({
              showClose: true,
              message: '请先选择乡镇',
              type: 'error'
            });
            this.$store.commit('townAndCountry/CLEARCOUNTRYLIST')
            return
          } else {
            let data
            if (this.townItem) {
              data = {
                id: this.townItem.id
              }
              this.$store.dispatch('townAndCountry/getTownOrCountryList', { data: data, val: val })
            } else {
              let data = {
                id: this.id
              }
              request({
                method: 'get',
                url: '/diyData/getIdInfo',
                params: data
              }).then(res => {
                if (res.code == '10000') {
                  data = {
                    id: res.data.zhenId
                  }
                  this.$store.dispatch('townAndCountry/getTownOrCountryList', { data: data, val: val })
                }
              })
            }
          }
        }
      }
    },

    changeData (row) {  //编辑
      this.form = { ...row }
      this.id = row.id
      this.isCompile = true
      this.$store.commit('crud/ONOFF_ADDDATA_DIALOG', true)
      if (this.hasMap) {
        let jingdu = this.$parent.longitudeName
        let weidu = this.$parent.latitudeName
        this.$store.commit('crud/GET_LONGITUDE_AND_LATITUDE', { jingdu: Number(this.form[jingdu]), weidu: Number(this.form[weidu]) })
      }
    },

    checkItemDetails (row) {
      this.$store.commit('crud/ONOFF_ADDDATA_DIALOG', true)
      this.viewUserInfor = true
      this.form = { ...row }
    },

    handleCurrentChange (val) {
      this.selectedItemsIds = []
      this.page = val
      this.getDataList()
    },
    handleSizeChange (val) {
      this.selectedItemsIds = []
      this.pageSize = val
      this.getDataList()
    },
  }
}
</script>

<style lang="scss" scoped>
.table-container {
  height: 630px;
  // overflow-y: auto;
  padding-bottom: 20px;
  position: relative;
}
.content-main {
  h2 {
    text-align: center;
    padding: 10px 0;
  }
  >>> .el-dialog__body {
    font-size: 16px;
  }
  .el-table {
    font-size: 16px;
    color: #333;
    >>> .el-table__expand-icon {
      //字体图标的大小
      font-size: 16px;
    }
  }
}
</style>