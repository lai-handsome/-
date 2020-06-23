<template>
  <div class="management">
    <div class="management-header">
      <div class="header-title">
        <span class="big">邛崃市智慧农业云平台</span>
        <img src="@/assets/management/header-decorate.png"
             alt="">
        <span class="small">管理平台</span>
      </div>
      <div class="header-tab">
        <ul>
          <li :class="tabIndex === 0 ?'checked':'no-checked'"
              @click="managementTab(0)">
            <router-link to="/systemManagement"
                         tag="span">系统管理</router-link>
          </li>
          <li :class="tabIndex === 1 ?'checked':'no-checked'"
              @click="managementTab(1)">
            <router-link to="/dataManagementScreen"
                         tag="span">数据管理</router-link>
          </li>
        </ul>
      </div>
      <div class="header-right">
        <ul>
          <li>欢迎你：{{name}}</li>
          <!-- <li class="personal-settings">
            <img class="img-set"
                 src="@/assets/icon/icon-set.png"
                 alt="">
            <span>个人设置</span>
          </li> -->
          <li class="exit"
              style="border-right: none;cursor:pointer"
              @click="exitManagement">
            <img class="img-exit"
                 src="@/assets/icon/icon-exit.png"
                 alt="">
            <span>退出</span>
          </li>
        </ul>
      </div>
    </div>
    <router-view></router-view>
  </div>

</template>


<script>
// import { getPermissionList } from '@/request/publicRequest'
export default {
  data () {
    return {
      tabIndex: 0,
      name: sessionStorage.name
    }
  },

  watch: {
    $route (to, from) {
      if (to.path.includes('systemManagement')) {
        this.tabIndex = 0
      } else {
        this.tabIndex = 1
      }
    }
  },
  methods: {
    managementTab (index) {
      if (this.tabIndex !== index) {
        this.tabIndex = index
      }
    },
    exitManagement () {
      let href = window.location.href.split('#')[0]
      window.location.href = href + '/login/login.html'
    }
  }

}
</script>

<style lang="scss" scoped>
.management {
  height: 100%;
  //   overflow: hidden;
}
.management-header {
  height: 80px;
  width: 100%;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 999;
  background: #0a4974;
  color: #fff;
  padding: 0 18px;
  display: table;
  box-sizing: border-box;
}
.header-title {
  line-height: 80px;
  height: 80px;
  .big {
    font-size: 32px;
  }
  .small {
    font-size: 26px;
  }
  img {
    width: 146px;
    height: 22px;
    margin: 0 22px;
  }
}
.header-tab {
  display: table-cell;
  vertical-align: middle;
  position: absolute;
  left: 50%;
  top: 20px;
  transform: translateX(-50%);
  li {
    cursor: pointer;
    border-radius: 4px;
    float: left;
    width: 140px;
    height: 40px;
    text-align: center;
    line-height: 40px;
    margin: 0 10px;
    span {
      display: block;
      height: 100%;
      width: 100%;
    }
  }
  .checked {
    background: url("../assets/management/bg-topbtn-ischecked.png") no-repeat;
    background-size: 140px 40px;
    font-size: 24px;
  }
  .no-checked {
    background: url("../assets/management/bg-topbtn-nochecked.png") no-repeat;
    background-size: 140px 40px;
    color: #b6cad7;
    font-size: 18px;
  }
}
.header-right {
  display: table-cell;
  vertical-align: middle;
  position: absolute;
  right: 18px;
  top: 28px;
  font-size: 18px;
  li {
    display: inline-block;
    padding: 0 14px;
    border-right: 1px solid #8396ac;
  }
  img {
    vertical-align: middle;
  }
  .img-set {
    width: 18px;
    height: 18px;
  }
  .img-exit {
    width: 22px;
    height: 18px;
  }
}
</style>