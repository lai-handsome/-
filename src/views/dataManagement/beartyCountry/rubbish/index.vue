<template>
  <div>
    <contentHeaderBtns :importExcelUrl="'/garbageSort/importGarbageSorts'"
                       :excelTemplateUrl="'/garbageSort/ExcelModle'"
                       :exportExcelUrl="'/garbageSort/exportGarbageSortList'"
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

      <el-form label-width="100px"
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

        <el-form-item label="任务年度"
                      prop="year">
          <el-date-picker v-model="form.year"
                          :ref="mySelect3"
                          @focus="mySelect3 = 'mySelect'"
                          @blur="mySelect3 = ''"
                          value-format="yyyy"
                          type="year"
                          placeholder="选择年"> </el-date-picker>
        </el-form-item>

        <el-form-item label="村落类型">
          <el-select v-model="form.countryTypeChinese"
                     :ref="mySelect4"
                     @focus="mySelect4 = 'mySelect'"
                     @blur="mySelect4 = ''"
                     @change="selectCountryType">
            <el-option v-for="item in countryType"
                       :key="item.id"
                       :label="item.name"
                       :value="item">
            </el-option>
          </el-select>
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
      <span>您还有必填项没填，或者填入数据的格式有问题</span>
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
import townAndCountry from '../../components/townAndCountry'
import contentHeaderBtns from '../../components/contentHeaderBtns'
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
      mySelect4: '',
      viewUserInfor: false, //查看用户信息弹框
      userDialogVisible: false,
      item: null, //单条用户信息
      selectedItemsIds: [],
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
          title: '任务年度',
          key: 'year',
        },
        {
          title: '村落类型',
          key: 'countryTypeChinese',
        },
      ],
      page: 1,
      pageSize: 10,
      form: {
        town: '',  //乡镇
        countryName: '', //村名称
        countryType: '', //村落类型  1.分类处理 2：项目试点
        countryTypeChinese: '',
        menuId: 2,
        jingdu: '',//是	经度   必需传
        weidu: '',//是	纬度     必需传
        cel1: '',   //扩展字段1
        cel2: '',   //扩展字段2
        cel3: '',   //扩展字段3
        cel4: '',   //扩展字段4
        year: '',  //年份
        countryId: '', //村id
        townId: '',  //乡镇id
        type: 0,
      },
      rules: {
        town: [
          { validator: noEmpty, required: true, trigger: ['change', 'blur'] }
        ],
        year: [
          { validator: noEmpty, required: true, trigger: ['change', 'blur'] }
        ],
        countryName: [
          { validator: noEmpty, required: true, trigger: ['change', 'blur'] }
        ]
      },
      countryType: [
        {
          name: '分类处理村',
          id: 1
        },
        {
          name: '项目试点村',
          id: 2
        }
      ],
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

    longitude () {
      return this.$store.state.crud.longitude
    },

    latitude () {
      return this.$store.state.crud.latitude
    }
  },

  watch: {
    dialogFormVisible (to, from) {
      this.form.type = 0
      if (!to) {
        this.viewUserInfor = false
      }
    }
  },
  mounted () {
    this.getDataList();
  },

  methods: {
    selectCountryType (item) {
      this.form.countryType = item.id
      this.form.countryTypeChinese = item.name
    },

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
      this.form.year = `${row.year}`
    },
    getDataList () {
      let data = {
        page: this.page,
        pageSize: this.pageSize,
        town: this.townName,
        countryName: this.countryName
      }
      this.$store.dispatch('crud/getDataList', { url: '/garbageSort/getGarbageSortList', method: 'get', params: { params: data } })
    },

    deleteData (id) {
      let data = {
        ids: id
      }
      this.$store.dispatch('crud/deleteData', { url: '/garbageSort/deleteGarbageSort', method: 'post', params: data })
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
        // data.jingdu = this.longitude
        // data.weidu = this.latitude
        if (this.isCompile) {
          delete data.createTime
          delete data.updateTime
          url = "/garbageSort/updateGarbageSort"
        } else {
          url = '/garbageSort/addGarbageSort'
        }
        this.$store.dispatch('crud/addData', { url: url, method: 'post', params: data })
      } else {
        this.mustDialog = true
      }

    },

  },
}
</script>
