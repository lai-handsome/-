<template>
  <div class="module">

    <div class="content">
      <div class="content-header">
        <!-- <div class="arrows-icon">

    </div> -->
        <img src="@/assets/icon/arrows.png"
             alt="">
        <router-link :to="{name: 'dataManagementScreen'}"
                     tag="span"
                     style="cursor: pointer">数据管理</router-link><span>>&nbsp;&nbsp;宏观数据&nbsp;&nbsp;>&nbsp;&nbsp;{{$route.query.title}}</span>
      </div>

      <div class="content-main">

        <contentHeaderBtns :importExcelUrl="'/dataHongGuan/importHongGuanTableDatas'"
                           :excelTemplateUrl="'/dataHongGuan/ExcelModle'"
                           :exportExcelUrl="'/dataHongGuan/exportHongGuanTableDatas'"
                           :exportExcelData="{menuId: routeId,year:year,ids:selectedItemsIds.join(',')}"
                           :importExcelData="{menuId:routeId}">
          <template v-slot:insertBtn>
            <div class="pull-down"
                 v-if="btnPermission($route.name,'changeIndexName')">
              <el-button type="warning"
                         @click="openIndexDialog(true)">修改指标名称</el-button>
            </div>
          </template>

          <div class="pull-down"
               v-if="btnPermission($route.name,'query')">
            <span>年份：</span>
            <el-date-picker v-model="year"
                            value-format="yyyy"
                            type="year"
                            placeholder="选择年"> </el-date-picker>
            <!-- <el-input v-model="year"></el-input> -->
          </div>

        </contentHeaderBtns>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>
                  <!-- <input type="checkbox"
                   :checked="checkAllStatus"
                   @change="checkAll($event)" /> -->
                  <el-checkbox v-model="checkAllStatus"
                               @change="checkAll($event)"></el-checkbox>
                </th>
                <th>
                  序号
                </th>
                <th v-for="column in columns"
                    :key="column.key">{{column.title}}</th>
                <th>
                  操作
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row,index) in dataList"
                  :key="row.id">
                <td>
                  <el-checkbox :value="isChecked(row.id)"
                               title="check"
                               @change="checkItems(row.id,$event)"></el-checkbox>
                </td>
                <td>
                  {{index + 1}}
                </td>
                <td v-for="column in columns"
                    :key="column.key">{{row[column.key]}}</td>
                <td>
                  <el-button @click="changeData(row)"
                             v-if="btnPermission($route.name,'compile')">编辑</el-button>
                  <el-button @click="checkItemDetails(row)"
                             v-if="btnPermission($route.name,'checkDetails')">查看</el-button>
                  <el-button @click="changeStatus(row.id)"
                             v-if="btnPermission($route.name,'normalOrDisable')">{{row.statuShow == 0 ? '禁用' : '正常'}}</el-button>
                </td>
              </tr>
            </tbody>
          </table>
          <el-pagination v-if="total > 10"
                         @size-change="handleSizeChange"
                         @current-change="handleCurrentChange"
                         :current-page="page"
                         :page-sizes="[5,10, 20]"
                         :page-size="pageSize"
                         background
                         style="float:right;"
                         layout="total, sizes, prev, pager, next, jumper"
                         :total="total"></el-pagination>
        </div>

      </div>

    </div>

    <form-dialog v-if="dialogFormVisible"
                 :formTitle="$route.query.title">
      <el-form ref="ruleForm"
               :rules="rules"
               :model="form"
               :disabled="viewUserInfor"
               label-width="80px">

        <el-form-item label="年份"
                      prop="year">
          <el-date-picker v-model="form.year"
                          value-format="yyyy"
                          type="year"
                          placeholder="选择年"> </el-date-picker>
        </el-form-item>

        <el-form-item label="指标名称">
          <el-input v-model="form.targetNmae"
                    :disabled="true"></el-input>
        </el-form-item>

        <el-form-item label="数值"
                      prop="value">
          <el-input v-model="form.value"
                    @input="form.value = toDecimals(form.value)"></el-input>
        </el-form-item>
        <el-form-item label="数值单位"
                      prop="valueName">
          <el-input v-model="form.valueName"
                    :disabled="true"
                    type="text"
                    maxlength="4"
                    show-word-limit></el-input>
        </el-form-item>

        <el-form-item label="状态">
          <el-radio-group v-model="form.statuShow">
            <el-radio :label="0">正常</el-radio>
            <el-radio :label="1">禁用</el-radio>
          </el-radio-group>
        </el-form-item>

      </el-form>

    </form-dialog>

    <el-dialog title="提示:请先填写大屏统计的指标和数值单位"
               :visible.sync="indexDialog"
               :before-close="closeIndexDialog"
               :show-close="indexShowClose"
               :close-on-click-modal="indexShowClose"
               :close-on-press-escape="indexShowClose"
               width="30%">
      <el-form :model="form"
               label-width="120px">
        <el-form-item label="请输入统计名称">
          <el-input v-model="form.targetNmae"
                    placeholder="例如：人口统计"
                    type="text"></el-input>
        </el-form-item>

        <el-form-item label="数值单位">
          <el-input v-model="form.valueName"
                    placeholder="例如：万人"
                    type="text"
                    maxlength="4"
                    show-word-limit></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer"
            class="dialog-footer">
        <el-button type="danger"
                   v-if="!indexShowClose"
                   @click="$router.go(-1)">取消</el-button>
        <el-button type="primary"
                   @click="changeIndex">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import deepClone indexForm '@/utils/deepClone'
import request from '@/request/request';

import formDialog from '@/views/formDialog'
import contentHeaderBtns from '../components/contentHeaderBtns'
import dataManagementAside from '../components/dataManagementAside'
import { noEmpty, chinese, num } from '@/utils/validate'

export default {
  components: {
    contentHeaderBtns,
    dataManagementAside,
    formDialog
  },
  data () {
    return {
      viewUserInfor: false, //查看用户信息
      isCompile: false, //是否是编辑开关
      form: {
        year: '', //年份
        targetNmae: '',//指标名称
        value: '',//数值
        valueName: '',//数值单位
        statuShow: 0, //0:正常 1：禁用
        type: 0
        // statuShowChinese: ''
      },

      rules: {
        year: [
          { validator: noEmpty, required: true, trigger: ['change', 'blur'] }
        ],
        value: [
          { validator: num, required: true, trigger: ['change', 'blur'] }
        ],
        valueName: [
          { validator: chinese, required: true, trigger: ['change', 'blur'] }
        ],
      },

      columns: [
        {
          title: '年份',
          key: 'year',
        },
        {
          title: '指标名称',
          key: 'targetNmae',
        },
        {
          title: '数值',
          key: 'value',
        },
        {
          title: '数值单位',
          key: 'valueName',
        },
        {
          title: '页面显示',
          key: 'statuShowChinese',
        },
      ],
      //   indexForm: {
      //     indexName: '', //指标名称
      //     indexUnit: '', //指标单位
      //   },
      indexDialog: false, //改写指标名称弹头的开关
      indexShowClose: false,
      //   menuId: 1,
      id: '', //接收单条数据的id
      page: 1,
      pageSize: 10,

      checkAllStatus: false,//全选状态
      year: '',
      item: null,  //单条数据
      selectedItemsIds: [],
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

    total () {
      return this.$store.state.crud.total
    },

    dataList () {
      return this.$store.state.crud.dataList
    },

    routeId () {
      return this.$route.query.routeId
    }
  },

  mounted () {
    this.hasIndexName()
  },

  watch: {
    selectedItemsIds (to, from) {
      if (to.length === this.dataList.length) {
        this.checkAllStatus = true
      } else {
        this.checkAllStatus = false
      }
    },

    '$route' (to, from) {
      if (to.name !== from.name) {
        this.$store.commit('crud/GET_DATALIST', { dataList: [], total: 0, dataListParams: '' }) //清空dataList
        this.checkAllStatus = false
        this.selectedItemsIds.length = 0
        this.year = ''
        // this.menuId = to.meta.menuId
        for (let key in this.form) {
          this.form[key] = ''
        }

        if (this.routeId) {
          this.hasIndexName()
        }
      }
    },

    dialogFormVisible (to, from) {
      this.form.type = 0
      if (!to) {
        this.viewUserInfor = false
        this.isCompile = false
      } else {
        if (!this.isCompile && !this.viewUserInfor) {
          this.form.statuShow = 0
        }
        this.openIndexDialog(false)
      }
    },

    dataList (to, from) {
      if (to) {
        this.checkAllStatus = false
        this.selectedItemsIds.length = 0
      }
    }
  },

  //   mounted () {
  //     this.getDataList();
  //   },

  methods: {
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
        data.menuId = this.routeId
        // data.targetNmae = this.targetNmae
        data.statuShowChinese = this.form.statuShow == 0 ? '正常' : '禁用'
        let url
        if (this.isCompile) {
          delete data.createTime
          delete data.updateTime
          url = "/dataHongGuan/updataTableData"
        } else {
          url = "/dataHongGuan/addTableData"
        }
        this.$store.dispatch('crud/addData', { url: url, method: 'post', params: data })
      }

    },

    changeStatus (id) { //修改状态的接口
      //   console.log(id, 'id');
      let data = {
        id: id,
        menuId: this.routeId
      }
      request({
        url: '/dataHongGuan/operateTableData',
        method: 'post',
        data
      }).then(res => {
        if (res.code == '10000') {
          this.$message({
            message: res.msg,
            type: 'success'
          });
        }
        this.getDataList()
        // console.log(res, 'res');
      })
    },

    deleteData (id) {
      let data = {
        ids: id, //传个用户id可以删除，也可以批量处理，传个数组，里面是要传的id
        menuId: this.routeId,
      }
      this.$store.dispatch('crud/deleteData', { url: '/dataHongGuan/deleteTableData', method: 'post', params: data })
    },

    getDataList () {
      let data = {
        page: this.page,
        pageSize: this.pageSize,
        menuId: this.routeId,
        id: this.id,
        year: this.year
      }
      this.$store.dispatch('crud/getDataList', { url: '/dataHongGuan/findAllTableData', method: 'get', params: { params: data } })
    },

    hasIndexName () { //确认下是否有指标名称和数值单位
      if (this.routeId) {
        let data = {
          id: this.routeId,
        }
        request({
          url: '/dataHongGuan/isHavaMenuName',
          method: 'post',
          data
        }).then(res => {
          if (res.code == '10000') {
            this.indexDialog = res.nameIndex
            if (!res.nameIndex) {
              this.getDataList()
            }
          }
        })
      }
    },

    changeIndex () {//修改指标名称
      if (this.form.valueName !== '' && this.form.targetNmae !== '') {
        let data = {
          id: this.routeId,
          menuName: this.form.targetNmae,  //指标名称
          menuValueName: this.form.valueName  //数值单位
        }
        request({
          url: '/dataHongGuan/updateMenu',
          method: 'post',
          data
        }).then(res => {
          if (res.code == '10000') {
            this.$message({
              message: res.msg,
              type: 'success',
              showClose: false
            })
            setTimeout(() => {
              this.$router.go(0)
            }, 1500)
            // this.indexDialog = false
            // this.getDataList()
          }
        })
      } else {
        this.$message({
          message: '文本框不能为空哦！',
          type: 'error',
          showClose: false
        })
      }
    },

    openIndexDialog (boolean) {
      let data = {
        id: this.routeId
      }
      request({
        url: '/dataHongGuan/findMenuById',
        method: 'get',
        params: data
      }).then(res => {
        if (res.code == '10000') {
          this.form.targetNmae = res.data.menuName, //指标名称
            this.form.valueName = res.data.menuValueName, //指标单位
            this.indexDialog = boolean
          this.indexShowClose = boolean
        }
      })
    },

    closeIndexDialog () {
      this.indexDialog = false
      this.indexShowClose = false
    },

    isChecked (id) {
      return this.selectedItemsIds.some(item => item === id);
    },

    checkAll (e) {  //全选功能
      this.checkAllStatus = e
      if (e) {
        let checkAllArr = [];
        let i = 0;
        let length = this.dataList.length;
        for (i; i < length; i++) {
          checkAllArr.push(this.dataList[i].id);
        }
        this.selectedItemsIds = checkAllArr
        // this.$emit("update:selectedItemsIds", checkAllArr);
      } else {
        // this.$emit("update:selectedItemsIds", []);
        this.selectedItemsIds.length = 0
      }
    },

    checkItems (id, e) {  //单选
      //   let copyselectedItemsIds = deepClone(this.selectedItemsIds);
      let copyselectedItemsIds = this.selectedItemsIds

      if (e) {
        copyselectedItemsIds.push(id);
      } else {
        let index = copyselectedItemsIds.findIndex(item => item === id);
        copyselectedItemsIds.splice(index, 1);
      }
      this.selectedItemsIds = copyselectedItemsIds
    },

    changeData (row) {  //编辑
      this.isCompile = true
      this.form = { ...row }
      this.form.year = String(row.year)
      this.$store.commit('crud/ONOFF_ADDDATA_DIALOG', true)
    },

    checkItemDetails (row) { //查看
      this.$store.commit('crud/ONOFF_ADDDATA_DIALOG', true)
      this.viewUserInfor = true
      this.form = { ...row }
      this.form.year = String(row.year)
    },

    handleCurrentChange (val) {
      this.page = val
      this.getDataList()
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.getDataList()
    }
  },
}
</script>

<style lang="scss" scoped>
@import "@/styles/table.scss";
@import "@/styles/contentHeader.scss";
.module {
  background: #f4f7fe;
  width: 100%;
  height: 100%;
  position: relative;
  .content {
    padding: 20px 20px 0 20px;
    margin-left: 260px;
  }
  .content-main {
    background: #fff;
    margin-top: 20px;
    border-radius: 4px;
    padding: 0 20px;
  }
}
</style>