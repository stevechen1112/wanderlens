<template>
  <div class="bottomBox swiper-container">
    <div class="listBox swiper" ref="bannerSwiper">
      <div class="listBox swiper-wrapper bannerSwiper">

        <!-- <div class="banner swiper-slide swiper-no-swiping"  -->

        <div class="swiper-slide swiper-no-swiping"
            v-for="bg in bgImageList"
            :key="bg.id">
          <div class="slogan">
            <div class="txt">
              <img :src="displayImage(bg.imageFile.url)">
            </div>
            <div class="secTxt">{{$t('pages.home.banner.sub_title')}}</div>
          </div>
        </div>

      </div>
    </div>

    <div class="swiper-button-prev"></div>
    <div class="swiper-button-next"></div>
  </div>
</template>


<script>

import Swiper from 'swiper'

export default {
  name: 'Banner',
  data(){
    return {
      bgImage1:'',
      bgImage2:'',
      bgImage3:'',
      bgImageList:[]
    }
  },
  methods:{
    loadData(){
      let query = {lang: this.getLang()}

      if (this.pageWidth <= 420) {
        this.request.get('/banner/type/banner_mobile', {params: query}).then(res => {
          if (res.code === '200') {
            this.bgImageList = res.data

            // this.bgImage = 'url(' + this.showImage(res.data.imageUuid) + ")"
            // this.bgImage = 'url(' + this.showImage(res.data.imageUuid) + ")"
            // this.bgImage = 'url(' + this.showImage(res.data.imageUuid) + ")"

          } else {
            const message = this.$t('pages.home.banner.mobile_banner_load_failed')
            this.showResult('error', message)
          }
        })

      } else {
         this.request.get('/banner/type/banner_desktop', {params: query}).then(res => {
          if (res.code === '200') {
            this.bgImageList = res.data

            // console.log('banner_desktop:', res.data.imageUuid)
            // this.bgImage = 'url(' + this.showImage(res.data.imageUuid) + ")"
          } else {
            const message = this.$t('pages.home.banner.banner_load_failed')
            this.showResult('error', message)
          }
        })
      }
    }
  },
  mounted(){
    this.pageWidth = window.screen.width
    this.loadData()
    console.log('resize:', window.screen.width)
  },
  watch:{
    //監測 areaList變化時才啟用 swiper
    bgImageList:{
      immediate: true,
      handler(newValue, oldValue){

        //頁面的資料有更新且loop展現後，此時的dom都完整了，才初始化swiper
        this.$nextTick(() => {

          var mySwiper = new Swiper (this.$refs.bannerSwiper, {
            speed: 2000,
            autoplay: {
              delay: 5000
            },
            loop: true,
            slidesPerView: 1,
            spaceBetween: 0,
            preventClicksPropagation: true,
            preventClicks: true,
            noSwiping: false,
            navigation: {
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev'
            }
          })
        });

      }
    }
  }
}
</script>

<style scoped>

.banner {
  min-height: 680px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
/*  background-image: url('~@/assets/images/index/banner.jpg');*/
}
@media screen and (max-width:767px){
  .banner {
    min-height: 300px;
/*    background-image: url('~@/assets/images/index/banner-mobile.jpg');*/
  }
}
@media screen and (min-width:1200px){
  .banner {
    min-height: 450px;
  }
}
@media screen and (min-width:1600px){
  .banner {
    min-height: 680px;
  }
}





.banner .slogan {
  position: absolute;
  right: 20%;
  bottom: 20%;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
@media screen and (max-width: 767px) {
  .banner .slogan {
    right: 20px;
  }
}
.banner .slogan .txt {
  font-size: 2.625rem;
  font-weight: 500;
}
@media screen and (max-width: 1000px) {
  .banner .slogan .txt {
    font-size: 1.875rem;
  }
}
@media screen and (max-width: 767px) {
  .banner .slogan .txt {
    font-size: 1.625rem;
  }
}
.banner .slogan .secTxt {
  font-size: 1.5rem;
  font-weight: 400;
  margin-bottom: 15px;
}
@media screen and (max-width: 1000px) {
  .banner .slogan .secTxt {
    font-size: 1.125rem;
  }
}
.banner .slogan .more {
  display: block;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: none;
  background: #f37a69;
  padding: 11px 30px;
  font-size: 1.5rem;
  font-weight: 400;
  letter-spacing: 5px;
}
@media screen and (max-width: 1000px) {
  .banner .slogan .more {
    font-size: 1.25rem;
  }
}
@media screen and (max-width: 767px) {
  .banner .slogan .more {
    padding: 5px 20px;
    font-size: 1.125rem;
  }
}
.banner .slogan .more::after {
  content: "";
  width: 18px;
  height: 9px;
  display: block;
  -webkit-mask: url("~@/assets/images/btn_arrow.svg") no-repeat;
          mask: url("~@/assets/images/btn_arrow.svg") no-repeat;
  background: #fff;
  margin-left: 15px;
}

.swiper-button-prev,
.swiper-button-next {
  color: #f37a69;
}

</style>
