<template>
  <div class="module">
    <dataManagementAside :routeName="'beartyCountry'"
                         :title="'美丽乡村'"></dataManagementAside>
    <div class="content">
      <bread-crumb :parentTitle="'美丽乡村'"></bread-crumb>
      <div class="content-main">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import request from '@/request/request';
import dataManagementAside from '../components/dataManagementAside'
import breadCrumb from '../components/breadCrumb'
export default {
  components: {
    dataManagementAside,
    breadCrumb
  },

  watch: {
    '$route' (to, from) {
      if (to.path !== from.path) {
        this.$store.commit('townAndCountry/CLEARTOWN', { isForm: false })
      }
    }
  },
}
</script>

<style lang="scss" scoped>
@import "@/styles/module.scss";
</style>