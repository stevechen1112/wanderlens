<template>
  <main class="siteMain reserveDetailBox" ref="siteMain" aria-label="main" itemscope>
    <div class="banner" :style="bgImage">
      <NoticeBox />
      <div class="titleBox">
        <div class="avatar">
          <img :src="showImage(photographer.avatar)">
        </div>

        <div class="infoBox">
          <h1>{{ translate(photographer, "nickName", true) }}</h1>
          <div class="info">{{ translate(photographer, "city") }}</div>
        </div>
      </div>
    </div>

    <div class="mainBox">

      <div class="comment">
        <div class="tag" v-if="false">{{photographer.rating}}</div>
        <!-- <p v-if="photographer.ratings">{{photographer.ratings.length}} 則評論</p> -->

        <ul>
          <li v-if="photographer.ratings">{{ $t('Views.Photographer.comment_count', { count: photographer.ratings.length }) }}</li>
          <li v-if="photographer.bookings">{{ $t('Views.Photographer.booked_count', { count: photographer.bookings.length }) }}</li>
        </ul>
      </div>
      <div class="reserveDetail">
        <div class="container">
          <div class="topBox">

            <div class="content">

              <ul class="photographer">
                <li v-if="photographer.career">{{photographer.career}}</li>
                <li v-if="photographer.experience">{{ $t('Views.Photographer.photographer_experience', { year: photographer.experience }) }}</li>
              </ul>
              <div>&nbsp;</div>
              <div class="txtBox" :style="{display: (excerpt)? 'block': 'none'}" v-html="fmtNotes(translate(photographer, 'intro'), true)"></div>
              <div class="txtBox" :style="{display: (!excerpt)? 'block': 'none'}" v-html="fmtNotes(translate(photographer, 'intro'))"></div>
              <button class="open" v-show="excerpt" title="VIEW MORE" @click="excerpt = !excerpt">VIEW MORE</button>
              <button class="open" v-show="!excerpt" title="VIEW LESS" @click="excerpt = !excerpt">VIEW LESS</button>

              <div class="typeBox">
                <div class="title">{{ $t('Views.Photographer.photograph_style') }}</div>
                <div class="listBox">
                  <div class="item" v-for="(cat,idx) in photographer.serviceCats" :key="idx">
                    <img :src="showImage(cat.iconFileUuid)" class="cat-icon">
                    {{ translate(cat, "name") }}
                  </div>
                </div>
              </div>
            </div>

            <div class="side">
              <!-- <div class="conBox">
                <div class="listBox">
                  <div class="item">??</div>
                  <div class="item">??</div>
                </div>
                <div class="listBox">
                  <div class="item">??</div>
                </div>
              </div> -->
              <div class="btnBox">
                <button :title="$t('Views.Photographer.booking_photographer')" @click.stop="bookMe(translate(photographer, 'nickName', true), ph_uuid)">{{ $t('Views.Photographer.booking_photographer') }}</button>
              </div>
              <div class="infoBox">
                <!-- <div class="info">免費改期<br />免費取消</div> -->
                <div class="txt"></div>
              </div>
            </div>
          </div>

          <div class="centerBox">
            <ul v-if="photographer.feature">
              <li v-for="f in photographer.feature" :key="f.id">
                <div class="title">{{f.featureTitle}}</div>
                <div class="txt" v-html="fmtNotes(f.featureContent)"></div>
              </li>
            </ul>
          </div>

          <div class="evaluateBox" v-show="ratingList.length > 0">
            <div class="swiperBox">
              <div class="swiper-button swiper-button-prev"></div>

              <div class="swiper topSwiper" ref="ratingSwiper">
                <div class="listBox swiper-wrapper">

                  <div class="swiper-slide" v-for="r in ratingList" :key="r.id">
                    <div class="item">
                      <!-- <div class="tag">{{r.stars}}</div> -->
                      <!-- <time class="date">{{r.createdAt | fmtDateTime}}</time> -->
                      <!-- <a href="#">留下評語</a> -->
                      <div class="title">{{r.author}}</div>
                      <div class="txt">{{r.comments}}</div>
                    </div>
                  </div>

                </div>
              </div>
              <div class="swiper-button swiper-button-next"></div>
            </div>
          </div>

          <div class="bottomBox">
            <div class="title">{{ $t('Views.Photographer.photographer_artworks', { nickName: translate(photographer, 'nickName', true) }) }}</div>
            <PhotographerWorksGrid/>
          </div>
        </div>
      </div>

    </div>

  </main>
</template>

<script>

import NoticeBox from '@/components/NoticeBox.vue'
import PhotographerWorksGrid from '@/components/PhotographerWorksGrid.vue'
import Swiper from 'swiper'
import 'swiper/css'
import { Navigation } from 'swiper/modules'

Swiper.use([Navigation])

export default {
  name: 'Photographer',
  components:{
    NoticeBox,PhotographerWorksGrid
  },
  data(){
    return {
      ph_uuid:'',
      photographer:{},
      ratingList:[],
      excerpt:true,
      bgImage:{},
      bigIntro:false
    }
  },
  props:['appInSearchMode'],
  methods:{
    bookMe(name,ph_uuid){
      console.log('bookMe')
      this.$bus.$emit('HeaderInSearchMode', {mode:'searchOpen', name, ph_uuid})
      this.$emit('appInSearchMode', {mode:'searchOpen'})
    },
    checkout(){
      this.$router.push('/checkout').catch(()=>{})
    },
    handleBodyClick(){
      // console.log('Photographer.vue 點擊body，期望關閉搜尋')
      this.$emit('appInSearchMode',  {mode:''})
    },
    getPhotographerInfo(){
      this.request.get(`/photographer/info/${this.ph_uuid}`).then(res => {
        if (res.code === '200') {
          this.event_tracking()

          // console.log(res)
          this.photographer = res.data
          this.photographer.feature = this.photographer.feature?.filter((item) => item.language === this.getLang());
          this.ratingList = res.data.ratings
          this.bigIntro = res.data.intro.length > 140


          this.bgImage.backgroundImage = 'url(' + this.showImage(res.data.bannerImg) + ")"


        } else {
          const message = this.$t('Views.Photographer.photographer_load_failed')
          this.showResult('error', message+res.message)
          this.$router.push('/404').catch(()=>{})
        }
      })
    },
    event_tracking() {
      fbq('track', 'ViewContent'); //瀏覽攝影師頁面
    }
  },
  mounted(){
    window.scrollTo({top: 0, behavior: 'smooth'})
    this.$refs.siteMain.addEventListener('click', this.handleBodyClick);
    this.ph_uuid = this.$route.params.pid
    this.getPhotographerInfo()
  },
  watch:{
    //監測 areaList變化時才啟用 swiper
    ratingList:{
      immediate: true,
      handler(newValue, oldValue){
        console.log('ratingList:', newValue)

        //頁面的資料有更新且loop展現後，此時的dom都完整了，才初始化swiper
        this.$nextTick(() => {
          console.log('nextTick:')
          let mySwiper = new Swiper (this.$refs.ratingSwiper, {
            loop: false,
            slidesPerView: 1.5,
            spaceBetween: 12,
            preventClicksPropagation: true,
            preventClicks: true,
            noSwiping: true,
            // slideToClickedSlide: true,
            // autoplay: true,
            navigation: {
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            }
          })
        });
      }
    }
  }

}
</script>

<style type="text/css" scoped>

@charset "UTF-8";
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

.banner {
  position: relative;
  background-position: center;
  background-repeat: no-repeat;
/*  background-image: url('~@/assets/images/in/banner_reserve_detail.jpg');*/
  background-size: cover;
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

.more {
  width: 100%;
  display: block;
  max-width: 300px;
  background: #fff;
  border: #dddddd 1px solid;
  border-radius: 30px;
  padding: 15px;
  margin: 0 auto 5%;
  font-size: 1.125rem;
  text-align: center;
  position: relative;
  z-index: 1;
  overflow: hidden;
}
@media screen and (max-width: 1000px) {
  .more {
    margin: 0 auto 10%;
  }
}
.more::after {
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
.more:hover {
  color: #fff;
}
.more:hover::after {
  width: 100%;
  left: 0;
}

.container .pic {
  line-height: 0;
}

.reserveDetailBox .banner {
  aspect-ratio: 1920/550;
}
.reserveDetailBox .titleBox {
  width: 100%;
  max-width: 1150px;
  position: absolute;
  bottom: 30px;
  color: #fff;
  z-index: 2;
  padding: 0 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
}
.reserveDetailBox .titleBox h1 {
  font-size: 3.375rem;
  padding: 0;
  margin: 0 0 0px 0;
  line-height: 1.2;
}
@media screen and (max-width: 1000px) {
.reserveDetailBox .titleBox h1 {
    font-size: 2.125rem;
  }
}
.reserveDetailBox .titleBox .info {
  font-size: 1.5rem;
}
@media screen and (max-width: 1000px) {
.reserveDetailBox .titleBox .info {
    font-size: 1.375rem;
  }
}
.reserveDetailBox .mainBox {
  padding-top: 15px !important;
}
.reserveDetailBox .comment {
  max-width: 1150px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  margin: 0 auto 30px;
}
.reserveDetailBox .comment .tag {
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
  margin-right: 10px;
}
.reserveDetailBox .comment .tag::before {
  content: "";
  width: 15px;
  height: 14px;
  display: block;
  margin-right: 5px;
  background: url("~@/assets/images/index/icon_star.png");
}
.reserveDetailBox .comment p {
  color: #666666;
  margin: 0;
  padding: 2px 0 0;
  font-size: 0.875rem;
}
.reserveDetailBox .side {
  flex-shrink: 0;
  width: 280px;
  border-radius: 20px;
  padding: 20px;
  border: #ee7c6b 1px solid;
  position: -webkit-sticky;
  position: sticky;
  top: 120px;
  overflow: hidden;
}
@media screen and (max-width: 1000px) {
.reserveDetailBox .side {
    width: 100%;
  }
}
.reserveDetailBox .side button {
  width: 100%;
  margin: 0 auto -26px;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: none;
  background: #f37a69;
  border-radius: 5px;
  padding: 14px 20px;
  font-size: 1.3125rem;
  font-weight: 700;
  position: relative;
  z-index: 2;
}
.jp-app .reserveDetailBox .side button {
  padding: 14px 10px;
  font-size: 1rem;
}
.kr-app .reserveDetailBox .side button {
  padding: 14px 10px;
  font-size: 1.15rem;
}
.reserveDetailBox .side button::after {
  content: "";
  width: 18px;
  height: 9px;
  display: block;
  -webkit-mask: url("~@/assets/images/btn_arrow.svg") no-repeat;
          mask: url("~@/assets/images/btn_arrow.svg") no-repeat;
  background: #fff;
  margin-left: 5px;
}
.reserveDetailBox .side .infoBox {
  padding: 45px 0px 0px;
  color: #1f1f1f;
  font-weight: 0.9375rem;
  position: relative;
}
.reserveDetailBox .side .infoBox::before {
  content: "";
  position: absolute;
  display: block;
  left: -20px;
  right: -20px;
  top: 0;
  bottom: -20px;
  z-index: -1;
  background: #fff5f4;
}
.reserveDetailBox .side .infoBox .info {
  color: #52b6cc;
}
.reserveDetailBox .centerBox {
  background: #f3fafb;
  padding: 5% 4%;
  margin-bottom: 5%;
}
.reserveDetailBox .centerBox li {
  padding-left: 20px;
  position: relative;
}
.reserveDetailBox .centerBox li + li {
  margin-top: 20px;
}
.reserveDetailBox .centerBox li::before {
  content: "";
  position: absolute;
  width: 8px;
  height: 8px;
  background: #52b6cc;
  top: 13px;
  left: 0;
  border-radius: 100%;
}
.reserveDetailBox .centerBox li .title {
  font-size: 1.25rem;
}
@media screen and (max-width: 767px) {
.reserveDetailBox .centerBox li .title {
    font-size: 1.125rem;
  }
}
.reserveDetailBox .centerBox li .txt {
  color: #666666;
  font-size: 1.125rem;
  font-weight: 300;
}
@media screen and (max-width: 767px) {
.reserveDetailBox .centerBox li .txt {
    font-size: 1rem;
  }
}
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
.reserveDetailBox .swiper-button::after {
  display: none;
}
.reserveDetailBox .swiper-button::before {
  content: "";
  position: absolute;
  inset: 0;
  display: block;
  background: url("~@/assets/images/m_ar.svg") no-repeat;
  background-position: 58% 50%;
  background-size: 30%;
}
.reserveDetailBox .swiper-button.swiper-button-next {
  right: 0;
}
.reserveDetailBox .swiper-button.swiper-button-prev {
  left: 0;
}
.reserveDetailBox .swiper-button.swiper-button-prev::before {
  transform: rotate(180deg);
}
.reserveDetailBox .evaluateBox {
  margin: 0 -20px 5%;
}
.reserveDetailBox .evaluateBox .swiperBox {
  max-width: 1560px;
  padding: 0 14px;
  margin: 0 auto;
  position: relative;
}
.reserveDetailBox .evaluateBox .item {
  display: flex;
  flex-wrap: wrap;
  padding: 20px 25px;
  border-radius: 15px;
  margin: 10px;
  box-shadow: 0px 0px 10px 2px rgba(0, 0, 0, 0.1);
  position: relative;
}
.reserveDetailBox .evaluateBox .item .tag {
  position: absolute;
  top: 20px;
  right: 45px;
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
}
.reserveDetailBox .evaluateBox .item .tag::before {
  content: "";
  width: 15px;
  height: 14px;
  display: block;
  margin-right: 5px;
  background: url("~@/assets/images/index/icon_star.png");
}
.reserveDetailBox .evaluateBox a,
.reserveDetailBox .evaluateBox .date {
  display: block;
  color: #999999;
  font-size: 0.8125rem;
}
.reserveDetailBox .evaluateBox .title {
  width: 100%;
  font-size: 1.25rem;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}
.reserveDetailBox .evaluateBox .txt {
  width: 100%;
  color: #444444;
  font-size: 1.125rem;
  overflow: hidden;
/*  display: -webkit-box;*/
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}
.reserveDetailBox .bottomBox .title {
  font-size: 1.75rem;
  margin-bottom: 15px;
}
@media screen and (max-width: 1000px) {
.reserveDetailBox .bottomBox .title {
    font-size: 1.25rem;
  }
}
.reserveDetailBox .bottomBox .listBox {
  margin: 0 -5px 2%;
  display: flex;
  flex-wrap: wrap;
}
.reserveDetailBox .bottomBox .listBox .item {
  width: calc(25% - 10px);
  margin: 0 5px 10px;
  aspect-ratio: 1/1;
  line-height: 0;
}
@media screen and (max-width: 1000px) {
.reserveDetailBox .bottomBox .listBox .item {
    width: calc(33.3333333333% - 10px);
  }
}
@media screen and (max-width: 767px) {
.reserveDetailBox .bottomBox .listBox .item {
    width: calc(50% - 10px);
  }
}
.reserveDetailBox .bottomBox .listBox .item.unActive {
  display: none;
}

.reserveDetail .container {
  max-width: 1110px;
}
.reserveDetail .topBox {
  display: flex;
  align-items: flex-start;
  margin-bottom: 5%;
}
@media screen and (max-width: 1000px) {
.reserveDetail .topBox {
    flex-direction: column;
  }
}
.reserveDetail .content {
  flex-grow: 1;
  padding-right: 30px;
  letter-spacing: 2px;
  color: #444444;
  font-size: 1.125rem;
}
@media screen and (max-width: 1000px) {
.reserveDetail .content {
    padding-right: 0;
  }
}
.reserveDetail .content .txtBox {
  margin-bottom: 30px;
  overflow: hidden;
}
@media screen and (max-width: 1000px) {
.reserveDetail .content .txtBox {
    margin-bottom: 20px;
  }
}
.reserveDetail .content .open {
  width: 140px;
  display: block;
  max-width: 300px;
  background: #fff;
  border: #dddddd 1px solid;
  border-radius: 30px;
  padding: 15px;
  font-size: 0.8125rem;
  text-align: center;
  position: relative;
  z-index: 1;
  overflow: hidden;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
}
@media screen and (max-width: 1000px) {
.reserveDetail .content .open {
    margin: 0 auto 10%;
  }
}
.reserveDetail .content .open::after {
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
.reserveDetail .content .open.active,
.reserveDetail .content .open:hover {
  color: #fff;
}
.reserveDetail .content .open.active::after,
.reserveDetail .content .open:hover::after {
  width: 100%;
  left: 0;
}
.reserveDetail .typeBox {
  margin-top: 5%;
  padding-top: 5%;
  border-top: #dddddd 1px solid;
}
.reserveDetail .typeBox .title {
  font-size: 1.75rem;
  margin-bottom: 15px;
}
@media screen and (max-width: 1000px) {
.reserveDetail .typeBox .title {
    font-size: 1.25rem;
  }
}
.reserveDetail .typeBox .listBox {
  margin: 0 -5px;
  display: flex;
  flex-wrap: wrap;
}
.en-app .reserveDetail .typeBox .listBox,
.jp-app .reserveDetail .typeBox .listBox,
.kr-app .reserveDetail .typeBox .listBox {
  gap:10px;
  margin: 0 0 10px;
}
.reserveDetail .typeBox .listBox .item {
  width: calc(12.5% - 10px);
  aspect-ratio: 1/1;
  margin: 0 5px 10px;
  font-size: 0.5rem;
  border-radius: 5px;
  border: #52b6cc 1px solid;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  line-height: 1;
  padding: 5px;
}
.en-app .reserveDetail .typeBox .listBox .item,
.jp-app .reserveDetail .typeBox .listBox .item,
.kr-app .reserveDetail .typeBox .listBox .item {
  width: calc((100% - 10px * 4) / 5);
  text-align: center;
  padding: 10px;
  margin: 0;
  font-size: 1rem;
}
@media screen and (max-width: 1000px) {
  .reserveDetail .typeBox .listBox .item {
    width: calc(20% - 10px);
  }
}
@media screen and (max-width: 767px) {
  .reserveDetail .typeBox .listBox .item {
    font-size: 7px;
  }
  .en-app .reserveDetail .typeBox .listBox .item,
  .jp-app .reserveDetail .typeBox .listBox .item,
  .kr-app .reserveDetail .typeBox .listBox .item {
    width: calc((100% - 10px * 3) / 4);
    font-size: 14px;
    letter-spacing: 0px;
  }
}
@media screen and (max-width: 550px) {
  .en-app .reserveDetail .typeBox .listBox .item,
  .jp-app .reserveDetail .typeBox .listBox .item,
  .kr-app .reserveDetail .typeBox .listBox .item {
    width: calc((100% - 10px * 2) / 3);
  }
}

.viewpoint .topBox {
  position: relative;
  margin-bottom: 2.5%;
  padding: 0 70px;
}
.viewpoint .topBox .swiper {
  max-width: 1520px;
  overflow: hidden;
  margin: 0 auto;
}
.viewpoint .topBox .swiper button {
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
.viewpoint .topBox .swiper-slide-thumb-active button {
  color: #f37a69;
  border-color: #f37a69;
}
.viewpoint .topBox .pic {
  width: 35px;
  aspect-ratio: 1/1;
  border-radius: 100%;
  overflow: hidden;
  margin-right: 10px;
}
.viewpoint .topBox .title {
  padding-top: 4px;
  font-size: 1.3125rem;
}
@media screen and (max-width: 1600px) {
  .viewpoint .topBox .title {
    font-size: 1.125rem;
  }
}
@media screen and (max-width: 1000px) {
  .viewpoint .topBox .title {
    font-size: 1rem;
  }
}

.cat-icon {
  width: 40px;
  aspect-ratio: 1/1;
  margin-bottom: 10px;
  object-fit: contain;
}

.reserveDetailBox .titleBox .avatar {
  line-height: 0;
  width: 127px;
  aspect-ratio: 1/1;
  border: 5px solid #fff;
  border-radius: 100%;
  margin-right: 20px;
  overflow: hidden;
}
@media screen and (max-width:767px){
  .banner {
    height: 300px;
  }
}
@media screen and (max-width:767px){
  .reserveDetailBox .titleBox .avatar {
    width: 100px;
    height: 100px;
  }
  .reserveDetailBox .titleBox .avatar img {
    width: 100px;
    height: 100px;
    object-fit: cover;
  }
}

.reserveDetailBox .titleBox .avatar {
  width: 120px;
  height: 120px;
  object-fit: cover;
}
.reserveDetailBox .titleBox .avatar img {
  width: 120px;
    height: 120px;
    object-fit: cover;
}

.reserveDetail .photographer {
  display: flex;
  align-items: center;
}

.reserveDetail .photographer li {
  position: relative;
    background: #fff;
    padding: 8px 15px 8px 15px;
    border-radius: 30px;
    color: #000;
    font-size: 1rem;
    letter-spacing: 1px;
    border: #dddddd 1px solid;
}
.reserveDetail .photographer li + li {
  /* padding: 0 0 0 20px; */
  margin: 0 0 0 10px;
}


.reserveDetailBox .comment ul {
  display: flex;
  align-items: center;
}

.reserveDetailBox .comment ul li {
  color: #666666;
  margin: 0;
  font-size: 0.875rem;
  position: relative;
}
.reserveDetailBox .comment ul li + li {
  padding: 0 0 0 10px;
  margin: 0 0 0 10px;
}
.reserveDetailBox .comment ul li + li::before {
  content: '';
  position: absolute;
  width: 1px;
  height: 12px;
  top: 50%;
  background: #444;
  transform: translateY(-50%);
  display: block;
  left: 0;
}

</style>
