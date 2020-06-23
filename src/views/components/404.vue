<template>
  <div class="page">
    <div class="main">
      <img class="bg-404"
           src="../../assets/404/404.png"
           alt="">
      <div class="btn">
        <img src="../../assets/404/fanhui.png"
             alt="">
        <span @click="lastPage">返回上一页</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    lastPage () {
      this.$router.back()
    }
  },
}
</script>

<style lang="scss" scoped>
.page {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 9999;
  padding: 0;
  margin: 0;
  background-color: #fff;
  .bg-404 {
    margin: 40px auto;
    width: 1049px;
    height: 684px;
  }
  .main {
    text-align: center;
  }
  .btn {
    width: 242px;
    height: 60px;
    line-height: 60px;
    background: #1757f6;
    text-align: center;
    border-radius: 30px;
    margin: 0 auto;
    cursor: pointer;
    span {
      vertical-align: middle;
      display: inline-block;
      color: #fff;
      font-size: 20px;
    }
    img {
      vertical-align: middle;
      width: 31px;
      height: 26px;
      margin-right: 10px;
    }
  }
}
</style>