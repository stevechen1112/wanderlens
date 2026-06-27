<template>
	<main class="siteMain orderBox" ref="siteMain" aria-label="main" itemscope>
		<div class="mainBox">

      <div class="titleBox" v-if="order.status === 'pay_success'" >
        <div class=" thankyou">
          <h1 class="pay_success">{{ $t('Views.Thankyou.pay_success') }}</h1>
        </div>
        <div  style="font-size: 18px; margin-bottom: 10px;">
          <div>※ {{ $t('Views.Thankyou.contact_you') }}</div>

          <div class="font-red">※ {{ $t('Views.Thankyou.customer_service') }}</div>
        </div>
        <div class="">
          <el-button @click="joinLine" type="success" class="ml-10 big30">{{ $t('Views.Thankyou.join_line') }}</el-button>
        </div>
      </div>

      <div class="titleBox" v-if="order.status === 'pay_failed'" >
      	<div class=" thankyou">
          <h1 class="pay_failed">{{ $t('Views.Thankyou.pay_failed') }}</h1>
        </div>
        <div class="">
          <div style="font-size:18px">{{ $t('Views.Thankyou.return_code') }} {{ order.rtnCode }}</div>
        </div>
        <div class="" style="margin-top:20px">
          <el-button style="font-size:16px" @click="joinLine" type="success" icon="el-icon-chat-dot-round" >{{ $t('Views.Thankyou.check_reason') }}</el-button>
        </div>
      </div>


      <div class="container">
          <div class="order">


            <div class="topBox">
              <div class="item">
                <div class="title">{{ $t('Views.Thankyou.order_no') }}</div>
                <div class="">{{order.orderNo}}</div>
              </div>
              <div class="item">
                <div class="title">{{ $t('Views.Thankyou.name') }}</div>
                <div class="">{{order.customerName}}</div>
              </div>
              <div class="item">
                <div class="title">{{ $t('Views.Thankyou.phone') }}</div>
                <div class="">{{order.customerPhone}}</div>
              </div>
              <div class="item">
                <div class="title">{{ $t('Views.Thankyou.contact_time') }}</div>
                <div class="">{{order.contactTime}}</div>
              </div>
              <div class="item">
                <div class="title">Email</div>
                <div class="">{{order.email}}</div>
              </div>
            </div>

            <div class="topBox">
              <div class="item">
                <div class="title">{{ $t('Views.Thankyou.date') }}</div>
                <div class="txt">{{order.shootingDate}}</div>
              </div>
              <div class="item">
                <div class="title">{{ $t('Views.Thankyou.time') }}</div>
                <div class="txt">{{order.shootingTime}}</div>
              </div>
              <div class="item">
                <div class="title">{{ $t('Views.Thankyou.hours') }}</div>
                <div class="txt">{{order.shootingDuration}}</div>
              </div>
              <div class="item">
                <div class="title">{{ $t('Views.Thankyou.people') }}</div>
                <div class="txt">{{order.shootingPersons}}</div>
              </div>
            </div>
          </div>


        </div>
    </div>
	</main>

</template>

<script>

export default {
	name: 'Thankyou',
	components:{

	},
	data(){
		return {
			uuid: '',
			order:{}
		}
	},
	methods:{
		loadOrder(tradeNo) {
			this.request.get('/order/info/'+tradeNo).then(res => {

        if (res.code === '200') {
         this.order = res.data
        } else{
          const message = this.$t('Views.Thankyou.load_transaction_failed')
          this.showResult('error', message)
        }
      })
		},
    joinLine(){
      window.open("https://lin.ee/9Hdd4Dl", "_blank")
    }
	},
	mounted(){
		console.log('Thankyou mounted')
		this.tradeNo = this.$route.params.tradeNo
		this.loadOrder(this.tradeNo)
	}
}

</script>

<style scoped>

/*override Home css*/
.mainBox{
  padding-top: 0 !important;
  padding-bottom: 60px !important;
}


/**********/
.noticeBox {
  top: 0 !important;
  position: relative !important;
}
.noticeBox .container {
  display: block !important;
}

.orderBox .container {
  display: flex;
  align-items: flex-start;
}
@media screen and (max-width: 1000px) {
  .orderBox .container {
    flex-direction: column;
  }
}

.order {
  flex-grow: 1;
  margin: 0 20px 0 0;
}
@media screen and (max-width: 1000px) {
  .order {
    margin: 0 0 20px 0;
    width: 100%;
  }
}
.order .topBox,
.order .bottomBox {
  padding: 10px 25px;
  border-radius: 5px;
  border: 1px solid #ddd;
  background: #fff;
  font-size: 1.125rem;
}
.order .topBox .title,
.order .bottomBox .title {
  color: #000000;
  font-size: 1.25rem;
  margin-bottom: 5px;
}
@media screen and (max-width: 1000px) {
  .order .topBox .title,
.order .bottomBox .title {
    font-size: 1.125rem;
  }
}
.order .topBox {
  margin-bottom: 15px;
}
.order .topBox .item {
  padding: 10px 0;
}
.order .topBox .item + .item {
  border-top: 1px solid #ddd;
}
.order .topBox .item .txt {
  position: relative;
  padding-left: 30px;
}
.order .topBox .item .txt::before {
  content: "";
  width: 17px;
  height: 21px;
  display: block;
  background: url("~@/assets/images/order_icon.png");
  background-position: 0 0;
  position: absolute;
  left: 2px;
  top: 3px;
}
.order .topBox .item:nth-child(2) .txt::before {
  background-position: -17px 0;
}
.order .topBox .item:nth-child(3) .txt::before {
  background-position: -34px 0;
}
.order .bottomBox .item {
  margin-bottom: 20px;
}
.order .bottomBox .item .txt {
  position: relative;
  padding-left: 30px;
}
.order .bottomBox .item .txt::before {
  content: "";
  width: 17px;
  height: 21px;
  display: block;
  background: url("~@/assets/images/order_icon.png");
  background-position: -51px 0;
  position: absolute;
  left: 2px;
  top: 3px;
}

.pay_success {
	color: green;
}
.pay_failed {
	color: red;
}
.big30 {
  font-size: 30px;
}
.font-red {
  color: red;
}
</style>


