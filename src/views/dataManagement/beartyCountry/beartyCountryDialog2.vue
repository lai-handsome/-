<template>
  <div class="dialog">
    <el-dialog title="开化县长虹乡虹桥村"
               width="780px"
               :visible.sync="$parent.beartyCountryDialog2">
      <div style="height:500px; overflow-y: auto">
        <el-form label-width="100px"
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
            <!-- 二级 -->
            <span>所属村庄</span>
            <el-select v-model="form.countryName"
                       placeholder="请选择"
                       @visible-change="getCountrySelectDataList($event,2)">
              <el-option v-for="item in countryOption2"
                         :key="item.id"
                         :label="item.name"
                         :value="item.name">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="任务年度">
            <el-input v-model="form.year"></el-input>
          </el-form-item>

          <el-form-item label="村落类型">
            <el-select v-model="form.countryType">
              <el-option v-for="item in countryType"
                         :key="item.id"
                         :label="item.name"
                         :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="经度">
            <el-input v-model="form.longitude"></el-input>
          </el-form-item>

          <el-form-item label="纬度">
            <el-input v-model="form.latitude"></el-input>
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
  data () {
    return {
      form: {
        town: '',  //乡镇
        countryName: '', //村名称
        countryType: '', //村落类型  1.分类处理 2：项目试点
        menuId: 2,
        longitude: '', //经度
        latitude: '',  //纬度
        cel1: '',   //扩展字段1
        cel2: '',   //扩展字段2
        cel3: '',   //扩展字段3
        cel4: '',   //扩展字段4
        year: '',  //年份
        countryId: '', //村id
        townId: '',  //乡镇id
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

      countryOption1: null,
      countryOption2: null,

      countryside: 230000000000,// 一级乡镇id
    }
  },

  mounted () {
    if (this.$parent.isCompile) {
      this.form = { ...this.$parent.item }
      delete this.form.townId
      delete this.form.updateTime
      delete this.form.createTime
    }
  },

  methods: {
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
          let data = {
            id: this.form.townId
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
            data.townId = item.id
            break
          }
        }
      }
      if (this.countryOption2) {
        for (let item of this.countryOption2) {
          if (data.countryName == item.name) {
            data.countryId = item.id
            break
          }
        }
      }

      console.log(data, 'data');
      //   request({
      //     url: '/garbageSort/addGarbageSort',
      //     method: 'post',
      //     data
      //   }).then(res => {
      //     if (res.code == '10000') {
      //       //   this.$parent.getDataList()
      //       this.$message({
      //         message: res.msg,
      //         type: 'success'
      //       });
      //       this.$parent.beartyCountryDialog2 = false
      //       this.$parent.isCompile = false
      //       this.$parent.getDataList('/garbageSort/getGarbageSortList', 'get')
      //     }
      //   })

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