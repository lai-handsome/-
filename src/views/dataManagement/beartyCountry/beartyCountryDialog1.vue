<template>
  <div class="dialog">
    <el-dialog title="开化县长虹乡虹桥村"
               width="760px"
               :visible.sync="$parent.dialogFormVisible1">
      <div style="height:500px; overflow-y: auto">

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

    }
  },

  //   components: {
  //     countryName () {//所属乡镇名称
  //       let i = 0
  //       for (i; i < this.countryOption1.length; i++) {
  //         if (this.countryOption1[i].id == this.form.townId) {
  //           return this.countryOption1[i].name
  //         }
  //       }
  //     },

  //     cunName () {//所属村庄名称
  //       let i = 0
  //       for (i; i < this.countryOption2.length; i++) {
  //         if (this.countryOption2[i].id == this.form.countryId) {
  //           return this.countryOption2[i].name
  //         }
  //       }
  //     }
  //   },

  mounted () {
    if (this.$parent.isCompile) {
      this.form = { ...this.$parent.item }
      delete this.form.updateTime
      delete this.form.createTime
    }
  },
  methods: {

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