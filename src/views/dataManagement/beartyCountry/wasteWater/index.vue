<template>
  <div>
    <contentHeaderBtns :importExcelUrl="'/wastewaterHand/importWastewaterHandles'"
                       :excelTemplateUrl="'/wastewaterHand/ExcelModle'"
                       :exportExcelUrl="'/wastewaterHand/exportWastewaterHandle'"
                       :exportExcelData="{ids:selectedItemsIds.join(','),countryName: countryName,town:townName}">
      <div class="margin40"
           v-permission="{name:$route.name,btnName:'query'}">
        <townAndCountry></townAndCountry>
        <span>乡镇村庄：</span>
      </div>
    </contentHeaderBtns>

    <my-table :columns="columns"
              :selectedItemsIds.sync="selectedItemsIds"></my-table>

    <formDialog v-if="dialogFormVisible"
                :formTitle="$route.meta.title">
      <el-form label-width="140px"
               ref="ruleForm"
               :rules="rules"
               :disabled="viewUserInfor"
               :model="form">
        <!-- 一级 -->
        <el-form-item label="乡镇村庄"
                      required>
          <el-col :span="11">
            <el-form-item prop="town">
              <el-select v-model="form.town"
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
            <el-form-item prop="countryName">
              <el-select v-model="form.countryName"
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

        <el-form-item label="受益户数(户)">
          <el-input v-model="form.benefitNumber"
                    @input="form.benefitNumber = toInt(form.benefitNumber)"></el-input>
          <!-- @keyup="form.benefitNumber=form.benefitNumber.replace(/\D/g,'')"
                    @afterpaste="form.benefitNumber=form.benefitNumber.replace(/\D/g,'')" -->
        </el-form-item>

        <el-form-item label="建设时间"
                      prop="buildTime">
          <el-date-picker v-model="form.buildTime"
                          :ref="mySelect3"
                          @focus="mySelect3 = 'mySelect'"
                          @blur="mySelect3 = ''"
                          value-format="yyyy"
                          type="year"
                          placeholder="选择年"> </el-date-picker>
        </el-form-item>

        <el-form-item label="建设总投资(万元)">
          <el-input v-model="form.buildTotalMoney"
                    @input="form.buildTotalMoney = toDecimals(form.buildTotalMoney)"></el-input>
        </el-form-item>
        <el-form-item label="主要收集方式">
          <el-input v-model="form.collectStyle"></el-input>
        </el-form-item>
        <el-form-item label="主要处理工艺">
          <el-input v-model="form.handleStyle"></el-input>
        </el-form-item>
        <el-form-item label="化粪池改造数（户）">
          <el-input v-model="form.septicTankNumber"
                    @input="form.septicTankNumber = toInt(form.septicTankNumber)"></el-input>
        </el-form-item>
        <el-form-item label="处理站点数量（处）">
          <el-input v-model="form.handleNumber"
                    @input="form.handleNumber = toInt(form.handleNumber)"></el-input>
        </el-form-item>
        <el-form-item label="日处理量（d/t）">
          <el-input v-model="form.dayHandleNumber"
                    @input="form.dayHandleNumber = toDecimals(form.dayHandleNumber)"></el-input>
        </el-form-item>
        <el-form-item label="排放标准">
          <el-input v-model="form.emissionStandard"></el-input>
        </el-form-item>

        <el-form-item label="年运维经费（万元）">
          <el-input v-model="form.yearOperationalFunds"
                    @input="form.yearOperationalFunds = toDecimals(form.yearOperationalFunds)"></el-input>
        </el-form-item>

        <el-form-item label="村级管理员">
          <el-input v-model="form.countryAdmin"></el-input>
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

    <el-dialog title="删除提示"
               :visible.sync="dialogVisible"
               width="300px">
      <span>确定要删除吗？</span>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="deleteData">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import request from '@/request/request'
import myTable from '@/views/table'
import contentHeaderBtns from '../../components/contentHeaderBtns'
import formDialog from '@/views/formDialog'
import townAndCountry from '../../components/townAndCountry'
import { noEmpty } from '@/utils/validate'
export default {
  components: {
    myTable,
    formDialog,
    townAndCountry,
    contentHeaderBtns
  },
  data () {
    return {
      mustDialog: false,
      mySelect1: '',
      mySelect2: '',
      mySelect3: '',
      viewUserInfor: false,
      selectedItemsIds: [],
      dialogVisible: false,// 删除弹框
      columns: [
        {
          title: '乡镇',
          key: 'town',
        },
        {
          title: '村名称',
          key: 'countryName',
        },
        {
          title: '受益户数',
          key: 'benefitNumber',
        },
        {
          title: '主要收集方式',
          key: 'collectStyle',
        },
        {
          title: '主要处理工艺',
          key: 'handleStyle',
        },
        {
          title: '化粪池改造数',
          key: 'septicTankNumber',
        },
      ],
      page: 1,
      pageSize: 10,
      //   townId: '',  //乡镇id
      //   town: '', //乡镇名
      //   countryName: '',
      form: {
        benefitNumber: '', //受益户数
        buildTime: '', // 建设时间
        collectStyle: '',//主要收集方式
        handleStyle: '',//主要处理工艺
        septicTankNumber: '',//化粪池该改造数
        handleNumber: '',//处理站点数量
        dayHandleNumber: '',//日处理量
        emissionStandard: '', //排放标准
        countryAdmin: '', //村级管理员
        yearOperationalFunds: '', //年运维经费
        jingdu: '',//是	经度   必需传
        weidu: '',//是	纬度     必需传
        cel1: '', //扩展字段1
        cel2: '', //扩展字段
        cel3: '', //扩展字段3
        cel4: '', //扩展字段4
        town: '', // 镇名称     必需传
        countryName: '', //村名称   必需传
        buildTotalMoney: '', //建设总投资
        townId: '', //乡镇id     必需传
        countryId: '', //村id     必需传
        type: 0,
        // countryName: '',//所属乡镇名称
        // cunName: '', //所属村庄名称
      },
      rules: {
        town: [
          { validator: noEmpty, required: true, trigger: ['change', 'blur'] }
        ],
        countryName: [
          { validator: noEmpty, required: true, trigger: ['change', 'blur'] }
        ],
        buildTime: [
          { validator: noEmpty, required: true, trigger: ['change', 'blur'] }
        ]
      },
      formTownItem: null,
      formCountryItem: null,
      item: null, //单条数据信息
      isCompile: false, //是否是编辑的开关
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

    countryName: {
      get () {
        return this.$store.state.townAndCountry.countryName
      },
      set () {

      }
    },

    townName: {
      get () {
        return this.$store.state.townAndCountry.townName
      },
      set () {

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
    dialogFormVisible (to, from) {
      this.form.buildTime = `${this.form.buildTime}`
      if (!to) {
        this.viewUserInfor = false
      }
    },
  },

  mounted () {
    this.getDataList()
  },
  methods: {
    getFormCountryItem (item) {
      this.form.countryName = item.name
      this.form.countryId = item.id
      this.$forceUpdate()
    },

    getFormTownItem (item) {
      if (this.form.townId !== item.id) {
        this.form.countryName = ''
        this.form.countryId = ''
      }
      this.form.town = item.name
      this.form.townId = item.id
    },

    getFormCountrySelectDataList (event, val) {
      if (event) {
        if (val == 1) { //打开town的下拉框
          let data = {
            id: sessionStorage.countryId
          }
          this.$store.dispatch('townAndCountry/getTownOrCountryList', { data: data, val: val })
        } else {
          if (this.form.townId) {
            let data = {
              id: this.form.townId
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

    checkItemDetails (row) { //查看
      this.$store.commit('crud/ONOFF_ADDDATA_DIALOG', true)
      this.viewUserInfor = true
      this.form = { ...row }
      this.form.buildTime = `${row.buildTime}`
    },

    deleteData (id) {
      let data = {
        ids: id
      }
      this.$store.dispatch('crud/deleteData', { url: '/wastewaterHand/deleteWastewaterHandles', method: 'post', params: data })
    },

    getDataList () {
      let data = {
        page: this.page,
        pageSize: this.pageSize,
        town: this.townName,
        countryName: this.countryName
      }
      this.$store.dispatch('crud/getDataList', { url: '/wastewaterHand/getWastewaterHandList', method: 'get', params: { params: data } })
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
        let url
        if (this.isCompile) {
          delete data.createTime
          delete data.updateTime
          url = "/wastewaterHand/updateWastewaterHandle"
        } else {
          url = "/wastewaterHand/addWastewaterHandle"
        }
        this.$store.dispatch('crud/addData', { url: url, method: 'post', params: data })
      } else {
        this.mustDialog = true
      }
    }
  },
}
</script>
