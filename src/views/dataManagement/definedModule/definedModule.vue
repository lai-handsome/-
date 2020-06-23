<template>
  <div class="module">
    <dataManagementAside :routeName="'newModule'"
                         :title="$route.query.title"></dataManagementAside>
    <div class="content">
      <div class="content-header">

        <img src="@/assets/icon/arrows.png"
             alt="">
        <router-link :to="{name: 'dataManagementScreen'}"
                     tag="span"
                     style="cursor: pointer">数据管理</router-link>
        <span>>&nbsp;&nbsp;<span @click="componentName = 'hasTableList'"
                style="cursor: pointer">{{$route.query.title}}</span>
          <span v-if="componentName !== 'hasTableList' && tableItem.description">>&nbsp;&nbsp;<span>{{tableTitle}}</span></span>
        </span>
      </div>
      <transition name="fade"
                  mode="out-in">
        <component :is="componentName"
                   :tableItem="tableItem"
                   :columns="columns"
                   :hasMap="hasMap"
                   :tableTitle="tableTitle"
                   :moduleTypeId="moduleTypeId"></component>
      </transition>
    </div>
  </div>
</template>

<script>
import dataManagementAside from '../components/dataManagementAside'
import hasTableList from './components/hasTableList'
import tableItemDetail from './components/tableItemDetail'
export default {
  components: {
    dataManagementAside,
    hasTableList,
    tableItemDetail
  },
  data () {
    return {
      componentName: 'hasTableList',
      tableItem: null,
      columns: null,
      formList: null,
      hasMap: false,
      townName: '',
      longitudeName: '',//经度名
      latitudeName: '',//纬度名
    }
  },
  watch: {
    tableItem: {
      handler (to, from) {
        if (to !== from) {
          this.columns = []
          let tableList = to.tableZiDuanList
          this.hasMap = false
          let i = 0
          let length = to.tableZiDuanList
          let dateIndexArr = []
          tableList.forEach((item, index) => {
            if (item.chineseName === '月') {
              dateIndexArr.push(index)
            }
            if (item.chineseName === '日') {
              dateIndexArr.push(index)
            }
          })

          if (dateIndexArr.length === 2) {
            tableList.splice(dateIndexArr[1] - 1, 1)
            tableList.splice(dateIndexArr[0] - 1, 1)
          } else if (dateIndexArr.length === 1) {
            let i = dateIndexArr[0] - 1
            tableList.splice(i, 1)
          }

          for (const item of tableList) {
            if (item.isNull === 0) { //经度，纬度，时间，地区为0，其它为1
              if (item.chineseName === '乡/镇/街道') {
                this.townName = item.engName
              } else if (item.chineseName === '日') {
                item.chineseName = '年/月/日'
                item['format'] = 'yyyy/MM/dd'
                item['type'] = 'date'
                this.columns.push({
                  title: '年/月/日',
                  key: item.engName
                })
              } else if (item.chineseName === '月') {
                item.chineseName = '年/月'
                item['format'] = 'yyyy/MM'
                item['type'] = 'month'
                this.columns.push({
                  title: '年/月',
                  key: item.engName,
                })
              } else if (item.chineseName === '年') {
                item['format'] = 'yyyy'
                item['type'] = 'year'
                this.columns.push({
                  title: '年',
                  key: item.engName,
                })
              } else if (item.chineseName === '经度' || item.chineseName === '纬度') {
                item['disabled'] = true
                this.columns.push({
                  title: item.chineseName,
                  key: item.engName,
                })
                this.hasMap = true
                if (item.chineseName === '经度') this.longitudeName = item.engName
                if (item.chineseName === '纬度') this.latitudeName = item.engName
              }
            } else {
              this.columns.push({
                title: item.chineseName,
                key: item.engName
              })
            }
          }
          this.formList = tableList
        }
      },
      deep: true
    }
  },
  computed: {
    tableTitle () {
      if (this.tableItem && this.tableItem.description) {
        return this.tableItem.description
      }
      return ''
    },
    moduleTypeId () {
      if (this.tableItem && this.tableItem.id) {
        return this.tableItem.id
      }
      return ''
    }
  },

}
</script>

<style lang="scss" scoped>
@import "@/styles/module.scss";
@import "@/styles/contentHeader.scss";
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>