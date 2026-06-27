<template>
  <main class="siteMain orderBox" ref="siteMain" aria-label="main" itemscope>
      <!-- <div class="noticeBox">
        <div class="container">春節期間拍攝費用每小時調漲為$1500</div>
      </div> -->
      <div class="mainBox">

        <div id="orderForm" ref="orderForm"></div>


        <div class="titleBox" v-if="orderSubmitted">
          <div class="container thankyou">
            <h1>{{ $t('Views.Checkout.wait') }}</h1>
          </div>
        </div>

        <div class="container">
          <div class="order">
            <form class="formBox" v-show="!orderSubmitted">
              <ul>
                <li class="inputItem wow fadeInUp required" style="visibility: visible; animation-name: fadeInUp;">
                  <label for="customerName">{{ $t('Views.Checkout.name') }}</label>
                  <input type="text" class="inputControl input-field" v-model="form.customerName">
                </li>
                <li class="inputItem wow fadeInUp required" style="visibility: visible; animation-name: fadeInUp;">
                  <label for="customerPhone">{{ $t('Views.Checkout.phone') }}</label>
                  <input type="text" class="inputControl input-field" v-model="form.customerPhone">
                </li>
              </ul>

              <ul>
                <li class="inputItem wow fadeInUp required" style="visibility: visible; animation-name: fadeInUp;">
                  <label for="contactTime">{{ $t('Views.Checkout.contact_time') }}</label>
                  <input type="text" placeholder="ex:10:00~11:00" class="inputControl input-field" v-model="form.contactTime">
                </li>
                <li class="inputItem wow fadeInUp required" style="visibility: visible; animation-name: fadeInUp;">
                  <label for="social" style="width: 0px;">{{ $t('Views.Checkout.contact_social_media') }}</label>
                  <select class="inputControl city-option input-field" v-model="form.social">
                    <option value="">{{ $t('Views.Checkout.choose') }}</option>
                    <option value="Line">Line</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Wechat">Wechat</option>
                  </select>
                </li>
              </ul>

              <ul>
                <li class="inputItem wow fadeInUp required" style="visibility: visible; animation-name: fadeInUp;">
                  <label for="socialAccount">{{ $t('Views.Checkout.account') }}</label>
                  <input type="text" class="inputControl input-field" v-model="form.socialAccount" :placeholder="$t('Views.Checkout.account_placeholder')">
                </li>
                <li class="inputItem wow fadeInUp required" style="visibility: visible; animation-name: fadeInUp;">
                  <label for="email">email</label>
                  <input type="text" class="inputControl input-field" v-model="form.email" >
                </li>
              </ul>


              <ul>

                <li class="inputItem wow fadeInUp" style="visibility: visible; animation-name: fadeInUp;">
                  <label for="customerCity" style="width: 0px;">{{ $t('Views.Checkout.foreigner') }}</label>
                  <select @change="changePaymentMethod" class="inputControl city-option input-field" v-model="form.customerCity">
                    <option value="taiwan">{{ $t('Views.Checkout.not') }}</option>
                    <option value="not_taiwan">{{ $t('Views.Checkout.yes') }}</option>
                  </select>
                </li>
              </ul>

            </form>

            <div class="topBox" v-show="orderSubmitted">
              <div class="item">
                <div class="title">{{ $t('Views.Checkout.order_no') }}</div>
                <div class="">{{orderCreated.orderNo}}</div>
              </div>
              <div class="item">
                <div class="title">{{ $t('Views.Checkout.name') }}</div>
                <div class="">{{form.customerName}}</div>
              </div>
              <div class="item">
                <div class="title">{{ $t('Views.Checkout.phone') }}</div>
                <div class="">{{form.customerPhone}}</div>
              </div>
              <div class="item">
                <div class="title">{{ $t('Views.Checkout.contact_time') }}</div>
                <div class="">{{form.contactTime}}</div>
              </div>
              <div class="item">
                <div class="title">email</div>
                <div class="">{{form.email}}</div>
              </div>
              <div class="item">
                <div class="title">{{ $t('Views.Checkout.your_location') }}</div>
                <div class="">{{form.customerCity}}</div>
              </div>
              <div class="item">
                <div class="title">{{ $t('Views.Checkout.contact_method') }}</div>
                <div class="">{{form.social}}</div>
              </div>
              <div class="item">
                <div class="title">{{ $t('Views.Checkout.social_media_account') }}</div>
                <div class="">{{form.socialAccount}}</div>
              </div>
            </div>

            <div class="topBox">
              <div class="item">
                <div class="title">{{ $t('Views.Checkout.date') }}</div>
                <div class="txt">{{order.shootingDate}}</div>
              </div>
              <div class="item">
                <div class="title">{{ $t('Views.Checkout.time') }}</div>
                <div class="txt">{{order.shootingTime}}</div>
              </div>
              <div class="item">
                <div class="title">{{ $t('Views.Checkout.people') }}</div>
                <div class="txt">{{shootingPersons}}</div>
              </div>
            </div>

            <div class="bottomBox">
              <div class="item">
                <div class="title">{{ $t('Views.Checkout.addition_info') }}</div>
                <el-input :readOnly="orderSubmitted"
                  type="textarea"
                  :rows="3"
                  :cols="30"
                  :placeholder="$t('Views.Checkout.additional_info_placeholder')"
                  v-model="form.extraInfo">
                </el-input>
              </div>
              <div class="item">
                <div class="title">{{ $t('Views.Checkout.film_location') }}</div>
                <div class="txt">{{order.shootingLocation}}</div>
              </div>
              <div class="item map">
                <div style="width: 100%">
                  <iframe
                    width="100%"
                    height="300"
                    scrolling="no"
                    frameborder="0"
                    style="border:0"
                    referrerpolicy="no-referrer-when-downgrade"
                    :src="`https://www.google.com/maps/embed/v1/place?maptype=roadmap&zoom=17&key=AIzaSyCZt0Avv2Dx6P9uSyYXAh2dP-dx5JaxrII&q=${mapGeometry}`"
                    allowfullscreen>
                  </iframe>
                </div>
              </div>

            </div>
          </div>
          <div class="side">

            <div class="sideTitle">{{ $t('Views.Checkout.order_detail') }}</div>
            <div class="conBox">
              <div class="listBox">
                <div :prefix="$t('css.content.photographer')" class="item">{{ translate(preOrderInfo, "nickName", true) }}</div>
              </div>
              <div class="listBox">
                <div :prefix="$t('css.content.catagory')" class="item">{{ translate(order, "serviceCat") }}</div>
                <div :prefix="$t('css.content.duration')" class="item">{{order.shootingDuration}}{{ $t('Views.Checkout.hour') }}</div>
              </div>
              <div class="listBox">
                <div :prefix="$t('css.content.shooting_fee')" class="item">${{order.serviceFee}}</div>
                <div :prefix="$t('css.content.transportation_fee')" class="item">
                  <del>${{order.transportationFeeOnCustomer}}</del>
                  ${{order.transportationFeeCustomerActualPay}}
                </div>
              </div>
              <div class="listBox">
                <div :prefix="$t('css.content.coupon_discount')" class="item" v-show="form.couponDiscountPrice != 0">
                  ${{form.couponDiscountPrice}}
                  <el-button size="mini" type="danger" circle @click="removeCoupon"><i class="el-icon-delete"></i></el-button>
                </div>
                <div :prefix="$t('css.content.total')" class="item">TWD {{order.totalFee}}</div>
              </div>
              <div class="listBox">
                <div class="item">
                  <input :placeholder="$t('Views.Checkout.discount_code')" type="text" class="inputControl input-field coupon-field" v-model="form.couponCode">
                  <el-button size="mini" type="warning" @click="applyCoupon">{{ $t('Views.Checkout.use') }}</el-button>
                </div>
              </div>
            </div>
            <div class="btnBox" v-show="!orderSubmitted">
              <!-- 關閉線上支付，改成導到messenger, 20241212
              <el-popconfirm v-show="paymentMethod == 'ecpay'"
                @confirm="submitOrder"
                :confirm-button-text="$t('Views.Checkout.confirm')"
                :cancel-button-text="$t('Views.Checkout.cancel')"
                icon="el-icon-info"
                icon-color="red"
                :title="$t('Views.Checkout.click_hint')"
              >
                <button class="checkout-btn" type="submit" slot="reference" :title="$t('Views.Checkout.submit_title')">{{ $t('Views.Checkout.submit') }}</button>
              </el-popconfirm>

              <div v-show="paymentMethod == 'paypal'" ref="paypal"></div>
            -->
              <button class="checkout-btn" @click="contact()">Contact Us !</button>

            </div>
            <div class="infoBox">
             <!--  <div class="info">
                <span style="cursor: pointer;" @click="showFaq">免費改期</span style="cursor: pointer;"><br />
                <span style="cursor: pointer;" @click="showFaq">免費取消</span style="cursor: pointer;">
              </div> -->
              <!-- <div class="txt">
                很抱歉，Joyshot目前服務暫停無法下單
              </div>
 -->
              <div class="txt">
                {{ $t('Views.Checkout.after_payment_title') }}
              </div>
              <div class="txt">
                {{ $t('Views.Checkout.after_payment1') }}
              </div>
              <div class="txt">
                {{ $t('Views.Checkout.after_payment2') }}
              </div>
              <div class="txt" style="margin-bottom: 20px;">
                {{ $t('Views.Checkout.after_payment3') }}
<!-- TODO -->
                <el-button @click="joinLine"
                  style="background-color: rgb(103, 194, 58);border-color: rgb(103, 194, 58);width: 34%;border-radius: 999px;padding: 10px;font-size: 13px;" type="success" >加入Line@</el-button>
              </div>
            </div>

          </div>
        </div>
      </div>


      <el-dialog title="Paypal Checkout"
               :visible.sync="dialogFormVisible"
               width="350px">
<!-- TODO? -->
        <div>{{ $t('Views.Checkout.foreigner_payment') }}</div>
        <div>For foreign customers, please pay by PayPal</div>
        <div ref="paypal"></div>


      </el-dialog>


    </main>
</template>

<script>

import {mapState, mapGetters} from 'vuex'
import dayjs from "dayjs";

export default {
  name: 'Checkout',
  components:{

  },
  data(){
    return {
      dialogFormVisible: false,
      orderCreated:{},
      couponValid: false,
      form:{
        //客戶輸入

        customerName:'',
        customerPhone:'',
        contactTime:'',
        couponCode:'',
        couponDiscountPrice:0,
        email:'',
        customerCity:'taiwan',
        social:'',
        socialAccount:'',
        extraInfo:'',
        status:'processing'
      },
      orderSubmitted:false,
      paymentOpen:false,
      paymentMethod: 'ecpay',
      loaded: false,
// TODO?
      product: {
        price: 1288,
        description: "隨行攝影2小時",
        invoice_id: "234567890-00808112"
      },
      originalTotalPrice:0
    }
  },
  computed:{
    ...mapState('jsapp',['preOrderInfo']),
    ...mapGetters('jsapp',['order','mapGeometry','shootingPersons'])
  },
  methods:{
    changePaymentMethod(){
      if (this.form.customerCity == 'taiwan') {
        this.paymentMethod = 'ecpay'
      } else {
        this.paymentMethod = 'paypal'
      }
    },
    showFaq(){
      window.open("/faq", "_blank")
    },
    joinLine(){
      window.open("https://lin.ee/9Hdd4Dl", "_blank")
    },
    handleBodyClick(){
      this.$emit('appInSearchMode',  {mode:''})
    },
    submitOrder(){
      // console.log('訂單資訊無誤，確認送出訂單，表單驗證')
      if (this.formValidate()) {

        if (this.form.customerCity == 'taiwan') {
          this.paymentMethod = 'ecpay'
        } else {
          this.paymentMethod = 'paypal'
        }

        this.order.couponDiscount = this.form.couponDiscountPrice
        this.order.totalFee = this.originalTotalPrice + this.form.couponDiscountPrice
        let form_data = {...this.order, ...this.form}
        console.log(form_data)

        this.request.post('/order', form_data).then(res => {

          if (res.code === '200') {
            const message = this.$t('Views.Checkout.payment_success_desc')
            const hour = this.$t('Views.Checkout.hour')
            this.product.price = res.data.serviceFee+res.data.transportationFeeCustomerActualPay+res.data.couponDiscount
            this.product.description = `${message}${res.data.shootingDuration}${hour}`
            this.product.invoice_id = res.data.orderNo



            // console.log('/order res.data:', res.data)
            this.orderCreated = res.data
            this.orderSubmitted = true

            let query = {
              orderId: res.data.id
            }

            if (this.paymentMethod == 'ecpay') {
              this.request.get('/order/ecpayCheckout', {params: query} ).then(res1 => {

                if (res1.code === '200') {
                  //綠界回傳值為一個表單，要自動送出
                  this.$refs['orderForm'].innerHTML = res1.data
                  document.getElementById('allPayAPIForm').submit()
                } else{
                  const message = this.$t('Views.Checkout.ecpay_error')
                  this.showResult('error', message)
                }
              })
              this.paymentOpen = true

            } else {

              // this.dialogFormVisible = true
            }

            this.$bus.$emit('OrderSubmitted')

            fbq('track', 'Purchase', {value: this.orderCreated.totalFee, currency: 'TWD'});

          } else {
            const message = this.$t('Views.Checkout.order_error')
            this.showResult('error', message+res.code)
          }
        })



      }
    },
    formValidate(){
      //確認資料輸入完整
      let {customerName,customerPhone,contactTime,social,socialAccount,email} = this.form

      let msg = ''
      if (customerName === '') { msg += this.$t('Views.Checkout.name_required')}
      if (contactTime === '') { msg += this.$t('Views.Checkout.contact_time_required')}
      if (customerPhone === '') { msg += this.$t('Views.Checkout.phone_required') }
      if (social === '') { msg += this.$t('Views.Checkout.contact_method_required') }
      if (socialAccount === '') { msg += this.$t('Views.Checkout.social_media_account_required') }
      if (email === '') { msg += this.$t('Views.Checkout.email_required') }
      if (msg !== '') {
         this.$alert(msg, this.$t('Views.Checkout.remind'), {
          confirmButtonText: 'OK',
          dangerouslyUseHTMLString:true,
          callback: action => {
            return false
          }
        });
      } else {
        return true
      }
    },
    preparePayPal() {
      const script = document.createElement("script");
      // script.src = "https://www.paypal.com/sdk/js?client-id=AX9U3T0gHvHSwROwcvC7ugYLwm4pvLkmxVx6NG1538eRl4AowqRZy0faJZYEIRlQhQdtNaXQfTPf6Djg&disable-funding=credit,card&currency=TWD";  //sandbox
      script.src = "https://www.paypal.com/sdk/js?client-id=AdIYbX1MGQwKJauLjZDN2QVHKdKM3YYeptoQAkwP5U9VNOxvG98rf8BlLSGAHlkBtCw3VoQKWtsHIk-n&disable-funding=credit,card&currency=TWD"; //prod
      script.addEventListener("load", this.paypalLoaded);
      document.body.appendChild(script);
    },
    applyCoupon(){
      let form_data = {...this.order, ...this.form}
      console.log(form_data)
      this.request.post('/coupon/apply', form_data).then(res => {
        if (res.code === '200') {
          //重新計算價格
          this.couponValid = true
          this.form.couponDiscountPrice = res.data
          this.order.totalFee = this.originalTotalPrice + this.form.couponDiscountPrice

          console.log(res.data)
        } else {
          this.form.couponCode = ''
          this.form.couponDiscountPrice = 0
          this.order.totalFee = this.originalTotalPrice
          const message = this.$t('Views.Checkout.dicount_code_error')
          this.showResult('error', message)
        }
      });
    },
    removeCoupon(){
      this.order.totalFee = this.originalTotalPrice
      this.form.couponCode = ''
      this.form.couponDiscountPrice = 0

    },
    paypalLoaded() {
      this.loaded = true;
      window.paypal
        .Buttons({
          createOrder: (data, actions) => {
            console.log('createOrder...')
            if (this.formValidate()) {

              console.log('createOrder..valid')

              if (this.form.customerCity == 'taiwan') {
                this.paymentMethod = 'ecpay'
              } else {
                this.paymentMethod = 'paypal'
              }

              return actions.order.create({
                    purchase_units: [
                      {
                        invoice_id: dayjs().format('YYYYMMDDHHmmss'),
                        description: this.$t('Views.Checkout.payment_success_desc')+ this.order.shootingDuration + this.$t('Views.Checkout.hour'),
                        amount: {
                          currency_code: "TWD",
                          value: this.originalTotalPrice + this.form.couponDiscountPrice
                        }
                      }
                    ]
                  });



            } else {
              console.log('createOrder...not valid')
              return false;
            }




          },
          onApprove: async (data, actions) => {
            console.log('onApprove...')

            const order = await actions.order.capture();

            //建立order
            // let query = {
            //   tradeNo: order.id,
            //   invoiceId: order.purchase_units[0].invoice_id
            // }


            console.log('建立order...', order)

            this.form.orderNo = order.purchase_units[0].invoice_id
            this.form.paymentOrderNo = order.id
            this.form.paymentMethod = 'paypal'
            this.form.status = 'pay_success'


            this.order.totalFee = this.originalTotalPrice + this.form.couponDiscountPrice
            let form_data = {...this.order, ...this.form}
            console.log('form_data...', form_data)

            this.request.post('/order/paypal-order', form_data).then(res => {
              if (res.code === '200') {

                this.orderCreated = res.data
                this.orderSubmitted = true

                let purchase = this.orderCreated.serviceFee+this.orderCreated.transportationFeeCustomerActualPay+this.orderCreated.couponDiscount

                fbq('track', 'Purchase', {value: purchase, currency: 'TWD'});

                this.$router.push('/thankyou/'+res.data.orderNo).catch(()=>{})

              } else {
                const message = this.$t('Views.Checkout.order_error')
                this.showResult('error', message+res.code)
              }
            })



            // this.request.get('/order/paypal-paid', {params: query} ).then(res => {

            //   if (res.code === '200') {

            //     this.$router.push('/thankyou/'+res.data).catch(()=>{})

            //   } else{
            //     this.showResult('error', '更新訂單狀態出錯.')
            //   }
            // })


          },
          onError: err => {
            console.log('onError...', err)

            // let query = {
            //   invoiceId: this.product.invoice_id
            // }
            // if (this.product.invoice_id != '') {
            //   this.request.get('/order/paypal-failed', {params: query} ).then(res => {

            //     if (res.code === '200') {

            //       this.$router.push('/thankyou/'+res.data).catch(()=>{})

            //     } else{
            //       //this.showResult('error', '更新訂單狀態出錯')
            //     }
            //   })
            // }



          }
        })
        .render(this.$refs.paypal);
    },
    contact(){
      window.open('https://m.me/joyshottw')
    }
  },
  mounted(){
    fbq('track', 'InitiateCheckout');
    this.originalTotalPrice = this.order.totalFee
    this.$refs.siteMain.addEventListener('click', this.handleBodyClick);

    this.preparePayPal()

    //重新整理會被導去首頁
    if (Object.keys(this.preOrderInfo).length === 0) {
      this.$router.push('/').catch(()=>{})
    }
  }
}
</script>

<style type="text/css" scoped>


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

.side {
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
  .side {
    width: 100%;
  }
}
.side .sideTitle {
  color: #1f1f1f;
  font-size: 1.125rem;
  font-weight: 500;
  letter-spacing: 2px;
  padding-bottom: 10px;
  margin: 0;
}
.side .conBox {
  position: relative;
  z-index: 2;
}
.side .conBox .listBox {
  padding: 10px 0px;
  border-top: #dddddd 1px solid;
}
.side .conBox .listBox .item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 1.125rem;
  color: #1f1f1f;
  padding: 3px 0;
}
.side .conBox .listBox .item::before {
  letter-spacing: 2px;
}
.side .conBox .listBox:nth-child(1) .item:nth-child(1)::before {
  content: attr(prefix);
}
.side .conBox .listBox:nth-child(2) .item:nth-child(1)::before {
  content: attr(prefix);
}
.side .conBox .listBox:nth-child(2) .item:nth-child(2)::before {
  content: attr(prefix);
}
.side .conBox .listBox:nth-child(3) .item:nth-child(1)::before {
  content: attr(prefix);
}
.side .conBox .listBox:nth-child(3) .item:nth-child(2)::before {
  content: attr(prefix);
}

.side .conBox .listBox:nth-child(4) .item:nth-child(1)::before {
  content: attr(prefix);
}
.side .conBox .listBox:nth-child(4) .item:nth-child(2) {
  font-weight: 700;
  font-size: 1.5rem;
  color: #f37a69;
}
.side .conBox .listBox:nth-child(4) .item:nth-child(2)::before {
  content: attr(prefix);
  font-weight: 700;
  font-size: 1.125rem;
  color: #1f1f1f;
}


.side button.checkout-btn {
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
.side button.checkout-btn::after {
  content: "";
  width: 18px;
  height: 9px;
  display: block;
  -webkit-mask: url("~@/assets/images/btn_arrow.svg") no-repeat;
          mask: url("~@/assets/images/btn_arrow.svg") no-repeat;
  background: #fff;
  margin-left: 5px;
}
.side .infoBox {
  padding: 45px 0px 0px;
  background: #fff5f4;
  color: #1f1f1f;
  font-weight: 0.9375rem;
  position: relative;
}
.side .infoBox::before {
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
.side .infoBox .info {
  color: #52b6cc;
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
.order textarea {
  color: #999999;
  font-size: 0.9375rem;
  border: #dddddd 1px solid;
  padding: 15px;
  letter-spacing: 1px;
}/*# sourceMappingURL=order.css.map */


.formBox {
  padding: 20px 0 20px;
}
.formBox ul {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 0 auto 0px;
}
.formBox .inputItem {
  width: calc(50% - 25px);
  padding: 25px 0;
  position: relative;
  display: flex;
  align-items: flex-start;
  border: 1px solid #dadfe3;
  border-width: 0 0 1px 0;
}
@media screen and (max-width: 767px) {
  .formBox .inputItem {
    width: 100%;
  }
}
.formBox .inputItem > label {
  font-size: 1.25rem;
  color: #000000;
  line-height: 1;
  min-width: 130px;
  border-right: #dadfe3 1px solid;
  display: flex;
  align-items: center;
}
@media screen and (max-width: 767px) {
  .formBox .inputItem > label {
    font-size: 1.125rem;
  }
}
.formBox .inputItem .itemBox,
.formBox .inputItem input.inputControl,
.formBox .inputItem textarea.textareaControl {
  flex-grow: 1;
  margin-left: 15px;
  color: #000;
  border-radius: 0;
  border: none;
}
.formBox .inputItem .itemBox::-moz-placeholder, .formBox .inputItem input.inputControl::-moz-placeholder, .formBox .inputItem textarea.textareaControl::-moz-placeholder {
  color: #c0c0c0;
}
.formBox .inputItem .itemBox::placeholder,
.formBox .inputItem input.inputControl::placeholder,
.formBox .inputItem textarea.textareaControl::placeholder {
  color: #c0c0c0;
}
.formBox .inputItem.full {
  width: 100%;
}
.formBox .inputItem.required label::after {
  content: "※";
  color: #329db8;
  margin: 0 0 -2px 5px;
  display: block;
}
.formBox .itemBox ul {
  display: flex;
  flex-wrap: wrap;
}
.formBox .itemBox ul li {
  width: 50%;
  padding: 0 5px;
  margin-bottom: 20px;
}
@media screen and (max-width: 767px) {
  .formBox .itemBox ul li {
    width: 100%;
  }
}
.formBox .itemBox ul li label {
  display: block;
  padding-left: 22px;
  position: relative;
}
.formBox .itemBox ul li label::before {
  content: "";
  position: absolute;
  width: 13px;
  height: 13px;
  display: block;
  background: url("~@/assets/images/checkbox.png") bottom no-repeat;
  left: 0px;
  top: 3px;
  z-index: 9;
}
.formBox .itemBox ul li input {
  position: absolute;
  opacity: 0;
}
.formBox .itemBox ul li input[type=checkbox] {
  margin-right: 5px;
  opacity: 0;
}
.formBox .itemBox ul li input[type=checkbox]:checked + label::before {
  background: url("~@/assets/images/checkbox.png") top no-repeat;
}
.formBox a {
  color: #666666;
  font-size: 0.8125rem;
  text-decoration: underline;
}
.formBox a:nth-child(2) {
  margin: 0 auto 0 10px;
}
.formBox a:hover {
  color: #329db8;
}
.formBox .checkImg {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 50px;
  line-height: 0;
  margin-top: 10px;
}
.formBox .reBtn {
  width: 15px;
  height: 15px;
  margin-top: 10px;
  top: 50%;
  transform: translateY(-50%);
  right: 15px;
  z-index: 2;
  position: absolute;
  cursor: pointer;
  background: none;
}
.formBox .reBtn::before {
  content: "";
  width: 15px;
  height: 15px;
  top: 0;
  left: 0;
  -webkit-mask: url("~@/assets/images/re.svg") no-repeat;
          mask: url("~@/assets/images/re.svg") no-repeat;
  background: #000;
  position: absolute;
  transition: all 0.3s ease;
}
.formBox .reBtn:hover::before {
  transform: rotate(180deg);
  background: #e50012;
}

.city-option {
  padding: 6px 40px;
  border-radius: 4px;
}

.input-field {
  border: 1px solid #e4e4e4 !important;
  border-radius: 8px !important;
}
.coupon-field {
  padding: 8px;
  margin-right: 6px;
}

.side .conBox .listBox .item {
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
}

.side .conBox .listBox .item del {
  margin: 0 10px 0 0;
  color: #818181;
}

.side .conBox .listBox .item::before {
  letter-spacing: 0px;
  width: 100%;
}

.side .conBox .listBox:nth-child(2) .item::before {
  width: auto;
  margin: 0 auto 0 0;
}

.en-app .side button.checkout-btn {
  font-size: 16px;
}
</style>
