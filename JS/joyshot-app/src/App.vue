<template>
  <div id="app" @keydown.esc="changeSearchMode" ref="app" class="app-top" :class="`${getLang()}-app`">
  <!-- <div id="app"> -->
    <div :class="mode">
      <div class="wrapper" ref="wrapper">
        <Header @appInSearchMode="appInSearchMode" />
        <!-- <Header1 @appInSearchMode="appInSearchMode" /> -->
        <router-view @appInSearchMode="appInSearchMode"></router-view>
        <Footer/>
      </div>
      <div class="privacyBox">
        <span v-html="$t('App.cookie_law')"></span>
        <div class="closePrivacy">{{ $t('App.cookie_agree') }}</div>
      </div>
      <div class="goTop" @click="goToTop">
        <div class="scrollTopArrow"></div>
        <div class="scrollTopText">TOP</div>
      </div>
    </div>
    <!-- Messenger Chat Plugin Code -->
    <div id="fb-root"></div>
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import Header1 from '@/components/Header1.vue'
import Footer from '@/components/Footer.vue'
import { nanoid } from 'nanoid'
import { setToken, getToken } from "@/util";

export default {
  name: 'app',
  components:{
    Header,Header1,Footer
  },
  data(){
    return {
      mode:'',
      isRouterAlive: true,
      appVersion: localStorage.getItem('JSAPP_VERSION')
    }
  },
  provide(){
    return {
      reload: this.pageReload
    }
  },
  methods:{
    pageReload(){
      this.isRouterAlive = false
      this.$nextTick(()=>{
        this.isRouterAlive = true
      })
    },
    goToTop(){
      window.scrollTo({top: 0, behavior: 'smooth'})
    },
    assignToken(){
      let client_token = getToken('JS_APP_TOKEN')
      if (!client_token) {
          const newId = nanoid()
          setToken('JS_APP_TOKEN', newId)
      }
    },
    changeSearchMode(){
      if (this.mode ===  'searchOpen') {
        // console.log('App 離開搜尋模式')
        this.mode = ''
        this.$bus.$emit('HeaderLeaveSearchMode', {mode:''})
      } else {
        console.log('App.vue do nothing')
      }
    },
    appInSearchMode(results){
      // console.log('App.vue appInSearchMode:', this.mode, results)

      if (results.mode === '') {
        this.$bus.$emit('HeaderLeaveSearchMode', {mode:''})
      }

      if (this.mode !== results.mode) {
        this.mode = results.mode
      } else {
        // console.log('App.vue 不切換')
      }
    }
  },
  mounted() {
    //首次進入網站，給一個 anonymous user token
    this.assignToken()

    console.log('新：', this.appVersion + " 舊：" + this.version)
    if (this.appVersion === null) {
      localStorage.setItem('JSAPP_VERSION', this.version)
      console.log('沒有版本資料，重新整理')
      window.location.reload()
    } else {
      if (this.appVersion !== this.version) {
        localStorage.setItem('JSAPP_VERSION', this.version)
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
