<template>
  <div>
    <!-- 弹框 -->
    <el-dialog title="宏观数据编辑"
               width="640px"
               :visible.sync="$parent.dialogFormVisible">
      <el-form ref="form"
               :model="form"
               label-width="80px">

        <el-form-item label="年份">
          <el-input v-model.number="form.year"></el-input>
        </el-form-item>

        <el-form-item label="指标名称">
          <el-input v-model="form.targetNmae"></el-input>
        </el-form-item>

        <el-form-item label="数值"
                      prop="numberValue">
          <el-input v-model.number="form.value"></el-input>
        </el-form-item>
        <el-form-item label="数值单位">
          <el-input v-model="form.valueName"></el-input>
        </el-form-item>

        <el-form-item label="状态">
          <el-radio-group v-model="form.statuShow">
            <el-radio :label="0">启用</el-radio>
            <el-radio :label="1">禁用</el-radio>
          </el-radio-group>
        </el-form-item>

      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="$parent.dialogFormVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="addData">保 存</el-button>
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
        year: '', //年份
        targetNmae: '',//指标名称
        value: '',//数值
        valueName: '',//数值单位
        statuShow: 0 //0:正常 1：禁用
      },
    }
  },
  mounted () {
    if (this.$parent.isCompile) {
      let item = this.$parent.item
      //   this.form = this.$parent.item
      this.form.year = item.year
      this.form.targetNmae = item.targetNmae
      this.form.value = item.value
      this.form.valueName = item.valueName
      this.form.statuShow = item.statuShow
      this.form.id = item.id
      console.log(this.form);
    }
  },

  //   watch: {
  //     form: {
  //       handler (to, from) {
  //         console.log(to, 'to');
  //       },
  //       deep: true
  //     }
  //   },

  methods: {

    addData () {
      let data = this.form
      data.menuId = this.$parent.menuId
      this.$store.dispatch('crud/addData', { url: '/dataHongGuan/addTableData', method: 'post', params: data })

      //   request({// 添加数据
      //     url: '/dataHongGuan/addTableData',
      //     method: 'post',
      //     data
      //   }).then(res => {
      //     if (res.code == '10000') {
      //       this.$message({
      //         message: res.msg,
      //         type: 'success'
      //       });
      //       this.$parent.dialogFormVisible = false
      //       this.$parent.isCompile = false
      //       this.$parent.getDataList()
      //     }
      //   })

    }

  },
}
</script>

<style lang="scss" scoped>
</style>