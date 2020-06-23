<template>
  <div style="background:#fff">
    <contentHeaderBtns :importExcelUrl="'/liveStockManage/importExcel'"
                       :excelTemplateUrl="'/liveStockName/toExcel'"
                       :exportExcelUrl="'/liveStockManage/exportExcel'"
                       :exportExcelData="data={ids:selectedItemsIds,year:year,countryside:townId}">
      <div v-permission="{name:$route.name,btnName:'query'}">
        <div class="margin40">
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
          <span>所属乡镇：</span>
        </div>

        <div class="pull-down">
          <el-date-picker v-model="year"
                          value-format="yyyy"
                          type="year"
                          placeholder="选择年"> </el-date-picker>
          <span>年份：</span>
        </div>
      </div>

    </contentHeaderBtns>

    <my-table :columns="columns"
              :selectedItemsIds.sync="selectedItemsIds"></my-table>
    <formDialog v-if="dialogFormVisible"
                :formTitle="$route.meta.title"
                :hasTownAndCountry="true">
      <el-form label-width="100px"
               ref="ruleForm"
               :rules="rules"
               :disabled="viewUserInfor"
               :model="form">

        <el-form-item label="产业类型"
                      prop="industrytypSec">
          <el-cascader :options="option"
                       :ref="mySelect1"
                       @focus="mySelect1 = 'mySelect'"
                       @blur="mySelect1 = ''"
                       v-model="industryTypeIdArr"
                       :props="{value: 'id',label:'name',children:'industryTypeThird'}"
                       children='industryTypeThird'
                       clearable
                       placeholder="请选择"
                       @change="selectIndustry"
                       @visible-change="getSelectDataList($event)"></el-cascader>
        </el-form-item>

        <el-form-item label="年度"
                      prop="year">
          <el-date-picker v-model="form.year"
                          :ref="mySelect2"
                          @focus="mySelect2 = 'mySelect'"
                          @blur="mySelect2 = ''"
                          value-format="yyyy"
                          type="year"
                          placeholder="选择年"> </el-date-picker>

        </el-form-item>
        <!-- 一级 -->
        <el-form-item label="所属乡镇"
                      prop="countryName">
          <el-select v-model="form.countryName"
                     :ref="mySelect3"
                     @focus="mySelect3 = 'mySelect'"
                     @blur="mySelect3 = ''"
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

        <el-form-item label="产量(万吨)"
                      prop="yield">
          <el-input v-model="form.yield"></el-input>
        </el-form-item>
        <el-form-item label="产值(万元)"
                      prop="outputValue">
          <el-input v-model="form.outputValue"></el-input>
        </el-form-item>
        <el-form-item label="年末存栏数(万只/万头)"
                      prop="numbersCunlan">
          <el-input v-model="form.numbersCunlan"></el-input>
        </el-form-item>
        <el-form-item label="年末出栏数(万只/万头)"
                      prop="numbersChulan">
          <el-input v-model="form.numbersChulan"></el-input>
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
import myTable from '@/views/table'
import formDialog from '@/views/formDialog'
// import townAndCountry from '../../components/townAndCountry'
import contentHeaderBtns from '../../components/contentHeaderBtns'
import { noEmpty, num } from '@/utils/validate'
export default {
  components: {
    myTable,
    formDialog,
    // townAndCountry,
    contentHeaderBtns
  },
  data () {
    return {
      mustDialog: false,
      mySelect1: '',
      mySelect2: '',
      mySelect3: '',
      mySelect4: '',
      viewUserInfor: false,
      selectedItemsIds: [],
      item: null, //单条用户信息
      columns: [
        {
          title: '产业类型',
          key: 'industryTypeThirdName',
        },
        {
          title: '年度',
          key: 'year',
        },
        {
          title: '乡镇',
          key: 'countryName',
        },
        {
          title: '产量（万吨）',
          key: 'yield',
        },
        {
          title: '年末存栏数(万只/万头)',
          key: 'numbersCunlan',
        },
        {
          title: ' 年末出栏数(万只/万头)',
          key: 'numbersChulan',
        },

      ],
      page: 1,
      pageSize: 10,
      year: '',

      form: {
        // industrytypFir: '', //产业一级分类id 非必需
        industrytypSec: '', //产业二级分类id 非必需
        industrytypThir: '',//产业三级分类id 非必需
        industryTypeSecondName: '',// 产业二级name
        industryTypeThirdName: '', //产业三级name
        numbersCunlan: '',//	是 年末存栏数
        numbersChulan: '', // 是  年末出栏数
        year: '', //年度
        yield: '', //产量
        outputValue: '',//产值
        id: '', //当id为空时表示新增，不空时表示修改该条id的相关数据 非必需
        countryside: '',//乡镇id
        countryName: '',//所属乡镇名称
        cunId: '',//所属村庄id
        cunName: '', //所属村庄名称
        type: 0,//0为添加修改数据，1为替换数据
      },
      industryTypeIdArr: [], //接收产业类型的id数组
      rules: {
        industrytypSec: [
          { validator: noEmpty, required: true, trigger: ['change', 'blur'] }
        ],
        year: [
          { validator: noEmpty, required: true, trigger: ['change', 'blur'] }
        ],
        numbersCunlan: [
          { validator: num, required: true, trigger: ['change', 'blur'] }
        ],
        numbersChulan: [
          { validator: num, required: true, trigger: ['change', 'blur'] }
        ],
        yield: [
          { validator: num, required: true, trigger: ['change', 'blur'] }
        ],
        outputValue: [
          { validator: num, required: true, trigger: ['change', 'blur'] }
        ],
        countryName: [
          { validator: noEmpty, required: true, trigger: ['change', 'blur'] }
        ],
        cunName: [
          { validator: noEmpty, required: true, trigger: ['change', 'blur'] }
        ],
      },
      optionProps: {
        label: 'name',
      },
      isCompile: false,
      option: null,
      townId: '',
      townName: ''
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

    formTownList () {
      return this.$store.state.townAndCountry.townList
    },
    townList () {
      return this.$store.state.townAndCountry.townList
    },
  },

  watch: {
    async  dialogFormVisible (to, from) {
      this.form.type = 0
      if (!to) {
        this.industryTypeIdArr = []
        this.viewUserInfor = false
      } else {
        if (this.isCompile || this.viewUserInfor) {
          await this.getSelectDataList(true)
          this.industryTypeIdArr[0] = await this.form.industrytypSec
          this.industryTypeIdArr[1] = await this.form.industrytypThir
        }
      }
    }
  },

  mounted () {
    this.getDataList();
  },

  methods: {
    selectIndustry (item) {
      this.industryTypeIdArr = item
      this.form.industrytypSec = this.industryTypeIdArr[0]
      this.form.industrytypThir = this.industryTypeIdArr[1]
      for (let item of this.option) {
        if (this.form.industrytypSec == item.id) {
          this.form.industryTypeSecondName = item.name
          let arr = item.industryTypeThird
          for (let item of arr) {
            if (this.form.industrytypThir == item.id) {
              this.form.industryTypeThirdName = item.name
            }
          }
        }
      }
    },
    getTownItem (item) {
      this.townId = item.id
      this.townName = item.name
    },

    getCountrySelectDataList (event, val) {
      if (event) {
        let data = {
          id: sessionStorage.countryId
        }
        this.$store.dispatch('townAndCountry/getTownOrCountryList', { data: data, val: 1 })
      }
    },
    getFormTownItem (item) {
      //   if (this.form.countryside !== item.id) {
      //     this.form.cunName = ''
      //     this.form.cunId = ''
      //   }
      this.form.countryName = item.name
      this.form.countryside = item.id
    },

    getFormCountrySelectDataList (event, val) {
      if (event) {
        // if (val == 1) { //打开town的下拉框
        let data = {
          id: sessionStorage.countryId
        }
        this.$store.dispatch('townAndCountry/getTownOrCountryList', { data: data, val: val })
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
        let url = '/liveStockManage/addLiveStock'
        if (this.isCompile) {
          delete data.createDate
          delete data.updateDate
          url = '/liveStockManage/editData'
        }

        this.$store.dispatch('crud/addData', { url: url, method: 'post', params: data })
      } else {
        this.mustDialog = true
      }
    },

    checkItemDetails (row) { //查看
      this.$store.commit('crud/ONOFF_ADDDATA_DIALOG', true)
      this.viewUserInfor = true
      this.form = { ...row }
      this.form.year = `${row.year}`
    },
    getSelectDataList (event, val) {
      if (event) {
        let data = {
          id: 2  //畜牧类型默认为1
        }
        request({
          url: '/industryType/getAllType',
          method: 'get',
          params: data
        }).then(res => {
          if (res.code == '10000') {
            this.option = res.data[0].industryTypeSecond
          }
        })
      }
    },

    getDataList () {
      let data = {
        pageNo: this.page,
        pageSize: this.pageSize,
        countryside: this.townId,
        year: this.year,
        // cunId: this.countryId
      }
      this.$store.dispatch('crud/getDataList', { url: '/liveStockManage/getList', method: 'post', params: data })
    },

    deleteData (id) {
      let data = {
        ids: id
      }
      this.$store.dispatch('crud/deleteData', { url: '/liveStockManage/deleLiveStock', method: 'post', params: data })
    },

  },
}
</script>

<style lang="scss" scoped>
</style>