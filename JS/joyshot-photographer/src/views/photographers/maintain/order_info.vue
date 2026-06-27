<template>

	<div >
    <el-table :data="myOrders" empty-text="目前無資料" stripe header-row-class-name="headerStyle" style="padding:20px 20px 40px 20px">
      <el-table-column label="訂單編號" prop="orderNo"></el-table-column>
      <el-table-column label="日期時間" prop="orderDate"></el-table-column>
      <el-table-column label="人數" prop="persons"></el-table-column>
      <el-table-column label="時數" prop="hours"></el-table-column>
      <el-table-column label="拍攝金額">
      	<template slot-scope="attrs">
      		${{attrs.row.serverFee}}
        </template>
      </el-table-column>
      <el-table-column label="交通補貼" prop="transportationFee"></el-table-column>
      <el-table-column label="合計" prop="sum"></el-table-column>
    </el-table>
  </div>

</template>

<script>

export default {
	name: 'PhotographerOrderInfo',
	components:{

	},
	data(){
		return {
			myOrders:[]
		}
	},
	methods:{
		loadOrder(){
			// this.request.get("/photographer/1/order").then(res => {
      this.mockRequest.get("/photographer/1/order").then(res => {
        if (res.code === 200) {
          this.myOrders = res.data
        } else {
          this.showResult('error', '無法取得攝影師訂單資料')
        }
      })
		}
	},
	mounted(){
		console.log('loadOrder')
		this.loadOrder()
	}
}

</script>

<style scoped>

</style>


