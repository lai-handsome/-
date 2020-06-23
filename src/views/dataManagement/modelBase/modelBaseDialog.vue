<template>
  <div class="dialog">
    <el-dialog title="春粮编辑"
               width="600px"
               :visible.sync="$parent.dialogFormVisible"
               @close="sureCloseDialog = true">
      <div style="height:500px; overflow-y:auto">
        <el-form label-width="100px"
                 :model="form">

          <el-form-item label="所属乡镇">
            <!-- 一级 -->
            <el-select v-model="form.existCountry"
                       placeholder="请选择"
                       @visible-change="getCountrySelectDataList($event)">
              <el-option v-for="item in countryOption1"
                         :key="item.id"
                         :label="item.name"
                         :value="item.name"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="基地名称">
            <el-input v-model="form.name"></el-input>
          </el-form-item>

          <el-form-item label="年份">
            <el-input v-model="form.year"></el-input>
          </el-form-item>

          <el-form-item label="建设类别">
            <el-select v-model="form.constructeType"
                       placeholder="请选择">
              <el-option v-for="item in constructionType"
                         :key="item.id"
                         :label="item.name"
                         :value="item.id"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="法定代表人">
            <el-input v-model="form.legalRepresentativePerson"></el-input>
          </el-form-item>

          <el-form-item label="联系电话">
            <el-input v-model="form.phoneNumber"></el-input>
          </el-form-item>

          <el-form-item label="业务用房面积（㎡）">
            <el-input v-model="form.businessHouseArea"></el-input>
          </el-form-item>

          <el-form-item label="检测室面积（㎡）">
            <el-input v-model="form.monitoringRoomArea"></el-input>
          </el-form-item>

          <el-form-item label="农技产业服务基地数（个）">
            <el-input v-model="form.agriculturalBaseNumber"></el-input>
          </el-form-item>

          <el-form-item label="办公设备数量（套）">
            <el-input v-model="form.officeEquipmentNumber"></el-input>
          </el-form-item>
          <el-form-item label="检测设备数量（套）">
            <el-input v-model="form.checkEquipmentNumber"></el-input>
          </el-form-item>
          <el-form-item label="农技人员数（个）">
            <el-input v-model="form.agriculturalPersonNumber"></el-input>
          </el-form-item>

          <el-form-item label="地址">
            <el-input v-model="form.address"></el-input>
          </el-form-item>
          <el-form-item label="经度">
            <el-input v-model="form.longitude"></el-input>
          </el-form-item>
          <el-form-item label="纬度">
            <el-input v-model="form.latitude"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <!-- 还有4个扩展字段 -->
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="sureCloseDialog = true">取 消</el-button>
        <el-button type="primary"
                   @click="addData">确 定</el-button>
      </div>

    </el-dialog>

    <el-dialog title="提示"
               :visible.sync="sureCloseDialog"
               width="20%">
      <span style="font-size: 16px">确定关闭表单弹框吗？</span>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="sureCloseDialog = false">取 消</el-button>
        <el-button type="danger"
                   @click="closeDialog">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import request from '@/request/request'
export default {
  data () {
    return {
      sureCloseDialog: false,
      form: {
        existCountry: '',//是	所在乡镇

        name: '',//是	基地名称

        constructeType: '',//是	建设类别 1和2区别

        legalRepresentativePerson: '',//否	法定代表人

        phoneNumber: '',//否	联系电话

        businessHouseArea: '',//否	业务用房面积

        monitoringRoomArea: '',//否	监测室面积

        agriculturalBaseNumber: '',//否	农技产业服务基地数

        officeEquipmentNumber: '',//否	办公设备数量

        checkEquipmentNumber: '',//否	检测设备数量

        agriculturalPersonNumber: '',//否	农技人员数

        address: '',//否	地址

        longitude: '',//是	经度

        latitude: '',//是	纬度

        cel1: '',//否	扩展字段1

        cel2: '',//否	扩展字段2

        cel3: '',//否	扩展字段3

        cel4: '',//否	扩展字段4

        year: '',//否	年份

        countryId: '',//是	所属乡镇id
      },

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

      countryOption1: null,
    }
  },

  mounted () {
    if (this.$parent.isCompile) {
      this.form = this.$parent.item
    }
  },
  methods: {
    closeDialog () {
      this.sureCloseDialog = true
      this.$store.commit('crud/ONOFF_ADDDATA_DIALOG', false)
    },

    addData () {
      //   console.log(this.form);
      let data = this.form;
      if (this.countryOption1 != null) {
        for (let item of this.countryOption1) {
          if (data.existCountry == item.name) {
            data.countryId = item.id
          }
        }
      }

      this.$store.dispatch('crud/addData', { url: '/modleBase/addModleBase', method: 'post', params: data })
    },

    getCountrySelectDataList (event) {
      if (event) {
        let data = {
          id: 230000000000
        };

        request({
          url: "/countryData/getcountry",
          method: "get",
          params: data
        }).then(res => {
          if (res.code == "10000") {
            this.countryOption1 = res.data;
          }
        });
      }
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