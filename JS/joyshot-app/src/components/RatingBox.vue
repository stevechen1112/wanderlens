<template>
  <section class="evaluateBox">
    <div class="swiperBox">
      <div class="unitTitle">{{ $t('Components.RatingBox.evaluation_count', { count: allRatings }) }}</div>
      <div class="swiper-button swiper-button-prev"></div>
      <div class="swiper topSwiper" ref="ratingSwiper">
        <div class="listBox swiper-wrapper">

          <div class="swiper-slide" v-for="rating in ratingList" :key="rating.id">
            <div class="item">
              <!-- <div class="tag">{{rating.stars}}</div> -->
              <time class="date">{{rating.createdAt | fmtCDate}}</time>
              <!-- <a href="#">留下評語</a> -->
              <div class="title">{{rating.author}}</div>
              <div class="txt">{{rating.comments}}</div>
            </div>
          </div>

          <!-- <div class="swiper-slide">
            <div class="item">
              <time class="date">2022 年 5 月 1 日</time><a href="#">留下評語</a>
              <div class="title">Emily</div>
              <div class="txt">謝謝攝影師幫我補抓寶寶每個瞬間，孩子真的很難拍這次體驗讓我獲得很多謝謝攝影師幫我補抓寶寶每個瞬間，孩子真的很難拍這次體驗讓我獲得很多謝謝攝影師幫我補抓寶寶每個瞬間，孩子真的很難拍這次體驗讓我獲得很多</div>
            </div>
          </div>
          <div class="swiper-slide">
            <div class="item">
              <time class="date">2022 年 5 月 1 日</time><a href="#">留下評語</a>
              <div class="title">Emily</div>
              <div class="txt">謝謝攝影師幫我補抓寶寶每個瞬間，孩子真的很難拍這次體驗讓我獲得很多謝謝攝影師幫我補抓寶寶每個瞬間，孩子真的很難拍這次體驗讓我獲得很多謝謝攝影師幫我補抓寶寶每個瞬間，孩子真的很難拍這次體驗讓我獲得很多</div>
            </div>
          </div> -->
        </div>
      </div>
      <div class="swiper-button swiper-button-next"></div>
    </div>
  </section>

</template>

<script>

import Swiper from 'swiper'

export default {
	name: 'RatingBox',
  components:{

  },
  data(){
    return {
      pageNum:1,
      pageSize:12,
      total:0,
      ratingList:[],
      allRatings:0
    }
  },
  methods:{
    loadData(){
      let query = {
        pageNum:this.pageNum,
        pageSize:this.pageSize
      }
      this.request.get('/photographer/ratings', {params:query} ).then(res => {
        if (res.code === '200') {
          this.ratingList = res.data.records
        } else {
          this.showResult('error', this.$t('action.get_error', {err: 'error'}))
        }
      })
    },
    loadAll(){
      let query = {}
      this.request.get('/photographer/ratings-all', {params:query} ).then(res => {
        if (res.code === '200') {
          this.allRatings = res.data
        } else {
          this.showResult('error', this.$t('action.get_error', {err: 'error'}))
        }
      })
    }
  },
  mounted(){
    this.loadData()
    this.loadAll()
  },
  watch:{
    //監測 areaList變化時才啟用 swiper
    ratingList:{
      immediate: true,
      handler(newValue, oldValue){

        //頁面的資料有更新且loop展現後，此時的dom都完整了，才初始化swiper
        this.$nextTick(() => {
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
              nextEl: '.evaluateBox .swiper-button-next',
              prevEl: '.evaluateBox .swiper-button-prev',
            },
            breakpoints: {
              760: {
                slidesPerView: 1,
              },
              1000: {
                slidesPerView: 3,
              }
            },
          })
        });

      }
    }
  }
}

</script>

<style scoped>

.evaluateBox .unitTitle {
  font-size: 20px;
  padding: 0 0 0 10px;
  color: #000;
  display: flex;
  align-items: center;
}
.evaluateBox .unitTitle::before {
  content: '';
  width: 15px;
  height: 14px;
  display: block;
  margin-right: 5px;
  background: url('~@/assets/images/index/icon_star.png');
  filter: invert(100%);
}

.evaluateBox {
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 3%;
  background: linear-gradient(to bottom, rgba(246, 246, 246, 1) 0%, rgba(255, 255, 255, 1) 100%);
}

@media screen and (max-width: 1000px) {
  .evaluateBox {
    padding-top: 6%;
    padding-bottom: 6%;
  }
}


.evaluateBox .swiperBox {
  max-width: 1560px;
  padding: 0 16px;
  margin: 0 auto;
  position: relative;
}

.evaluateBox .item {
  display: flex;
  flex-direction: column;
  padding: 20px 50px;
  border-radius: 15px;
  margin: 10px;
  box-shadow: 0px 0px 10px 2px rgba(0, 0, 0, 0.1);
  position: relative;
}

@media screen and (max-width: 1000px) {
.evaluateBox .item {
  padding: 20px 25px;
}
}

.evaluateBox .item .tag {
  position: absolute;
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
  font-family: 'Roboto', Arial, 'Noto Sans TC', '微軟正黑體', 'Microsoft JhengHei', '蘋果儷中黑', 'Apple LiGothic Medium', sans-serif, '0xe804';
  font-weight: 500;
  line-height: 1;
    display:none;
}

 .evaluateBox .item .tag::before {
  content: '';
  width: 15px;
  height: 14px;
  display: block;
  margin-right: 5px;
  background: url('~@/assets/images/index/icon_star.png');
}

.evaluateBox a,
.evaluateBox .date {
  display: block;
  color: #999999;
  font-size: 0.8125rem;
}

.evaluateBox .title {
  /* width: 100%; */
  font-size: 1.25rem;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

.evaluateBox .txt {
  width: 100%;
  color: #444444;
  font-size: 1.125rem;
  overflow: hidden;
/*  display: -webkit-box;*/
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
}
@media screen and (max-width: 1000px) {
  .evaluateBox .txt {
    max-width: 300px;
  }
}
@media screen and (max-width: 500px) {
  .evaluateBox .txt {
    max-width: 200px;
  }
}

.evaluateBox .swiper-button {
  top: 58%;
}
@media screen and (max-width: 1000px) {
  .evaluateBox .swiperBox {
    padding: 0;
  }
  .evaluateBox .swiper-button {
    display: none;
  }
}

</style>
