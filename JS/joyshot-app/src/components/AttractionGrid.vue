<template>
	<div class="viewPointBox">
		<div class="bottomBox">
			<div class="viewpointList">
				<div class="swiper listSwiper" ref="myswiper">
			    <div class="listBox swiper-wrapper">
			     <div class="item swiper-slide" v-for="post in list" :key="post.id">
			        <a href="#" @click="showPost(post)">
			          <div class="pic">
			            <div class="location"><img src="@/assets/images/icon_location.svg" style="height:22px;width:15px;margin-right:5px"> {{post.name}}</div>
			            <img :src="showImage(post.imageUuid)" alt="" class="feature-image" />
			          </div>
			        </a>
			      </div>
			    </div>
			    <div class="attraction-button swiper-button-prev"></div>
			    <div class="attraction-button swiper-button-next"></div>
			  </div>
			</div>
		</div>
	</div>

</template>

<script>

import Swiper from 'swiper'

export default {
	name: 'AttractionGrid',
	components:{

	},
	props:['list'],
	data(){
		return {

		}
	},
	methods:{
		showPost(post){

			window.open(post.postUrl, '_new')
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
            loop: false,
            slidesPerView: 2,
            spaceBetween: 12,
            preventClicksPropagation: true,
            preventClicks: true,
            noSwiping: true,
            // slideToClickedSlide: true,
            // autoplay: true,
            navigation: {
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            },
            breakpoints: {
              700: {
                slidesPerView: 2,
              },
              1000: {
                slidesPerView: 3,
              },
              1200: {
                slidesPerView: 4,
              },
              1600: {
                slidesPerView: 5,
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

.viewpointBox .bottomBox .viewpointList .swiper-slide {
  padding: 0 12px;
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
  z-index: 2;
  letter-spacing: 2px;
  line-height: 1.5rem;
}
@media screen and (max-width: 1000px) {
  .viewpointBox .bottomBox .listBox .item .pic .location {
    font-size: 1.125rem;
  }
}
.viewpointBox .bottomBox .listBox .item .pic img {
  aspect-ratio: 1/1;
  width: 100%;
  -o-object-fit: cover;
     object-fit: cover;
  transition: all 0.3s ease;
}
.viewpointBox .bottomBox .listBox .item:hover .pic img {
  transform: scale(1.1);
}
.viewpointBox .bottomBox .swiper-button-next,
.viewpointBox .bottomBox .swiper-button-prev {
  color: #92959a;
  position: absolute;
  top: 50%;
}

</style>


