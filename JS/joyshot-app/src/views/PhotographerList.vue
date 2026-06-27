<template>
  <main class="siteMain viewpointBox" ref="siteMain" aria-label="main" itemscope>
    <div class="banner">
      <NoticeBox />
      <div class="titleBox">
        <h1>{{ $t('Views.PhotographerList.title') }}</h1>
      </div>
    </div>

    <AreaSlider :list="areaList" @cityChange="cityChange"></AreaSlider>

    <div class="mainBox reserve">
      <div class="container">

        <!--攝影師資料-->
        <PhotographerGrid :list="photographerList" @photographerDetail="photographerDetail" :showBooking="false" :limit="1000" />

        <div v-if="photographerList && photographerList.length == 0" class="photographerBox">
          <div class="more">{{ $t('Views.PhotographerList.no_photographer') }}</div>
        </div>

      </div>
    </div>
  </main>
</template>

<script>

import NoticeBox from '@/components/NoticeBox.vue'
import AreaSlider from '@/components/AreaSlider.vue'
import PhotographerGrid from '@/components/PhotographerGrid.vue'

export default {
  name: 'PhotographerList',
  components:{
    NoticeBox,AreaSlider,PhotographerGrid
  },
  data(){
    return {
      areaList:[],
      photographerList:[],
      pageNum:1,
      pageSize:100,
      areaId:0
    }
  },
  methods:{
    bookMe(photographerId){
      console.log('bookMe:', photographerId)
      return false
    },
    cityChange(areaId){
      console.log('cityChange:', areaId)
      this.areaId = areaId
      this.getPhotographer()
    },
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
    getCity(){
      this.request.get('/area/area1').then(res => {
        if (res.code === '200') {
          this.areaList = res.data
        } else {
          this.showResult('error', this.$t('action.get_error', {err: 'error'}))
        }
      })
    },

    handleBodyClick(){
      // this.$bus.$emit('AppInSearchMode',  {mode:''})
      this.$emit('appInSearchMode',  {mode:''})
    },
    bookNow(){
      this.$router.push('/checkout').catch(()=>{})
    },
    photographerDetail(pid){
      this.$router.push(`/photographer/${pid}`).catch(()=>{})
    }
  },
  mounted(){
    // this.$refs.siteMain.addEventListener('click', this.handleBodyClick);
    this.getCity()

    //
    this.getPhotographer()
  }
}
</script>

<style type="text/css" scoped>

@charset "UTF-8";


.banner {
  position: relative;
  background-position: center;
  background-repeat: no-repeat;
  background-image: url('~@/assets/images/in/banner_reserve.jpg');
}
.banner::before {
  content: "";
  position: absolute;
  inset: 0;
  display: block;
  z-index: 2;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgb(0, 0, 0) 100%);
  opacity: 0.3;
}
.banner::after {
  content: "";
  position: absolute;
  inset: 0;
  display: block;
  z-index: 1;
  background: #465464;
  opacity: 0.2;
}

.container .pic {
  line-height: 0;
}
.container .pic:hover,
.container .infoBox:hover {
  cursor: pointer;
}

.viewpointBox .banner {
  min-height: 360px;
}
@media screen and (max-width: 1000px) {
  .viewpointBox .banner {
    min-height: 200px;
  }
}
.viewpointBox .banner .titleBox {
  position: absolute;
  inset: 50px 20px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #fff;
  z-index: 2;
}
.viewpointBox .banner .titleBox h1 {
  font-size: 2.625rem;
  padding: 0;
  margin: 0 0 0px 0;
}
@media screen and (max-width: 1000px) {
  .viewpointBox .banner .titleBox h1 {
    font-size: 1.875rem;
  }
}
.viewpointBox .banner .titleBox .info {
  font-size: 1.5rem;
}
@media screen and (max-width: 1000px) {
  .viewpointBox .banner .titleBox .info {
    font-size: 1.375rem;
  }
}
.viewpointBox .container {
  max-width: 1720px;
}

.reserve .listBox {
  background: #fff;
  display: flex;
  flex-wrap: wrap;
  margin: 0 -13px;
  padding-bottom: 2%;
}
@media screen and (max-width: 1400px) {
.reserve .listBox {
    margin: 0 0px 2%;
  }
}
.reserve .listBox .item {
  width: calc(25% - 26px);
  position: relative;
  margin: 0px 13px 26px;
  box-shadow: 5px 5px 10px 0px rgba(0, 0, 0, 0.2);
  border-radius: 15px;
  overflow: hidden;
  transition: all 0.3s ease;
}
@media screen and (max-width: 1400px) {
.reserve .listBox .item {
    width: calc(33.3333333333% - 20px);
    margin: 0px 10px 20px;
  }
}
@media screen and (max-width: 1000px) {
.reserve .listBox .item {
    width: calc(50% - 20px);
  }
}
@media screen and (max-width: 600px) {
.reserve .listBox .item {
    width: 100%;
    max-width: 410px;
    margin: 0px auto 20px;
  }
}
.reserve .listBox .item:hover .pic img {
  transform: scale(1.1);
}
.reserve .listBox .item.unActive {
  display: none;
}
.reserve .listBox .pic {
  overflow: hidden;
}
.reserve .listBox .pic img {
  aspect-ratio: 41/27;
  width: 100%;
  -o-object-fit: contain;
     object-fit: contain;
  transition: all 2s ease;
}
.reserve .listBox .infoBox {
  padding: 20px 25px;
  background: #fff;
}
.reserve .listBox .infoBox .title {
  color: #333333;
  font-size: 1.5rem;
  font-weight: 500;
  line-height: 1.2;
  position: relative;
}
@media screen and (max-width: 1300px) {
.reserve .listBox .infoBox .title {
    font-size: 1.25rem;
  }
}
@media screen and (max-width: 1000px) {
.reserve .listBox .infoBox .title {
    font-size: 1.125rem;
  }
}
.reserve .listBox .infoBox .title::before {
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
.reserve .listBox .infoBox .city {
  color: #666666;
  font-size: 1.125rem;
}
@media screen and (max-width: 1300px) {
.reserve .listBox .infoBox .city {
    font-size: 1rem;
  }
}
.reserve .listBox .infoBottom {
  display: flex;
  justify-content: space-between;
  padding-top: 15px;
  margin-top: 15px;
  border-top: #dddddd 1px solid;
}
.reserve .listBox .infoBottom .comment .tag {
  width: 70px;
  top: 20px;
  right: 20px;
  border-radius: 20px;
  background: #f37a69;
  display: block;
  padding: 5px 12px 4px;
  display: flex;
  align-items: center;
  color: #fff;
  font-size: 1.125rem;
  font-family: "Roboto", Arial, "Noto Sans TC", "微軟正黑體", "Microsoft JhengHei", "蘋果儷中黑", "Apple LiGothic Medium", sans-serif, "0xe804";
  font-weight: 500;
  line-height: 1;
  margin-bottom: 10px;
}
.reserve .listBox .infoBottom .comment .tag::before {
  content: "";
  width: 15px;
  height: 14px;
  display: block;
  margin-right: 5px;
  background: url("~@/assets/images/index/icon_star.png");
}
.reserve .listBox .infoBottom .comment p {
  color: #666666;
  margin: 0;
  padding: 0;
  font-size: 0.875rem;
}
.reserve .listBox a {
  color: #329db8;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: none;
  padding: 11px 30px;
  letter-spacing: 5px;
  font-size: 1.3125rem;
  font-weight: 700;
  position: relative;
  z-index: 1;
  background: #329db8;
  transition: all 0.3s ease;
}
@media screen and (max-width: 1000px) {
.reserve .listBox a {
    font-size: 1.125rem;
  }
}
.reserve .listBox a::before {
  content: "";
  position: absolute;
  z-index: -1;
  inset: 0;
  display: block;
  background: linear-gradient(to right, rgb(243, 250, 251) 0%, rgb(230, 247, 255) 100%);
  transition: all 0.3s ease;
}
.reserve .listBox a::after {
  content: "";
  width: 18px;
  height: 9px;
  display: block;
  -webkit-mask: url("~@/assets/images/btn_arrow.svg") no-repeat;
          mask: url("~@/assets/images/btn_arrow.svg") no-repeat;
  background: #329db8;
  margin-left: 5px;
  transition: all 0.3s ease;
}
.reserve .listBox a:hover {
  color: #fff;
}
.reserve .listBox a:hover::before {
  opacity: 0;
}
.reserve .listBox a:hover::after {
  background: #fff;
}

.photographerBox .more {
  text-align: center;
  display: block;
  max-width: 250px;
  background: #fff;
/*  border: #dddddd 1px solid;*/
/*  border-radius: 30px;*/
  padding: 15px;
  margin: 0 auto 10%;
  font-size: 1.125rem;
  text-align: center;
  position: relative;
  z-index: 1;
  overflow: hidden;

}



</style>

