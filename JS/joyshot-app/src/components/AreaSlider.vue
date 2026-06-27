<template>
  <div class="swiper-container">
    <div class="swiper" ref="myswiper">
      <div class="listBox swiper-wrapper myswiper">
          <div :class="{ 'swiper-slide-thumb-active': areaId === area.id}"
            class="swiper-slide swiper-no-swiping"
            v-for="(area, index) in list" :key="area.id">
            <button @click.stop.prevent="filterByArea(area.id)">
              <div class="pic">
                <img :src="showImage(area.imageUuid)" alt="" />
              </div>
              <div class="title">{{ translate(area, "name") }}</div>
            </button>
          </div>
      </div>
      <div class="swiper-button swiper-button-prev"></div>
      <div class="swiper-button swiper-button-next"></div>
    </div>
  </div>
</template>

<script>

import Swiper from 'swiper'

export default {
	name: 'AreaSlider',
	components:{

	},
	props:['list'],
	data(){
		return {
			areaId:0
		}
	},
	methods:{
		filterByArea(selectedId){
      console.log('change area:', selectedId)
      this.areaId = selectedId
      this.$emit('cityChange', selectedId)
		}
	},
	mounted(){
	},
	watch:{
    //監測 areaList變化時才啟用 swiper
    list:{
      immediate: true,
      handler(newValue, oldValue){

        //頁面的資料有更新且loop展現後，此時的dom都完整了，才初始化swiper
        this.$nextTick(() => {

        	var mySwiper = new Swiper (this.$refs.myswiper, {
            loop: true,
            slidesPerView: '3',
            spaceBetween: 12,
            preventClicksPropagation: false,
            preventClicks: true,
            noSwiping: false,
            slideToClickedSlide: true,
            autoplay: true,
            navigation: {
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            },
            breakpoints: {
              700: {
                slidesPerView: 3,
              },
              1000: {
                slidesPerView: 3,
              },
              1200: {
                slidesPerView: 8,
              },
              1600: {
                slidesPerView: 9,
              },
            }
          })
        });

      }
    }
  }
}

</script>

<style scoped>
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

.swiper-container .swiper {
  max-width: 1240px;
  overflow: hidden;
  margin: 4.5% auto 0;
}
.swiper-container .swiper .swiper-wrapper {
  padding: 0 0 0 50px !important;
}


.swiper-container .swiper button {
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
.swiper-container .swiper-slide-thumb-active button {
  color: #f37a69;
  border-color: #f37a69;
}
.swiper-container .pic {
  width: 35px;
  aspect-ratio: 1/1;
  border-radius: 100%;
  overflow: hidden;
  margin-right: 10px;
}

@media screen and (max-width:767px){
  .swiper-button {
    display: none !important;
  }
}


</style>


