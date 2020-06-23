<template>
  <div class="module">

    <dataManagementAside :routeName="'areaData'"
                         :title="'区域数据'"></dataManagementAside>
    <div class="content">

      <bread-crumb :parentTitle="'区域数据'"></bread-crumb>
      <div class="content-main">
        <contentHeaderBtns :importExcelUrl="importExcelUrl"
                           :excelTemplateUrl="$route.meta.excelTemplateUrl"
                           :exportExcelUrl="$route.meta.exportExcelUrl"
                           :exportExcelData="{ids:selectedItemsIds,jibie:jibie,country:townId}">

          <div v-if="btnPermission($route.name,'query')">
            <div class="pull-down">
              <span>认定级别：</span>
              <el-select v-model="jibie"
                         placeholder="请选择"
                         :clearable="true">
                <el-option v-for="item in rankSelectDataList"
                           :key="item.id"
                           :label="item.name"
                           :value="item.id">
                </el-option>
              </el-select>
            </div>

            <div class="pull-down">
              <span>所在乡镇：</span>
              <el-select v-model="townName"
                         placeholder="请选择"
                         :clearable="true"
                         @change="getTownItem"
                         value-key="id"
                         @visible-change="getCountrySelectDataList($event)">
                <el-option v-for="item in townList"
                           :key="item.id"
                           :label="item.name"
                           :value="item">
                </el-option>
              </el-select>
            </div>
          </div>

        </contentHeaderBtns>

        <my-table :columns="columns"
                  :selectedItemsIds.sync="selectedItemsIds"></my-table>
      </div>

    </div>

    <formDialog v-if="dialogFormVisible"
                :formTitle="$route.meta.title">
      <el-form label-width="100px"
               :disabled="viewUserInfor"
               ref="ruleForm"
               :rules="rules"
               :model="form">
        <el-form-item label="认定名称"
                      prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <!-- 一级 -->
        <el-form-item label="乡镇村庄"
                      required>
          <el-col :span="11">
            <el-form-item prop="countryName">
              <el-select v-model="form.countryName"
                         :ref="mySelect1"
                         @focus="mySelect1 = 'mySelect'"
                         @blur="mySelect1 = ''"
                         placeholder="请选择乡镇"
                         value-key="id"
                         @change="getFormTownItem"
                         @visible-change="getFormCountrySelectDataList($event,1)">
                <el-option v-for="item in formTownList"
                           :key="item.id"
                           :label="item.name"
                           :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col style="text-align:center"
                  :span="2">-</el-col>
          <el-col :span="11">
            <el-form-item prop="jianshedidianName">
              <el-select v-model="form.jianshedidianName"
                         :ref="mySelect2"
                         @focus="mySelect2 = 'mySelect'"
                         @blur="mySelect2 = ''"
                         placeholder="请选择村庄"
                         value-key="id"
                         @change="getFormCountryItem"
                         @visible-change="getFormCountrySelectDataList($event,2)">
                <el-option v-for="item in formCountryList"
                           :key="item.id"
                           :label="item.name"
                           :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-form-item>

        <el-form-item label="认定编码">
          <el-input v-model="form.code"></el-input>
        </el-form-item>
        <el-form-item label="建设起始年">
          <el-date-picker v-model="form.startYear"
                          :ref="mySelect3"
                          @focus="mySelect3 = 'mySelect'"
                          @blur="mySelect3 = ''"
                          value-format="yyyy"
                          type="year"
                          placeholder="选择年"> </el-date-picker>
        </el-form-item>
        <el-form-item label="建设终止年">
          <el-date-picker v-model="form.endYear"
                          :ref="mySelect4"
                          @focus="mySelect4 = 'mySelect'"
                          @blur="mySelect4 = ''"
                          value-format="yyyy"
                          type="year"
                          placeholder="选择年"> </el-date-picker>
        </el-form-item>
        <el-form-item label="建设状态">
          <el-select v-model="form.statusName"
                     :ref="mySelect5"
                     @focus="mySelect5 = 'mySelect'"
                     @blur="mySelect5 = ''"
                     @change="selectStatus"
                     placeholder="请选择">
            <el-option v-for="item in jianshe_options"
                       :key="item.value"
                       :label="item.label"
                       :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="认定级别">
          <el-select v-model="form.jibieName"
                     :ref="mySelect6"
                     @focus="mySelect6 = 'mySelect'"
                     @blur="mySelect6 = ''"
                     @change="selectGrade"
                     placeholder="请选择">
            <el-option v-for="item in rankSelectDataList"
                       :key="item.id"
                       :label="item.name"
                       :value="item"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="现有规模（亩）">
          <el-input v-model="form.xianyouguimo"
                    @input="form.xianyouguimo = toDecimals(form.xianyouguimo)"></el-input>
        </el-form-item>

        <el-form-item label="计划建设规模（亩）">
          <el-input v-model="form.jihuaguimo"
                    @input="form.jihuaguimo = toDecimals(form.jihuaguimo)"></el-input>
        </el-form-item>
        <el-form-item label="规划总投资（万元）">
          <el-input v-model="form.jihuatouzi"
                    @input="form.jihuatouzi = toDecimals(form.jihuatouzi)"></el-input>
        </el-form-item>
        <el-form-item label="目前已投资（万元）">
          <el-input v-model="form.yitouzi"
                    @input="form.yitouzi = toDecimals(form.yitouzi)"></el-input>
        </el-form-item>
        <el-form-item label="联系人">
          <el-input v-model="form.contact"></el-input>
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="form.tele"
                    @input="form.tele = toInt(form.tele)"></el-input>
        </el-form-item>
        <el-form-item label="拟申报省级资金补助的项目数">
          <el-input v-model="form.projNumbers"
                    @input="form.projNumbers = toInt(form.projNumbers)"></el-input>
        </el-form-item>
        <el-form-item label="扩展字段1">
          <el-input v-model="form.cel1"></el-input>
        </el-form-item>

        <el-form-item label="扩展字段2">
          <el-input v-model="form.cel2"></el-input>
        </el-form-item>

        <el-form-item label="扩展字段3">
          <el-input v-model="form.cel3"></el-input>
        </el-form-item>

        <el-form-item label="扩展字段4">
          <el-input v-model="form.cel4"></el-input>
        </el-form-item>
      </el-form>
    </formDialog>

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
import request from '@/request/request';
import breadCrumb from '../components/breadCrumb'
import myTable from '@/views/table'
import formDialog from '@/views/formDialog'
import contentHeaderBtns from '../components/contentHeaderBtns'
import dataManagementAside from '../components/dataManagementAside'
import townAndCountry from '../components/townAndCountry'
import { noEmpty } from '@/utils/validate'
import deepClone from '@/utils/deepClone'
export default {
  components: {
    formDialog,
    myTable,
    townAndCountry,
    dataManagementAside,
    contentHeaderBtns,
    breadCrumb
  },
  data () {
    return {
      mustDialog: false, //必填弹框
      mySelect1: '',
      mySelect2: '',
      mySelect3: '',
      mySelect4: '',
      mySelect5: '',
      mySelect6: '',
      viewUserInfor: false,//查看用户信息弹框
      userDialogVisible: false,
      selectedItemsIds: [],  // 与table子组件双向绑定id的数据组
      columns: [
        {
          title: '认定名称',
          key: 'name',
        },
        {
          title: '区域类型',
          key: 'regionalTypeName',
        },
        {
          title: '所在乡镇',
          key: 'countryName',
        },
        {
          title: '建设地点',
          key: 'jianshedidianName',
        },
        {
          title: '认定级别',
          key: 'jibieName',
        },
        {
          title: '建设状态',
          key: 'statusName',
        },
      ],
      form: {
        countryName: '', //乡镇名
        jianshedidianName: '',// 建设地点名 村名
        country: '', //镇id
        jianshedidian: '',//村id
        regionalTypeId: '', //区域类型id
        regionalTypeName: '', //区域类型name
        jingdu: '',//是	1.1.1.1经度
        weidu: '',//是 2.2.2.2纬度
        name: "", //认证名称
        code: "", //认证编码
        startYear: "", //起始年份
        projNumbers: '',//拟申报省级资金补助的项目数
        endYear: "", //终止年份
        status: "", //建设状态  0在建 1已建
        statusName: '',
        jibie: "", //认定级别   1省级 2市级 3县级
        jibieName: '',
        xianyouguimo: "", //现有规模
        jihuaguimo: "", //计划规模
        jihuatouzi: "", //计划投资
        yitouzi: "", //已投资
        contact: "", //联系人
        tele: "", //联系人电话
        cel1: "", //扩展字段1
        cel2: "", //扩展字段2
        cel3: "", //扩展字段3
        cel4: "", //扩展字段4
        xiangzhenAndcun: "", //乡镇对应村的id
        type: 0,//0为添加修改数据，1为替换数据
      },

      rules: {
        name: [
          { validator: noEmpty, required: true, trigger: ['blur', 'change'] }
        ],
        countryName: [
          { validator: noEmpty, required: true, trigger: ['blur', 'change'] }
        ],
        jianshedidianName: [
          { validator: noEmpty, required: true, trigger: ['blur', 'change'] }
        ],
        xinxiang: [
          { validator: noEmpty, required: true, trigger: ['blur', 'change'] }
        ]
      },

      // 建设状态
      jianshe_options: [
        {
          value: "0",
          label: "在建"
        },
        {
          value: "1",
          label: "已建"
        }
      ],
      treeData: [
        {
          name: '粮食生产功能区',
          exportExcelUrl: '/Type1Ziduan/exportExcel',
          importExcelUrl: '/regionalData/importExcel',
          excelTemplateUrl: '/Type1Ziduan/toExcel',
        },
        {
          name: '现代农业综合区',
          exportExcelUrl: '/Type2Ziduan/exportExcel',
          excelTemplateUrl: '/Type2Ziduan/toExcel',
        },
        {
          name: '主导产业示范区',
          exportExcelUrl: '/Type3Ziduan/exportExcel',
          importExcelUrl: '/regionalData/importExcel',
          excelTemplateUrl: '/Type3Ziduan/toExcel',
        },
        {
          name: '特色农业精品园',
          exportExcelUrl: '/Type4Ziduan/exportExcel',
          importExcelUrl: '/regionalData/importExcel',
          excelTemplateUrl: '/Type4Ziduan/toExcel',
        },
      ],

      excelTemplateUrl: '',
      importExcelUrl: '/regionalData/importExcel',
      exportExcelUrl: '',
      dataList: null,

      rankSelectDataList: [
        {
          name: '省级',
          id: 1
        },
        {
          name: '市级',
          id: 2
        },
        {
          name: '县级',
          id: 3
        }
      ],
      formCopy: null,
      isCompile: false, //是否是编辑的开关
      selectDataList: null,  //区域数据类别数据

      item: null, //单条数据
      total: 0,//数据总数
      page: 1,
      pageSize: 10,
      country: '', //乡镇id 按乡镇查询时
      townName: '',
      townId: '',
      jibie: '', //认定级别（ 1省级 2市级 3县级）， 按级别查询时
      //   regionalTypeId: '', //区域类型id
      //   regionalTypeName: '', //区域类型name
    }
  },

  computed: {
    dialogFormVisible: {
      get () {
        return this.$store.state.crud.addDialog
      },
      set (val) {

      }
    },

    townList () {
      return this.$store.state.townAndCountry.townList
    },

    formCountryList () {
      return this.$store.state.townAndCountry.countryList
    },

    formTownList () {
      return this.$store.state.townAndCountry.townList
    },
  },

  mounted () {
    // this.getAreaSelectDataList()
    this.getDataList()
    this.formCopy = deepClone(this.form)
  },

  watch: {
    $route (to, from) {
      this.townId = ''
      this.townName = ''
      this.jibie = ''
      this.page = 1
      this.pageSize = 10
      this.form = deepClone(this.formCopy)
      this.getDataList()
    },

    dialogFormVisible (to, from) {
      this.form.type = 0
      if (!to) {
        let data = {
          id: sessionStorage.countryId
        }
        this.form = this.formCopy
        this.viewUserInfor = false
      } else if (this.isCompile) {
        if (this.form.startYear) {
          this.form.startYear = `${this.form.startYear}`
        } else {
          this.form['startYear'] = this.form.startYear || ''
        }
        if (this.form.endYear) {
          this.form.endYear = `${this.form.endYear}`
        } else {
          this.form['endYear'] = this.form.endYear || ''
        }
      }
    },

  },

  methods: {
    getTownItem (item) {
      this.townId = item.id
      this.townName = item.name
    },

    getCountrySelectDataList (event) {
      if (event) {
        let data = {
          id: sessionStorage.countryId
        }
        this.$store.dispatch('townAndCountry/getTownOrCountryList', { data: data, val: 1 })
      }
    },

    getFormCountryItem (item) {
      this.form.jianshedidianName = item.name
      this.form.jianshedidian = item.id
      this.$forceUpdate()
    },

    getFormTownItem (item) {
      if (this.form.country !== item.id) {
        this.form.jianshedidian = ''
        this.form.jianshedidianName = ''
      }
      this.form.countryName = item.name
      this.form.country = item.id
    },

    getFormCountrySelectDataList (event, val) {
      if (event) {
        if (val == 1) { //打开town的下拉框
          let data = {
            id: sessionStorage.countryId
          }
          this.$store.dispatch('townAndCountry/getTownOrCountryList', { data: data, val: val })
        } else {
          if (this.form.country) {
            let data = {
              id: this.form.country
            }
            this.$store.dispatch('townAndCountry/getTownOrCountryList', { data: data, val: val })
          } else {
            this.$message({
              showClose: true,
              message: '请先选择乡镇',
              type: 'error'
            });
            this.$store.commit('townAndCountry/CLEARCOUNTRYLIST')
          }
        }
      }
    },

    selectGrade (item) {
      this.form.jibieName = item.name
      this.form.jibie = item.id
    },
    selectStatus (item) {
      this.form.status = item.value
      this.form.statusName = item.label
    },

    checkItemDetails (row) { //查看
      this.$store.commit('crud/ONOFF_ADDDATA_DIALOG', true)
      this.viewUserInfor = true
      this.form = { ...row }
      this.form.startYear = `${row.startYear}`
      this.form.endYear = `${row.endYear}`
    },

    // selectDiffData (index = 0) {
    //   this.treeDataIndex = index
    //   this.pageSize = 10
    //   this.page = 1
    //   this.getDataList()
    // },

    addData () { //添加数据
      let isRequest = true

      this.$refs.ruleForm.validate((valid) => {

        if (valid) {

        } else {
          isRequest = false;
          return false
        }
      });

      if (isRequest) {
        let data = this.form;
        let url = '/regionalData/addRegionalData'
        if (this.isCompile) {
          delete data.updateDate
          delete data.createDate
          url = "/regionalData/editData"
        }
        let countryId
        data.regionalTypeId = this.$route.query.routeId
        data.regionalTypeName = this.$route.meta.title

        // data.xiangzhenAndcun = this.form.country + ',' + this.form.jianshedidian
        delete data.year
        this.$store.dispatch('crud/addData', { url: url, method: 'post', params: data })
      } else {
        this.mustDialog = true
      }

    },

    deleteData (id) {
      let data = {
        ids: id
      }

      this.$store.dispatch('crud/deleteData', { url: '/regionalData/deleteRegionalData', method: 'post', params: data })
    },
    queryData () {
      this.getDataList()
    },

    // getAreaSelectDataList () {
    //   request({
    //     url: '/regionalType/getType',
    //     method: 'post',
    //   }).then(res => {
    //     if (res.code == '10000') {
    //       this.selectDataList = res.data
    //       let index = this.treeDataIndex
    //       this.regionalTypeId = this.selectDataList[index].id
    //       this.regionalTypeName = this.selectDataList[index].name
    //     }
    //   }).then(res => {
    //     this.selectDiffData()
    //   })
    // },

    getDataList () {
      let data = {
        pageNo: this.page,
        pageSize: this.pageSize,
        country: this.townId,
        jibie: this.jibie,
        regionalTypeId: this.$route.query.routeId  //区域类型id
      }
      this.$store.dispatch('crud/getDataList', { url: '/regionalData/getList', method: 'post', params: data })
    },

    changeData (item, dialog) { //编辑数据
      this.item = item
      delete this.item.createDate
      delete this.item.updateDate
      this[dialog] = true
      this.isCompile = true //是否是编辑的开关
    },

  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/module.scss";
</style>