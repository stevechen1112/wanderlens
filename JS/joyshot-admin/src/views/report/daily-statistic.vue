<template>
  <div>
  <el-row :gutter="20" class="top-block">
    <Breadcrumb :route="this.$route"></Breadcrumb>
  </el-row>

  <el-row class="ml-20 mr-20" >
    <el-col :xs="12" :sm="12" :lg="12">
      <el-button icon="el-icon-search" circle type="warning" @click="drawer = true"></el-button>
    </el-col>
  </el-row>

  <el-row> 
    

    


    <!-------------------------------------------------------------------->
    <!-- table -->
    <!-------------------------------------------------------------------->
    <el-col :xs="24" :sm="24" :lg="24">
      <el-main>
        <div><p>統計日期: {{startDate}}</p></div>
        <el-table class="mt-20" :data="tableData" empty-text="目前尚無資料" stripe header-row-class-name="headerStyle">
          <el-table-column prop="username" label="姓名" width="120">
          </el-table-column>
          <el-table-column prop="cnt" label="日誌">
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
        title="工作日誌查詢"
        :visible.sync="drawer"
        :direction="direction"
        :before-close="handleClose">

        <el-main>
          <el-row class="mr-20" >
            <el-col :xs="24" :sm="24" :lg="24">
              <span class="demonstration">日誌日期</span>
                <el-date-picker
                  v-model="startDate"
                  type="date"
                  format="yyyy/MM/dd"
                  value-format="yyyy/MM/dd"
                  placeholder="選擇日期" class="mt-10">
                </el-date-picker>
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
  name: "DailyReportStatistic",
  components: {
    Breadcrumb
  },
  data() {
    

    return {
      drawer:false,
      direction: 'ltr',

      startDate:'',
      tableData:[]
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
      this.request.get("/report/daily?date="+this.startDate).then(res => {
          if (res.code === '200') {
            this.tableData = res.data
          } else {
            this.showResult('success', '資料取得失敗')
          }
        })
    },

    search(){
      this.drawer = false
      this.loadData()
    },
    clearQuery(){
      this.drawer = false
      this.startDate = dayjs().format('YYYY/MM/DD')
      this.loadData()
    }


  },
  mounted() {
    this.startDate = dayjs().format('YYYY/MM/DD')
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
