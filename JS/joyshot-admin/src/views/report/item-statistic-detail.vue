<template>
  <div>
    <el-row :gutter="20" class="top-block">
      <Breadcrumb :route="this.$route"></Breadcrumb>
    </el-row>

    <el-row class="mt-20">
      <el-col :xs="24" :sm="24" :lg="24">
        <el-button type="normal" @click.prevent="goBack" class="ml-20" circle><i class="el-icon-d-arrow-left"></i>
        </el-button>
      </el-col>
    </el-row>
    
    <el-row>
      <el-col :xs="24" :sm="24" :lg="24" style="padding: 20px 10px 20px 30px;">
        <el-tabs v-model="activeName" >
          <el-tab-pane label="用品資料" name="basicInfo">
            
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>用品資料</span>
            </div>
            <el-form label-position="top" :model="form">
                <el-row>
                  <el-col :xs="24" :sm="24" :md="8" :lg="8" v-if="canViewAll === 'Y'">
                    <el-form-item label="Warehouse">
                      {{form.area}}
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="8" :lg="8">
                    <el-form-item label="類型">
                      {{form.itemTypeLabel}}
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="8" :lg="8">
                    <el-form-item label="名稱">
                      {{form.itemName}}
                    </el-form-item>
                  </el-col>
                  
                </el-row>
              </el-form>
          </el-card>

           <el-card class="box-card mt-20">
            <div slot="header" class="clearfix">
              <span>使用情況</span>
              
            </div>
            <div>
              <el-table :data="tableData" empty-text="無資料" stripe  :default-expand-all="true">
                <el-table-column label="請領單申請時間">
                  <template slot-scope="scope">
                    {{scope.row.actionDate | fmtDate}}
                  </template>
                </el-table-column>
                <el-table-column label="使用情況">
                  <template slot-scope="scope">
                    <p v-if="scope.row.actionType === 'req_item'">
                      <font color='#409EFF'>{{scope.row.notes}}</font>
                      <!-- <font color='#409EFF'><a :href="`/#/daily/todo/req_item/${scope.row.mytodoId}`">{{scope.row.notes}}</a></font> -->
                    </p>
                    <p v-else><font color='red'>{{scope.row.notes}}</font></p>
                  </template>
                </el-table-column>
                <el-table-column label="數量" prop="qty">
                  <template slot-scope="scope">
                    <p v-if="scope.row.actionType === 'req_item'">{{scope.row.qty}}</p>
                    <p v-else>-{{scope.row.qty}}</p>
                  </template>
                </el-table-column>
                <el-table-column label="小計" prop="currentQty">
                </el-table-column>
              </el-table>
            </div>
          </el-card>

          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>

    
    
  </div>
</template>

<script>
import {mapState} from 'vuex'
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import dayjs from "dayjs"


export default {
  name: "ItemUsageStatisticDetail",
  components: {
    Breadcrumb
  },
  data() {
    return {
      activeName: 'basicInfo',
      
      /**上頁接收的參數**/
      itemId:'',
      userId:'',

      tableData:[],

      /**入庫資料表單**/
      form: {},

      canViewAll:'N'

    }
  },
  methods: {

    goBack(){
      this.$router.push('/report/item-statistic')
    },

    
    /**用品使用資料**/
    getItemUsageInfo() {
      this.request.get("/report/item-usage-detail/" + this.itemId + "/" + this.userId).then(res => {
        if (res.code === '200') {
          this.tableData = res.data
        }
      })
    },

    getItemInfo() {
      this.request.get("/item/" + this.itemId).then(res => {
        if (res.code === '200') {
          this.form = res.data
        }
      })
    },

    userItemViewPermission(){
      this.request.get("/item/view/permission").then(res => {
        if (res.code === '200') {
          this.canViewAll = res.data
        }
      })
    },

  },
  mounted() {
    
    this.itemId = this.$route.params.itemId
    this.userId = this.$route.params.userId
    
    this.userItemViewPermission()

    this.getItemUsageInfo()
    this.getItemInfo()
  }
}
</script>

<style scoped>


</style>
