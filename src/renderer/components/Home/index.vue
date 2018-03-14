<template>
  <div style="height: 100vh">
    <div style="height: 10%">
      <home-header></home-header>
    </div>
    <div style="height: 90%;overflow: hidden">
      <el-row type="flex" justify="center" style="height: 100%;">
        <el-col :span="6" style="overflow: hidden">
          <nav-menu></nav-menu>
        </el-col>
        <el-col style="border-left: 1px solid #cccccc;border-right: 1px solid #cccccc;height: 100%;overflow: hidden">
          <router-view></router-view>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
  import HomeHeader from './HomeHeader'
  import NavMenu from './NavMenu'
  export default {
    components: {
      HomeHeader,
      NavMenu
    }
  }
</script>
