<template>
  <section class="viewpointBox">
    <div class="container">
      <div class="titleBox">
        <h2>{{ $t('home.attraction.title') }}</h2>
      </div>


      <div class="topBox">
        <AreaSlider :list="list" @cityChange="cityChange"></AreaSlider>

        <!-- <button class="filterBtn">篩選<span>景點</span></button> -->
      </div>
    </div>

     <AttractionGrid :list="attractionList" />

  </section>
</template>

<script>

import AreaSlider from '@/components/AreaSlider.vue'
import AttractionGrid from '@/components/AttractionGrid.vue'

export default {
	name: 'TouristSpots',
  components:{
    AreaSlider,AttractionGrid
  },
  props:['list'],
  data(){
    return {
      areaId:0,
      attractionList:[],

      pageNum: 1,
      pageSize: 5,
      total:0
    }
  },
  methods:{
    cityChange(areaId){
      this.areaId = areaId
      this.loadData()
    },
    loadData(){
      let query = {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          areaId: this.areaId,
          lang: this.getLang(),
      }
      this.request.get('/attraction',{ params: query}).then(res => {
        if (res.code === '200') {
          this.attractionList = res.data.records
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

<style scoped>


.viewpointBox {
  background: linear-gradient(to bottom, rgb(255, 245, 244) 0%, rgb(255, 255, 255) 20%);
}
.viewpointBox .container {
  max-width: 1700px;
}
.viewpointBox .topBox {
  position: relative;
  margin-bottom: 2.5%;
  display: flex;
  justify-content: space-between;
}
.viewpointBox .topBox .filterBtn {
  background: #fff;
  border: #dddddd 1px solid;
  border-radius: 30px;
  font-size: 1.125rem;
  width: 156px;
  margin: 0 0 0 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}
.viewpointBox .topBox .filterBtn span {
  color: #f37a69;
}
.viewpointBox .topBox .filterBtn::before {
  content: "";
  width: 16px;
  height: 17px;
  display: block;
  margin-right: 10px;
  background: url("~@/assets/images/icon_filter.svg") no-repeat;
}
.viewpointBox .topBox .swiperBox {
  width: calc(100% - 152px);
  flex-grow: 1;
  position: relative;
  padding: 0 70px;
}
.viewpointBox .topBox .swiper {
  max-width: 1370px;
  overflow: hidden;
  margin: 0 auto;
}
.viewpointBox .topBox .swiper button {
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
.viewpointBox .topBox .swiper-slide-thumb-active button {
  color: #f37a69;
  border-color: #f37a69;
}
.viewpointBox .topBox .pic {
  width: 35px;
  aspect-ratio: 1/1;
  border-radius: 100%;
  overflow: hidden;
  margin-right: 10px;
}
.viewpointBox .topBox .title {
  padding-top: 4px;
  font-size: 1.3125rem;
}
@media screen and (max-width: 1600px) {
  .viewpointBox .topBox .title {
    font-size: 1.125rem;
  }
}
@media screen and (max-width: 1000px) {
  .viewpointBox .topBox .title {
    font-size: 1rem;
  }
}
.viewpointBox .bottomBox .viewpointList > .swiper-slide {
  padding: 0 60px;
}
.viewpointBox .bottomBox .listBox {
  background: #fff;
}
.viewpointBox .bottomBox .listBox .item {
  position: relative;
  pointer-events: unset;
  transition: all 0.3s ease;
}
.viewpointBox .bottomBox .listBox .item .pic {
  position: relative;
  border-radius: 15px;
  overflow: hidden;
}
.viewpointBox .bottomBox .listBox .item .pic::before {
  content: "";
  position: absolute;
  inset: 0;
  display: block;
  z-index: 1;
  background: linear-gradient(to bottom, rgb(0, 0, 0) 0%, rgba(0, 0, 0, 0) 100%);
  opacity: 0.3;
}
.viewpointBox .bottomBox .listBox .item .pic .location {
  position: absolute;
  top: 20px;
  left: 20px;
  color: #fff;
  font-size: 1.3125rem;
  display: flex;
  align-items: center;
  z-index: 2;
  letter-spacing: 2px;
}
@media screen and (max-width: 1000px) {
  .viewpointBox .bottomBox .listBox .item .pic .location {
    font-size: 1.125rem;
  }
}
.viewpointBox .bottomBox .listBox .item .pic .location::before {
  content: "";
  width: 15px;
  height: 22px;
  display: block;
  background: url("~@/assets/images/icon_location.svg") no-repeat;
  margin-right: 5px;
}
.viewpointBox .bottomBox .listBox .item .pic img {
  aspect-ratio: 1/1;
  width: 100%;
  -o-object-fit: contain;
     object-fit: contain;
  transition: all 0.3s ease;
}
.viewpointBox .bottomBox .listBox .item:hover .pic img {
  transform: scale(1.1);
}
.viewpointBox .bottomBox .swiper-button-next,
.viewpointBox .bottomBox .swiper-button-prev {
  color: #92959a;
}
.viewpointBox .more {
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
.viewpointBox .more::after {
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
.viewpointBox .more:hover {
  color: #fff;
}
.viewpointBox .more:hover::after {
  width: 100%;
  left: 0;
}

</style>
