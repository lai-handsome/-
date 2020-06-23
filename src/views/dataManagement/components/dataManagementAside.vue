<template>
  <div class="aside">
    <div class="pull-down">
      <div class="pull-down-header">
        <img src="@/assets/icon/2.png"
             alt=""
             class="farming-statistics-icon">
        <span>{{title}}</span>
        <img src="@/assets/icon/icon-select.png"
             alt=""
             class="pull-down-icon">
      </div>

      <ul class="pull-down-content"
          v-if="authRoutes">
        <li :class="item.name == $route.name ? 'is-selected' : ''"
            v-for="(item,index) in authRoutes"
            :key="item.id"
            :data-index="index">
          <router-link :to="{name:item.name,query:{routeId:item.id,parentRoute:$route.query.parentRoute}}"
                       tag="div">
            {{item.description}}
          </router-link>
        </li>
      </ul>
    </div>
  </div>

</template>

<script>
// import { getPermissionList } from '@/request/publicRequest'
// import { sliceHref } from '@/utils/sliceHref.js'
export default {
  props: {
    title: String,
    routeName: {
      type: String,
    },
  },
  data () {
    return {
      childRoute: null,
      authRoutes: null,
    }
  },
  watch: {
    '$route' (to, from) {
      sessionStorage.path = to.path
    }
  },
  mounted () {
    let authRoutes
    if (this.$route.query.hasOwnProperty('parentRoute')) {
      if (this.$store.state.permission.flatRoutesObj[this.$route.query.parentRoute].hasOwnProperty('children')) {
        authRoutes = this.$store.state.permission.flatRoutesObj[this.$route.query.parentRoute].children
      }
    }
    this.authRoutes = authRoutes
  },

  methods: {
    changeRoute () {
      this.$parent.getDataList()
    }
  },
}
</script>

<style lang="scss" scoped>
.aside {
  position: absolute;
  left: 0;
  top: 0;
  width: 250px;
  height: 100%;
  background: #fff;
  .pull-down-header {
    height: 60px;
    line-height: 60px;
    font-size: 20px;
    color: #2780ff;
    padding: 0 18px 0 22px;
  }
  img {
    float: left;
    margin-top: 19px;
    margin-right: 10px;
  }
  //   .macro-data-icon {
  //     width: 20px;
  //     height: 22px;
  //   }
  .pull-down-icon {
    height: 8px;
    width: 14px;
    float: right;
    margin-top: 24px;
  }

  .pull-down-content {
    cursor: pointer;
    padding: 0 10px;
    li {
      height: 50px;
      line-height: 50px;
      font-size: 16px;
      padding-left: 10px;
    }
  }
  .is-selected {
    background: #f4f7fe;
    border-radius: 4px;
    color: #5494ff;
  }
}
</style>