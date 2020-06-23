<template>
  <div class="dialog">
    <el-dialog title="开化县长虹乡虹桥村"
               width="800px"
               :visible.sync="$parent.beartyCountryDialog3">

      <el-tabs v-model="activeName"
               @tab-click="handleClick">
        <el-tab-pane label="基本信息"
                     name="first">
          <div style="height:500px; overflow-y: auto">
            <el-form label-width="160px"
                     :model="form">
              <el-form-item label="所属乡镇">
                <!-- 一级 -->
                <el-select v-model="form.town"
                           placeholder="请选择"
                           @visible-change="getCountrySelectDataList($event,1)">
                  <el-option v-for="item in countryOption1"
                             :key="item.id"
                             :label="item.name"
                             :value="item.name">
                  </el-option>
                </el-select>

              </el-form-item>
              <!-- 二级 -->
              <el-form-item label="所属村庄">
                <el-select v-model="form.countryname"
                           placeholder="请选择"
                           @visible-change="getCountrySelectDataList($event,2)">
                  <el-option v-for="item in countryOption2"
                             :key="item.id"
                             :label="item.name"
                             :value="item.name">
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="村落类型">
                <el-select v-model="form.countryType"
                           placeholder="请选择">
                  <el-option v-for="item in countryType"
                             :key="item.id"
                             :label="item.name"
                             :value="item.name">
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="申报时间">
                <el-input v-model="form.applytime"></el-input>
              </el-form-item>

              <el-form-item label="经度">
                <el-input v-model="form.longitude"></el-input>
              </el-form-item>

              <el-form-item label="纬度">
                <el-input v-model="form.latitude"></el-input>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
        <el-tab-pane label="项目信息"
                     name="second">
          <div style="height:500px; overflow-y: auto">
            <el-form label-width="160px"
                     :model="form">
              <el-form-item label="年度">
                <el-input v-model="form.year"></el-input>
              </el-form-item>
              <el-form-item label="项目类型">
                <el-select v-model="form.projecttype"
                           placeholder="请选择">
                  <el-option v-for="item in projectType"
                             :key="item.id"
                             :label="item.name"
                             :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="项目负责人">
                <el-input v-model="form.projectperson"></el-input>
              </el-form-item>

              <el-form-item label="负责人联系电话">
                <el-input v-model="form.projectphone"></el-input>
              </el-form-item>

              <el-form-item label="项目主管部门">
                <el-input v-model="form.projectchiefdept"></el-input>
              </el-form-item>
              <el-form-item label="主管部门联系人">
                <el-input v-model="form.projectdeptperson"></el-input>
              </el-form-item>

              <el-form-item label="主管部门联系电话">
                <el-input v-model="form.projectdeptphone"></el-input>
              </el-form-item>
              <el-form-item label="项目施工单位">
                <el-input v-model="form.constructcompany"></el-input>
              </el-form-item>

              <el-form-item label="施工单位联系电话">
                <el-input v-model="form.constructphone"></el-input>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>

        <el-tab-pane label="投资构成"
                     name="third">
          <div style="height:500px; overflow-y: auto">
            <p>古建筑修复项目</p>
            <el-form label-width="160px"
                     :model="form">
              <el-form-item label="总投资（万元）">
                <el-input v-model="form.totalinvestment"></el-input>
              </el-form-item>
              <el-form-item label="*省级财政（万元）">
                <el-input v-model="form.provincemoney"></el-input>
              </el-form-item>
              <el-form-item label="市级财政（万元）">
                <el-input v-model="form.citymoney"></el-input>
              </el-form-item>

              <el-form-item label="县级及县以下财政（万元）">
                <el-input v-model="form.countymoney"></el-input>
              </el-form-item>

              <el-form-item label="村自筹资金（万元）">
                <el-input v-model="form.villagemoney"></el-input>
              </el-form-item>
              <el-form-item label="银行贷款（万元）">
                <el-input v-model="form.bankmoney"></el-input>
              </el-form-item>

              <el-form-item label="其他收入（万元）">
                <el-input v-model="form.othermoney"></el-input>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>

        <el-tab-pane label="建设清单"
                     name="fourth">
          <div style="height:500px; overflow-y: auto">
            <el-form label-width="160px"
                     :model="form">
              <p>古建筑修复项目</p>
              <el-form-item label="顶瓦修补幢数（幢）">
                <el-input v-model="form.dwxb"></el-input>
              </el-form-item>
              <el-form-item label="*墙体加固幢数（幢）">
                <el-input v-model="form.qtjg"></el-input>
              </el-form-item>
              <el-form-item label="立体改造幢数（幢）">
                <el-input v-model="form.ltgz"></el-input>
              </el-form-item>

              <el-form-item label="构造修复个数（幢）">
                <el-input v-model="form.gzxf"></el-input>
              </el-form-item>

              <el-form-item label="异地迁入幢数（幢）">
                <el-input v-model="form.ydqr"></el-input>
              </el-form-item>
              <p>
                与历史风貌有冲突的建构物修整改造项目
              </p>
              <el-form-item label="立面改造幢数（幢）">
                <el-input v-model="form.lmgz"></el-input>
              </el-form-item>

              <el-form-item label="结构降层幢数（幢）">
                <el-input v-model="form.jgjc"></el-input>
              </el-form-item>

              <el-form-item label="整体拆除面积（m²）">
                <el-input v-model="form.ztcc"></el-input>
              </el-form-item>

              <el-form-item label="异地搬迁入户（户）">
                <el-input v-model="form.ydbq"></el-input>
              </el-form-item>

              <p>
                搬迁安置区基本公建设施项目
              </p>
              <el-form-item label="用地面积（亩）">
                <el-input v-model="form.ydmj"></el-input>
              </el-form-item>

              <el-form-item label="安置户数（户）">
                <el-input v-model="form.azhs"></el-input>
              </el-form-item>

              <el-form-item label="基本公建设施资额（万元）">
                <el-input v-model="form.jbgj"></el-input>
              </el-form-item>

              <p>
                村内古道修复与改造
              </p>
              <el-form-item label="面积（m²）">
                <el-input v-model="form.area"></el-input>
              </el-form-item>

              <el-form-item label="里程（公里）">
                <el-input v-model="form.licheng"></el-input>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
      </el-tabs>

      <div slot="footer"
           class="dialog-footer">
        <el-button @click="$parent.beartyCountryDialog3 = false">取 消</el-button>
        <el-button type="primary"
                   @click="addData">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import request from '@/request/request'
export default {
  data () {
    return {
      activeName: 'first',
      form: {
        town: '',  //乡镇           必需传
        countryname: '', //村名称   必需传
        countryType: '', //村落类型  1.分类处理 2：项目试点
        menuId: 2,
        longitude: '', //经度    必需传
        latitude: '',  //纬度     必需传
        cel1: '',   //扩展字段1
        cel2: '',   //扩展字段2
        cel3: '',   //扩展字段3
        cel4: '',   //扩展字段4
        year: '',  //年份
        countryid: '', //村id   必需传
        townid: '',  //乡镇id    必需传
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
      },
      countryType: [ //村落类型
        {
          name: '分类处理村',
          id: 1
        },
        {
          name: '项目试点村',
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
      countryOption1: null,
      countryOption2: null,

      countryside: 230000000000,// 一级乡镇id
    }
  },

  mounted () {
    if (this.$parent.isCompile) {
      this.form = { ...this.$parent.item }
      delete this.form.updatetime
      delete this.form.createtime
    }
  },

  methods: {
    handleClick (tab, event) {
      console.log(tab, event);
    },

    getCountrySelectDataList (event, val) {

      if (event) {
        if (val == 1) {
          let data = {
            id: this.countryside
          }
          request({
            url: '/countryData/getcountry',
            method: 'get',
            params: data
          }).then(res => {
            if (res.code == '10000') {
              this.countryOption1 = res.data
            }
          })

        } else if (val == 2 && this.countryValue1 != '') {

          if (this.countryOption1) {
            for (let item of this.countryOption1) {
              if (this.form.town == item.name) {
                this.form.townid = item.id
                break
              }
            }
          }
          let data = {
            id: this.form.townid
          }

          request({
            url: '/countryData/getcountry',
            method: 'get',
            params: data
          }).then(res => {
            if (res.code == '10000') {
              this.countryOption2 = res.data
            }
          })
        }

      }
    },

    addData () {

      let data = this.form

      if (this.countryOption1) {
        for (let item of this.countryOption1) {
          if (data.town == item.name) {
            data.townid = item.id
            break
          }
        }
      }
      if (this.countryOption2) {
        for (let item of this.countryOption2) {
          if (data.countryname == item.name) {
            data.countryid = item.id
            break
          }
        }
      }

      request({
        url: '/historyCulture/addHistoryCulture',
        method: 'post',
        data
      }).then(res => {
        if (res.code == '10000') {
          //   this.$parent.getDataList()
          this.$message({
            message: res.msg,
            type: 'success'
          });
          this.$parent.beartyCountryDialog3 = false
          this.$parent.isCompile = false
          this.$parent.getDataList('/historyCulture/getHistoryCultureList', 'get')
        }
      })

    },


  },
}
</script>

<style lang="scss" scoped>
.dialog {
  .el-input {
    width: 400px;
  }
}
</style>