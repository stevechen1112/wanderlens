<template>
  <section class="shotBox">
    <div class="container">
      <div class="titleBox">
        <h2>{{ $t('home.milestone.title') }}</h2>
        <div class="info">{{ $t('home.milestone.sub_title') }}</div>
      </div>
      <div class="listBox">
        <div class="item" v-for="(service,idx) in serviceList" :key="service.id" v-if="idx<4">
          <a href="#">
            <div class="pic">
              <!-- <img :src="showImage(service.fileUuid)" alt="" /> -->
              <img :src="displayImage(service.featureFile.url)" alt="" />
            </div>
            <div class="infoBox">
              <div class="title">{{ translate(service, "name") }}</div>
              <div class="price">NT${{service.price}}</div>
            </div>
          </a>
        </div>
      </div>

      <div class="listBox" style="margin-top: 25px;">
        <div class="item" v-for="(service,idx) in serviceList" :key="service.id" v-if="idx>=4">
          <a href="#">
            <div class="pic">
              <!-- <img :src="showImage(service.fileUuid)" alt="" /> -->
              <img :src="displayImage(service.featureFile.url)" alt="" />
            </div>
            <div class="infoBox">
              <div class="title">{{ translate(service, "name") }}</div>
              <div class="price">NT${{service.price}}</div>
            </div>
          </a>
        </div>
      </div>


    </div>
  </section>

</template>

<script>

export default {
	name: 'MilestoneBox',
  components:{

  },
  data(){
    return {
      serviceList:[]
    }
  },
  methods:{
    loadService() {

      let query = {
        pageNum: 1,
        pageSize: 10
      }

      this.request.get("/service-cat", {params: query}).then(res => {
        if (res.code === '200') {
          this.serviceList = res.data.records
        } else {
          this.showResult('error', this.$t('action.get_error', {err: 'error'}))
        }
      })
    }
  },
  mounted(){
    this.loadService()
  }
}

</script>

<style scoped>

/*.pic {
  line-height: 0;
}

section {
  padding-bottom: 3%;
}
*/

.mainBox {
  margin-top: 3%;
}
.mainBox .titleBox {
  padding: 3vw 0 2vw;
  text-align: center;
  position: relative;
}
@media screen and (max-width: 1000px) {
  .mainBox .titleBox {
    padding: 9vw 0 4vw;
  }
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

.shotBox .container {
  max-width: 1800px;
}
.shotBox .listBox {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -11px;
}
.shotBox .item {
  width: calc(25% - 22px);
  position: relative;
  margin: 0px 11px;
  border-radius: 15px;
  overflow: hidden;
/*  box-shadow: 0px 0px 10px 2px rgba(0, 0, 0, 0.2);*/
}
.shotBox .item:first-child {
  margin: 0 11px 0 0;
}
.shotBox .item:last-child {
  margin: 0 0 0 11px;
}
@media screen and (max-width: 767px) {
  .shotBox .item {
    width: calc((100% - 20px) / 2);
  }
  .shotBox .item:nth-child(odd) {
    margin: 0 10px 20px 0;
  }
  .shotBox .item:nth-child(even) {
    margin: 0 0 20px 10px;
  }
}
.shotBox .item:hover .pic img {
  transform: scale(1.1);
}
.shotBox .pic {
  overflow: hidden;
}
.shotBox .pic img {
  aspect-ratio: 1/1;
  width: 100%;
  -o-object-fit: contain;
     object-fit: contain;
  transition: all 2s ease;
}
.shotBox .infoBox {
  padding: 7%;
  background: #52b6cc;
  color: #fff;
  display: flex;
  justify-content: space-between;
  line-height: 1;
}
.shotBox .infoBox .title {
  font-size: 1.35rem;
  font-weight: 500;
}
@media screen and (max-width: 1000px) {
  .shotBox .infoBox .title {
    font-size: 1.1rem;
  }
}
.shotBox .infoBox .price {
  font-size: 1.3rem;
  position: relative;
  display: flex;
  align-items: center;
  font-weight: 700;
}
@media screen and (max-width: 1000px) {
  .shotBox .infoBox .price {
    font-size: 1.1rem;
  }
}
.shotBox .infoBox .price::before {
  content: "";
  width: 18px;
  height: 18px;
  display: block;
  background: url("~@/assets/images/icon_price.svg") no-repeat;
  margin-right: 10px;
}
.shotBox .more {
  position: absolute;
  right: 0;
  color: #52b6cc;
  font-size: 1.125rem;
  display: block;
  display: flex;
  align-items: center;
  bottom: 2vw;
}
@media screen and (max-width: 767px) {
  .shotBox .more {
    position: relative;
    justify-content: center;
    margin-top: 20px;
  }
}
.shotBox .more::after {
  content: "";
  width: 18px;
  height: 14px;
  display: block;
  -webkit-mask: url("~@/assets/images/more_arrow.svg") center right no-repeat;
          mask: url("~@/assets/images/more_arrow.svg") center right no-repeat;
  background: #52b6cc;
  margin-left: 10px;
}

.en-app .shotBox .item a,
.jp-app .shotBox .item a {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.en-app .shotBox .item a .infoBox,
.jp-app .shotBox .item a .infoBox {
  flex-grow: 1;
  align-items: center;
}
</style>
