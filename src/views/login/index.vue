<template>
  <div class="login">
    <el-form :label-position="labelPosition"
             label-width="80px"
             :model="formLabelAlign">
      <el-form-item label="用户名">
        <el-input v-model="formLabelAlign.userName"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="formLabelAlign.passward"></el-input>
      </el-form-item>
      <input type="text"> <span></span>
    </el-form>
  </div>
</template>

<script>
import request from '@/request/request'
export default {
  data () {
    return {
      formLabelAlign: {
        name: '',
        region: ''
      },
      securityCode: '',//验证码
    }
  },
  mounted () {
    request({
      url: '/code/add',
      method: 'get'
    }).then(res => console.log(res))
  },
}
</script>

<style lang="scss" scoped>
.login {
  width: 100%;
  height: 100%;
}
</style>