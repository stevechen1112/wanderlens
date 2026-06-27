<template>
  <section class="photographerBox">
    <div class="container">
      <div class="titleBox">
        <h2>{{ $t('home.photographer.title') }}</h2>
      </div>

      <AreaSlider :list="list" @cityChange="cityChange"/>

      <div class="mainBox reserve">
        <div class="container">
          <PhotographerGrid :list="photographerList" @photographerDetail="photographerDetail" :showBooking="false" :limit="8" />
        </div>
      </div>

      <router-link to="/photographer-list" class="more">{{ $t('home.photographer.more') }}</router-link>

    </div>
  </section>
</template>

<script>

import Swiper from 'swiper'
import AreaSlider from '@/components/AreaSlider.vue'
import PhotographerGrid from '@/components/PhotographerGrid.vue'

export default {
	name: 'PhotographerBox',
  components:{
    AreaSlider,PhotographerGrid
  },
  props:['list'],
  data(){
    return {
      photographerList:[],
      areaId:0,
      pageNum:1,
      pageSize:10,
      total:0
    }
  },
  methods:{
    getPhotographer(){
      let query = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      this.request.get(`/photographer/area/${this.areaId}`, {params: query}).then(res => {
        if (res.code === '200') {
          this.photographerList = res.data.records
        } else {
          this.showResult('error', this.$t('action.get_error', {err: 'error'}))
        }
      })
    },
    photographerDetail(pid){
      this.$router.push(`/photographer/${pid}`).catch(()=>{})
    },
    cityChange(areaId){
      console.log('photographerbox cityChange:', areaId)
      this.areaId = areaId
      this.getPhotographer()
    }
  },
  mounted(){
    this.getPhotographer()
  }
}

</script>

<style scoped>



.photographerBox .container {
  max-width: 1700px;
}
.photographerBox .topBox {
  position: relative;
  margin-bottom: 2.5%;
  padding: 0 70px;
}
.photographerBox .topBox .swiper {
  max-width: 1520px;
  overflow: hidden;
  margin: 0 auto;
}
.photographerBox .topBox .swiper button {
  width: 100%;
  height: 47px;
  background: #fff;
  border: #dddddd 1px solid;
  border-radius: 30px;
  padding: 4px 10px 4px 4px;
  display: flex;
  align-items: center;
  line-height: 1;
}
.photographerBox .topBox .swiper-slide-thumb-active button {
  color: #f37a69;
  border-color: #f37a69;
}
.photographerBox .topBox .pic {
  width: 35px;
  aspect-ratio: 1/1;
  border-radius: 100%;
  overflow: hidden;
  margin-right: 10px;
}
.photographerBox .topBox .title {
  padding-top: 4px;
  font-size: 1.3125rem;
}
@media screen and (max-width: 1600px) {
  .photographerBox .topBox .title {
    font-size: 1.125rem;
  }
}
@media screen and (max-width: 1000px) {
  .photographerBox .topBox .title {
    font-size: 1rem;
  }
}
.photographerBox .bottomBox {
  margin-bottom: 30px;
}
.photographerBox .bottomBox .listBox {
  background: #fff;
  display: flex;
  flex-wrap: wrap;
}
.photographerBox .bottomBox .listBox .item {
  width: calc(25% - 28px);
  position: relative;
  margin: 0px 14px 28px;
  box-shadow: 5px 5px 10px 0px rgba(0, 0, 0, 0.2);
  border-radius: 15px;
  overflow: hidden;
  transition: all 0.3s ease;
}
@media screen and (max-width: 1300px) {
  .photographerBox .bottomBox .listBox .item {
    width: calc((100% - 40px) / 3);
    margin: 0px 10px 20px;
  }
}
@media screen and (max-width: 767px) {
  .photographerBox .bottomBox .listBox .item {
    width: calc((100% - 20px) / 2);
  }
}
.photographerBox .bottomBox .listBox .item:hover .pic img {
  transform: scale(1.1);
}
.photographerBox .bottomBox .listBox .pic {
  overflow: hidden;
}
.photographerBox .bottomBox .listBox .pic img {
  aspect-ratio: 41/27;
  width: 100%;
  -o-object-fit: contain;
     object-fit: contain;
  transition: all 2s ease;
}
.photographerBox .bottomBox .listBox .infoBox {
  padding: 5% 7%;
  background: #fff;
}
.photographerBox .bottomBox .listBox .infoBox .title {
  color: #333333;
  font-size: 1.5rem;
  font-weight: 500;
  line-height: 1.2;
  position: relative;
}
@media screen and (max-width: 1300px) {
  .photographerBox .bottomBox .listBox .infoBox .title {
    font-size: 1.25rem;
  }
}
@media screen and (max-width: 1000px) {
  .photographerBox .bottomBox .listBox .infoBox .title {
    font-size: 1.125rem;
  }
}
.photographerBox .bottomBox .listBox .infoBox .title::before {
  content: "";
  display: block;
  position: absolute;
  width: 5px;
  height: 5px;
  background: #222222;
  border-radius: 100%;
  right: 0;
  top: 50%;
  box-shadow: -10px 0 0 0 #222222, -20px 0 0 0 #222222;
}
.photographerBox .bottomBox .listBox .infoBox .city {
  color: #666666;
  font-size: 1.125rem;
}
@media screen and (max-width: 1300px) {
  .photographerBox .bottomBox .listBox .infoBox .city {
    font-size: 1rem;
  }
}
.photographerBox .more {
  display: block;
  max-width: 250px;
  background: #fff;
  border: #dddddd 1px solid;
  border-radius: 30px;
  padding: 15px;
  margin: 0 auto;
  font-size: 1.125rem;
  text-align: center;
  position: relative;
  z-index: 1;
  overflow: hidden;
}
.jp-app .photographerBox .more {
  max-width: 270px;
}
.photographerBox .more::after {
  content: "";
  position: absolute;
  width: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: block;
  background: #52b6cc;
  z-index: -1;
  transition: all 0.3s ease;
}
.photographerBox .more:hover {
  color: #fff;
}
.photographerBox .more:hover::after {
  width: 100%;
  left: 0;
}


/**swiper**/
.swiper-button {
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
.swiper-button::after {
  display: none;
}
.swiper-button::before {
  content: "";
  position: absolute;
  inset: 0;
  display: block;
  background: url("~@/assets/images/m_ar.svg") no-repeat;
  background-position: 58% 50%;
  background-size: 30%;
}
.swiper-button.swiper-button-next {
  right: 0;
}
.swiper-button.swiper-button-prev {
  left: 0;
}
.swiper-button.swiper-button-prev::before {
  transform: rotate(180deg);
}
.photographerBox .swiper-button,
.reserveDetailBox .swiper-button {
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
.photographerBox .swiper-button::after,
.reserveDetailBox .swiper-button::after {
  display: none;
}
.photographerBox .swiper-button::before,
.reserveDetailBox .swiper-button::before {
  content: "";
  position: absolute;
  inset: 0;
  display: block;
  background: url("~@/assets/images/m_ar.svg") no-repeat;
  background-position: 58% 50%;
  background-size: 30%;
}
.photographerBox .swiper-button.swiper-button-next,
.reserveDetailBox .swiper-button.swiper-button-next {
  right: 0;
}
.photographerBox .swiper-button.swiper-button-prev,
.reserveDetailBox .swiper-button.swiper-button-prev {
  left: 0;
}
.photographerBox .swiper-button.swiper-button-prev::before,
.reserveDetailBox .swiper-button.swiper-button-prev::before {
  transform: rotate(180deg);
}


.myswiper{
  padding: 0 0 0 50px !important;
}

@media screen and (max-width: 767px) {
  .mainBox .titleBox {
    padding-top: 30px;
  }
}



</style>
