<template>

	<div >
    <el-table :data="myOrders" empty-text="目前無資料" stripe header-row-class-name="headerStyle" style="padding:20px 20px 40px 20px">
      <el-table-column label="訂單編號" prop="orderNo"></el-table-column>
      <el-table-column label="客戶姓名 / 電話">
        <template slot-scope="scope">
          <div>{{scope.row.customerName}} / {{scope.row.customerPhone}}</div>
        </template>
      </el-table-column>
      
      <el-table-column label="拍攝日期與時間" width="220">
        <template slot-scope="scope">
          <div>{{scope.row.shootingDate}},{{scope.row.shootingTime}} ({{scope.row.shootingDuration}}小時)</div>
        </template>
      </el-table-column>
      
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
			pid: 0,
			myOrders:[]
		}
	},
	methods:{
		loadOrder(){
			// this.request.get("/photographer/1/order").then(res => {
      this.mockRequest.get("/photographer/"+this.pid+"/order").then(res => {
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
		this.pid = parseInt(this.$route.params.pid)
		this.loadOrder()
	}
}

</script>

<style scoped>

</style>


