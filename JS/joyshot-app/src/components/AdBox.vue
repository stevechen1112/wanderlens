<template>
  <section class="adBox" :style="{backgroundImage: bgImage }">
  <!-- <section class="adBox"> -->
    <div class="container">
      <div class="slogan" v-html="$t('Components.AdBox.remember')"></div>
      <div class="sec">{{ $t('Components.AdBox.booking') }}</div>
    </div>
  </section>
</template>

<script>

export default {
	name: 'AdBox',
  data(){
    return {
      bgImage:''
    }
  },
  methods:{
    loadData(){
      let query = {lang: this.getLang()}

      this.request.get('/banner/type/homepage_hero', {params: query}).then(res => {
        if (res.code === '200') {
          console.log('banner_mobile:', res.data.imageUuid)
          this.bgImage = 'url(' + this.showImage(res.data.imageUuid) + ")"
        } else {
          const message = this.$t('Components.AdBox.image_load_failed')
          this.showResult('error', message)
        }
      })
    }
  },
  mounted(){
    this.loadData()
  }

}

</script>

<style scoped>

.adBox {
  height: 380px;
/*  background: #eae7d7 url("~@/assets/images/index/ad_bg.jpg") no-repeat;*/
/*  background: #eae7d7 no-repeat;*/
  background-size: cover;
  background-position: right center;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  margin-bottom: 80px;
}
@media screen and (max-width: 1000px) {
  .adBox {
    background-position: center;
    margin-bottom: 30px;
  }
}

.adBox::before {
  content: "";
  width: 55%;
  position: absolute;
  background: linear-gradient(to right, rgb(234, 231, 215) 65%, rgba(234, 231, 215, 0) 100%);
  display: block;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 0;
}
@media screen and (max-width: 1000px) {
  .adBox::before {
    width: 80%;
  }
}
.adBox .container {
  max-width: 1200px;
  flex-grow: 1;
  letter-spacing: 2px;
  z-index: 2;
  position: relative;
}
.adBox .slogan {
  font-weight: 500;
  font-size: 2.625rem;
  color: #333333;
}
.adBox .slogan span {
  color: #f37a69;
}
.adBox .sec {
  font-weight: 400;
  font-size: 1.5rem;
  color: #4e565a;
  margin-bottom: 20px;
}
.adBox .more {
  width: 200px;
  border-radius: 50px;
  background: #f37a69;
  display: block;
  padding: 17px 15px;
  color: #fff;
  font-size: 1.125rem;
  font-weight: 500;
  line-height: 1;
  text-align: center;
  transition: all 0.3s ease;
}
.adBox .more:hover {
  transform: translateX(-3px) translateY(-3px);
  box-shadow: 5px 5px 5px 0px rgba(0, 0, 0, 0.2);
}
@media screen and (max-width:767px){
  .adBox {
    height: 280px;
  }
  .adBox .slogan {
    font-size: 2.125rem;
  }
}
</style>
