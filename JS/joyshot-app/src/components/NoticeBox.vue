<template>
  <div class="noticeBox" v-if="news.topic">
    <div class="container">{{news.topic}}</div>
  </div>
</template>

<script>
export default {
  name: 'NoticeBox',
  components:{

  },
  data(){
    return {
      news:{}
    }
  },
  methods:{
    loadData(){
      let query = {lang: this.getLang()}

      this.request.get('/news/on', {params: query}).then(res => {
        if (res.code === '200') {
          if (res.data && res.data.length > 0) {
            this.news = res.data[0]
          }
        } else {
          this.showResult('error', this.$t('action.get_error', {err: 'error'}))
        }
      })
    }
  },
  mounted(){
    this.loadData()
  }
}
</script>
