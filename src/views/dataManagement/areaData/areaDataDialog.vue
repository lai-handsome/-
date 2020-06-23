<template>
  <div class="dialog">
    <el-dialog title="编辑粮食生产功能区"
               width="700px"
               :visible.sync="$parent.dialogFormVisible1">
      <div style="height:500px; overflow-y:auto">

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
import request from "@/request/request";
export default {
  data () {
    return {


    };
  },

  mounted () {
    let index = this.$parent.treeDataIndex;
    this.form.regionalTypeName = this.$parent.selectDataList[index].name
    this.form.regionalTypeId = this.$parent.selectDataList[index].id

    if (this.$parent.isCompile) {
      this.form = this.$parent.item
    }
  },

  methods: {
    addData () {
      //   console.log(this.form);
      let data = this.form;
      let countryId
      if (this.countryOption2 != null) {
        for (let item of this.countryOption2) {
          if (this.form.jianshedidianName == item.name) {
            countryId = item.id
          }
        }
      }

      if (this.$parent.isCompile) {

      } else {
        data.xiangzhenAndcun = this.townId + ',' + countryId
      }
      //   

      request({
        url: "/regionalData/addRegionalData",
        method: "post",
        data
      }).then(res => {
        if (res.code == '10000') {
          this.$message({
            message: res.msg,
            type: 'success'
          });
          this.$parent.dialogFormVisible1 = false
          this.$parent.getDataList()
        }
      });

    },




  }
};
</script>

<style lang="scss" scoped>
.dialog {
  .el-input {
    width: 400px;
  }
}
</style>