<template>
  <div>
    <el-row :gutter="20" class="top-block">
      <Breadcrumb :route="this.$route"></Breadcrumb>
    </el-row>
    

    <el-row class="ml-20 mr-20" >
      <el-col :xs="12" :sm="12" :lg="12">
        <el-button icon="el-icon-search" circle type="warning" @click="drawer = true"></el-button>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="12">
        <el-button @click.prevent="exportCurrent" class="fr" type="primary">匯出當前資料 <i class="el-icon-upload2"></i></el-button>
      </el-col>
    </el-row>


    

    <el-row>
      <el-col :xs="24" :sm="24" :lg="24">
        <el-main>
          <el-table :data="tableData" empty-text="目前尚無資料" stripe header-row-class-name="headerStyle">
            <el-table-column label="最近拜訪時間">
              <template slot-scope="props">
                {{ props.row.createdAtLabel}}
              </template>
            </el-table-column>
            <el-table-column prop="customer.company" label="客戶">
            </el-table-column>
            <el-table-column prop="customer.address" label="地址" width="400">
            </el-table-column>
            <el-table-column prop="user.username" label="業務人員">
            </el-table-column>
          </el-table>
        </el-main>
      </el-col>
    </el-row>
    


    <!-------------------------------------------------------------------->
    <!-- drawer -->
    <!-------------------------------------------------------------------->
    <el-row>  
      <el-drawer
          size="70%"
          title="搜尋"
          :visible.sync="drawer"
          :direction="direction"
          :before-close="handleClose">

          <el-row>
            <el-col :xs="24" :sm="24" :lg="24">
              <el-select v-model="form.area1" placeholder="選擇地區1" @change="loadArea2()" class="ml-10">
                <el-option
                    v-for="item in areaOption1"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
              </el-select>
            </el-col>
          </el-row>

           <el-row>
            <el-col :xs="24" :sm="24" :lg="24">
              <el-select v-model="form.area2" placeholder="選擇地區2" @change="loadArea3()" class="ml-10 mt-10">
                <el-option
                    v-for="item in areaOption2"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
              </el-select>
            </el-col>
          </el-row>

           <el-row>
            <el-col :xs="24" :sm="24" :lg="24">
              <el-select v-model="form.area3" placeholder="選擇地區3" class="ml-10 mt-10">
                <el-option
                    v-for="item in areaOption3"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
              </el-select>
            </el-col>
          </el-row>

          


          <el-row>
            <el-col :xs="24" :sm="24" :lg="24" class="ml-10 mt-10">
              <span class="demonstration">起</span>
              <br/>
              <el-date-picker
                v-model="form.startDate"
                type="date"
                format="yyyy/MM/dd"
                value-format="yyyy/MM/dd"
                placeholder="選擇日期" class="mt-10">
              </el-date-picker>
            </el-col>
          </el-row>

          <el-row>
            <el-col :xs="24" :sm="24" :lg="24" class="ml-10 mt-10">
              <span >迄</span>
                <br/>
                <el-date-picker
                  v-model="form.endDate"
                  type="date"
                  format="yyyy/MM/dd"
                  value-format="yyyy/MM/dd"
                  placeholder="選擇日期" class="mt-10">
                </el-date-picker>
            </el-col>
          </el-row>

          

        <el-button type="primary" @click.prevent="search" class="ml-10 mt-10">查詢</el-button>
        
        <el-button type="normal" @click.prevent="clearQuery" class="ml-10 mt-10">清除條件</el-button>
          
        </el-drawer>
    </el-row>
  </div>

</template>

<script>
import {mapState} from 'vuex'
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";

export default {
  name: "CustomerMaintain",
  components: {
    Breadcrumb
  },
  data() {
    let checkName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('請輸入資料'))
      } else {
        callback()
      }
    }

    return {
      drawer: false,
      direction: 'ltr',
      
      tableData: [],
      areaOption1: [],
      areaOption2: [],
      areaOption3: [],
      custTypeOption: [
        {value: '設計公司/設計師', label: '設計公司/設計師'},
        {value: '裝修工程公司', label: '裝修工程公司'},
        {value: '木工師傅 / 個人裝修單位', label: '木工師傅 / 個人裝修單位'},
      ],
      
      form:{
        startDate:'',
        endDate:'',
        area1:'',
        area2:'',
        area3:''
      },
      
      queryField: '',
      keyword: '',
      pageNum: 1,
      pageSize: 10,
      total: 0
    }
  },
  computed: {
    ...mapState('login', ['userInfo']),
  },
  methods: {
    handleClose(){
      this.drawer = false
    },
    
    search() {
      this.drawer = false
      this.loadData()
    },
    
    clearQuery() {
      this.form.startDate = ''
      this.form.endDate = ''
      this.form.area1 = ''
      this.form.area2 = ''
      this.form.area3 = ''
      this.loadData()
    },

    /** data crud **/
    loadData() {
      

      let {startDate, endDate, area1, area2, area3} = this.form

      // this.request.get(`/customer/visited?pageNum=${data.pageNum}&pageSize=${data.pageSize}&queryField=${data.queryField}&keyword=${data.keyword}&area1=${data.area1}&area2=${data.area2}&area3=${data.area3}`).then(res => {
      //     this.tableData = res.data.records
      //     this.total = res.data.total
      // })

      this.request.get(`/customer/visit-history?startDate=${startDate}&endDate=${endDate}&area1=${area1}&area2=${area2}&area3=${area3}`).then(res => {
          this.tableData = res.data
          // this.total = res.data.total
      })

    },

    exportCurrent() {
      let {startDate, endDate, area1, area2, area3} = this.form
      let url = `/customer/visit-history/export-current?startDate=${startDate}&endDate=${endDate}&area1=${area1}&area2=${area2}&area3=${area3}`
      window.open(process.env.VUE_APP_API_SERVER+url, "new")
    },
    
    loadArea1() {
      this.request.get("/area/area1").then(res => {
        if (res.code === '200') {
          this.areaOption1 = res.data
        } else {
          this.showResult('error', '無法取得地區1資料')
        }
      })
    },
    loadArea2() {
      this.request.get("/area/area2/" + this.form.area1).then(res => {
        if (res.code === '200') {
          this.areaOption2 = res.data
        } else {
          this.showResult('error', '無法取得地區2資料')
        }
      })
    },
    loadArea3() {
      this.request.get("/area/area3/" + this.form.area2).then(res => {
        if (res.code === '200') {
          this.areaOption3 = res.data
        } else {
          this.showResult('error', '無法取得地區3資料')
        }
      })
    },
    
    
    
  },
  mounted() {
    this.loadData()
    this.loadArea1()
  }
}
</script>

<style scoped>
.el-table {
  border-radius: 10px;
  padding: 20px;
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

.start_import {
  display: block;
}

.stop_import {
  display: none;
}


</style>
