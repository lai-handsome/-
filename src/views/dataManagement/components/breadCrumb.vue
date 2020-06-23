<template>
  <div class="content-header">
    <!-- <div class="arrows-icon">

    </div> -->
    <img src="@/assets/icon/arrows.png"
         alt="">
    <router-link :to="{name: 'dataManagementScreen'}"
                 tag="span"
                 style="cursor: pointer">数据管理</router-link><span>>&nbsp;&nbsp;{{parentTitle}}&nbsp;&nbsp;>&nbsp;&nbsp;{{$route.meta.title}}</span>
  </div>
</template>

<script>
export default {
  props: {
    parentTitle: String
  }

}
</script>

<style lang="scss" scoped>
@import "@/styles/contentHeader.scss";
</style>