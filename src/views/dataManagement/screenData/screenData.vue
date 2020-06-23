<template>
  <div style="height:100%">
    <div class="management-aside">
      <ul class="aside-list">
        <li class="aside-item"
            v-for="item in authRoutes"
            :key="item.id">
          <router-link :to="{name:item.name}"
                       tag="div"
                       active-class="is-checked">
            <span>{{item.description}}</span>
            <span style="float:right"><i :class="$route.fullPath.includes(item.name) ? 'el-icon-arrow-down' :'el-icon-arrow-right'"></i></span>
          </router-link>
          <div class="child-list"
               v-if="item.children && item.children.length>0">
            <router-link v-for="i in item.children"
                         :key="i.name"
                         :to="{name:i.name,query:{routeId:i.id,title:i.description}}"
                         tag="p"
                         :class="$route.name == i.name ? 'is-selected' : ''">{{i.description}}</router-link>
          </div>
        </li>
      </ul>

    </div>
    <router-view></router-view>
  </div>

</template>

<script>
import request from '@/request/request';
export default {
  data () {
    return {
      authRoutes: null,
      childRoute: [],
      childItem: null,
    }
  },

  mounted () {
    let authRoutes = this.$store.state.permission.flatRoutesObj['screenData'].children
    for (const item of authRoutes) {
      let children = this.$store.state.permission.flatRoutesObj[item.name].children
      item['children'] = children
    }
    this.authRoutes = authRoutes
    // this.$router.replace({ name: this.authRoutes[0].name })
  },

  methods: {
    getAuthRouteChild (routeName) {
      return this.$store.state.permission.flatRoutesObj[routeName].children
    }
  },
}
</script>

<style lang="scss" scoped>
@import "@/styles/aside.scss";
.management-aside {
  padding-top: 80px;
  top: 0;
  box-sizing: border-box;
}
</style>