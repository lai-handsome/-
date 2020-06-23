<template>
  <div class="dialog">
    <el-dialog title="春粮编辑"
               width="680px"
               :visible.sync="$parent.dialogFormVisible1">
      <el-form label-width="100px"
               :model="form">

        <el-form-item label="产业类型">
          <el-cascader :options="option"
                       v-model="form.industrytypSec"
                       :props="{value: 'id',label:'name',children:'industryTypeThird'}"
                       children='industryTypeThird'
                       clearable
                       placeholder="请选择"
                       @visible-change="getSelectDataList($event)"></el-cascader>

        </el-form-item>

        <el-form-item label="年度">
          <el-input v-model.number="form.year"></el-input>
        </el-form-item>

        <el-form-item label="所属乡镇">
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

        <el-form-item label="所属村庄">
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

        <el-form-item label="面积(万亩)">
          <el-input v-model.number="form.size"></el-input>
        </el-form-item>
        <el-form-item label="产量(万吨)">
          <el-input v-model.number="form.yield"></el-input>
        </el-form-item>
        <el-form-item label="产值(万元)">
          <el-input v-model.number="form.outputValue"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="$parent.dialogFormVisible1 = false">取 消</el-button>
        <el-button type="primary"
                   @click="addData">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import request from '@/request/request'
export default {
  props: {
    typeId: Number
  },
  data () {
    return {
      form: {
        // industrytypFir: '', //产业一级分类id 非必需
        industrytypSec: '', //产业二级分类id 非必需
        industrytypThir: '',//产业三级分类id 非必需
        industryTypeSecondName: '',// 产业二级name
        industryTypeThirdName: '', //产业三级name
        year: '', //年度
        size: '', //面积
        yield: '', //产量
        outputValue: '',//产值
        id: '', //当id为空时表示新增，不空时表示修改该条id的相关数据 非必需
        countryside: '',//乡镇id
        countryName: '',//所属乡镇名称
        cunId: '',//所属村庄id
        cunName: '', //所属村庄名称
      },
      optionProps: {
        label: 'name',
      },
      option: null,
      countryOption1: null,
      countryOption2: null,

    }
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

  mounted () {
    if (this.$parent.isCompile) {
      this.form = { ...this.$parent.item }
      delete this.form.updateDate
      delete this.form.createDate
    }
  },
  methods: {

    addData () {
      let data = this.form
      data.countryName = this.countryName
      data.cunName = this.cunName
      data.industrytypThir = data.industrytypSec[1]
      data.industrytypSec = data.industrytypSec[0]

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

      request({
        url: '/plantManage/addPlant',
        method: 'post',
        data
      }).then(res => {
        if (res.code == '10000') {

          this.$message({
            message: res.msg,
            type: 'success'
          });
          this.$parent.dialogFormVisible1 = false
          this.$parent.isCompile = false
          this.$parent.getDataList()
        }
      })
    },

    getSelectDataList (event, val) {
      //   console.log(event, val);
      if (event) {
        let data = {
          id: 1  //种植类型默认为1
        }
        request({
          url: '/industryType/getAllType',
          method: 'get',
          params: data
        }).then(res => {
          if (res.code == '10000') {
            // console.log(res.data[0].industryTypeSecond);
            this.option = res.data[0].industryTypeSecond

          }
        })
      }

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

    getCheckedNodes () {
      console.log('ddfkj');
    },

    handleItemChange () {
      console.log('val');
    }
  },
}
</script>

<style lang="scss" scoped>
.dialog {
  .el-select {
    width: 140px;
  }
  //   .el-input {
  //     width: 120px;
  //   }
}
</style>