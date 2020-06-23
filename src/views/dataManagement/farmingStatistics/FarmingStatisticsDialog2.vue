<template>
  <div class="dialog">
    <el-dialog title="生猪编辑"
               width="680px"
               :visible.sync="$parent.dialogFormVisible2">
      <div style="height:500px; overflow-y:auto">
        <el-form label-width="140px"
                 :model="form">
          <el-form-item label="产业类型">
            <el-cascader :options="option"
                         v-model="form.industrytypSec"
                         :props="{value: 'id',label:'name',children:'industryTypeThird'}"
                         children='industryTypeThird'
                         clearable
                         placeholder="请选择"
                         @visible-change="getSelectDataList($event)"></el-cascader>
            <!-- 一级 -->

            <!-- <el-select v-model="form.industrytypFir"
                     placeholder="请选择"
                     @visible-change="getSelectDataList($event,1)">
            <el-option v-for="item in option1"
                       :key="item.id"
                       :label="item.name"
                       :value="item.id">
            </el-option>
          </el-select> -->
            <!-- 二级 -->
            <!-- <el-select v-model="form.industrytypSec"
                     placeholder="请选择"
                     @visible-change="getSelectDataList($event,2)">
            <el-option v-for="item in option2"
                       :key="item.id"
                       :label="item.name"
                       :value="item.id">
            </el-option>
          </el-select> -->
            <!-- 三级 -->
            <!-- <el-select v-model="form.industrytypThir"
                     placeholder="请选择"
                     @visible-change="getSelectDataList($event,3)">
            <el-option v-for="item in option3"
                       :key="item.id"
                       :label="item.name"
                       :value="item.id">
            </el-option>
          </el-select> -->
          </el-form-item>

          <el-form-item label="年度">
            <el-input v-model="form.year"></el-input>
          </el-form-item>

          <el-form-item label="乡镇">
            <!-- 一级 -->
            <el-select v-model="form.countryName"
                       placeholder="请选择"
                       @visible-change="getCountrySelectDataList($event,1)">
              <el-option v-for="item in countryOption1"
                         :key="item.id"
                         :label="item.name"
                         :value="item.name">
              </el-option>
            </el-select>

          </el-form-item>

          <el-form-item label="村庄">
            <!-- 二级 -->
            <el-select v-model="form.cunName"
                       placeholder="请选择"
                       @visible-change="getCountrySelectDataList($event,2)">
              <el-option v-for="item in countryOption2"
                         :key="item.id"
                         :label="item.name"
                         :value="item.name">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="产量(万吨)">
            <el-input v-model="form.yield"></el-input>
          </el-form-item>
          <el-form-item label="产值(万元)">
            <el-input v-model="form.outputValue"></el-input>
          </el-form-item>
          <el-form-item label="年末存栏数（万只/万箱/万头">
            <el-input v-model="form.numbersCunlan"></el-input>
          </el-form-item>
          <el-form-item label="年末出栏数（万只/万箱/万头">
            <el-input v-model="form.numbersChulan"></el-input>
          </el-form-item>
        </el-form>
      </div>

      <div slot="footer"
           class="dialog-footer">
        <el-button @click="$parent.dialogFormVisible2 = false">取 消</el-button>
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
        // industrytypFir: '', //产业一级分类id 非必需
        // industryTypeThirdName:'',
        industrytypSec: '', //产业二级分类id 非必需
        industrytypThir: '',//产业三级分类id 非必需
        year: '', //年度
        yield: '', //产量
        outputValue: '',//产值
        id: '', //当id为空时表示新增，不空时表示修改该条id的相关数据 非必需
        numbersCunlan: '',//年末存栏数
        numbersChulan: '',//年末出栏数
        countryside: '', //乡镇
      },
      option: null, //下拉产业数组
      option2: null,
      option3: null,
      countryOption1: null,
      countryOption2: null,
    }
  },
  mounted () {
    if (this.$parent.isCompile) {
      this.form = { ...this.$parent.item }
      delete this.form.updateDate
      delete this.form.createDate
    };
  },

  computed: {

    countryName () {//所属乡镇名称
      let i = 0
      for (i; i < this.countryOption1.length; i++) {
        if (this.countryOption1[i].id == this.form.countryside) {
          return this.countryOption1[i].name
        }
      }
    },

    cunName () {//所属村庄名称
      let i = 0
      for (i; i < this.countryOption2.length; i++) {
        if (this.countryOption2[i].id == this.form.cunId) {
          return this.countryOption2[i].name
        }
      }
    }

  },

  methods: {
    addData () {

      let data = this.form
      console.log(data, 'data');
      delete data.createDate
      delete data.updateDate
      if (this.option != null) {
        data.countryName = this.countryName
        data.cunName = this.cunName
        data.industrytypThir = data.industrytypSec[1]
        data.industrytypSec = data.industrytypSec[0]

        console.log('123');
        for (let item of this.option) {
          if (data.industrytypSec == item.id) {
            data.industryTypeSecondName = item.name
            let arr = item.industryTypeThird
            for (let item of arr) {
              if (data.industrytypThir == item.id) {
                data.industryTypeThirdName = item.name
              }
            }
          }
        }
      }


      request({
        url: '/liveStockManage/addLiveStock',
        method: 'post',
        data
      }).then(res => {
        if (res.code == '10000') {
          this.$parent.getDataList()
          this.$message({
            message: res.msg,
            type: 'success'
          });
          this.$parent.dialogFormVisible2 = false
          this.$parent.isCompile = false
        }
      })
      //   request({
      //     url: '/liveStockManage/addLiveStock',
      //     method: 'post',
      //     data
      //   }).then(res => {
      //     if (res.code == '10000') {
      //       this.$parent.getDataList()
      //       this.$message({
      //         message: res.msg,
      //         type: 'success'
      //       });
      //       this.$parent.dialogFormVisible2 = false
      //       this.$parent.isCompile = false
      //     }
      //   })
    },

    getSelectDataList (event, val) {
      if (event) {
        let data = {
          id: 2  //畜牧类型默认为2 
        }
        request({
          url: '/industryType/getAllType',
          method: 'get',
          params: data
        }).then(res => {
          if (res.code == '10000') {
            // console.log(res);
            // console.log(res.data[0].industryTypeSecond);
            this.option = res.data[0].industryTypeSecond

          }
        })
      }

      //   if (event) {
      //     if (val == 1) {
      //       request({
      //         url: '/industryType/getFirstAndSecondType',
      //         method: 'post'
      //       }).then(res => {
      //         if (res.code == '10000') {
      //           this.option1 = res.data
      //         }
      //       })

      //     } else if (val == 2 && this.form.industrytypFir != '') {

      //       let data = {
      //         firstTypeId: this.form.industrytypFir
      //       }
      //       request({
      //         url: '/industryType/getFirstAndSecondType',
      //         method: 'post',
      //         data
      //       }).then(res => {
      //         if (res.code == '10000') {
      //           this.option2 = res.data
      //         }
      //       })

      //     } else if (val == 3 && this.form.industrytypSec != '') {
      //       let data = {
      //         secondTypeId: this.form.industrytypSec
      //       }
      //       request({
      //         url: '/industryType/getThirdType',
      //         method: 'post',
      //         data
      //       }).then(res => {
      //         if (res.code == '10000') {
      //           this.option3 = res.data
      //         }
      //       })
      //     }
      //   }

    },

    getCountrySelectDataList (event, val) {
      if (event) {

        if (val == 1) {

          let data = {
            id: 230000000000
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

        } else if (val == 2 && this.countryOption1 != null) {

          for (let item of this.countryOption1) {
            if (this.form.countryName == item.name) {
              this.form.countryside = item.id
            }
          }
          let data = {
            id: this.form.countryside
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

  },
}
</script>

<style lang="scss" scoped>
.dialog {
  .el-select {
    width: 140px;
  }
}
</style>