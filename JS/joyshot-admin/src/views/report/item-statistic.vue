<!-- 我的用品請領單 -->

<template>
  <div>
    <el-row :gutter="20" class="top-block">
      <Breadcrumb :route="this.$route"></Breadcrumb>
    </el-row>


    <el-row class="ml-20 mr-20" >
        <el-col :xs="12" :sm="12" :lg="12">
          <el-button icon="el-icon-search" circle type="warning" @click="drawer = true"></el-button>
        </el-col>
        <el-col :xs="12" :sm="12" :lg="12" >
          <el-button @click.prevent="exportCurrent" class="fr" type="primary">Export Current Result<i class="el-icon-upload2"></i></el-button>
        </el-col>
    </el-row >


    <el-row class="ml-20 mr-20">
      <el-col :xs="24" :sm="24" :lg="24">
          <el-main class="mymain">
            <el-table id="item_table" :data="tableData" empty-text="No Data" stripe header-row-class-name="headerStyle">
              <el-table-column prop="username" label="User">
              </el-table-column>
              <el-table-column prop="itemType" label="Item Cat." >
              </el-table-column>
              <el-table-column prop="itemName" label="Item Name" >
              </el-table-column>
              <el-table-column prop="stock" label="Checkout Qty" >
              </el-table-column>
              <el-table-column label="Action" width="300">
                <template slot-scope="scope">
                  <el-button type="warning" @click="viewDetail(scope.row)">Detail <i class="el-icon-edit"></i></el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-main>
      </el-col>
    </el-row>

    <el-drawer
        size="70%"
        title="Application Query"
        :visible.sync="drawer"
        :direction="direction"
        :before-close="handleClose">

        
            
      <el-row class="ml-20" >
        <el-col :xs="24" :sm="24" :lg="24">
          <span >User</span>
          <br/>
          <el-autocomplete
            class="inline-input full-width-input mt-10"
            v-model="empLabel"
            :fetch-suggestions="queryEmp"
            placeholder="Enter account"
            :trigger-on-focus="false"
            @select="handleSelect"
            clearable
            @clear="empId=''"
          ></el-autocomplete>
        </el-col>
      </el-row>

      <el-button type="primary" @click.prevent="search" class="mt-20 ml-20">Query</el-button>
      <el-button type="normal" @click.prevent="clearQuery" class="mt-20 ml-10">Clear</el-button>
     
    </el-drawer>

  </div>

</template>

<script>
import {mapState} from 'vuex'
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";

export default {
  name: "ItemUsageStatistic",
  components: {
    Breadcrumb
  },
  data() {
    return {
      drawer:false,
      direction: 'ltr',

      empId:'',
      empLabel:'',
      tableData:[] 
    }
  },
  methods: {
    search(){
      this.drawer = false
      let q = {
        empId: this.empId,
        empLabel: this.empLabel
      }
      localStorage.setItem('LH_ITEM_USAGE_REPORT_QUERY', JSON.stringify(q))
      this.loadData()
    },
    clearQuery(){
      this.drawer = false
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
    handleClose(){
      this.drawer = false
    },
    handleSelect(item) {
      this.empId = item.id
    },
    exportCurrent() {
      let {empId} = this
      let url = "/report/item-usage/export-current?empId="+empId
      window.open(process.env.VUE_APP_API_SERVER+url, "new")
    },
    viewDetail(rowData){
      this.$router.push('/report/item-statistic-detail/'+rowData.itemId+'/' + rowData.userId)
    },
    loadData(){
      let {empId} = this
      let url = "/report/item-usage?empId="+empId
      this.request.get(url).then(res => {
          if (res.code === '200') {
            this.tableData = res.data
          } else {
            this.showResult('success', '資料取得失敗')
          }
        })
    },
    
  },
  computed: {
    ...mapState('login', ['userInfo']),
  },
  mounted() {

    let cache = localStorage.getItem('LH_ITEM_USAGE_REPORT_QUERY')
    let cacheObj = JSON.parse(cache)
    if (cache !== null) {
      this.empId = (typeof cacheObj.empId === 'undefined')? '': cacheObj.empId
      this.empLabel = (typeof cacheObj.empLabel === 'undefined')? '': cacheObj.empLabel
    } 

    this.loadData()
  }
}
</script>

<style scoped>

.el-main {
  padding: 20px 0;
}
</style>
