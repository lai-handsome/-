<template>
  <div class="data-management">
    <div class="links">
      <ul>
        <li v-for="(item,index) in authRoutes"
            :class="`bg-${index%4}`"
            :key="item.id">
          <router-link :to="{path:'/dataManagement/'+item.url,query:{routeId:item.id,title:item.description}}"
                       tag="div">
            <img :src="require('../../assets/dataManagement/icon-'+item.url+'.png')"
                 alt=""
                 class="model-icon">
            <p>{{item.description}}</p>
          </router-link>
        </li>
      </ul>
    </div>

  </div>
</template>

<script>
import request from '@/request/request'
export default {
  data () {
    return {
      childRoute: null,
      authRoutes: [],
    }
  },
  mounted () {
    let authRoutes = this.$store.state.permission.flatRoutesObj['dataManagement'].children
    let definedModuleName = authRoutes[authRoutes.length - 1].name
    let length = authRoutes.length - 1
    let i = 0
    if (definedModuleName === "definedModule") {
      request({
        method: 'get',
        url: '/diyTable/getBarList'
      }).then(res => {
        if (res.code == '10000') {
          for (i; i < length; i++) {
            this.authRoutes.push(authRoutes[i])
          }
          res.data.forEach(item => {
            this.$set(item, 'url', 'definedModule')
            this.authRoutes.push(item)
          })
        }
      })
    } else {
      this.authRoutes = authRoutes
    }
  },
}
</script>

<style lang="scss" scoped>
.data-management {
  height: 100%;
  //   overflow: hidden;
  .links {
    width: 100%;
    height: 100%;
    background: url("../../assets/dataManagement/bg.png") no-repeat;
    background-size: 100% 100%;
    ul {
      //   padding-left: 290px;
      //   padding-top: 132px;
      width: 1360px;
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    .bg-0 {
      background: url("../../assets/dataManagement/bg-0.png") no-repeat 100%
        100%;
    }
    .bg-1 {
      background: url("../../assets/dataManagement/bg-1.png") no-repeat 100%
        100%;
    }
    .bg-2 {
      background: url("../../assets/dataManagement/bg-2.png") no-repeat 100%
        100%;
    }
    .bg-3 {
      background: url("../../assets/dataManagement/bg-3.png") no-repeat 100%
        100%;
    }
    li {
      float: left;
      margin: 0 40px 60px 0;
      width: 300px;
      height: 140px;
      display: table;
      cursor: pointer;
      box-sizing: border-box;
      position: relative;
      > div {
        text-align: center;
        display: table-cell;
        vertical-align: middle;
      }
      p {
        font-size: 30px;
        font-weight: bold;
        color: #fff;
      }
    }
  }
}
</style>