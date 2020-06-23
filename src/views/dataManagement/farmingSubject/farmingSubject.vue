<template>
  <div class="module">
    <dataManagementAside :routeName="'farmingSubject'"
                         :title="'农业主体'"></dataManagementAside>
    <div class="content">

      <bread-crumb :parentTitle="'农业主体'"></bread-crumb>
      <div class="content-main">

        <contentHeaderBtns :importExcelUrl="importExcelUrl"
                           :excelTemplateUrl="excelTemplateUrl"
                           :exportExcelUrl="exportExcelUrl"
                           :exportExcelData="{ids:selectedItemsIds,industryTypeThirId:industryTypeThirId,name:subjectName}">

          <div v-permission="{name:$route.name,btnName:'query'}">
            <div class="pull-down">
              <span>主体名称：</span>
              <el-input v-model="subjectName"
                        style="width: 200px"></el-input>
            </div>
            <div class="pull-down">
              <span>产业类型：</span>
              <el-select v-model="industryTypeThirId"
                         :clearable="true"
                         style="width: 200px"
                         placeholder="请选择"
                         @visible-change="getThreeProSelectDataList($event)">
                <el-option v-for="item in threeProDataList"
                           :key="item.id"
                           :label="item.name"
                           :value="item.id">
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
      <el-form label-width="120px"
               ref="ruleForm"
               :rules="rules"
               :disabled="viewUserInfor"
               :model="form">

        <el-form-item label="主体名称"
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
            <el-form-item prop="cunName">
              <el-select v-model="form.cunName"
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

        <el-form-item label="产业类型">
          <el-select v-model="form.industryTypeThirName"
                     :ref="mySelect3"
                     @focus="mySelect3 = 'mySelect'"
                     @blur="mySelect3 = ''"
                     :clearable="true"
                     placeholder="请选择"
                     @change="selectThreePro"
                     @visible-change="getThreeProSelectDataList($event)">
            <el-option v-for="item in threeProDataList"
                       :key="item.id"
                       :label="item.name"
                       :value="item">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="年份">
          <el-date-picker v-model="form.year"
                          :ref="mySelect4"
                          @focus="mySelect4 = 'mySelect'"
                          @blur="mySelect4 = ''"
                          value-format="yyyy"
                          type="year"
                          placeholder="选择年"> </el-date-picker>
        </el-form-item>
        <el-form-item label="联系人">
          <el-input v-model="form.contact"></el-input>
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="form.tele"
                    @input="form.tele = toInt(form.tele)"></el-input>
        </el-form-item>
        <el-form-item label="统一社会信用代码（或营业执照号）/身份证">
          <el-input v-model="form.xinyongdaima"></el-input>
        </el-form-item>
        <!-- <p style="line-height: 60px; font-size:18px">
          主体类别 ：默认显示
        </p> -->

        <el-form-item label="生产类型">
          <el-input v-model="form.shengchanleixing"></el-input>
        </el-form-item>

        <el-form-item label="主体类别">
          <!-- <el-select v-model="form.agriculturalSubjectTypeName"
                     placeholder="请选择"
                     @visible-change="getSubjectSelectDataList">
            <el-option v-for="item in subjectSelectDataList"
                       :key="item.id"
                       :label="item.name"
                       :value="item.name">
            </el-option>
          </el-select> -->
          <el-input v-model="form.agriculturalSubjectTypeName"
                    :disabled="true"></el-input>
        </el-form-item>

        <el-form-item label="产品认证">
          <el-select v-model="form.chanpinrenzhengName"
                     :ref="mySelect5"
                     @focus="mySelect5 = 'mySelect'"
                     @blur="mySelect5 = ''"
                     :clearable="true"
                     placeholder="请选择"
                     @change="selectProductList"
                     @visible-change="getProductSelectDataList($event)">
            <el-option v-for="item in productSelectDataList"
                       :key="item.id"
                       :label="item.name"
                       :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="农民信箱账号">
          <el-input v-model="form.xinxiang"></el-input>
        </el-form-item>
        <!-- 还有4个扩展字段 -->

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
import request from '@/request/request'
import dataManagementAside from '../components/dataManagementAside'
import myTable from '@/views/table'
import formDialog from '@/views/formDialog'
import contentHeaderBtns from '../components/contentHeaderBtns'
import breadCrumb from '../components/breadCrumb'
import townAndCountry from '../components/townAndCountry'
import { noEmpty } from '@/utils/validate'
import deepClone from '@/utils/deepClone'

export default {
  components: {
    dataManagementAside,
    myTable,
    formDialog,
    contentHeaderBtns,
    breadCrumb,
    townAndCountry
  },

  data () {
    return {
      mustDialog: false,//必填项弹框
      mySelect1: '',
      mySelect2: '',
      mySelect3: '',
      mySelect4: '',
      mySelect5: '',

      viewUserInfor: false,//用户信息开关
      userDialogVisible: false,
      subjectName: '', //主体名称查询
      industryTypeThirId: '', //产业类型
      threeProDataList: null, //产业类型列表
      form: {
        name: '',
        cel1: '',//否	扩展字段1

        cel2: '',//否	扩展字段2

        cel3: '',//否	扩展字段3

        cel4: '',//否	扩展字段4

        year: '',
        jingdu: '',//是	1.1.1.1经度

        weidu: '',//是 2.2.2.2纬度

        countryId: '',//是	230200000000所属乡镇id

        countryName: '',//是  齐齐哈尔市所属乡镇名称

        cunId: '',//是	230203000000所属村id

        cunName: '',//是	建华区  所属村名称

        industryTypeThirId: '',//否	1  三级产业分类id

        industryTypeThirName: '',//否 水稻   三级产业分类名称

        contact: '',//否	李四联系人

        tele: null,//否	1234联系电话

        xinyongdaima: '',//否  1234566信用代码（营业执照）或身份证

        agriculturalSubjectTypeId: '',//否	2主体类别id

        agriculturalSubjectTypeName: '',//否	农民专业合作社  主体类别名称

        shengchanleixing: '',//否  XX型生产类型

        chanpinrenzhengId: '',//否	1产品认证id

        chanpinrenzhengName: '',//否	无公害农产品认证产品认证名称

        xinxiang: '',//是	农民邮箱
        type: 0,//0为添加修改数据，1为替换数据
      },
      rules: {
        name: [
          { validator: noEmpty, required: true, trigger: ['change', 'blur'] }
        ],
        countryName: [
          { validator: noEmpty, required: true, trigger: ['change', 'blur'] }
        ],
        cunName: [
          { validator: noEmpty, required: true, trigger: ['change', 'blur'] }
        ]
      },
      //   subjectSelectDataList: null, //产品主体下拉数据

      threeProDataList: null, //获取产业三级类型

      productSelectDataList: null,  //产品认证下拉数据
      treeData: [
        {
          name: '龙头企业',
          path: '/cock',
          exportExcelUrl: '/KuoZhan1Ziduan/exportExcel',
          //   importExcelUrl: '/agriculturalSubjectData/importExcel',
          excelTemplateUrl: '/KuoZhan1Ziduan/toExcel',
        },
        {
          name: '农民专业合作社',
          exportExcelUrl: '/KuoZhan2Ziduan/exportExcel',
          //   importExcelUrl: '/agriculturalSubjectData/importExcel',
          excelTemplateUrl: '/KuoZhan2Ziduan/toExcel',
        },
        {
          name: '家庭农场',
          exportExcelUrl: '/KuoZhan3Ziduan/exportExcel',
          //   importExcelUrl: '/agriculturalSubjectData/importExcel',
          excelTemplateUrl: '/KuoZhan3Ziduan/toExcel',
        },
        {
          name: '农家乐',
          exportExcelUrl: '/KuoZhan4Ziduan/exportExcel',
          //   importExcelUrl: '/agriculturalSubjectData/importExcel',
          excelTemplateUrl: '/KuoZhan4Ziduan/toExcel',
        },
        {
          name: '其他规模大户',
          exportExcelUrl: '/KuoZhan5Ziduan/exportExcel',
          //   importExcelUrl: '/agriculturalSubjectData/importExcel',
          excelTemplateUrl: '/KuoZhan5Ziduan/toExcel',
        }
      ],

      excelTemplateUrl: '/KuoZhan1Ziduan/toExcel',
      importExcelUrl: '/agriculturalSubjectData/importExcel',
      exportExcelUrl: '/KuoZhan1Ziduan/exportExcel',
      selectedItemsIds: [],
      columns: [
        {
          title: '主体名称',
          key: 'name',
        },
        {
          title: '所属乡镇',
          key: 'countryName',
        },
        {
          title: '所属村庄',
          key: 'cunName',
        },
        {
          title: '联系人',
          key: 'contact',
        },
        {
          title: '产业类型',
          key: 'industryTypeThirName',
        },
      ],
      //   treeDataIndex: 0,
      page: 1,
      pageSize: 10,
      item: null, //单条数据
      isCompile: false, //是否是编辑的开关
    }
  },

  mounted () {
    this.getDataList()
  },

  computed: {
    dialogFormVisible: {
      get () {
        return this.$store.state.crud.addDialog
      },
      set (val) {

      }
    },

    formCountryList () {
      return this.$store.state.townAndCountry.countryList
    },

    formTownList () {
      return this.$store.state.townAndCountry.townList
    },
  },

  watch: {
    // treeDataIndex (to, from) {
    //   this.agriculturalSubjectTypeName = this.subjectSelectDataList[to].name
    //   this.agriculturalSubjectTypeId = this.subjectSelectDataList[to].id
    // },

    $route (to, from) {
      this.subjectName = ''  //改变路由让查询的数据为空
      this.industryTypeThirId = ''
      for (let item of this.treeData) {
        if (item.name == to.meta.title) {
          this.exportExcelUrl = item.exportExcelUrl
          this.excelTemplateUrl = item.excelTemplateUrl
        }
      }
      this.getDataList()
    },

    dialogFormVisible (to, from) {
      this.form.type = 0
      if (!to) {
        this.$store.commit('townAndCountry/CLEARTOWN', { isForm: true })
        this.viewUserInfor = false
      } else {
        this.form.agriculturalSubjectTypeName = this.$route.meta.title
        this.form.agriculturalSubjectTypeId = this.$route.query.routeId
      }
    }
  },

  methods: {
    selectProductList (item) { //产品认证
      this.form.chanpinrenzhengName = item.name
      this.form.chanpinrenzhengId = item.id
    },
    selectThreePro (item) {//获取三级产业id
      this.form.industryTypeThirName = item.name
      this.form.industryTypeThirId = item.id
    },

    getFormCountryItem (item) {
      this.form.cunName = item.name
      this.form.cunId = item.id
      this.$forceUpdate()
    },

    getFormTownItem (item) {
      if (this.form.countryId !== item.id) {
        this.form.cunName = ''
        this.form.cunId = ''
      }
      this.form.countryName = item.name
      this.form.countryId = item.id
    },

    getFormCountrySelectDataList (event, val) {
      if (event) {
        if (val == 1) { //打开town的下拉框
          let data = {
            id: sessionStorage.countryId
          }
          this.$store.dispatch('townAndCountry/getTownOrCountryList', { data: data, val: val })
        } else {
          if (this.form.countryId) {
            let data = {
              id: this.form.countryId
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

    getThreeProSelectDataList (event) {  //获取产业三级列表
      if (event) {
        request({
          url: '/industryType/getThird',
          method: 'get'
        }).then(res => {
          if (res.code == '10000') {
            this.threeProDataList = res.data
          }
        })
      }
    },

    addData () {
      let isRequest = true
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {

        } else {
          isRequest = false;
          return false
        }
      });
      if (isRequest) {
        let data = this.form
        let url = '/agriculturalSubjectData/addData'
        if (this.isCompile) {
          delete data.createDate
          delete data.updateDate
          url = '/agriculturalSubjectData/editData'
        }

        this.$store.dispatch('crud/addData', { url: url, method: 'post', params: data })
      } else {
        this.mustDialog = true
      }

    },

    getProductSelectDataList (event) {
      if (event) {
        request({
          url: '/chanpinRenzheng/getType',
          method: 'get'
        }).then(res => {
          if (res.code == '10000') {
            this.productSelectDataList = res.data
          }
        })
      }
    },

    // getSubjectSelectDataList () { //获取主体类别
    //   request({
    //     url: '/agriculturalSubjectType/getType',
    //     method: 'get'
    //   }).then(res => {
    //     if (res.code == '10000') {
    //       this.subjectSelectDataList = res.data
    //       let index = this.treeDataIndex

    //       this.agriculturalSubjectTypeId = this.subjectSelectDataList[index].id
    //       this.agriculturalSubjectTypeName = this.subjectSelectDataList[index].name
    //     }
    //   }).then(res => {
    //     this.getDataList()
    //   })

    // },

    getThreeProSelectDataList (event) {  //获取产业三级列表
      if (event) {
        request({
          url: '/industryType/getThird',
          method: 'get'
        }).then(res => {
          if (res.code == '10000') {
            this.threeProDataList = res.data
          }
        })
      }
    },
    checkItemDetails (row) { //查看
      this.$store.commit('crud/ONOFF_ADDDATA_DIALOG', true)
      this.viewUserInfor = true
      this.form = { ...row }
      this.form.year = `${row.year}`
    },

    queryData () {
      this.getDataList()
    },

    deleteData (id) {
      let data = {
        ids: id
      }
      this.$store.dispatch('crud/deleteData', { url: '/agriculturalSubjectData/deleData', method: 'post', params: data })
    },

    getDataList () {
      let data = {
        pageNo: this.page,
        pageSize: this.pageSize,
        name: this.subjectName,  //主体类别名称
        industryTypeThirId: this.industryTypeThirId, //产业类型id
        agriculturalSubjectTypeId: this.$route.query.routeId,
      }
      this.$store.dispatch('crud/getDataList', { url: '/agriculturalSubjectData/getList', method: 'post', params: data })
    },
  },
}
</script>

<style lang="scss" scoped>
@import "@/styles/module.scss";
</style>