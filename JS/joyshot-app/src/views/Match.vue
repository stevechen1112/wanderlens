<template>
  <main class="siteMain reserveBox" ref="siteMain" aria-label="main" itemscope>
    <div class="banner">
      <NoticeBox />


      <div class="titleBox">
        <h1>{{ $t('Views.Match.profession') }}</h1>
        <div class="info">{{ $t('Views.Match.match_count', { count: photographerList.length })}}</div>
        <div>{{ $t('Views.Match.film_time') }}－{{searchCondition.query_date}} {{searchCondition.query_hour}}:{{searchCondition.query_minute}}</div>
        <div>{{ $t('Views.Match.film_location') }}－{{searchCondition.query_location}}</div>
      </div>
    </div>
    <div class="mainBox reserve">
      <div class="container">
        <div class="listBox">

          <div class="item" v-for="(item,idx) in photographerList" :key="idx">
            <div class="pic" @click.stop="showPhotographer(item)">
              <img v-if="item.bannerImg" :src="showImage(item.bannerImg)" alt="" style="object-fit: fill;" />
            </div>
            <div class="infoBox" @click.stop="showPhotographer(item)">
              <div class="title">{{ translate(item, "nickName", true) }}</div>
              <div class="city">{{ translate(item, "city") }}</div>
              <div class="headPic">
                <img v-lazy="showImage(item.avatar)" class="p-avatar"/>
              </div>
              <div class="infoBottom">
                <div class="comment">
                  <!-- <div class="tag"></div> -->
                  <!-- <p>??則評論</p> -->
                </div>
                <div class="priceBox">
                  <div :prefix="$t('css.content.shooting_fee')" class="list">${{item.order.serviceFee}}</div>
                  <div :prefix="$t('css.content.transportation_fee')" class="list">
                    <del>${{item.order.transportationFeeOnCustomer}}</del>
                    ${{item.order.transportationFeeCustomerActualPay}}
                  </div>
                  <div :prefix="$t('css.content.total')" class="list">TWD${{item.order.total}}</div>
                </div>
              </div>
            </div>
            <a @click.stop="bookNow(item)">{{ $t('Views.Match.booking_now') }}</a>
          </div>


        </div>
      </div>
    </div>


    <el-dialog :title="$t('Views.Match.booking_result')"
               :visible.sync="dialogFormVisible"
               width="50%"
               @close="closeDialog" class="search-result">

      <div style="text-align:center">
        <h1>{{ $t('Views.Match.period_full') }}</h1>
        <h2 class="mt-10">{{ $t('Views.Match.recommend_others') }}</h2>
        <span slot="footer" class="dialog-footer">
          <el-button class="mt-10" type="primary" @click="queryOtherPhotographer">{{ $t('Views.Match.check_others') }}</el-button>
        </span>
      </div>

    </el-dialog>

  </main>
</template>

<script>

import {mapState} from 'vuex'
import NoticeBox from '@/components/NoticeBox.vue'

export default {
  name: 'Match',
  components:{
    NoticeBox
  },
  data(){
    return {
      dialogFormVisible:false,
      searchParam:{},
      photographerList:[],
      reserved:'n'
    }
  },
  computed:{
    //從store讀出查詢條件
    ...mapState('jsapp',['searchCondition'])
  },
  methods:{
    queryOtherPhotographer(){
      this.dialogFormVisible = false
      this.reserved = 'n'
      this.searchCondition.query_assign_ph_uuid = ''
      this.searchCondition.query_assign_photographer = ''
      this.searchPhotographer()
    },
    closeDialog(){

    },
    handleBodyClick(){
      this.$emit('appInSearchMode',  {mode:''})
    },
    bookNow(rowData){
      //把查詢條件放store
      console.log(rowData)

      fbq('track', 'AddToCart');


      this.$store.commit('jsapp/SAVE_PRE_ORDER', rowData)
      this.$router.push('/checkout').catch(()=>{})
    },
    showPhotographer(rowData){
      // alert('Match showPhotographer:')
      console.log('Match showPhotographer:', rowData)

      this.$store.commit('jsapp/SAVE_PREVIEW_MATCHED_PHOTOGRAPHER', rowData)


      setTimeout(()=>{

      //   const routeData = this.$router.resolve({name: 'routeName', query: {data: "someData"}});
      // window.open(routeData.href, '_blank');

        this.$router.push('/matched-photographer/'+rowData.phUuid).catch(()=>{})
      },1000)


    },

    /**依條件查詢攝影師**/
    searchPhotographer() {
      if (Object.keys(this.searchCondition).length > 0) {
        const wait = this.$t('Views.Match.wait')
        const loading = this.$loading({
            lock: true,
            text: wait,
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });

        console.log('this.searchCondition:', Object.keys(this.searchCondition).length)
        this.request.post('/search/photographer', this.searchCondition).then(res => {

          console.log('searchPhotographer:', res.data)
          loading.close()
          if (res.code === '200') {

            console.log('reserved=', this.reserved)


            if (this.reserved === 'y') {//指定攝影師
              if(res.data && res.data.length>0){
                this.bookNow(res.data[0])
              } else {
                //指定攝影師的條件不符合，提示是否顯示其它攝影師
                this.dialogFormVisible = true

              }
            } else {
              this.photographerList = res.data
            }
          } else {

            this.$bus.$emit('HeaderInSearchMode', {mode:'searchOpen', name:'', ph_uuid:''})
            this.$emit('appInSearchMode', {mode:'searchOpen'})
            //this.showResult('error', this.$t('action.get_error', {err: 'error'}))
          }
        })
      } else {
        this.$bus.$emit('HeaderInSearchMode', {mode:'searchOpen', name:'', ph_uuid:''})
        this.$emit('appInSearchMode', {mode:'searchOpen'})
      }
    }

  },
  mounted(){
    this.$refs.siteMain.addEventListener('click', this.handleBodyClick);
    this.searchPhotographer()
    this.reserved = this.$route.query.reserved
  },
  /**監視如果網址有異動，表示有重新查詢**/
  watch:{
    $route(newValue, oldValue) {
      console.log('查詢網址有異動有變動:')

      //從store取得查詢條件


      //清前次的條件
      this.searchParam = {}

      //重新收集條件
      // Object.assign(this.searchParam, this.$route.query)
      // console.log(this.searchParam)


      //把條件寫store
      //  this.$store.commit('jsapp/SAVE_SEARCH_CONDITION', this.form)

      //trigger query
      this.searchPhotographer()

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

.reserveBox .banner {
  min-height: 360px;
}
@media screen and (max-width: 1000px) {
.reserveBox .banner {
    min-height: 200px;
  }
}
.reserveBox .banner .titleBox {
  position: absolute;
  inset: 50px 20px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #fff;
  z-index: 2;
}
.reserveBox .banner .titleBox h1 {
  font-size: 2.625rem;
  padding: 0;
  margin: 0 0 0px 0;
}
@media screen and (max-width: 1000px) {
.reserveBox .banner .titleBox h1 {
    font-size: 1.875rem;
  }
}
.reserveBox .banner .titleBox .info {
  font-size: 1.5rem;
}
@media screen and (max-width: 1000px) {
.reserveBox .banner .titleBox .info {
    font-size: 1.375rem;
  }
}
.reserveBox .container {
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
/*  background: url("~@/assets/images/index/icon_star.png");*/
  background: url("~@/assets/images/index/lens.png");
}
.reserve .listBox .infoBottom .comment p {
  color: #666666;
  margin: 0;
  padding: 0;
  font-size: 0.875rem;
}
.reserve .listBox .infoBottom .priceBox {
  width: 60%;
}
.reserve .listBox .infoBottom .priceBox .list {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 500;
  color: #202020;
  font-size: 0.9375rem;
  line-height: 1.8;
}
.reserve .listBox .infoBottom .priceBox .list::before {
  font-weight: normal;
}
.reserve .listBox .infoBottom .priceBox .list:nth-child(1)::before {
  content: attr(prefix);
}
.reserve .listBox .infoBottom .priceBox .list:nth-child(2)::before {
  content: attr(prefix);
}
.reserve .listBox .infoBottom .priceBox .list:nth-child(3) {
  color: #f37a69;
  font-size: 1.3125rem;
  font-weight: 700;
  line-height: 1.2;
}
@media screen and (max-width: 1000px) {
.reserve .listBox .infoBottom .priceBox .list:nth-child(3) {
    font-size: 1.125rem;
  }
}
.reserve .listBox .infoBottom .priceBox .list:nth-child(3)::before {
  font-size: 0.9375rem;
  color: #202020;
  content: attr(prefix);
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

.reserveBox .banner {
  min-height: 360px;
}
@media screen and (max-width: 1000px) {
  .reserveBox .banner {
    min-height: 200px;
  }
}
.reserveBox .banner .titleBox {
  position: absolute;
  inset: 50px 20px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #fff;
  z-index: 2;
}
.reserveBox .banner .titleBox h1 {
  font-size: 2.625rem;
  padding: 0;
  margin: 0 0 0px 0;
}
@media screen and (max-width: 1000px) {
  .reserveBox .banner .titleBox h1 {
    font-size: 1.875rem;
  }
}
.reserveBox .banner .titleBox .info {
  font-size: 1.5rem;
}
@media screen and (max-width: 1000px) {
  .reserveBox .banner .titleBox .info {
    font-size: 1.375rem;
  }
}

.infoBox:hover,
.pic:hover {
  cursor: pointer;
}

.search-result >>> .el-dialog {
  border-radius: 12px;
}

.search-result >>> .el-button.el-button--primary {
  background-color: #F17B6D;
  border-color: #F17B6D;
  border-radius: 999px;
  padding: 16px 40px;
  font-size: 18px;
}

.search-result >>> h1{
  font-size: 34px;
}

.search-result >>> h2{
  margin: 24px 0;
  font-weight: 400;
}

.listBox .infoBox .headPic {
  line-height: 0;
  width: 127px;
  aspect-ratio: 1/1;
  border: 5px solid #fff;
  border-radius: 100%;
  overflow: hidden;
  position: absolute;
  right: 10px;
  bottom: 170px;
  z-index: 9;
}

@media screen and (max-width: 1500px) {
  .listBox .infoBox .headPic {
    width: 100px;
  }
}
@media screen and (max-width:767px){
  .listBox .infoBox .headPic {
    width: 75px;
  }
}
</style>
