<template>
  <div>
    <el-row class="mb-20-r mt-20">
      <el-col :xs="24" :sm="24" :lg="12" style="text-align: left;" >
        <h1>{{ queried.year }}年{{ queried.month }}月</h1>

        <el-button type="primary" @click="lastMonth"><i class="el-icon-back"></i></el-button>
        <el-button type="primary" @click="backToToday">今日</el-button>
        <el-button type="primary" @click="nextMonth" class="mr-20"><i class="el-icon-right"></i></el-button>
      </el-col>

      <!-- <el-col :xs="24" :sm="24" :lg="8" class="text-right">
        <div>每月的第一天為星期幾:{{queried.day.first}}</div>
        <div>每月最後一天為星期幾:{{queried.day.last}}</div>
        <div>日期:{{slot}}</div>
      </el-col> -->
      <el-col :xs="24" :sm="24" :lg="12" class="text-right">
        <el-button type="warning" @click="setWholeMonth" class="ml-20"><i class="el-icon-date"></i> 設定</el-button>
      </el-col>
    </el-row>

    <!--星期幾標示-->
    <el-row>
      <el-col :xs="24" :sm="24" :lg="lgSpan" style="padding: 1px 1px 4px;" v-for="(w,idx) in labelOfWeek" :key="idx">
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
              <!-- <el-checkbox label="" name="ddd"></el-checkbox> -->
            </div>
            <div class="bottom clearfix day-grid-data"
                 v-for="(schedule) in scheduleList.filter((schedule) => booked(schedule, s))" :key="schedule.id">

              <el-popconfirm v-if="schedule.active=='Y'"
                      class="ml-10 popconfirm-bg"
                      title="確定刪除此筆資料嗎?"
                      confirm-button-text="確定"
                      cancel-button-text="取消"
                      icon="el-icon-info"
                      icon-color="red"
                      @confirm="handleDelete(schedule.id)"
                  >
                  <el-tag slot="reference">
                    {{schedule.slotStartLabel}}-{{schedule.slotEndLabel}}
                    <span class="schedule-slot">X</span>
                  </el-tag>
              </el-popconfirm>

              <!-- 已被預約的，設定不同顏色，並且不能刪除 -->
              <el-tag slot="reference" v-else type="warning">
                {{schedule.slotStartLabel}}-{{schedule.slotEndLabel}}
              </el-tag>

            </div>

          </div>

          <div v-else class="day-grid dummy">
          </div>

        </el-card>
      </el-col>
    </el-row>


    <el-dialog title="設定攝影師接案時段"
               :visible.sync="dialogFormVisible"
               width="600px"
               @close="closeDialog">



      <!--星期幾標示-->

      <el-row class="mb-20 ">
        <el-col :xs="24" :sm="24" :lg="8">
           <div class="schedule-title">{{ queried.year }}年{{ queried.month }}月</div>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="4" class="mr-20">
           <div class="schedule-title">
            <label>開始時段</label>
            <el-select placeholder="選擇開始時段" v-model="hourStart" class="mt-10">
              <el-option
                v-for="item in hourArray"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
           </div>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="4">
           <div class="schedule-title">
            <label>結束時段</label>
            <el-select placeholder="選擇結束時段" v-model="hourEnd" class="mt-10">
              <el-option
                v-for="item in hourArray.filter((item) => item.value >= 10)"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
           </div>
        </el-col>
      </el-row>

      <el-row>
        <el-col :xs="24" :sm="24" :lg="lgSpan" style="padding: 1px 1px 4px;" v-for="(w,idx) in labelOfWeek" :key="idx">
          <el-card :body-style="{ padding: '10px', textAlign:'center' }"><h4>{{w}}</h4></el-card>
        </el-col>
      </el-row>

      <el-row>
        <el-col :xs="24" :sm="24" :lg="24">

            <el-checkbox-group v-model="daySlotChecked" class="chkbox-group">
              <el-checkbox-button :disabled="s === ''" v-for="(s, index) in slot" :label="s" :key="index">
               {{s!=''? parseInt(s): s}}
              </el-checkbox-button>
            </el-checkbox-group>

        </el-col>
      </el-row>


      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="saveScheduleData('dataForm')">確認</el-button>
      </div>
    </el-dialog>



  </div>
</template>

<script>

import {mapState} from 'vuex'
import dayjs from "dayjs";

export default {
  name: 'PhotographerSchedule',
  components:{

  },
  computed:{
    ...mapState('login', ['userInfo'])
  },
  data(){
    return {
      hourStart:8,
      hourEnd:18,
      hourArray:[
        {value: 8,label: '08:00'},
        {value: 9,label: '09:00'},
        {value: 10,label: '10:00'},
        {value: 11,label: '11:00'},
        {value: 12,label: '12:00'},
        {value: 13,label: '13:00'},
        {value: 14,label: '14:00'},
        {value: 15,label: '15:00'},
        {value: 16,label: '16:00'},
        {value: 17,label: '17:00'},
        {value: 18,label: '18:00'},
        {value: 19,label: '19:00'},
        {value: 20,label: '20:00'},
        {value: 21,label: '21:00'},
        {value: 22,label: '22:00'}
      ],

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

      dialogFormVisible:false,

      scheduleList:[],
      daySlotChecked:[],//批次設定時，挑選了哪些日期
      phId:''


    }
  },
  methods:{

    booked(schedule, slot){
      var ymd = schedule.scheduleDate.split("/")
      return slot === ymd[2]
    },
    setWholeMonth(){
      this.dialogFormVisible = true
      this.daySlotChecked = []
      this.hourStart = 8
      this.hourEnd = 18
    },
    saveScheduleData(){
      // console.log(this.queried.year)
      // console.log(this.queried.month)
      // console.log(this.daySlotChecked)
      // console.log(this.hourStart)
      // console.log(this.hourEnd)

      let info = {
        year: this.queried.year,
        month: this.queried.month,
        daySlotChecked: this.daySlotChecked,
        hourStart: this.hourStart,
        hourEnd: this.hourEnd,
        phId: this.phId
      }
      if (this.daySlotChecked.length > 0) {
        this.request.post('/photographer/schedule/'+this.phId, info ).then(res => {
          if (res.code === '200') {
            this.dialogFormVisible = false
            this.showResult('success', '資料更新成功')
            this.loadData()
          } else {
            this.showResult('error', this.$t('action.get_error', {err: 'error'}))
          }
        })
      } else {
        this.dialogFormVisible = false
      }


    },
    closeDialog(){

    },
    handleDelete(sId){
      this.request.delete('/photographer/schedule/'+sId).then(res => {
        if (res.code === '200') {
          this.showResult('success', '資料刪除成功')
          this.loadData()
        } else {
          this.showResult('error', this.$t('action.delete_error', {err: 'error'}))
        }
      })

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

    //一進入頁面後，先顯示目前的年月
    prepareQuery() {
      const now = dayjs()
      this.queried.title = now.format('YYYY年MM月')
      this.queried.year = now.year()
      this.queried.month = now.month()+1
      this.queried.dd = now.date()
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
    },
    loadData(){
      //有日期後，再發查詢
      let query = {
        phId: this.phId,
        year: this.queried.year,
        month: this.queried.month
      }

      this.request.get('/photographer/schedule',{params: query}).then(res => {
          if (res.code === '200') {
            // console.log(res.data)
            this.scheduleList = res.data

            this.getCalendar()

          } else {
            this.showResult('error', this.$t('action.get_error', {err: 'error'}))
          }
        })
    }
  },
  mounted(){
    // this.phId = parseInt(this.$route.params.pid)
    this.phId = this.userInfo.phId
    this.prepareQuery()
  }
}

</script>

<style scoped>
  .el-col-lg-7 {
    width: 14.28%;
  }
  .time {
    font-size: 13px;
    color: #999;
  }

  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  /*.button {
    padding: 0;
    float: right;
  }*/

  .image {
    width: 100%;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
      display: table;
      content: "";
  }

  .clearfix:after {
      clear: both
  }
  .mb-20-r {
    margin-bottom: 20px;
    text-align: center;
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

  .chkbox-group >>> .el-checkbox-button__inner{
    width: -moz-calc((600px - 40px) / 7);
    width: -webkit-calc((600px - 40px) / 7);
    width: calc((600px - 40px) / 7);
    height: 40px;
  }
</style>


