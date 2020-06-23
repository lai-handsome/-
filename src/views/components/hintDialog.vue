<template>
  <el-dialog :title="dialogTitle"
             :visible.sync="hintDialog"
             :before-close="closeHintDialog"
             width="15%">
    <span>{{description}}</span>
    <span slot="footer"
          class="dialog-footer">
      <!-- <el-button @click="deleteDialogVisible = false">取 消</el-button> -->
      <el-button @click="closeHintDialog">取 消</el-button>
      <el-button :type="buttonType"
                 @click="confirmOperation">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    hintDialog: {
      //   type: Boolean,
      default: false
    },
    dialogTitle: String, //弹框标题
    description: String, //弹框描述
    buttonType: { //按钮类型
      type: String,
      default: 'danger'
    },
    cbFnName: String,  //父级函数的名称
    cbFnArguments: {  //父级函数的参数
      type: Object,
      default: () => { }
    },
    cancelFn: String,
    cancelFnArguments: {  //父级函数的参数
      type: Object,
      default: () => { }
    },
  },
  methods: {
    confirmOperation () {
      this.$parent[this.cbFnName](this.cbFnArguments)
    },

    closeHintDialog () {
      if (this.cancelFn) {
        this.$parent[this.cancelFn](this.cancelFnArguments)
      }
      this.$parent.hintDialog = false
    }
  },
}
</script>

