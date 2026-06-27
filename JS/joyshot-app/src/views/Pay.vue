<template>
	<div id="orderForm" ref="orderForm"></div>
</template>

<script>

export default {
	name: 'Pay',
	components:{

	},
	data(){
		return {
			orderNo: ''
		}
	},
	methods:{
		checkPayment(){
			this.request.get('/order/check/paid/'+this.orderNo).then(res => {

        if (res.code === '200') {
          //if paid, redirect to thank you page
          this.$router.push('/thankyou/' + res.data).catch(()=>{})

        } else {
        	//if not paid, trigger payment
          let query = {
            orderId: res.message
          }
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
        }
      })


		}
	},
	mounted(){
		this.orderNo = this.$route.params.orderNo
		this.checkPayment()
	}
}

</script>

<style scoped>

</style>


