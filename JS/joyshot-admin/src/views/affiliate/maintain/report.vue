<template>
	<div>
    <el-row :gutter="20" class="top-block">
      <Breadcrumb :route="this.$route"></Breadcrumb>
    </el-row>

    <el-row>
      <el-col :xs="24" :sm="24" :lg="16">
        <el-select :xs="24" v-model="queryField" placeholder="選擇" style="padding: 0 0 0 20px">
          <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
        <el-input v-model="keyword" style="width: 200px" placeholder="keyword" class="ml-10"
                  suffix-icon="el-icon-search"></el-input>

        <el-button type="primary" @click.prevent="search" class="ml-10">搜尋</el-button>
        <el-button type="normal" @click.prevent="clearQuery" class="ml-10">清除查詢</el-button>
      </el-col>

      <el-col :xs="24" :sm="24" :lg="8" style="text-align: right">
      </el-col>
    </el-row>

    <el-row>
      <el-col :xs="24" :sm="24" :lg="24" class="mymain">  
        <el-main>
          <el-table id="product_table" :data="tableData" empty-text="無資料" stripe header-row-class-name="headerStyle">
            <el-table-column prop="orderNo" label="訂單編號" width="180">
            </el-table-column>

            <el-table-column label="客戶">
              <template slot-scope="scope">
                <div>{{scope.row.customerName}}</div>
              </template>
            </el-table-column>

            <el-table-column label="拍攝日期" width="120">
              <template slot-scope="scope">
                <div>{{scope.row.shootingDate}}</div>
                <div>{{scope.row.shootingTime}} ({{scope.row.shootingDuration}}小時)</div>
              </template>
            </el-table-column>
            
            <el-table-column label="訂單金額">
              <template slot-scope="scope">
                <span>${{scope.row.totalFee}}</span>
              </template>
            </el-table-column>

            <el-table-column label="折扣碼" prop="couponCode">
            </el-table-column>

						<el-table-column label="推廣員">
							<template slot-scope="scope">
                <span v-if="scope.row.couponOwner">{{scope.row.couponOwner.name}}({{scope.row.couponOwner.nickName}})</span>
              </template>
            </el-table-column>
            

            

          </el-table>

          <div style="border-radius:8px; margin-top:10px;padding:20px 10px; text-align: center; background-color: white">
            <el-pagination
                background
                layout="prev, pager, next"
                :current-page="pageNum"
                :page-size="pageSize"
                :total="total"
                @current-change="handleCurrentChange">
            </el-pagination>
          </div>

        </el-main>
      </el-col>
    </el-row>

  </div>
</template>

<script>

import Breadcrumb from "@/components/breadcrumb/Breadcrumb";

export default {
	name: 'AffiliateReport',
	components:{
		Breadcrumb
	},
	data(){
		return {
      pageNum:0,
      pageSize:20,
      total:0,
      tableData:[],
      queryField:'',
      keyword:'',
      options: [
      	{value: 'name', label: '推廣員'},
      	{value: 'coupon_code', label: '折扣碼'}]
    }
	},
	methods:{
		search(){
      this.getData()
    },
    clearQuery(){
      this.pageNum = 1
      this.queryField = ''
      this.keyword = ''
      this.getData()
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.getData()
    },
    
    getData(){
      let query = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        queryField: this.queryField,
        keyword: this.keyword
      }

      this.request.get('/order/has-coupon', {params:query}).then(res => {
        if (res.code === "200") {
          this.tableData = res.data.records
          this.total = res.data.total
        } else {
          this.showResult('error', this.$t('action.get_error', {err: 'error'}))
        }
      })
    }
	},
	mounted(){
		this.getData()
	}
}

</script>

<style scoped>

</style>


