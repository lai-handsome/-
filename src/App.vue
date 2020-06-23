<template>
  <div id="app"
       class="app">
    <!-- <home></home> -->
    <management></management>
  </div>
</template>

<script>
import management from './views/index'
export default {
  name: 'App',
  components: {
    management
  },
}
</script>

<style lang="scss">
// body {
//   //   padding-top: 80px;
//   box-sizing: border-box;
// }
#app {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding-top: 80px;
  .pointer {
    cursor: pointer;
  }
}
.app {
  .using {
    //启用样式
    color: #4f9e02;
  }
  .forbid {
    //禁用样式
    color: #f03838;
  }
}
</style>
