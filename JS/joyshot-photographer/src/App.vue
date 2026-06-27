<template>
  <div id="app">
    <transition name="fade" mode="out-in">
      <!-- <keep-alive> -->
      <router-view></router-view>
      <!-- </keep-alive> -->
    </transition>
  </div>
</template>

<script>

export default {
  name: 'app',
  data(){
    return {
      appVersion: localStorage.getItem('JS_P_VERSION')
    }
  },
  components: {},
  methods:{

  },
  mounted(){

    console.log('新：', this.appVersion + " 舊：" + this.version)
    if (this.appVersion === null) {
      localStorage.setItem('JS_P_VERSION', this.version)
      console.log('沒有版本資料，重新整理')
      window.location.reload()
    } else {
      if (this.appVersion !== this.version) {
        localStorage.setItem('JS_P_VERSION', this.version)
        this.appVersion = this.version
        console.log('版本有更新，重新整理')
        window.location.reload()
      } else {
        console.log('版本一致')
      }
    }
    
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center;
  color: #2c3e50;
  margin-top: 60px; */
}

</style>
