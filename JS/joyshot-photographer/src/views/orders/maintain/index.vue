<template>
  <div>
    <el-row :gutter="20" class="top-block">
      <Breadcrumb :route="this.$route"></Breadcrumb>
    </el-row>

      <!-------------------------------------------------------------------->
      <!-- action -->
      <!-------------------------------------------------------------------->

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

            <el-table-column label="客戶姓名與電話" width="170">
              <template slot-scope="scope">
                <div>{{scope.row.customerName}}</div>
                <div>TEL:{{scope.row.customerPhone}}</div>
              </template>
            </el-table-column>

            <el-table-column prop="shootingDate" label="日期">
            </el-table-column>
            <el-table-column prop="shootingTime" label="時間">
            </el-table-column>
            <el-table-column prop="shootingDuration" label="時數">
            </el-table-column>
            <el-table-column label="人數">
              <template slot-scope="scope">
                <div>{{scope.row.adultNum}}大人,{{scope.row.childNum}}小孩</div>
              </template>
            </el-table-column>
            
            
            <el-table-column label="金額">
              <template slot-scope="scope">
                <div>${{scope.row.totalFee}}</div>
              </template>
            </el-table-column>

            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="warning" @click="handleEdit(scope.row)" circle> <i class="el-icon-tickets"></i></el-button>
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
      

    </el-row>    
  </div>
</template>

<script>

import Breadcrumb from "@/components/breadcrumb/Breadcrumb";

export default {
  name: "OrdersMaintain",
  components: {
    Breadcrumb
  },
  data() {
    return {
      pageNum:0,
      pageSize:15,
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
    handleEdit(){

    },
    getData(){
      let query = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        queryField: this.queryField,
        keyword: this.keyword
      }

      this.request.get('/order/all', {params:query}).then(res => {
        if (res.code === "200") {
          this.tableData = res.data.records
          this.total = res.data.total
        } else {
          this.showResult('error', this.$t('action.get_error', {err: 'error'}))
        }
      })
    }
  },
  mounted() {
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


</style>
