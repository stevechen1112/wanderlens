<template>
  <main class="siteMain" ref="siteMain" aria-label="main" itemscope>

    <Banner/>

    <div class="mainBox">
      <UvpBox/>
      <MilestoneBox />
      <ReserveStepBox />
      <PhotographerBox :list="areaList" />
      <RatingBox />
      <TouristSpots :list="areaList" />
      <InstagramBox />
      <AdBox />
      <Recruit />
    </div>

  </main>

</template>


<script>
// @ is an alias to /src
import Banner from '@/components/Banner.vue'
import ReserveStepBox from '@/components/ReserveStepBox.vue'

import Recruit from '@/components/Recruit.vue'
import AdBox from '@/components/AdBox.vue'
import RatingBox from '@/components/RatingBox.vue'
import InstagramBox from '@/components/InstagramBox.vue'
import PhotographerBox from '@/components/PhotographerBox.vue'
import TouristSpots from '@/components/TouristSpots.vue'

import MilestoneBox from '@/components/MilestoneBox.vue'
import UvpBox from '@/components/UvpBox.vue'


import IG from '@/components/IG.vue'

export default {
  name: 'Home',
  components: {
    Banner,Recruit,AdBox,RatingBox,TouristSpots,
    InstagramBox,PhotographerBox,ReserveStepBox,
    MilestoneBox,IG,UvpBox
  },
  data(){
    return {
      areaList:[]
    }
  },
  props:['appInSearchMode'],
  methods:{
    handleBodyClick(){
      console.log('Home.vue 點擊body，期望關閉搜尋')
      this.$emit('appInSearchMode',  {mode:''})
    },
    getCity(){
      this.request.get('/area/area1').then(res => {
        if (res.code === '200') {
          this.areaList = res.data
        } else {
          this.showResult('error', this.$t('action.get_error', {err: 'error'}))
        }
      })
    }
  },
  mounted(){
    console.log('mounted Home')
    fbq('track', 'PageView');
    this.$refs.siteMain.addEventListener('click', this.handleBodyClick);
    this.getCity()
  }
}
</script>


<style type="text/css" >

/*home css*/
.pic {
  line-height: 0;
}

section {
  padding-bottom: 3%;
}

.mainBox {
  margin-top: 3%;
}
.mainBox .titleBox {
  padding: 3vw 0 2vw;
  text-align: center;
  position: relative;
}
.mainBox .titleBox h2 {
  font-size: 2.25rem;
  font-weight: normal;
  letter-spacing: 2px;
  text-indent: -2px;
  color: #000;
}
@media screen and (max-width: 1000px) {
  .mainBox .titleBox h2 {
    font-size: 1.75rem;
  }
}
.mainBox .titleBox .info {
  font-size: 1.3125rem;
  color: #666666;
}
@media screen and (max-width: 1000px) {
  .mainBox .titleBox .info {
    font-size: 1.125rem;
  }
}


.evaluateBox .swiper-button,
.viewpointBox .topBox .swiper-button,
.photographerBox .swiper-button {
  width: 48px;
  display: block;
  flex-shrink: 0;
  aspect-ratio: 1/1;
  border: #dddddd 1px solid;
  padding: 0;
  border-radius: 30px;
  background: #fff;
  box-shadow: 5px 5px 10px 0px rgba(0, 0, 0, 0.1);
}
.evaluateBox .swiper-button::after,
.viewpointBox .topBox .swiper-button::after,
.photographerBox .swiper-button::after {
  display: none;
}
.evaluateBox .swiper-button::before,
.viewpointBox .topBox .swiper-button::before,
.photographerBox .swiper-button::before {
  content: "";
  position: absolute;
  inset: 0;
  display: block;
  background: url("~@/assets/images/m_ar.svg") no-repeat;
  background-position: 58% 50%;
  background-size: 30%;
}
.evaluateBox .swiper-button.swiper-button-next,
.viewpointBox .topBox .swiper-button.swiper-button-next,
.photographerBox .swiper-button.swiper-button-next {
  right: 0;
}
.evaluateBox .swiper-button.swiper-button-prev,
.viewpointBox .topBox .swiper-button.swiper-button-prev,
.photographerBox .swiper-button.swiper-button-prev {
  left: 0;
}
.evaluateBox .swiper-button.swiper-button-prev::before,
.viewpointBox .topBox .swiper-button.swiper-button-prev::before,
.photographerBox .swiper-button.swiper-button-prev::before {
  transform: rotate(180deg);
}

@media screen and (max-width: 1000px) {
  .evaluateBox .swiper-button,
  .viewpointBox .topBox .swiper-button,
  .photographerBox .swiper-button {
    display: none;
  }
}

</style>
