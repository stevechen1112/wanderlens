<template>
  <div>
    <el-row :gutter="20" class="top-block">
      <Breadcrumb :route="this.$route"></Breadcrumb>
    </el-row>

    <el-row class="mb-20-r mt-20">

     	<el-col :xs="24" :sm="24" :lg="5">
      	<el-main>
	        <el-table :data="groupByTableData"
	                default-expand-all
	                row-key="id"
	                :empty-text="$t('message.no_data')"
	                stripe header-row-class-name="headerStyle">
		        <el-table-column :label="$t('page.user_maintain.column.area',{count: photographerStatistic})" >
		          <template slot-scope="scope">
		            <el-button type="text" @click.prevent="searchTerm(scope.row.col)"> {{scope.row.col}} ({{scope.row.count}})</el-button>
		          </template>
		        </el-table-column>
		      </el-table>
	      </el-main>
	    </el-col>
      <el-col :xs="24" :sm="24" :lg="19" class="mymain">
      	<el-main>
      		<el-row class="mb-20">
			      <el-col :xs="24" :sm="24" :lg="18">
			        <h1>{{ queried.year }}年{{ queried.month }}月</h1>
			        <el-button type="primary" @click="lastMonth"><i class="el-icon-back"></i></el-button>
			        <el-button type="primary" @click="backToToday">今日</el-button>
			        <el-button type="primary" @click="nextMonth" class="mr-20"><i class="el-icon-right"></i></el-button>
			      </el-col>
            <el-col :xs="24" :sm="24" :lg="6">
              <span class="query-city">查詢縣市：{{this.city}}</span>
            </el-col>
			    </el-row>

      		<!--星期幾標示-->
	      	<el-row>
			      <el-col :xs="24" :sm="24" :lg="lgSpan"  style="padding: 1px 1px 4px;" v-for="(w,idx) in labelOfWeek" :key="idx">
			        <el-card :body-style="{ padding: '10px', textAlign:'center' }"><h4>{{w}}</h4></el-card>
			      </el-col>
			    </el-row>

			    <!--日期-->
			    <el-row>
			      <el-col :xs="24" :sm="24" :lg="lgSpan" v-for="(s, index) in slot" :key="index" style="padding: 1px;">
			        <el-card :body-style="{ padding: '0px' }">
			          <div class="day-grid" v-if="s != ''">
			            <h3 :class="isToday(s)">{{queried.month}}/{{parseInt(s)}}</h3>
			            <div>
                    <p><br/></p>
			            </div>

                  <div class="bottom clearfix day-grid-data"
                       v-for="(schedule) in scheduleList.filter((schedule) => booked(schedule, s))"
                       :key="schedule.scheduleDate">

                    <el-tag slot="reference" @click="openSchedule(schedule)">
                      {{(!schedule.reservedSeats)? 0: schedule.reservedSeats}} / {{schedule.allSeats}}
                    </el-tag>

                  </div>


			          </div>
			          <div v-else class="day-grid dummy">
			          </div>
			        </el-card>
			      </el-col>
			    </el-row>

			  </el-main>
      </el-col>

	  </el-row>



    <el-dialog title="攝影師"
             :visible.sync="dialogFormVisible">
      <el-row class="mb-20-r mt-20">
        <el-col :xs="24" :sm="24" :lg="24">
          <el-table :data="photographerScheduleTable"
                  default-expand-all
                  row-key="id"
                  empty-text="無資料"
                  stripe header-row-class-name="headerStyle">
            <el-table-column label="攝影師" width="200">
              <template slot-scope="scope">
                <div>{{scope.row.photographer.name}}({{scope.row.photographer.nickName}})</div>
              </template>
            </el-table-column>
            <el-table-column label="日期" prop="scheduleDate">
            </el-table-column>
            <el-table-column label="接案時段">
              <template slot-scope="scope">
                <div>{{scope.row.slotStartLabel}}~{{scope.row.slotEndLabel}}</div>
              </template>
            </el-table-column>
            <el-table-column label="可預約" prop="active">
            </el-table-column>
            <el-table-column label="">
              <template slot-scope="scope">
                <div>
                  <a :href="`${fontend}/photographer/${scope.row.photographer.phUuid}`" target="_new">
                    攝影師詳情
                  </a>
                </div>
              </template>
            </el-table-column>

          </el-table>
        </el-col>
      </el-row>
    </el-dialog>



  </div>
</template>

<script>

import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import dayjs from "dayjs";

export default {
  name: "PhotographerDashboard",
  components: {
    Breadcrumb
  },
  computed:{
    photographerStatistic(){
      return `上架:${this.livePhotographerCount} / 全部:${this.totalPhotographer}`
    }
  },
  data() {


    return {
      fontend: process.env.VUE_APP_FRONTEND,
      totalPhotographer:0,
      livePhotographerCount:0,
      groupByTableData:[],

      labelOfWeek:['一','二','三','四','五','六','日'],
      slot:[], //放置日期
      currentDate: new Date(),
      lgSpan: {span: '7'},
      days:['01','02','03','04','05','06','07','08','09','10',
        '11','12','13','14','15','16','17','18','19','20',
        '21','22','23','24','25','26','27','28','29','30','31'],

      daysInMonth:[], //每個月有多少天

      queried:{
        year: 0,
        month: 0,
        dd:0,
        title: '',
        day:{
          first: 0,
          last: 0
        }
      },
      city:'',
      scheduleList:[],

      dialogFormVisible:false,
      photographerScheduleTable:[],

      photographerList:[]

    }
  },
  methods: {
    openPhotographer(){
      // eslint-disable-next-line
      wndow.open()
    },
    openSchedule(schedule){
      console.log(schedule)
      let query = {
        city: this.city,
        scheduleDate: schedule.scheduleDate
      }
      this.request.get('/photographer/date',{params: query}).then(res => {
        if (res.code === '200') {
          this.photographerScheduleTable = res.data
          this.dialogFormVisible = true
        } else {
          this.showResult('error', 'Error')
        }
      })


    },
    booked(schedule, slot){
      var ymd = schedule.scheduleDate.split("/")
      return slot === ymd[2]
    },
  	isToday(s){
      const now = dayjs()
      if (this.queried.year == now.year() &&
          this.queried.month == now.month()+1 &&
          this.queried.dd == parseInt(s)) {
        return 'today'
      }
      return ''
    },
  	loadData(){
  		let query = {
        city: this.city,
        year: this.queried.year,
        month: this.queried.month
      }

      this.request.get('/photographer/area/schedule',{params: query}).then(res => {
        if (res.code === '200') {
          // console.log(res.data)
          this.scheduleList = res.data


          this.getCalendar()

        } else {
          this.showResult('error', this.$t('action.get_error', {err: 'error'}))
        }
      })

  		this.getCalendar()
  	},
    /**點擊分區後**/
    searchTerm(term){
      this.queryField = 'city'
      this.city = term
      this.loadData()
    },

		backToToday(){
      const now = dayjs()
      this.queried.year = now.year()
      this.queried.month = now.month()+1
      this.loadData()

    },
    lastMonth(){
      if (this.queried.month == 1) {
        this.queried.month = 12
        this.queried.year -= 1
      } else {
        this.queried.month -= 1
      }
      this.loadData()
    },
    nextMonth(){
      if (this.queried.month == 12) {
          this.queried.month = 1
          this.queried.year += 1
        } else {
          this.queried.month += 1
        }
        this.loadData()
    },

    /**負責取得攝影師分區的資料**/
    loadGroupbyData() {
      this.request.get("/photographer/groupby").then(res => {
        if (res.code === '200') {
          this.totalPhotographer = 0
          this.groupByTableData = res.data
          res.data.forEach(element => {
            this.totalPhotographer += element.count
          });
        }
      })

      this.request.get("/photographer/live/all").then(res => {
        if (res.code === '200') {
          this.livePhotographerCount = res.data
        }
      })
    },

    //一進入頁面後，先顯示目前的年月
    prepareQuery() {
      const now = dayjs()
      this.queried.title = now.format('YYYY年MM月')
      this.queried.year = now.year()
      this.queried.month = now.month()+1
      this.queried.dd = now.date()
      this.loadData()
      // this.getCalendar()
    },
    getCalendar(){
      this.daysList()
      this.prepareDaySlot()
    },
    //取得該月份的日期陣列
    daysList(){
      let daysCount = dayjs(`${this.queried.year}/${this.queried.month}/1`).daysInMonth()

      //收集每個月有多少天
      this.daysInMonth = this.days.filter((d,idx) => idx < daysCount)
    },
    //取得的行事曆再進行加工，補齊空白
    prepareDaySlot() {
      const temp = this.queried.year + '/' + this.queried.month + '/1'

      // 每月一號為星期幾
      this.queried.day.first = dayjs(temp).startOf("month").day()
      // //每月最後一天為星期幾
      this.queried.day.last = dayjs(temp).endOf("month").day()

      this.slot = this.daysInMonth

      //該月份的第一天不是星期一，補齊前面的空白日期
      // //queried.day.first > 0 表示星期一~星期六，星期天為0
      if (this.queried.day.first > 0) {
        //補空資料
        let empty = Array(this.queried.day.first-1).fill().map(() => '');
        //串接原日期資料
        this.slot = empty.concat(this.slot);
      } else {
        //星期天，前面補6個空
        let empty = Array(6).fill().map(() => '');
        this.slot = empty.concat(this.slot);
      }

      //該月份的最後一天不是星期日，補齊後面的空白日期
      if (this.queried.day.last > 0) {
        //補空資料
        let empty = Array(7-this.queried.day.last).fill().map(() => '');
        //串接原日期資料
        this.slot = this.slot.concat(empty);
      }
    }


  },
  mounted() {
    this.loadGroupbyData()
    this.prepareQuery()
  }
}
</script>

<style scoped>

.el-col-lg-7 {
    width: 14.28%;
  }

.day-grid {
  height: 64px;
  padding: 16px 10px;
}
.day-grid.dummy {

  background-color: lightgrey;

}
.day-grid-data{
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.day-grid-data >>> .el-tag {
  font-size: 15px;
}
.schedule-slot{
  font-size:8px;
  padding:1px 4px;
  border-radius:999px;
  border: 1px solid;
}
.today {
  color: white;
  display: inline;
  padding: 4px;
  border-radius: 8px;
  background-color: #F17B6D;
}
h1{
  font-size: 30px;
  display: inline-block;
  margin-right: 20px;
  vertical-align: middle;
}
.schedule-title{
  font-size: 18px;
  text-align: center;
}

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


/deep/ .el-upload-dragger {
  width: 260px !important;
  border: 3px dashed #d9d9d9;
}

.el-form--label-top >>> .el-form-item__label {
  padding: 0;
}
.query-city {
  font-size: 20px;
}

</style>
