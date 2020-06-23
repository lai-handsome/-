<template>
  <div class="module">
    <dataManagementAside :routeName="'modelBase'"
                         :title="'示范基地'"></dataManagementAside>
    <div class="content">
      <bread-crumb :parentTitle="'示范基地'"></bread-crumb>
      <div class="content-main">

        <contentHeaderBtns :importExcelUrl="'/modleBase/importModleBases'"
                           :excelTemplateUrl="'/modleBase/ExcelModle'"
                           :exportExcelUrl="'/modleBase/exportModleBaseList'"
                           :exportExcelData="{ids:selectedItemsIds.join(','),constructeType:constructeTypeId,baseName:baseName}">
          <div v-permission="{name:$route.name,btnName:'query'}">
            <div class="pull-down">
              <span>基地名称：</span>
              <el-input v-model="baseName"
                        :clearable="true"
                        style="width: 200px"></el-input>
            </div>
            <div class="pull-down">
              <span>建设类别：</span>
              <el-select v-model="constructeTypeId"
                         placeholder="请选择"
                         :clearable="true">
                <el-option v-for="item in constructionType"
                           :key="item.id"
                           :label="item.name"
                           :value="item.id"></el-option>
              </el-select>
            </div>
          </div>
        </contentHeaderBtns>

        <my-table :columns="columns"
                  :selectedItemsIds.sync="selectedItemsIds"></my-table>

      </div>
    </div>

    <form-dialog v-if="dialogFormVisible">
      <el-form label-width="100px"
               ref="ruleForm"
               :rules="rules"
               :disabled="viewUserInfor"
               :model="form">

        <el-form-item label="所属乡镇"
                      prop="existCountry">
          <!-- 一级 -->
          <el-select v-model="form.existCountry"
                     :ref="mySelect1"
                     @focus="mySelect1 = 'mySelect'"
                     @blur="mySelect1 = ''"
                     placeholder="请选择乡镇"
                     value-key="id"
                     @change="getFormTownItem"
                     @visible-change="getFormCountrySelectDataList($event)">
            <el-option v-for="item in formTownList"
                       :key="item.id"
                       :label="item.name"
                       :value="item"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="基地名称"
                      prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>

        <el-form-item label="建设类别">
          <el-select v-model="form.constructeTypeChinese"
                     :ref="mySelect2"
                     @focus="mySelect2 = 'mySelect'"
                     @blur="mySelect2 = ''"
                     @change="selectConstructeType"
                     placeholder="请选择">
            <el-option v-for="item in constructionType"
                       :key="item.id"
                       :label="item.name"
                       :value="item"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="法定代表人">
          <el-input v-model="form.legalRepresentativePerson"></el-input>
        </el-form-item>

        <el-form-item label="联系电话">
          <el-input v-model="form.phoneNumber"
                    @input="form.phoneNumber = toInt(form.phoneNumber)"></el-input>
        </el-form-item>

        <el-form-item label="业务用房面积（㎡）">
          <el-input v-model="form.businessHouseArea"
                    @input="form.businessHouseArea = toDecimals(form.businessHouseArea)"></el-input>
        </el-form-item>

        <el-form-item label="检测室面积（㎡）">
          <el-input v-model="form.monitoringRoomArea"
                    @input="form.monitoringRoomArea = toDecimals(form.monitoringRoomArea)"></el-input>
        </el-form-item>

        <el-form-item label="农技产业服务基地数（个）">
          <el-input v-model="form.agriculturalBaseNumber"
                    @input="form.agriculturalBaseNumber = toInt(form.agriculturalBaseNumber)"></el-input>
        </el-form-item>

        <el-form-item label="办公设备数量（套）">
          <el-input v-model="form.officeEquipmentNumber"
                    @input="form.officeEquipmentNumber = toInt(form.officeEquipmentNumber)"></el-input>
        </el-form-item>
        <el-form-item label="检测设备数量（套）">
          <el-input v-model="form.checkEquipmentNumber"
                    @input="form.checkEquipmentNumber = toInt(form.checkEquipmentNumber)"></el-input>
        </el-form-item>
        <el-form-item label="农技人员数（个）">
          <el-input v-model="form.agriculturalPersonNumber"
                    @input="form.agriculturalPersonNumber = toInt(form.agriculturalPersonNumber)"></el-input>
        </el-form-item>

        <el-form-item label="地址">
          <el-input v-model="form.address"></el-input>
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
    </form-dialog>

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
import myTable from '@/views/table'
import formDialog from '@/views/formDialog'
import contentHeaderBtns from '../components/contentHeaderBtns'
import dataManagementAside from '../components/dataManagementAside'
import { noEmpty } from '@/utils/validate'
import breadCrumb from '../components/breadCrumb'
export default {
  components: {
    myTable,
    formDialog,
    contentHeaderBtns,
    dataManagementAside,
    breadCrumb
  },
  data () {
    return {
      mustDialog: false,
      mySelect1: '',
      mySelect2: '',
      viewUserInfor: false,

      selectedItemsIds: [],
      //   dialogFormVisible: false,
      constructionType: [
        {
          name: '示范性',
          id: 1
        },
        {
          name: '非示范性',
          id: 2
        }
      ],
      columns: [
        {
          title: '所在乡镇',
          key: 'existCountry',
        },
        {
          title: '基地名称',
          key: 'name',
        },
        {
          title: '建设类别',
          key: 'constructeTypeChinese',
        },
        {
          title: '法定代表人',
          key: 'legalRepresentativePerson',
        },
        {
          title: '农技产业服务基地数（个）',
          key: 'agriculturalBaseNumber',
        },
      ],
      form: {
        existCountry: '',//是	所在乡镇
        countryId: '',//是	所属乡镇id
        name: '',//是	基地名称
        constructeType: '',//是	建设类别 1和2区别
        constructeTypeChinese: '', // 示范性和非示范性
        legalRepresentativePerson: '',//否	法定代表人
        phoneNumber: '',//否	联系电话
        businessHouseArea: '',//否	业务用房面积
        monitoringRoomArea: '',//否	监测室面积
        agriculturalBaseNumber: '',//否	农技产业服务基地数
        officeEquipmentNumber: '',//否	办公设备数量
        checkEquipmentNumber: '',//否	检测设备数量
        agriculturalPersonNumber: '',//否	农技人员数
        address: '',//否	地址
        jingdu: '',//是	经度
        weidu: '',//是	纬度
        cel1: '',//否	扩展字段1
        cel2: '',//否	扩展字段2
        cel3: '',//否	扩展字段3
        cel4: '',//否	扩展字段4
        type: 0
        // year: '',//否	年份
      },
      rules: {
        existCountry: [
          { validator: noEmpty, required: true, trigger: ['blur', 'change'] }
        ],
        name: [
          { validator: noEmpty, required: true, trigger: ['blur', 'change'] }
        ],
      },
      baseName: '', //基地名称
      constructeTypeId: '',//1：示范性基地（添加数据时默认值）  2：非示范性基地

      isCompile: false, //是否是编辑的开关
      userDialogVisible: false, //查看用户信息弹框

      page: 1,
      pageSize: 10,
      id: '', //单条数据的id

      dataList: null,
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
  },

  mounted () {
    this.getDataList();
  },

  watch: {
    dialogFormVisible (to, from) {
      this.form.type = 0
      if (!to) {
        this.viewUserInfor = false
      }
    }
  },

  methods: {
    selectConstructeType (item) {
      this.form.constructeTypeChinese = item.name
      this.form.constructeType = item.id
    },
    deleteData (id) {
      let data = {
        ids: id
      }

      this.$store.dispatch('crud/deleteData', { url: '/modleBase/deleteModleBases', method: 'post', params: data })
    },

    getFormTownItem (item) {
      this.form.existCountry = item.name
      this.form.countryId = item.id
    },

    getFormCountrySelectDataList (event) {
      if (event) {
        let data = {
          id: sessionStorage.countryId
        }
        this.$store.dispatch('townAndCountry/getTownOrCountryList', { data: data, val: 1 })
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
        let data = this.form;
        if (this.isCompile) {
          delete data.createTime
          delete data.updateTime
        }
        let url
        if (this.isCompile) {
          url = "/modleBase/updateModleBase"
        } else {
          url = "/modleBase/addModleBase"
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
    },

    queryData () {// 查询数据
      this.getDataList()
    },

    getDataList () {
      let data = {
        constructeType: this.constructeTypeId,
        name: this.baseName,
        page: this.page,
        pageSize: this.pageSize,
      }
      this.$store.dispatch('crud/getDataList', { url: '/modleBase/findAllByWheres', method: 'get', params: { params: data } })
    },
  },
}
</script>

<style lang="scss" scoped>
@import "@/styles/module.scss";
</style>