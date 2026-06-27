<template>
  <div>
    <el-row :gutter="20" class="top-block">
      <Breadcrumb :route="this.$route"></Breadcrumb>
    </el-row>

      <!-------------------------------------------------------------------->
      <!-- action -->
      <!-------------------------------------------------------------------->

    <el-row>
      <el-col :xs="24" :sm="24" :lg="16" v-if="false">
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

        <!-- <el-button type="primary" @click.prevent="handleAdd" class="mr-20">新增 <i
            class="el-icon-circle-plus-outline"></i></el-button> -->
      </el-col>
    </el-row>


    <el-row>

      <el-col :xs="24" :sm="24" :lg="24" class="mymain">
        <el-main>
          <el-table id="product_table" :data="tableData" empty-text="無資料" stripe header-row-class-name="headerStyle">
            <el-table-column prop="orderNo" label="訂單編號" width="170">
            </el-table-column>

            <el-table-column label="客戶" width="120">
              <template slot-scope="scope">
                <div>{{scope.row.customerName}}</div>
                <div>TEL:{{scope.row.customerPhone}}</div>
              </template>
            </el-table-column>

            <el-table-column label="拍攝時間">
            	<template slot-scope="scope">
                <div>{{scope.row.shootingDate}}</div>
                <div>{{scope.row.shootingTime}} ({{scope.row.shootingDuration}}小時)</div>
              </template>
            </el-table-column>

            <el-table-column label="已聯繫客戶">
              <template slot-scope="scope">
                <div class="finish" v-if="scope.row.finishContact">是</div>
                <div class="not-finish" v-else>否</div>
              </template>
            </el-table-column>


           	<el-table-column label="照片目錄">
            	<template slot-scope="scope">
                <div v-if="scope.row.driverLink"><a :href="scope.row.driverLink" target="_new">進行上傳</a></div>
              </template>
            </el-table-column>

            <el-table-column label="照片張數">
              <template slot-scope="scope">
                <div class="finish" v-if="scope.row.afterUpload && scope.row.picNum > 0">
                  {{scope.row.picNum}}
                </div>
              </template>
            </el-table-column>

            <el-table-column label="照片已上傳">
            	<template slot-scope="scope">
                <div class="finish" v-if="scope.row.afterUpload">是</div>
                <div class="not-finish" v-else>否</div>
              </template>
            </el-table-column>



            <el-table-column label="拍攝酬勞">
              <template slot-scope="scope">
                <div>${{scope.row.shootingDuration * 800}}</div>
              </template>
            </el-table-column>

            <el-table-column label="預定匯款日期" prop="payDate">
            </el-table-column>

            <!-- <el-table-column label="是否入帳">
            	<template slot-scope="scope">
            		<div class="finish" v-if="scope.row.afterPayment">是</div>
                <div class="not-finish" v-else>否</div>
              </template>
            </el-table-column> -->

            <el-table-column label="操作" width="200">
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
                <div></div>

                <el-button class="mt-10" size="mini" type="primary" @click="notifyUpload(scope.row)"> 通報照片已上傳</el-button>

              	<!-- <el-popconfirm v-if="!scope.row.afterUpload"
                    class="ml-10 popconfirm-bg"
                    title="確認照片完成上傳"
                    confirm-button-text="確認"
                    cancel-button-text="取消"
                    icon="el-icon-info"
                    icon-color="red"
                    @confirm="notifyUpload(scope.row)"
                >
                <el-button class="mt-10" size="mini" type="primary" slot="reference"> 通報照片已上傳</el-button>
                </el-popconfirm> -->




                <!-- <el-button class="mt-10" size="mini" type="primary" @click="handleEdit(scope.row)"> <i class="el-icon-tickets"></i> 回報已入帳</el-button> -->
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


      <!-------------------------------------------------------------------->
      <!-- dialog -->
      <!-------------------------------------------------------------------->

      <el-dialog title="通報照片完成上傳"
               :visible.sync="dialogFormVisible"
               width="45%">

      <el-form label-position="top"
               :model="form"
               ref="dataForm" class="myform">
        <el-row>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" class="pr-10">
            <el-form-item label="請填寫上傳照片數(每小時至少40張)" prop="picNum">
              <el-input-number v-model="form.picNum" :min="40" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="saveConfirmUpload('dataForm')">確認</el-button>
      </div>
    </el-dialog>


    </el-row>
  </div>
</template>

<script>

import {mapState} from 'vuex'
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";

export default {
  name: "MyOrder",
  components: {
    Breadcrumb
  },
  computed: {
    ...mapState('login', ['userInfo']),
  },
  data() {
    return {
      dialogFormVisible:false,
      pageNum:0,
      pageSize:15,
      total:0,
      tableData:[],
      queryField:'',
      keyword:'',
      pId: '',
      form:{
        picNum:40,
        orderId:0
      },
      options: [{
        value: 'orderNo',
        label: '訂單編號'
      }, {
        value: 'customerPhone',
        label: '客戶電話'
      }, {
        value: 'customerName',
        label: '客戶姓名'
      }]
    }
  },
  methods: {
    search(){
      this.getData()
    },
    clearQuery(){
      this.pageNum = 1
      this.queryField = ''
      this.keyword = ''
      this.getData()
    },
    handleCurrentChange(){

    },
    saveConfirmUpload(){

      // console.log(this.form)

      this.request.post('/order/photo/uploaded/pic-num', this.form).then(res => {

        if (res.code === "200") {

          this.request.post('/order/photo/uploaded/'+ this.form.orderId).then(res => {
            if (res.code === "200") {
              this.dialogFormVisible = false
              this.showResult('success', '照片已上傳-完成通報')
              this.getData()
            } else {
              this.showResult('error', '通報出現錯誤，請重新整理後再執行一次或與客服聯繫')
            }
          })

        } else {
          this.showResult('error', '通報出現錯誤，請重新整理後再執行一次或與客服聯繫')
        }
      })


    },
    notifyUpload(row){

      this.dialogFormVisible = true
      this.form.orderId = row.id

      // this.request.post('/order/photo/uploaded/'+ row.id).then(res => {
      //   if (res.code === "200") {
      //   	this.showResult('success', '照片已上傳-完成通報')
      //     this.getData()
      //   } else {
      //     this.showResult('error', '通報出現錯誤，請重新整理後再執行一次或與客服聯繫')
      //   }
      // })


    },
    notifyContact(row){
      this.request.post('/order/contact/customer/'+ row.id).then(res => {
        if (res.code === "200") {
          this.showResult('success', '已聯繫客戶-完成通報')
          this.getData()
        } else {
          this.showResult('error', '通報出現錯誤，請重新整理後再執行一次或與客服聯繫')
        }
      })
    },
    getData(){
      let query = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        queryField: this.queryField,
        keyword: this.keyword,
        pId: this.pId
      }

      this.request.get('/order/myorder', {params:query}).then(res => {
        if (res.code === "200") {
          let myorders = res.data.records

          //篩選掉手動單，狀態為cancel的單
          this.tableData = myorders.filter((o) => {
            // console.log(o)
            return o.status != 'auto_cancel' && o.status != 'pay_failed' && o.status != 'cancel'
          })
          this.total = res.data.total
        } else {
          this.showResult('error', this.$t('action.get_error', {err: 'error'}))
        }
      })
    }
  },
  mounted() {
  	this.pId = this.userInfo.phId
    this.getData()
  }
}
</script>

<style scoped>
.el-5able {
  border-radius: 10px;
  padding: 20px;
}

.el-table >>> .headerStyle {
  /*background-color: #1e8fc6;*/
}

.el-popover.el-popper .el-popconfirm {
  background-color: black !important;
  padding: 10px !important;
}

.avatar-uploader {
  /*border: 1px dashed #d9d9d9;*/
  /*border-radius: 6px;*/
  cursor: pointer;
  position: relative;
  overflow: hidden;
  margin-bottom: 20px;
  text-align: center;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 240px;
  height: 178px;
  display: block;
}

.display-avatar {
  width: 60px;
  height: 60px;
  border-radius: 999px;
}


/deep/ .el-upload-dragger {
  width: 260px !important;
  border: 3px dashed #d9d9d9;
}

.finish {
	color: green;
}
.not-finish {
	color: red;
}
</style>
