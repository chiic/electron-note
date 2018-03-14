<template>
  <div class="home-header-wrapper">
  </div>
</template>
<script>
  export default {
    name: 'homeheader',
    data () {
      return {
        personInfo: {
          img: 'static/img/person.jpeg'
        }
      }
    }
  }
</script>
<style>
  .home-header-wrapper {
      height: 100%;
      width: 100%;
      line-height: 100%;
      background: rgb(118,77,57);
  }
  .el-dropdown-link {
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-size: 12px;
    color: white;
  }
</style>
