<template>
  <div class="dialog">
    <el-dialog title="编辑龙头企业"
               width="700px"
               :visible.sync="$parent.farmingSubjectDialog1">
      <div style="height:500px; overflow-y: auto">
        <el-form label-width="200px"
                 :model="form">

          <el-form-item label="主体名称">
            <el-input v-model="form.name"></el-input>
          </el-form-item>

          <el-form-item label="所属乡镇">
            <!-- 一级 -->
            <el-select v-model="form.countryName"
                       :clearable="true"
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
            <el-select v-model="form.cunName"
                       :clearable="true"
                       placeholder="请选择"
                       @visible-change="getCountrySelectDataList($event,2)">
              <el-option v-for="item in countryOption2"
                         :key="item.id"
                         :label="item.name"
                         :value="item.name">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="经度">
            <el-input v-model="form.jingdu"></el-input>
          </el-form-item>

          <el-form-item label="纬度">
            <el-input v-model="form.weidu"></el-input>
          </el-form-item>

          <el-form-item label="产业类型">
            <el-select v-model="form.industryTypeThirName"
                       :clearable="true"
                       placeholder="请选择"
                       @visible-change="getThreeProSelectDataList($event)">
              <el-option v-for="item in threeProDataList"
                         :key="item.id"
                         :label="item.name"
                         :value="item.name">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="年份">
            <el-input v-model="form.year"></el-input>
          </el-form-item>
          <el-form-item label="联系人">
            <el-input v-model="form.contact"></el-input>
          </el-form-item>
          <el-form-item label="联系电话">
            <el-input v-model="form.tele"></el-input>
          </el-form-item>
          <el-form-item label="统一社会信用代码（或营业执照号）/身份证">
            <el-input v-model="form.xinyongdaima"></el-input>
          </el-form-item>
          主体类别 ：默认显示
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
                       :clearable="true"
                       placeholder="请选择"
                       @visible-change="getProductSelectDataList($event)">
              <el-option v-for="item in productSelectDataList"
                         :key="item.id"
                         :label="item.name"
                         :value="item.name">
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
      </div>

      <div slot="footer"
           class="dialog-footer">
        <el-button @click="$parent.farmingSubjectDialog1 = false">取 消</el-button>
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

        tele: '',//否	1234联系电话

        xinyongdaima: '',//否  1234566信用代码（营业执照）或身份证

        agriculturalSubjectTypeId: '',//否	2主体类别id

        agriculturalSubjectTypeName: '',//否	农民专业合作社  主体类别名称

        shengchanleixing: '',//否  XX型生产类型

        chanpinrenzhengId: '',//否	1产品认证id

        chanpinrenzhengName: '',//否	无公害农产品认证产品认证名称

        xinxiang: '',//是	农民邮箱
      },

      countryOption1: null,
      countryOption2: null,
      countryside: 230000000000,// 一级乡镇id

      subjectSelectDataList: null, //产品主体下拉数据

      threeProDataList: null, //获取产业三级类型

      productSelectDataList: null,  //产品认证下拉数据
    }
  },

  mounted () {
    let index = this.$parent.treeDataIndex;
    this.form.agriculturalSubjectTypeName = this.$parent.subjectSelectDataList[index].name
    this.form.agriculturalSubjectTypeId = this.$parent.subjectSelectDataList[index].id

    if (this.$parent.isCompile) {
      this.form = { ...this.$parent.item }
    }

  },
  methods: {
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

    getCountrySelectDataList (event, val) {  //获取乡镇，村庄

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
          for (let item of this.countryOption1) {
            if (this.form.countryName == item.name) {
              this.form.countryId = item.id
            }
          }

          let data = {
            id: this.form.countryId
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

    // getSubjectSelectDataList (event) {
    //   if (event) {
    //     request({
    //       url: '/agriculturalSubjectType/getType',
    //       method: 'get'
    //     }).then(res => {
    //       if (res.code == '10000') {
    //         this.subjectSelectDataList = res.data
    //       }
    //     })
    //   }
    // },

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

    addData () {

      // for (let item of this.subjectSelectDataList) {
      //   if (this.form.agriculturalSubjectTypeName == item.name) {
      //     this.form.agriculturalSubjectTypeId = item.id
      //     break
      //   }
      // }

      if (this.countryOption2 != null) {  //获取村庄 id
        for (let item of this.countryOption2) {
          if (this.form.cunName == item.name) {
            this.form.cunId = item.id
            break
          }
        }
      }

      if (this.threeProDataList != null) { //获取三级产业id
        for (let item of this.threeProDataList) {
          if (this.form.industryTypeThirName == item.name) {
            this.form.industryTypeThirId = item.id
            break
          }
        }
      }

      if (this.productSelectDataList != null) { //获取产品认证
        for (let item of this.productSelectDataList) {
          if (this.form.chanpinrenzhengName == item.name) {
            this.form.chanpinrenzhengId = item.id
            break
          }
        }
      }

      let data = this.form

      request({
        url: '/agriculturalSubjectData/addData',
        method: 'post',
        data
      }).then(res => {
        if (res.code == '10000') {

          this.$message({
            message: res.msg,
            type: 'success'
          });

          this.$parent.farmingSubjectDialog1 = false
          this.$parent.getDataList()
        }
      })


    }

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