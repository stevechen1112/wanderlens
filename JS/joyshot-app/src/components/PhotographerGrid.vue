<template>
	<div class="listBox" v-if="list && list.length>0">
    <div class="item" v-for="(p,idx) in list" :key="p.id" v-if="idx < limit">
      <div class="pic">
        <img v-lazy="showImage(p.bannerImg)" @click="showDetail(p.phUuid)" class="p-avatar"/>
      </div>
      <div class="infoBox" @click.stop="showDetail(p.phUuid)">
        <div class="title">{{ translate(p, "nickName", true) }}</div>
        <div class="city">{{ translate(p, "city") }}</div>
        <div class="headPic">
          <img v-lazy="showImage(p.avatar)" class="p-avatar"/>
        </div>
        <div class="infoBottom" v-if="showBooking">
          <div class="comment">
            <div class="tag">{{p.rating}}</div>
          </div>
          <div class="priceBox">
            <div class="list"></div>
          </div>
        </div>
      </div>
      <a href="#" @click="bookMe(p.phUuid)" v-if="showBooking">{{ $t('Components.PhotographerGrid.check') }}</a>
    </div>
  </div>
</template>



<script>

export default {
	name: 'PhotographerGrid',
	components:{

	},
	props:['list', 'showBooking', 'limit'],
	data(){
		return {

		}
	},
	methods:{
		showDetail(pid){
      this.$emit('photographerDetail', pid)
		},
    bookMe(pid){

    }
	},
	mounted(){

	}
}

</script>

<style scoped>

.listBox .infoBox .headPic {
  line-height: 0;
  width: 127px;
  aspect-ratio: 1/1;
  border: 5px solid #fff;
  border-radius: 100%;
  overflow: hidden;
  position: absolute;
  right: 10px;
  bottom: 10px;
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

.viewpointBox .banner,
.reserveBox .banner {
  min-height: 360px;
}
@media screen and (max-width: 1000px) {
  .viewpointBox .banner,
.reserveBox .banner {
    min-height: 200px;
  }
}
.viewpointBox .banner .titleBox,
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
.viewpointBox .banner .titleBox h1,
.reserveBox .banner .titleBox h1 {
  font-size: 2.625rem;
  padding: 0;
  margin: 0 0 0px 0;
}
@media screen and (max-width: 1000px) {
  .viewpointBox .banner .titleBox h1,
.reserveBox .banner .titleBox h1 {
    font-size: 1.875rem;
  }
}
.viewpointBox .banner .titleBox .info,
.reserveBox .banner .titleBox .info {
  font-size: 1.5rem;
}
@media screen and (max-width: 1000px) {
  .viewpointBox .banner .titleBox .info,
.reserveBox .banner .titleBox .info {
    font-size: 1.375rem;
  }
}
.viewpointBox .container,
.reserveBox .container {
  max-width: 1720px;
}

.viewpoint .bottomBox .listBox,
.reserve .listBox {
  background: #fff;
  display: flex;
  flex-wrap: wrap;
  margin: 0 -13px;
  padding-bottom: 2%;
}
@media screen and (max-width: 1400px) {
  .viewpoint .bottomBox .listBox,
.reserve .listBox {
    margin: 0 0px 2%;
  }
}
.viewpoint .bottomBox .listBox .item,
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
  .viewpoint .bottomBox .listBox .item,
.reserve .listBox .item {
    width: calc(33.3333333333% - 20px);
    margin: 0px 10px 20px;
  }
}
@media screen and (max-width: 1000px) {
  .viewpoint .bottomBox .listBox .item,
.reserve .listBox .item {
    width: calc(50% - 20px);
  }
}
@media screen and (max-width: 600px) {
  .viewpoint .bottomBox .listBox .item,
.reserve .listBox .item {
    width: 100%;
    max-width: 410px;
    margin: 0px auto 20px;
  }
}
.viewpoint .bottomBox .listBox .item:hover .pic img,
.reserve .listBox .item:hover .pic img {
  transform: scale(1.1);
}
.viewpoint .bottomBox .listBox .item.unActive,
.reserve .listBox .item.unActive {
  display: none;
}
.viewpoint .bottomBox .listBox .pic,
.reserve .listBox .pic {
  overflow: hidden;
}
.viewpoint .bottomBox .listBox .pic img,
.reserve .listBox .pic img {
  aspect-ratio: 41/27;
  width: 100%;
  -o-object-fit: contain;
     object-fit: contain;
  transition: all 2s ease;
}
.viewpoint .bottomBox .listBox .infoBox,
.reserve .listBox .infoBox {
  padding: 20px 25px;
  background: #fff;
}
.viewpoint .bottomBox .listBox .infoBox .title,
.reserve .listBox .infoBox .title {
  color: #333333;
  font-size: 1.5rem;
  font-weight: 500;
  line-height: 1.2;
  position: relative;
}
@media screen and (max-width: 1300px) {
  .viewpoint .bottomBox .listBox .infoBox .title,
.reserve .listBox .infoBox .title {
    font-size: 1.25rem;
  }
}
@media screen and (max-width: 1000px) {
  .viewpoint .bottomBox .listBox .infoBox .title,
.reserve .listBox .infoBox .title {
    font-size: 1.125rem;
  }
}
.viewpoint .bottomBox .listBox .infoBox .title::before,
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
.viewpoint .bottomBox .listBox .infoBox .city,
.reserve .listBox .infoBox .city {
  color: #666666;
  font-size: 1.125rem;
}
@media screen and (max-width: 1300px) {
  .viewpoint .bottomBox .listBox .infoBox .city,
.reserve .listBox .infoBox .city {
    font-size: 1rem;
  }
}
.viewpoint .bottomBox .listBox .infoBottom,
.reserve .listBox .infoBottom {
  display: flex;
  justify-content: space-between;
  padding-top: 15px;
  margin-top: 15px;
  border-top: #dddddd 1px solid;
}
.viewpoint .bottomBox .listBox .infoBottom .comment .tag,
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
.viewpoint .bottomBox .listBox .infoBottom .comment .tag::before,
.reserve .listBox .infoBottom .comment .tag::before {
  content: "";
  width: 15px;
  height: 14px;
  display: block;
  margin-right: 5px;
  background: url("~@/assets/images/index/icon_star.png");
}
.viewpoint .bottomBox .listBox .infoBottom .comment p,
.reserve .listBox .infoBottom .comment p {
  color: #666666;
  margin: 0;
  padding: 0;
  font-size: 0.875rem;
}
.viewpoint .bottomBox .listBox .infoBottom .priceBox,
.reserve .listBox .infoBottom .priceBox {
  width: 60%;
}
.viewpoint .bottomBox .listBox .infoBottom .priceBox .list,
.reserve .listBox .infoBottom .priceBox .list {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 500;
  color: #202020;
  font-size: 0.9375rem;
  line-height: 1.8;
}
.viewpoint .bottomBox .listBox .infoBottom .priceBox .list::before,
.reserve .listBox .infoBottom .priceBox .list::before {
  font-weight: normal;
}
.viewpoint .bottomBox .listBox .infoBottom .priceBox .list:nth-child(1)::before,
.reserve .listBox .infoBottom .priceBox .list:nth-child(1)::before {
  content: "每小時拍攝費??";
}
.viewpoint .bottomBox .listBox .infoBottom .priceBox .list:nth-child(2)::before,
.reserve .listBox .infoBottom .priceBox .list:nth-child(2)::before {
  content: "交通費";
}
.viewpoint .bottomBox .listBox .infoBottom .priceBox .list:nth-child(3),
.reserve .listBox .infoBottom .priceBox .list:nth-child(3) {
  color: #f37a69;
  font-size: 1.3125rem;
  font-weight: 700;
  line-height: 1.2;
}
@media screen and (max-width: 1000px) {
  .viewpoint .bottomBox .listBox .infoBottom .priceBox .list:nth-child(3),
.reserve .listBox .infoBottom .priceBox .list:nth-child(3) {
    font-size: 1.125rem;
  }
}
.viewpoint .bottomBox .listBox .infoBottom .priceBox .list:nth-child(3)::before,
.reserve .listBox .infoBottom .priceBox .list:nth-child(3)::before {
  font-size: 0.9375rem;
  color: #202020;
  content: "總金額";
}
.viewpoint .bottomBox .listBox a,
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
  .viewpoint .bottomBox .listBox a,
.reserve .listBox a {
    font-size: 1.125rem;
  }
}
.viewpoint .bottomBox .listBox a::before,
.reserve .listBox a::before {
  content: "";
  position: absolute;
  z-index: -1;
  inset: 0;
  display: block;
  background: linear-gradient(to right, rgb(243, 250, 251) 0%, rgb(230, 247, 255) 100%);
  transition: all 0.3s ease;
}
.viewpoint .bottomBox .listBox a::after,
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
.viewpoint .bottomBox .listBox a:hover,
.reserve .listBox a:hover {
  color: #fff;
}
.viewpoint .bottomBox .listBox a:hover::before,
.reserve .listBox a:hover::before {
  opacity: 0;
}
.viewpoint .bottomBox .listBox a:hover::after,
.reserve .listBox a:hover::after {
  background: #fff;
}

.viewpointDetailBox .banner,
.reserveDetailBox .banner {
  aspect-ratio: 1920/550;
}
.viewpointDetailBox .titleBox,
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
}
.viewpointDetailBox .titleBox h1,
.reserveDetailBox .titleBox h1 {
  font-size: 3.375rem;
  padding: 0;
  margin: 0 0 0px 0;
  line-height: 1.2;
}
@media screen and (max-width: 1000px) {
  .viewpointDetailBox .titleBox h1,
.reserveDetailBox .titleBox h1 {
    font-size: 2.125rem;
  }
}
.viewpointDetailBox .titleBox .info,
.reserveDetailBox .titleBox .info {
  font-size: 1.5rem;
}
@media screen and (max-width: 1000px) {
  .viewpointDetailBox .titleBox .info,
.reserveDetailBox .titleBox .info {
    font-size: 1.375rem;
  }
}
.viewpointDetailBox .mainBox,
.reserveDetailBox .mainBox {
  padding-top: 15px !important;
}
.viewpointDetailBox .comment,
.reserveDetailBox .comment {
  max-width: 1150px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  margin: 0 auto 30px;
}
.viewpointDetailBox .comment .tag,
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
.viewpointDetailBox .comment .tag::before,
.reserveDetailBox .comment .tag::before {
  content: "";
  width: 15px;
  height: 14px;
  display: block;
  margin-right: 5px;
  background: url("~@/assets/images/index/icon_star.png");
}
.viewpointDetailBox .comment p,
.reserveDetailBox .comment p {
  color: #666666;
  margin: 0;
  padding: 2px 0 0;
  font-size: 0.875rem;
}
.viewpointDetailBox .side,
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
  .viewpointDetailBox .side,
.reserveDetailBox .side {
    width: 100%;
  }
}
.viewpointDetailBox .side .conBox,
.reserveDetailBox .side .conBox {
  position: relative;
  z-index: 2;
  margin-bottom: 10px;
}
.viewpointDetailBox .side .conBox .listBox + .listBox,
.reserveDetailBox .side .conBox .listBox + .listBox {
  padding-top: 10px;
  margin-top: 15px;
  border-top: #dddddd 1px solid;
}
.viewpointDetailBox .side .conBox .listBox .item,
.reserveDetailBox .side .conBox .listBox .item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 1.125rem;
  color: #1f1f1f;
}
.viewpointDetailBox .side .conBox .listBox .item::before,
.reserveDetailBox .side .conBox .listBox .item::before {
  letter-spacing: 2px;
}
.viewpointDetailBox .side .conBox .listBox:nth-child(1) .item:nth-child(1)::before,
.reserveDetailBox .side .conBox .listBox:nth-child(1) .item:nth-child(1)::before {
  content: "拍攝費";
}
.viewpointDetailBox .side .conBox .listBox:nth-child(1) .item:nth-child(2)::before,
.reserveDetailBox .side .conBox .listBox:nth-child(1) .item:nth-child(2)::before {
  content: "交通費";
}
.viewpointDetailBox .side .conBox .listBox:nth-child(2) .item,
.reserveDetailBox .side .conBox .listBox:nth-child(2) .item {
  font-weight: 700;
  font-size: 1.5rem;
  color: #f37a69;
}
.viewpointDetailBox .side .conBox .listBox:nth-child(2) .item::before,
.reserveDetailBox .side .conBox .listBox:nth-child(2) .item::before {
  content: "總金額";
  font-weight: 700;
  font-size: 1.125rem;
  color: #1f1f1f;
}
.viewpointDetailBox .side button,
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
.viewpointDetailBox .side button::after,
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
.viewpointDetailBox .side .infoBox,
.reserveDetailBox .side .infoBox {
  padding: 45px 0px 0px;
  color: #1f1f1f;
  font-weight: 0.9375rem;
  position: relative;
}
.viewpointDetailBox .side .infoBox::before,
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
.viewpointDetailBox .side .infoBox .info,
.reserveDetailBox .side .infoBox .info {
  color: #52b6cc;
}
.viewpointDetailBox .centerBox,
.reserveDetailBox .centerBox {
  background: #f3fafb;
  padding: 5% 4%;
  margin-bottom: 5%;
}
.viewpointDetailBox .centerBox li,
.reserveDetailBox .centerBox li {
  padding-left: 20px;
  position: relative;
}
.viewpointDetailBox .centerBox li + li,
.reserveDetailBox .centerBox li + li {
  margin-top: 20px;
}
.viewpointDetailBox .centerBox li::before,
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
.viewpointDetailBox .centerBox li .title,
.reserveDetailBox .centerBox li .title {
  font-size: 1.25rem;
}
@media screen and (max-width: 767px) {
  .viewpointDetailBox .centerBox li .title,
.reserveDetailBox .centerBox li .title {
    font-size: 1.125rem;
  }
}
.viewpointDetailBox .centerBox li .txt,
.reserveDetailBox .centerBox li .txt {
  color: #666666;
  font-size: 1.125rem;
  font-weight: 300;
}
@media screen and (max-width: 767px) {
  .viewpointDetailBox .centerBox li .txt,
.reserveDetailBox .centerBox li .txt {
    font-size: 1rem;
  }
}

.viewpointDetailBox .evaluateBox,
.reserveDetailBox .evaluateBox {
  margin: 0 -20px 5%;
}
.viewpointDetailBox .evaluateBox .item,
.reserveDetailBox .evaluateBox .item {
  display: flex;
  flex-wrap: wrap;
  padding: 20px 50px;
  border-radius: 15px;
  margin: 10px;
  box-shadow: 0px 0px 10px 2px rgba(0, 0, 0, 0.1);
  position: relative;
}
.viewpointDetailBox .evaluateBox .item .tag,
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
.viewpointDetailBox .evaluateBox .item .tag::before,
.reserveDetailBox .evaluateBox .item .tag::before {
  content: "";
  width: 15px;
  height: 14px;
  display: block;
  margin-right: 5px;
  background: url("~@/assets/images/index/icon_star.png");
}
.viewpointDetailBox .evaluateBox a,
.viewpointDetailBox .evaluateBox .date,
.reserveDetailBox .evaluateBox a,
.reserveDetailBox .evaluateBox .date {
  display: block;
  color: #999999;
  font-size: 0.8125rem;
}
.viewpointDetailBox .evaluateBox .title,
.reserveDetailBox .evaluateBox .title {
  width: 100%;
  font-size: 1.25rem;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}
.viewpointDetailBox .evaluateBox .txt,
.reserveDetailBox .evaluateBox .txt {
  width: 100%;
  color: #444444;
  font-size: 1.125rem;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}
.viewpointDetailBox .bottomBox .title,
.reserveDetailBox .bottomBox .title {
  font-size: 1.75rem;
  margin-bottom: 15px;
}
@media screen and (max-width: 1000px) {
  .viewpointDetailBox .bottomBox .title,
.reserveDetailBox .bottomBox .title {
    font-size: 1.25rem;
  }
}
.viewpointDetailBox .bottomBox .listBox,
.reserveDetailBox .bottomBox .listBox {
  margin: 0 -5px 2%;
  display: flex;
  flex-wrap: wrap;
}
.viewpointDetailBox .bottomBox .listBox .item,
.reserveDetailBox .bottomBox .listBox .item {
  width: calc(25% - 10px);
  margin: 0 5px 10px;
  aspect-ratio: 1/1;
  line-height: 0;
}
@media screen and (max-width: 1000px) {
  .viewpointDetailBox .bottomBox .listBox .item,
.reserveDetailBox .bottomBox .listBox .item {
    width: calc(33.3333333333% - 10px);
  }
}
@media screen and (max-width: 767px) {
  .viewpointDetailBox .bottomBox .listBox .item,
.reserveDetailBox .bottomBox .listBox .item {
    width: calc(50% - 10px);
  }
}
.viewpointDetailBox .bottomBox .listBox .item.unActive,
.reserveDetailBox .bottomBox .listBox .item.unActive {
  display: none;
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

.viewpointDetail .container,
.reserveDetail .container {
  max-width: 1110px;
}
.viewpointDetail .topBox,
.reserveDetail .topBox {
  display: flex;
  align-items: flex-start;
  margin-bottom: 5%;
}
@media screen and (max-width: 1000px) {
  .viewpointDetail .topBox,
.reserveDetail .topBox {
    flex-direction: column;
  }
}
.viewpointDetail .content,
.reserveDetail .content {
  flex-grow: 1;
  padding-right: 30px;
  letter-spacing: 2px;
  color: #444444;
  font-size: 1.125rem;
}
@media screen and (max-width: 1000px) {
  .viewpointDetail .content,
.reserveDetail .content {
    padding-right: 0;
  }
}
.viewpointDetail .content .txtBox,
.reserveDetail .content .txtBox {
  margin-bottom: 30px;
  overflow: hidden;
}
@media screen and (max-width: 1000px) {
  .viewpointDetail .content .txtBox,
.reserveDetail .content .txtBox {
    margin-bottom: 20px;
  }
}
.viewpointDetail .content .open,
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
  .viewpointDetail .content .open,
.reserveDetail .content .open {
    margin: 0 auto 10%;
  }
}
.viewpointDetail .content .open::after,
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
.viewpointDetail .content .open.active, .viewpointDetail .content .open:hover,
.reserveDetail .content .open.active,
.reserveDetail .content .open:hover {
  color: #fff;
}
.viewpointDetail .content .open.active::after, .viewpointDetail .content .open:hover::after,
.reserveDetail .content .open.active::after,
.reserveDetail .content .open:hover::after {
  width: 100%;
  left: 0;
}
.viewpointDetail .typeBox,
.reserveDetail .typeBox {
  margin-top: 5%;
  padding-top: 5%;
  border-top: #dddddd 1px solid;
}
.viewpointDetail .typeBox .title,
.reserveDetail .typeBox .title {
  font-size: 1.75rem;
  margin-bottom: 15px;
}
@media screen and (max-width: 1000px) {
  .viewpointDetail .typeBox .title,
.reserveDetail .typeBox .title {
    font-size: 1.25rem;
  }
}
.viewpointDetail .typeBox .listBox,
.reserveDetail .typeBox .listBox {
  margin: 0 -5px;
  display: flex;
  flex-wrap: wrap;
}
.viewpointDetail .typeBox .listBox .item,
.reserveDetail .typeBox .listBox .item {
  width: calc(12.5% - 10px);
  aspect-ratio: 1/1;
  margin: 0 5px 10px;
  font-size: 1.125rem;
  border-radius: 5px;
  border: #52b6cc 1px solid;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  line-height: 1;
  padding: 5px;
}
@media screen and (max-width: 1000px) {
  .viewpointDetail .typeBox .listBox .item,
.reserveDetail .typeBox .listBox .item {
    width: calc(20% - 10px);
  }
}
@media screen and (max-width: 767px) {
  .viewpointDetail .typeBox .listBox .item,
.reserveDetail .typeBox .listBox .item {
    font-size: 1rem;
  }
}
.viewpointDetail .typeBox .listBox .item::before,
.reserveDetail .typeBox .listBox .item::before {
  content: "";
  display: block;
  background: url("~@/assets/images/in/photographer_icon.svg");
  width: 40px;
  aspect-ratio: 1/1;
  margin-bottom: 10px;
}

.viewpoint .topBox {
  position: relative;
  margin-bottom: 2.5%;
  padding: 0 70px;
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

.viewpointDetail .side {
  padding: 20px;
}
.viewpointDetail .side .conBox {
  position: relative;
  z-index: 2;
  margin-bottom: 10px;
}
.viewpointDetail .side .conBox .listBox + .listBox {
  padding-top: 10px;
  margin-top: 15px;
  border-top: #dddddd 1px solid;
}
.viewpointDetail .side .conBox .listBox .item {
  display: block;
}
.viewpointDetail .side .conBox .listBox .item {
  font-weight: 700;
  font-size: 1.75rem;
  color: #f37a69;
}
.viewpointDetail .side .conBox .listBox .item::before {
  content: "每小時拍攝費" !important;
  font-weight: 400;
  font-size: 1.125rem;
  color: #1f1f1f;
  display: block;
}
.viewpointDetail .side button {
  margin: 0 auto;
}

.outLightBox .back {
  width: auto;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 11px 30px;
}
@media screen and (max-width: 1000px) {
  .outLightBox .back {
    font-size: 1.25rem;
  }
}
.outLightBox .back::after {
  content: "";
  width: 18px;
  height: 9px;
  display: block;
  -webkit-mask: url("~@/assets/images/btn_arrow.svg") no-repeat;
          mask: url("~@/assets/images/btn_arrow.svg") no-repeat;
  background: #fff;
  margin-left: 5px;
}/*# sourceMappingURL=search.css.map */


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


.p-avatar {
  object-fit: cover !important;
}

</style>


