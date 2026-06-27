<template>
  <div class="sidebar">
    <el-menu
        :default-active="activeIndex"
        router
        class="el-menu-vertical-demo"
        :collapse="isCollapse"
        background-color="#333333"
        text-color="#fff"
        active-text-color="#f27968">

      <template v-for="menu in menus">

        <el-menu-item v-if="menu.path !== ''" :index="menu.path" :key="menu.id">
          <i :class="menu.icon"></i>
          <span slot="title" v-text="$t(menu.name)"></span>
        </el-menu-item>


        <el-submenu v-else :index="menu.id + ''" :key="menu.id">
          <template slot="title">
            <i :class="menu.icon"></i>
            <span slot="title" v-text="$t(menu.name)"></span>
          </template>
          <el-menu-item v-for="child in menu.children" :key="child.id" :index="child.path" v-text="$t(child.name)">
          </el-menu-item>

        </el-submenu>

      </template>


    </el-menu>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import {getToken} from "@/util";

export default {
  name: 'Sidebar',
  data() {
    return {
      menus: JSON.parse(getToken('JS_P_ROLE_MENU'))
    }
  },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    isCollapse() {
      return !this.sidebar.opened
    },
    activeIndex() {
      const thisRoutPath = this.$route.path
      if (this.$route.name === 'details') {
        return '/tables/details'
      }
      return thisRoutPath
    }
  },
  mounted() {
    // console.log('mounted:', this.menus)
  }
}
</script>

<style scoped>
.sidebar {
  background-color: rgb(15, 15, 15);
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 100vh;
  height: 100%;
}

.el-menu-vertical-demo {
  min-height: 100vh;
  height: 100%;
}

.el-menu-item.is-active,
.el-submenu.is-active >>> .el-submenu__title {
  background: #484e5c !important;
}

.el-submenu .el-menu-item {
  padding-left: 60px !important;
  min-width: auto;
}

.el-submenu.is-active .el-menu-item {
  background: #484e5c !important;
}

.el-submenu.is-active .el-menu-item.is-active {
  background: #3a4046 !important;
}

.el-submenu .el-menu-item:hover {
  padding-left: 60px !important;
  background: rgb(15, 15, 15) !important;
}

.el-menu-item i {
  padding-bottom: 4px;
}

.el-submenu__title i {
  padding-bottom: 4px;
}

@media all and (max-width: 768px) {
  .el-menu--collapse {
    width: 0;
    overflow: hidden;
  }
}


</style>
