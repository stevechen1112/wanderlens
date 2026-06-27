<template>
  <div>
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
          <el-table v-loading="loading" id="product_table" :data="tableData" empty-text="無資料" stripe header-row-class-name="headerStyle">
            <el-table-column prop="orderNo" label="訂單編號" width="180">
            </el-table-column>

            <el-table-column label="客戶姓名 / 電話">
              <template slot-scope="scope">
                <div>{{scope.row.customerName}} / {{scope.row.customerPhone}}</div>
                <div v-if="scope.row.email">{{scope.row.email}}</div>
              </template>
            </el-table-column>
            
            <el-table-column label="拍攝時間">
              <template slot-scope="scope">
                <div>{{scope.row.shootingDate}} {{scope.row.shootingTime}}</div>
                <div>({{scope.row.shootingDuration}}小時)</div>
              </template>
            </el-table-column>


            <el-table-column prop="photographer.nickName" label="攝影師">
            </el-table-column>

            <el-table-column label="已聯繫客戶">
              <template slot-scope="scope">
                <div class="finish" v-if="scope.row.finishContact">是</div>
                <div class="not-finish" v-else>否</div>
              </template>
            </el-table-column>

            <el-table-column label="訂單總成本/拍攝酬勞/交通補貼(總交通費-交通收入)">
              <template slot-scope="scope">
                <div>${{scope.row.photographerProfit}}/${{scope.row.shootingDuration * 800}}/${{scope.row.transportationFeeCustomerActualPay}}</div>
              </template>
            </el-table-column>
            
            <el-table-column label="照片目錄">
              <template slot-scope="scope">
                <div v-if="scope.row.driverLink">
                  <a :href="scope.row.driverLink" target="_new">點擊前往</a>
                </div>
                <div v-else>
                   <el-button type="primary" size="mini" @click.prevent="createFolder(scope.row)" class="ml-10">建目錄</el-button>
                </div>
              </template>
            </el-table-column>

            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-popconfirm v-if="!scope.row.finishContact"
                    class="ml-10 popconfirm-bg"
                    title="確認已聯繫客戶"
                    confirm-button-text="確認"
                    cancel-button-text="取消"
                    icon="el-icon-info"
                    icon-color="red"
                    @confirm="notifyContact(scope.row)"
                ><el-button class="mt-10" size="mini" type="warning" slot="reference"> 通報已聯繫客戶</el-button>
                </el-popconfirm>
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

export default {
  name: 'FinishPayment',
  components:{

  },
  data(){
    return {
      loading: false,
      pageNum:0,
      pageSize:10,
      total:0,
      tableData:[],
      queryField:'',
      keyword:'',
      options: [{
        value: 'orderNo',
        label: '訂單編號'
      }, {
        value: 'customerPhone',
        label: '客戶電話'
      }, {
        value: 'customerName',
        label: '客戶姓名'
      }, {
        value: 'photograhperName',
        label: '攝影師'
      }]
    }
  },
  methods:{
    createFolder(row){
      this.loading = true
      this.request.get('/order/create/folder/' + row.id).then(res => {
        this.loading = false
        if (res.code === "200") {
          this.showResult('success', '目錄成功建立')
          this.getData();
        } else {
          this.showResult('error', '目錄建立失敗')
        }
      })
    },
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
    resendPaymentRemind(row){
      this.request.get('/order/payment/remind/' + row.id).then(res => {
        if (res.code === "200") {
          this.showResult('success', '付款提醒信件成功寄出')
          this.getData()
        } else {
          this.showResult('error', '付款提醒信件寄出失敗，請與客服聯繫')
        }
      })
    },
    getData(){
      let query = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        queryField: this.queryField,
        keyword: this.keyword
      }

      this.request.get('/order/status/pay_success', {params:query}).then(res => {
        if (res.code === "200") {
          this.tableData = res.data.records
          this.total = res.data.total
        } else {
          this.showResult('error', this.$t('action.get_error', {err: 'error'}))
        }
      })
    },

    notifyContact(row){
      this.request.post('/order/contact/customer/'+ row.id).then(res => {
        if (res.code === "200") {
          this.showResult('success', '已聯繫客戶-完成通報')
          this.getData()
        } else {
          this.showResult('error', '通報出現錯誤，請重新整理後再執行一次')
        }
      })
    },
  },
  mounted(){
    this.getData()
  }
}

</script>

<style scoped>
  .finish {
    color: green;
  }
  .not-finish {
    color: red;
  }


</style>


