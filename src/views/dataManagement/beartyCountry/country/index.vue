<template>
  <div>

    <contentHeaderBtns :importExcelUrl="'/historyCulture/importHistoryCultures'"
                       :excelTemplateUrl="'/historyCulture/ExcelModle'"
                       :exportExcelUrl="'/historyCulture/exportHistoryCultureList'"
                       :exportExcelData="{ids:selectedItemsIds.join(','),countryname: countryName,town:townName}">
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
      <el-tabs v-model="activeName">
        <el-tab-pane label="基本信息"
                     name="first">
          <div>
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
                  <el-form-item prop="countryname">
                    <el-select v-model="form.countryname"
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

              <el-form-item label="村落类型"
                            prop="countrytypechinese">
                <el-select v-model="form.countrytypechinese"
                           :ref="mySelect3"
                           @focus="mySelect3 = 'mySelect'"
                           @blur="mySelect3 = ''"
                           @change="selectCountryType"
                           placeholder="请选择">
                  <el-option v-for="item in countryType"
                             :key="item.id"
                             :label="item.name"
                             :value="item">
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="申报时间"
                            prop="applytime">
                <el-date-picker v-model="form.applytime"
                                :ref="mySelect4"
                                @focus="mySelect4 = 'mySelect'"
                                @blur="mySelect4 = ''"
                                value-format="yyyy"
                                type="year"
                                placeholder="选择年"> </el-date-picker>
              </el-form-item>

              <el-form-item label="经度"
                            prop="jingdu">
                <el-input v-model="form.jingdu"
                          @input="form.jingdu = toDecimals(form.jingdu)"></el-input>
              </el-form-item>

              <el-form-item label="纬度">
                <el-input v-model="form.weidu"
                          @input="form.weidu = toDecimals(form.weidu)"></el-input>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
        <el-tab-pane label="项目信息"
                     name="second">
          <div>
            <el-form label-width="120px"
                     :disabled="viewUserInfor"
                     :model="form">
              <el-form-item label="年度">
                <el-date-picker v-model="form.year"
                                :ref="mySelect5"
                                @focus="mySelect5 = 'mySelect'"
                                @blur="mySelect5 = ''"
                                value-format="yyyy"
                                type="year"
                                placeholder="选择年"> </el-date-picker>
              </el-form-item>
              <el-form-item label="项目类型">
                <el-select v-model="form.projecttypechinese"
                           :ref="mySelect6"
                           @focus="mySelect6 = 'mySelect'"
                           @blur="mySelect6 = ''"
                           @change="selectProjectType"
                           placeholder="请选择">
                  <el-option v-for="item in projectType"
                             :key="item.id"
                             :label="item.name"
                             :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="项目负责人">
                <el-input v-model="form.projectperson"></el-input>
              </el-form-item>

              <el-form-item label="负责人联系电话">
                <el-input v-model="form.projectphone"
                          @input="form.projectphone = toInt(form.projectphone)"></el-input>
              </el-form-item>

              <el-form-item label="项目主管部门">
                <el-input v-model="form.projectchiefdept"></el-input>
              </el-form-item>
              <el-form-item label="主管部门联系人">
                <el-input v-model="form.projectdeptperson"></el-input>
              </el-form-item>

              <el-form-item label="主管部门联系电话">
                <el-input v-model="form.projectdeptphone"
                          @input="form.projectdeptphone = toInt(form.projectdeptphone)"></el-input>
              </el-form-item>
              <el-form-item label="项目施工单位">
                <el-input v-model="form.constructcompany"></el-input>
              </el-form-item>

              <el-form-item label="施工单位联系电话">
                <el-input v-model="form.constructphone"
                          @input="form.constructphone = toInt(form.constructphone)"></el-input>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>

        <el-tab-pane label="投资构成"
                     name="third">
          <div>
            <p>古建筑修复项目</p>
            <el-form label-width="160px"
                     :disabled="viewUserInfor"
                     :model="form">
              <el-form-item label="总投资（万元）">
                <el-input v-model="form.totalinvestment"
                          @input="form.totalinvestment = toDecimals(form.totalinvestment)"></el-input>
              </el-form-item>
              <el-form-item label="*省级财政（万元）">
                <el-input v-model="form.provincemoney"
                          @input="form.provincemoney = toDecimals(form.provincemoney)"></el-input>
              </el-form-item>
              <el-form-item label="市级财政（万元）">
                <el-input v-model="form.citymoney"
                          @input="form.citymoney = toDecimals(form.citymoney)"></el-input>
              </el-form-item>

              <el-form-item label="县级及县以下财政（万元）">
                <el-input v-model="form.countymoney"
                          @input="form.countymoney = toDecimals(form.countymoney)"></el-input>
              </el-form-item>

              <el-form-item label="村自筹资金（万元）">
                <el-input v-model="form.villagemoney"
                          @input="form.villagemoney = toDecimals(form.villagemoney)"></el-input>
              </el-form-item>
              <el-form-item label="银行贷款（万元）">
                <el-input v-model="form.bankmoney"
                          @input="form.bankmoney = toDecimals(form.bankmoney)"></el-input>
              </el-form-item>

              <el-form-item label="其他收入（万元）">
                <el-input v-model="form.othermoney"
                          @input="form.othermoney = toDecimals(form.othermoney)"></el-input>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>

        <el-tab-pane label="建设清单"
                     name="fourth">
          <div>
            <el-form label-width="160px"
                     :disabled="viewUserInfor"
                     :model="form">
              <p>古建筑修复项目</p>
              <el-form-item label="顶瓦修补幢数（幢）">
                <el-input v-model="form.dwxb"
                          @input="form.dwxb = toInt(form.dwxb)"></el-input>
              </el-form-item>
              <el-form-item label="*墙体加固幢数（幢）">
                <el-input v-model="form.qtjg"
                          @input="form.qtjg = toInt(form.qtjg)"></el-input>
              </el-form-item>
              <el-form-item label="立体改造幢数（幢）">
                <el-input v-model="form.ltgz"
                          @input="form.ltgz = toInt(form.ltgz)"></el-input>
              </el-form-item>

              <el-form-item label="构造修复个数（幢）">
                <el-input v-model="form.gzxf"
                          @input="form.gzxf = toInt(form.gzxf)"></el-input>
              </el-form-item>

              <el-form-item label="异地迁入幢数（幢）">
                <el-input v-model="form.ydqr"
                          @input="form.ydqr = toInt(form.ydqr)"></el-input>
              </el-form-item>
              <p>
                与历史风貌有冲突的建构物修整改造项目
              </p>
              <el-form-item label="立面改造幢数（幢）">
                <el-input v-model="form.lmgz"
                          @input="form.lmgz = toInt(form.lmgz)"></el-input>
              </el-form-item>

              <el-form-item label="结构降层幢数（幢）">
                <el-input v-model="form.jgjc"
                          @input="form.jgjc = toInt(form.jgjc)"></el-input>
              </el-form-item>

              <el-form-item label="整体拆除面积（m²）">
                <el-input v-model="form.ztcc"
                          @input="form.ztcc = toDecimals(form.ztcc)"></el-input>
              </el-form-item>

              <el-form-item label="异地搬迁入户（户）">
                <el-input v-model="form.ydbq"
                          @input="form.ydbq = toInt(form.ydbq)"></el-input>
              </el-form-item>

              <p>
                搬迁安置区基本公建设施项目
              </p>
              <el-form-item label="用地面积（亩）">
                <el-input v-model="form.ydmj"
                          @input="form.ydmj = toDecimals(form.ydmj)"></el-input>
              </el-form-item>

              <el-form-item label="安置户数（户）">
                <el-input v-model="form.azhs"
                          @input="form.azhs = toInt(form.azhs)"></el-input>
              </el-form-item>

              <el-form-item label="基本公建设施资额（万元）">
                <el-input v-model="form.jbgj"
                          @input="form.jbgj = toDecimals(form.jbgj)"></el-input>
              </el-form-item>

              <p>
                村内古道修复与改造
              </p>
              <el-form-item label="面积（m²）">
                <el-input v-model="form.area"
                          @input="form.area = toDecimals(form.area)"></el-input>
              </el-form-item>

              <el-form-item label="里程（公里）">
                <el-input v-model="form.licheng"
                          @input="form.licheng = toDecimals(form.licheng)"></el-input>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
      </el-tabs>
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
      mySelect1: '',
      mySelect2: '',
      mySelect3: '',
      mySelect4: '',
      mySelect5: '',
      mySelect6: '',
      mustDialog: false,
      viewUserInfor: false,
      selectedItemsIds: [],
      dialogVisible: false,// 删除弹框
      userDialogVisible: false, //查看用户信息弹框
      item: null, //单条用户信息
      id: '', //单条数据的id
      columns: [
        {
          title: '乡镇',
          key: 'town',
        },
        {
          title: '村名称',
          key: 'countryname',
        },
        {
          title: '村落类型',
          key: 'countrytypechinese',
        },
        {
          title: '总投资（万元）',
          key: 'totalinvestment',
        },
        {
          title: '申报时间',
          key: 'applytime',
        },
      ],
      page: 1,
      pageSize: 10,
      activeName: 'first',
      form: {
        town: '',  //乡镇           必需传
        countryname: '', //村名称   必需传
        countryid: '', //村id   必需传
        townid: '',  //乡镇id    必需传
        countrytype: '', //村落类型  1.分类处理 2：项目试点
        countrytypechinese: '',
        menuId: 2,
        jingdu: '',//是	经度   必需传
        weidu: '',//是	纬度     必需传
        cel1: '',   //扩展字段1
        cel2: '',   //扩展字段2
        cel3: '',   //扩展字段3
        cel4: '',   //扩展字段4
        year: '',  //年份
        totalinvestment: '',//总投资
        applytime: '', //申报时间
        projecttype: '', //项目类型 1和2
        projectperson: '', //项目负责人
        projectphone: '',  //项目负责人联系电话
        projectchiefdept: '', //项目主管部门
        projectdeptperson: '', //主管部门联系人
        projectdeptphone: '', //主管部门联系电话
        constructcompany: '',//施工公司
        constructphone: '', //施工单位联系电话
        provincemoney: '', //省级财政
        citymoney: '',  //市级财政
        countymoney: '', //县级财政
        villagemoney: '',//村级财政
        bankmoney: '',//银行财政
        othermoney: '',//其他收入
        dwxb: '',//	顶瓦修补幢数
        qtjg: '',//	墙体加固幢数
        ltgz: '',//	立体改造幢数
        gzxf: '',//	构造修复幢数
        ydqr: '',//	异地迁入幢数
        lmgz: '',//	立面改造幢数
        jgjc: '',//	结构降层幢数
        ztcc: '',//	整体拆除面积
        ydbq: '',//	异地搬迁入户
        ydmj: '',//用地面积
        azhs: '',//安置户数
        jbgj: '',//	基本公建设施资额
        area: '',	//面积
        licheng: '',	 //里程
        type: 0
      },
      rules: {
        town: [
          { validator: noEmpty, required: true, trigger: ['change', 'blur'] }
        ],
        countryname: [
          { validator: noEmpty, required: true, trigger: ['change', 'blur'] }
        ],
        countrytypechinese: [
          { validator: noEmpty, required: true, trigger: ['change', 'blur'] }
        ],
        applytime: [
          { validator: noEmpty, required: true, trigger: ['change', 'blur'] }
        ],
      },
      countryType: [ //村落类型
        {
          name: '重点村',
          id: 1
        },
        {
          name: '一般村',
          id: 2
        }
      ],

      projectType: [
        {
          name: '修缮',
          id: 1
        },
        {
          name: '开发利用',
          id: 2
        },
        {
          name: '其它',
          id: 3
        }
      ],
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
    stateWeidu () {
      return this.$store.state.crud.weidu || this.form.weidu
    },
    stateJingdu () {
      return this.$store.state.crud.jingdu || this.form.jingdu
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
      //   this.form.type = 0
      //   console.log(this.form.type, 'type');
      if (!to) {
        this.activeName = 'first'
        this.viewUserInfor = false
      } else {
        this.form.buildTime = `${this.form.buildTime}`
        this.form.applytime = `${this.form.applytime}`
      }
    }
  },
  mounted () {
    this.getDataList();
    // console.log(this.$parent.$refs.mySelect, 'this.$parent.$refs.mySelect');
  },

  methods: {
    selectProjectType (item) {  //项目类型选择
      this.form.projecttypechinese = item.name
      this.form.projecttype = item.id
    },

    selectCountryType (item) {//村落类型选择
      this.form.countrytypechinese = item.name
      this.form.countrytype = item.id
    },

    getFormCountryItem (item) {
      this.form.countryname = item.name
      this.form.countryid = item.id
      this.$forceUpdate()
    },

    getFormTownItem (item) {
      if (this.form.townid !== item.id) {
        this.form.countryname = ''
        this.form.countryid = ''
      }
      this.form.town = item.name
      this.form.townid = item.id
    },

    getFormCountrySelectDataList (event, val) {
      if (event) {
        if (val == 1) { //打开town的下拉框
          let data = {
            id: sessionStorage.countryId
          }
          this.$store.dispatch('townAndCountry/getTownOrCountryList', { data: data, val: val })
        } else {
          if (this.form.townid) {
            let data = {
              id: this.form.townid
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

    getDataList () {
      let data = {
        page: this.page,
        pageSize: this.pageSize,
        town: this.townName,
        countryname: this.countryName
      }

      this.$store.dispatch('crud/getDataList', { url: '/historyCulture/getHistoryCultureList', method: 'get', params: { params: data } })
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
          delete data.createtime
          delete data.updatetime
          url = "/historyCulture/updateHistoryCulture"
        } else {
          url = "/historyCulture/addHistoryCulture"
        }
        this.$store.dispatch('crud/addData', { url: url, method: 'post', params: data })
      } else {
        this.mustDialog = true
      }
    },

    deleteData (id) {
      let data = {
        ids: id
      }
      this.$store.dispatch('crud/deleteData', { url: '/historyCulture/deleteHistoryCulture', method: 'post', params: data })
    },

    checkItemDetails (row) { //查看
      this.$store.commit('crud/ONOFF_ADDDATA_DIALOG', true)
      this.viewUserInfor = true
      this.form = { ...row }
      this.form.buildTime = `${row.buildTime}`
      this.form.applytime = `${row.applytime}`
    },
  },
}
</script>
