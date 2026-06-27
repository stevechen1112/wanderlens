<template>
  <section class="instagramBox">

    <div class="titleBox">{{ $t('Components.IG.follow') }}</div>
<!--
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
                <div class="title">{{area.name}}</div>
              </button>
            </div>
        </div>
        <div class="swiper-button swiper-button-prev"></div>
        <div class="swiper-button swiper-button-next"></div>
      </div>
    </div> -->


    <div class="bottomBox swiper-container">
      <div class="listBox swiper" ref="igswiper">
        <div class="listBox swiper-wrapper igswiper">
          <div class="swiper-slide swiper-no-swiping"  v-for="p in postList" :key="p.id">
            <button >
              <div class="pic">
                <img :src="showImage(p.igImageUuid)" alt="" />
              </div>
              <div class="title">{{p.title}}</div>
            </button>
          </div>

          <!-- <div class="item" v-for="p in postList" :key="p.id">
            <a :href="p.igUrl" target="_new">
              <div class="pic">
                <img v-lazy="showImage(p.igImageUuid)" alt="" />
              </div>
              <div class="infoBox">
                <div class="userPic">
                  <img src="@/assets/images/joyshot-ig.jpg" alt="" />
                </div>
                <div class="txtBox">
                  <div class="title">{{p.title}}</div>
                  <div class="account">@joyshot_tw</div>
                </div>
              </div>
            </a>
          </div> -->
        </div>

      </div>
    </div>





  </section>
</template>

<script>

import Swiper from 'swiper'

export default {
  name: 'IG',
  components:{

  },
  data(){
    return {
      postList:[]
    }
  },
  methods:{
    getData(){
      this.request.get('/instagram').then(res => {
        if (res.code === '200') {
          this.postList = res.data
        } else {
          this.showResult('error', this.$t('action.get_error', {err: 'error'}))
        }
      })
    }
  },
  mounted(){
    this.getData()
  },
  watch:{
    //監測 areaList變化時才啟用 swiper
    postList:{
      immediate: true,
      handler(newValue, oldValue){

        //頁面的資料有更新且loop展現後，此時的dom都完整了，才初始化swiper
        this.$nextTick(() => {

          var mySwiper = new Swiper (this.$refs.igswiper, {
            autoplay: {
              delay: 3000
            },
            loop: true,
            slidesPerView: 5,
            spaceBetween: 12,
            preventClicksPropagation: true,
            preventClicks: true,
            noSwiping: false,
            breakpoints: {
              700: {
                slidesPerView: 5,
              },
              1000: {
                slidesPerView: 5,
              },
              1200: {
                slidesPerView: 5,
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

.instagramBox {
  overflow: hidden;
}
.instagramBox .titleBox {
  color: #333333;
  font-size: 2.25rem;
  text-align: center;
  font-weight: 300;
  display: block;
}
@media screen and (max-width: 1000px) {
  .instagramBox .titleBox {
    font-size: 1.75rem;
  }
}
.instagramBox .titleBox::before {
  content: "";
  width: 45px;
  aspect-ratio: 1/1;
  display: block;
  background: url("~@/assets/images/index/icon_instagram.png") no-repeat;
  margin: 0 auto 10px;
}
.instagramBox .bottomBox {
  display: flex;
  white-space: nowrap;
}
.instagramBox .bottomBox::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 100px;
  z-index: 1;
  display: block;
  background: linear-gradient(to right, rgb(255, 255, 255) 10%, rgba(255, 255, 255, 0.8) 30%, rgba(255, 255, 255, 0) 100%);
}
.instagramBox .bottomBox::after {
  content: "";
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 100px;
  z-index: 1;
  display: block;
  background: linear-gradient(to left, rgb(255, 255, 255) 10%, rgba(255, 255, 255, 0.8) 30%, rgba(255, 255, 255, 0) 100%);
}
.instagramBox .bottomBox:hover .listBox > .item:not(:hover) {
  opacity: 0.4;
}
.instagramBox .listBox {
  background: #fff;
  padding: 10px 0;
  display: flex;
  flex-shrink: 0;
}
.instagramBox .listBox .item {
  width: 340px;
  position: relative;
  margin: 0 15px;
  box-shadow: 0px 0px 10px 2px rgba(0, 0, 0, 0.1);
  border-radius: 15px;
  overflow: hidden;
  white-space: nowrap;
  flex-shrink: 0;
  transition: all 0.3s ease;
}
/*@media screen and (max-width: 1000px) {
  .instagramBox .listBox .item {
     width: 150px;
  }
}*/
@media screen and (max-width: 767px) {
  .instagramBox .listBox .item {
    width: 150px;
  }
}
.instagramBox .listBox .pic {
  overflow: hidden;
  position: relative;
}
.instagramBox .listBox .pic::before {
  content: "";
  width: 22px;
  aspect-ratio: 1/1;
  display: block;
  position: absolute;
  right: 15px;
  top: 15px;
  background: url("~@/assets/images/index/icon_instagram2.png");
  background-size: contain;
}
.instagramBox .listBox .pic img {
  aspect-ratio: 1/1;
  width: 100%;
  -o-object-fit: contain;
     object-fit: contain;
}
.instagramBox .listBox .infoBox {
  padding: 4% 5%;
  background: #fff;
  display: flex;
}
.instagramBox .listBox .infoBox .userPic {
  width: 36px;
  height: 36px;
  border-radius: 100%;
  overflow: hidden;
  line-height: 0;
  flex-shrink: 0;
  margin-right: 10px;
}
.instagramBox .listBox .infoBox .title {
  color: #333333;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.2;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}
.instagramBox .listBox .infoBox .account {
  color: #666666;
  font-size: 0.875rem;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

</style>
