<template>
  <div class="dashboard">

    <panel-group @handleSetLineChartData="handleSetLineChartData" />


  </div>
</template>

<script>

import PanelGroup from './admin/components/PanelGroup'
import store from "@/store";
//import {removeToken} from "@/util";

const lineChartData = {
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145]
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130]
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130]
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130]
  }
}


export default {
  name: 'Dashboard',
  data() {
    return {
      tableData: [],
      menuTableData: [],
      dailyList:[],
      notDailyList:[],
      appVersion: localStorage.getItem('JS_VERSION'),
      lineChartData: lineChartData.newVisitis
    }
  },
  components:{
    PanelGroup
  },
  methods: {
    handleSetLineChartData(){
      // eslint-disable-next-line
      this.lineChartData = lineChartData[type]
    },
    loadActionLog() {
      this.request.get("/user/log").then(res => {
        console.log(res)
        if (res.code === '200') {
          this.tableData = res.data.records
        } else {
          this.showResult('error', '無法取得使用紀錄')
        }

      })
    },
    async loadUserBadge() {
      try {
        await store.dispatch('login/getUserBadge')
      } catch (e) {
        this.showResult('error', 'load_badge_error')
      }
    },
    loadUserMenuShortCut(){
      this.request.get("/user/shortcut").then(res => {
          if (res.code === '200') {
            this.menuTableData = res.data

            this.dailyList = this.menuTableData.filter(data => data.daily === 'Y')
            // console.log('dailyList:', this.dailyList)

            this.notDailyList = this.menuTableData.filter(data => data.daily === 'N')
            // console.log('notDailyList:', this.notDailyList)

          } else {
            this.showResult("error", "查詢使用者功能捷徑資料失敗")
          }
      })
    },
    checkReload(){
      console.log('appVersion:', this.appVersion)
      console.log('static version:', this.version)
      if (this.appVersion === null) {
        localStorage.setItem('JS_VERSION', this.version)
        location.reload()
      } else {
        if (this.appVersion !== this.version) {
          localStorage.setItem('JS_VERSION', this.version)
          this.appVersion = this.version
          window.location.reload()
        }
      }
    },

  },
  filters: {
    transformType(value) {
      let label = ''
      switch (value) {
        case '登入':
          label = "primary"
          break;
        case '登出':
          label = "warning"
          break;
        default:
          label = "danger"
      }
      return label
    }
  },
  mounted() {
    this.checkReload()
    // this.loadUserBadge();
    // this.loadUserMenuShortCut()
  }
}
</script>

<style scoped>

.el-table {
  font-size:16px;
}
.dashboard >>> .el-card__body {
  padding: 20px 0px;
}


</style>
