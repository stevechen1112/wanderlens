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
    

    


    <!-------------------------------------------------------------------->
    <!-- table -->
    <!-------------------------------------------------------------------->
    <el-col :xs="24" :sm="24" :lg="24">
      <el-main>
        <!-- <div><p>統計日期: {{startDate}}</p></div> -->
        <el-table class="mt-20" :data="tableData" empty-text="目前尚無資料" stripe header-row-class-name="headerStyle">
          <el-table-column prop="username" label="姓名" width="120">
          </el-table-column>
          <el-table-column prop="title" label="申請單">
            <template slot-scope="props">
              <p><a :href="`#${props.row.todoUrl}${props.row.id}?from=report`">{{ props.row.title}}</a></p>
            </template>
          </el-table-column>
          <el-table-column prop="startDate" label="日期">
            <template slot-scope="props">
              <p><b>{{ props.row.startDate | fmtDate }}</b></p>
            </template>
          </el-table-column>
          <el-table-column prop="carType" label="交通工具">
          </el-table-column>
          <el-table-column prop="startMile" label="哩程">
            <template slot-scope="props">
              <p>{{ props.row.startMile }}~{{ props.row.endMile }}</p>
            </template>
          </el-table-column>
          <el-table-column prop="myMile" label="哩程統計">
          </el-table-column>
        </el-table>
      </el-main>
    </el-col>

    <!-------------------------------------------------------------------->
    <!-- dialog -->
    <!-------------------------------------------------------------------->
    
  </el-row>

  <el-drawer
        size="70%"
        title="搜尋哩程統計"
        :visible.sync="drawer"
        :direction="direction"
        :before-close="handleClose">

        <el-main>
            <!-- <el-row class="ml-20 mr-20" >
              <el-col :xs="24" :sm="24" :lg="24">
                <el-select v-model="queryField" placeholder="選擇申請單類型" style="padding: 0 0 0 20px">
                <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
              </el-select>
                  
              </el-col>
            </el-row> -->

            <el-row class="mr-20" >
              <el-col :xs="24" :sm="24" :lg="24">
                <span class="demonstration">起</span>
                <br/>
                  <el-date-picker
                    v-model="startDate"
                    type="date"
                    format="yyyy/MM/dd"
                  value-format="yyyy/MM/dd"
                    placeholder="選擇日期" class="mt-10">
                  </el-date-picker>
              </el-col>
            </el-row>

            <el-row class="mr-20 mt-20" >
              <el-col :xs="24" :sm="24" :lg="24">
                <span >迄</span>
                <br/>
                <el-date-picker
                  v-model="endDate"
                  type="date"
                  format="yyyy/MM/dd"
                  value-format="yyyy/MM/dd"
                  placeholder="選擇日期" class="mt-10">
                </el-date-picker>
              </el-col>
            </el-row>
            
            <el-row class="mr-20 mt-20" >
              <el-col :xs="24" :sm="24" :lg="24">
                <span >人員</span>
                <br/>
                <el-autocomplete
                  class="inline-input full-width-input mt-10"
                  v-model="empLabel"
                  :fetch-suggestions="queryEmp"
                  placeholder="輸入工號或姓名"
                  :trigger-on-focus="false"
                  @select="handleSelect"
                  clearable
                  @clear="empId=''"
                ></el-autocomplete>
              </el-col>
            </el-row>

          </el-main>

      <el-button type="primary" @click.prevent="search" class="ml-20">查詢</el-button>
      <el-button type="normal" @click.prevent="clearQuery" class="ml-10">清除條件</el-button>
      

     
    </el-drawer>

 

</div>
</template>

<script>
import {mapState} from 'vuex'
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import dayjs from "dayjs";

export default {
  name: "MilesStatistic",
  components: {
    Breadcrumb
  },
  data() {
    return {
      drawer:false,
      direction: 'ltr',

      // queryField:'',
      empId:'',
      empLabel:'',
      startDate:'',
      endDate:'',
      tableData:[]

      // options: [
      //   {value: 'req_pay', label: '請款單' }, 
      //   {value: 'req_buy', label: '請購單'},
      //   {value: 'petty-cash', label: '零用金請款單'}
      // ],

    }
  },
  computed: {
    ...mapState('login', ['userInfo']),
  },
  methods: {
    handleClose(){
      this.drawer = false
    },

    loadData(){
      let {startDate, endDate, empId} = this
      let url = "/report/miles?startDate="+startDate+"&endDate="+endDate+"&empId="+empId
      this.request.get(url).then(res => {
          if (res.code === '200') {
            this.tableData = res.data
          } else {
            this.showResult('success', '資料取得失敗')
          }
        })
    },

    search(){
      this.drawer = false
      let q = {
        startDate: this.startDate,
        endDate: this.endDate,
        empId: this.empId,
        empLabel: this.empLabel
      }
      localStorage.setItem('LH_MILES_REPORT_QUERY', JSON.stringify(q))
      this.loadData()
    },
    clearQuery(){
      this.drawer = false
      this.startDate = dayjs().format('YYYY/MM/DD')
      this.endDate = ''
      this.empId = ''
      this.empLabel = ''
      this.loadData()
    },
    queryEmp(str, cb){
      
      this.request.get("/user/q?keyword=" + str).then(res => {
        if (res.code === '200') {

          let list = res.data.map((item) => {
            return {
              value: item.username,
              id: item.id 
            }
          })
          cb(list)
        }
      })
    },
    handleSelect(item) {
      this.empId = item.id
    },
    exportCurrent() {
      let {startDate, endDate, empId} = this
      let url = "/report/miles/export-current?startDate="+startDate+"&endDate="+endDate+"&empId="+empId
      window.open(process.env.VUE_APP_API_SERVER+url, "new")
    }

  },
  mounted() {
    let cache = localStorage.getItem('LH_MILES_REPORT_QUERY')
    let cacheObj = JSON.parse(cache)
    if (cache !== null) {
      this.startDate = cacheObj.startDate
      this.endDate = cacheObj.endDate
      this.empId = (typeof cacheObj.empId === 'undefined')? '': cacheObj.empId
      this.empLabel = (typeof cacheObj.empLabel === 'undefined')? '': cacheObj.empLabel
    } else {
      this.startDate = dayjs().format('YYYY/MM/DD')
    }

    this.loadData()
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
