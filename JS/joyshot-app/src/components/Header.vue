<template>
  <div>
    <header class="siteHeader" itemscope="itemscope" itemtype="https://schema.org/WPHeader">
      <div class="headerBox" ref="headerBox">
        <div class="top">
          <div class="logo" itemprop="headline">
            <router-link to="/" itemprop="url">
              <img class="picAnimated" data-src="" alt="JOYSHOT" src="@/assets/logo.svg" />
            </router-link>
          </div>

          <div class="menuSearch">
            <div class="searchBox">
              <input type="text" readonly class="form-control search-input" name="search" :placeholder="$t('buttons.search_photographer')" @click.stop="searchOpen"/>
              <button class="searchBtn" ref="searchBtn" @click.stop="searchOpen">{{ $t('buttons.booking') }}</button>
            </div>

            <!-- 搜尋表單區塊，由showSearchBox變數來決定是否顯示 -->
            <div class="bottom" :class="showSearchBox">
              <div class="content"  >
                <!-- <div class="clear-query">
                  <el-tooltip class="item" effect="dark" content="清除查詢條件" placement="top-start">
                    <el-button type="danger" icon="el-icon-refresh" circle @click="clearSearchCondition"></el-button>
                  </el-tooltip>
                </div> -->

                <div class="block typeBox" v-if="form.query_assign_photographer !== ''" style="display:flex;">
                  <div class="blockTitle">{{ $t('Components.Header.specify_photographer') }}</div>
                  <div class="item" >
                    <input type="text" class="inputUse" readonly v-model="form.query_assign_photographer"/>
                  </div>
                  <div >
                    <el-button type="warning" icon="el-icon-circle-close" :title="$t('Components.Header.cancel_specify')" @click="removeReserve">{{ $t('Components.Header.cancel_specify') }}</el-button>
                  </div>

                </div>



                <!--服務項目-->
                <div class="block typeBox" >
                  <div class="blockTitle" >
                    {{ $t('search_bar.service') }}
                    <font color='#f37a69'>{{ $t('search_bar.service_note') }}</font>
                  </div>
                  <div class="listBox">
                    <label class="item" :class="{ 'service-active': form.query_service === service.id}"  v-for="(service,index) in serviceList" :key="service.id">
                      <input @click.stop.prevent="handleSelectedService(service.id)" type="radio" title="title" style="display: none;" />
                      <div class="pic">
                        <img v-if="service.fileUuid" :src="showImage(service.fileUuid)">
                      </div>
                      <div class="txt">{{ translate(service, "name") }}</div>
                    </label>
                  </div>
                </div>

                <!--日期-->
                <div class="block dateBox" >
                  <div class="blockTitle">{{ $t('search_bar.date_picker') }}</div>
                  <div class="listBox">
                    <!-- <el-card class="box-card" style="width: 100%;" v-loading="true"> -->
                    <input type="text" class="date-picker-text" ref="dp1" :data-language="$i18n.locale" />
                  <!-- </el-card> -->
                  </div>
                </div>

                <!--地點查詢框-->
                <div class="block mapBox">
                  <div class="blockTitle" ref="querylocation">{{ $t('search_bar.pick_location') }}
                    <span class="remind">:{{ $t('Components.Header.location_hint') }}</span>
                  </div>

                    <el-autocomplete
                      popper-class="location-search"
                      class="inline-input full-width-input keyword-input"
                      v-model="form.query_location"
                      clearable
                      :debounce=700
                      suffix-icon="el-icon-search"
                      :fetch-suggestions="findLocation"
                      :placeholder="$t('search_bar.location_keyword')"
                      :trigger-on-focus="false"
                      @clear="locationNotValid=false"
                      @select="handleSelect"
                     >
                      <template slot-scope="{ item }">
                        <div class="value">{{ item.name }} ({{ item.formatted_address }}) {{item.rating}}⭐️ </div>
                      </template>
                    </el-autocomplete>
                </div>

                <div style="text-align: center; color: red;" v-if="locationNotValid">
                  <span>{{ $t('Components.Header.empty_hint') }}</span>
                </div>

                <!--時段與時數-->
                <div class="block timeBox">
                  <div class="blockTitle">
                    {{ $t('search_bar.time_picker') }}

                  </div>
                  <div class="listBox">
                    <div class="item">
                      <select class="inputUse" v-model="form.query_hour">
                        <option :value="-1">{{ $t('search_bar.time_picker_hour') }}</option>
                        <option :value="i" v-for="(i,idx) in hourArray" :key="i">{{i}}</option>
                      </select>
                    </div>
                    <span>：</span>
                    <div class="item">
                      <select class="inputUse" v-model="form.query_minute">
                        <option :value="-1">{{ $t('search_bar.time_picker_minute') }}</option>
                        <option :value="i" v-for="(i,idx) in minuteArray" :key="i">{{i}}</option>
                      </select>
                    </div>
                  </div>
                  <div class="blockTitle">{{ $t('search_bar.shooting_duration') }}</div>
                  <div class="listBox">
                    <div class="item">
                      <select class="inputUse hour" v-model="form.query_duration">
                        <option :value="-1">{{ $t('search_bar.how_many_hour') }}</option>
                        <option :value="i" v-for="(i,idx) in durationArray" :key="i">{{i}}</option>
                      </select>
                    </div>
                  </div>
                </div>




                <!--設定拍攝人數與寵物資訊-->
                <div class="block peopleBox">
                  <div class="blockTitle">{{ $t('search_bar.pick_person') }}</div>
                  <div class="listBox">
                    <div class="item">
                      <label for="adults">{{ $t('search_bar.pick_adults') }}</label>
                      <select class="inputUse" v-model="form.adults">
                        <option :value="i" v-for="(i,idx) in adultsArray" :key="i">{{i}}</option>
                        <option :value="99">{{ $t('Components.Header.more_than_ten') }}</option>
                      </select>
                    </div>
                    <div class="item">
                      <label for="children">{{ $t('search_bar.pick_children') }}</label>
                      <select class="inputUse" v-model="form.children">
                        <option :value="i" v-for="(i,idx) in childsArray" :key="i">{{i}}</option>
                        <option :value="99">{{ $t('Components.Header.more_than_ten') }}</option>
                      </select>
                    </div>
                  </div>
                  <div class="listBoxBottom">
                    <div class="checkPets">
                      <input type="checkbox" v-model="form.checkPets" name="checkPets" id="checkPets" @change="setPets"/>
                      <label for="checkPets">{{ $t('search_bar.has_pets') }}</label>
                    </div>

                    <div class="item">
                      <input type="text" v-model="form.petsNote" class="inputUse" name="info" :placeholder="$t('search_bar.pets_note')" />
                    </div>
                  </div>
                </div>

                <div class="btnBox">
                  <button @click.stop="queryPhotographer">{{ $t('buttons.book_now2') }}</button>
                </div>


              </div>
            </div>
            <!-- End 搜尋表單區塊 -->

          </div>

          <div class="menuBox">
            <!-- 選單 -->
            <TopMenu/>
          </div>

          <div class="rightNav">
            <!-- 語言切換 -->
            <HeaderNav/>
          </div>
        </div>
      </div>
      <!-- <div class="mobileBtn"></div> -->
    </header>

    <el-dialog :title="$t('Components.Header.enter_address')"
               :visible.sync="dialogFormVisible"
               width="90%">
    <el-form label-position="top"
               :model="form"
               ref="dataForm" class="myform">
        <el-row>
          <el-autocomplete
            popper-class="location-search"
            class="inline-input full-width-input keyword-input"
            v-model="form.query_location"
            :debounce=500
            clearable
            suffix-icon="el-icon-search"
            :fetch-suggestions="findLocation"
            :placeholder="$t('search_bar.location_keyword')"
            :trigger-on-focus="false"
            @select="handleSelect">
            <template slot-scope="{ item }">
              <div class="value">{{ item.name }} ({{ item.formatted_address }}) {{item.rating}}⭐️ </div>
            </template>
          </el-autocomplete>
        </el-row>

      </el-form>


    </el-dialog>
  </div>
</template>


<script>

import HeaderNav from '@/components/HeaderNav'
import TopMenu from '@/components/TopMenu'
import AirDatepicker from 'air-datepicker';
import localeEn from 'air-datepicker/locale/en';
import localeZh from 'air-datepicker/locale/zh';
import dayjs from "dayjs";
import axios from "axios";
import { nanoid } from 'nanoid'

export default {
  name: 'Header',
  components: {
    HeaderNav,TopMenu
  },
  data(){
    return {
      hourArray:[8,9,10,11,12,13,14,15,16,17,18,19,20,21,22],
      minuteArray:['00','10','20','30','40','50'],
      durationArray:[1,1.5,2,2.5,3,3.5,4,4.5,5,5.5,6,6.5,7,7.5,8],
      adultsArray:[0,1,2,3,4,5,6,7,8,9,10],
      childsArray:[0,1,2,3,4,5,6,7,8,9,10],
      serviceList:[],
      radio1: '',
      inSearchMode: false,
      mode: '',
      locationOptions: [],
      showSearchBox: '',//控制搜尋表單是否顯示
      locationKeyword:'',
      locationNotValid:false,
      selected_formatted_address: '',
      form:{
        query_service:-1,
        query_date:'',
        query_hour:-1,
        query_minute:-1,
        query_duration:1,
        adults:0,
        children:0,
        checkPets:false,
        petsNote:'',

        query_placeId:'',
        query_placeName:'',
        query_location:'',
        city:'',
        city_area:'',
        query_zipcode:0,

        lat:0,
        lng:0,

        query_assign_photographer:'',
        query_assign_ph_uuid:''
      },
      locationList:[],
      minHour:1,
      deviceType: 'desktop',
      dialogFormVisible:false
    }
  },
  computed:{
    dateLocale(){
        return this.$i18n.locale === 'zh'? localeZh : localeEn
    }
  },
  props:['changeSearchMode','appInSearchMode'],
  methods:{
    moveToTop(){
      if (this.deviceType === 'mobile') {
        // alert('mobile')
        this.dialogFormVisible = true
        // alert('mobile')
      } else {
        console.log('desktop')
      }
      //console.log('onfocus moveToTop:', this.$refs.querylocation)
      // window.scrollTo({top: 0, behavior: 'smooth'})
      // this.$refs.querylocation.scrollTo = 20
      //this.$refs['querylocation'].scrollIntoView({behavior: 'smooth'})

    },
    //取消指定
    removeReserve(){
      this.form.query_assign_photographer = ''
      this.form.query_assign_ph_uuid = ''
    },
    setPets(){
      if (this.form.checkPets === false) {
        this.form.petsNote = ''
      }
    },

    /**保留之後顯示地圖用**/
    showMap(placeId){
      //console.log(placeId)
    },

    clearAddressInfo(){
      this.form.query_placeId = ''
      this.form.formatted_address = ''
      this.form.lat = 0
      this.form.lng = 0
      this.form.city_area = ''
      this.form.city = ''
      this.locationList = []
    },

    async findLocation(str, cb){
      console.log('發請求:', str)
      this.clearAddressInfo()

      let query = {}
      query.query = str
      query.lang = (this.$i18n.locale) === 'zh' ? 'zh-TW': 'en-US'
      axios.get('/place-api/textsearch', { params: query })
        .then((res) => {
          if (res.status === 200) {

            if (res.data.results.length > 6) {
              this.locationList = res.data.results.slice(0,6)
            } else {
              this.locationList = res.data.results
            }

            let result = this.locationList.filter(item => {
              let formatted_address = item.formatted_address
              if (formatted_address !== undefined) {
                let zipcode = formatted_address.substring(0,3)
                console.log(formatted_address, ' zipcode:', zipcode)
                return !isNaN(zipcode)
              } else {
                return false
              }
            });

            cb(result)
          }
        })
        .catch((error) => { console.error(error) })
        .finally(() => {})

    },
    handleSelect(item){
      // console.log('handleSelect:', item)
      this.form.query_location = item.name + ' (' + item.formatted_address + ')'
      this.form.query_placeId = item.place_id
      this.form.query_placeName= item.name
      this.selected_formatted_address = item.formatted_address

      console.log('handleSelect　item.plus_code:', item.plus_code)
      if (typeof item.plus_code === 'undefined') {
        //再發一次請求，取得縣市鄉鎮資料
        console.log('再發一次請求:', item.name)
        let query = {}
        query.query = item.name
        query.lang = (this.$i18n.locale) === 'zh' ? 'zh-TW': 'en-US'
        axios.get('/place-api/textsearch', { params: query })
          .then((res) => {

            if (res.status === 200) {
              if (res.data.results.length > 0) {
                const places = res.data.results

                for (var i=0 ; i<places.length ; i++) {
                  let place = places[i]
                  console.log(i, ' place:', place)

                  this.form.query_placeId = place.place_id
                  this.form.formatted_address = place.formatted_address
                  this.form.lat = place.geometry.location.lat
                  this.form.lng = place.geometry.location.lng

                  if (place.plus_code) {
                    let code = place.plus_code.compound_code.split(" ")
                    this.form.city_area = code[1] //區
                    this.form.city = code[2]//縣市
                    break;
                  } else {
                    console.log('沒有place_code')
                  }
                }

                console.log('form.city=', this.form.city)
                if (this.form.city === '' || this.form.city === undefined) {

                  //拆解地址
                  let formatted_address = this.selected_formatted_address

                  //取得前三碼，若非數字，表示無郵遞區號
                  let zipcode = formatted_address.substring(0,3)
                  console.log('前三碼=', zipcode)
                  if (!isNaN(zipcode)) {

                    this.request.get('/area-zipcode/'+zipcode).then(res => {
                      if (res.code === '200') {
                        console.log('縣市=', res.data)
                        this.form.city_area = res.data.cityArea
                        this.form.city = res.data.city
                      } else{
                        this.showResult('error', '取得縣市資料失敗')
                      }
                    })
                  } else {
                    console.log('無前三碼，給預設：', formatted_address)
// TODO
                    if (formatted_address.indexOf('金門縣') != -1) {
                      this.form.city = '金門縣'
                      this.form.city_area = '金城鎮'
                    } else if (formatted_address.indexOf('連江縣') != -1) {
                      this.form.city = '連江縣'
                      this.form.city_area = '南竿鄉'
                    } else if (formatted_address.indexOf('澎湖縣') != -1) {
                      this.form.city = '澎湖縣'
                      this.form.city_area = '馬公市'
                    } else {
                      //不應若入此情境
                      this.locationNotValid = true
                      this.form.city = ''
                      this.form.city_area = ''
                    }
                  }

                  // this.showResult('error', this.$t('action.get_error', {err: '此景點在google地圖並沒有完整的鄉鎮區資料，請重新搜尋附近景點'}))
                }
              }
            }
          })
          .catch((error) => { console.error(error) })
          .finally(() => {})
      } else {
        //已有鄉鎮資料
        console.log('已有鄉鎮資料:', item.plus_code.compound_code)
        let code = item.plus_code.compound_code.split(" ")

        console.log('鄉鎮資料長度: ', code.length)
        let zipcode = this.selected_formatted_address.substring(0,3)
        console.log('zipcode ', zipcode)
        if (code.length != 3) {//地點縣市資料不完整
          console.log('地點縣市資料不完整，給預設：')
// TODO
          if (item.formatted_address.indexOf('金門縣') != -1) {
            this.form.query_zipcode = 893
            this.form.city = '金門縣'
            this.form.city_area = '金城鎮'
          } else if (item.formatted_address.indexOf('連江縣') != -1) {
            this.form.query_zipcode = 209
            this.form.city = '連江縣'
            this.form.city_area = '南竿鄉'
          } else if (item.formatted_address.indexOf('澎湖縣') != -1) {
            this.form.query_zipcode = 880
            this.form.city = '澎湖縣'
            this.form.city_area = '馬公市'
          } else {


            if (!isNaN(zipcode)) {
              this.request.get('/area-zipcode/'+zipcode).then(res => {
                if (res.code === '200') {
                  console.log('縣市=', res.data)
                  this.form.query_zipcode = zipcode
                  this.form.city_area = res.data.cityArea
                  this.form.city = res.data.city
                } else{
                  //不應若入此情境
                  this.locationNotValid = true
                  this.form.city = ''
                  this.form.city_area = ''
                }
              })
            }

          }

        } else {
          this.form.query_zipcode = zipcode
          this.form.city_area = code[1] //區
          this.form.city = code[2]//縣市
        }

        this.form.formatted_address = item.formatted_address
        this.form.lat = item.geometry.location.lat
        this.form.lng = item.geometry.location.lng
        this.locationNotValid = false
      }
    },

    handleSelectedService(serviceId){
      this.form.query_service = serviceId
    },

    queryPhotographer(){

        // this.mode = ''
        // this.$bus.$emit('leaveSearchMode', '')

      if (this.formValidate()) {

        //把查詢條件放store
        this.$store.commit('jsapp/SAVE_SEARCH_CONDITION', this.form)


        let resultPage = {name: 'Match'}
        let query = {
          //使用亂數id，讓查詢component知道要觸發查詢
          queryId: nanoid()
        }

        if (this.form.query_assign_ph_uuid !== '') {
          query.reserved='y'
        }else{
          query.reserved='n'
        }
        resultPage.query = query

        fbq('track', 'Search');

        this.$emit('appInSearchMode',  {mode:''})
        this.$router.push(resultPage).catch(()=>{})
      }
    },

    formValidate(){


      //確認資料輸入完整
      let {query_service,query_location,query_date,query_hour,query_minute,query_duration,adults,children,checkPets,petsNote,city,city_area } = this.form


      let msg = ''
      if (query_service == -1) { msg += this.$t('Components.Header.no_service_cat') + '<br/>'}
      if (query_date === '') { msg += this.$t('Components.Header.no_date') + '<br/>' }
      if (query_hour == -1 || query_minute == -1) { msg += this.$t('Components.Header.no_time') + '<br/>' }
      if (query_duration == -1) { msg += this.$t('Components.Header.no_hours') + '<br/>' }
      if (query_duration < this.minHour) { msg += this.$t('Components.Header.selected_info', {location: `${this.form.city}${this.form.city_area}`, hours: `${this.minHour}`}) + `<br/>` }
      if (query_location === '') { msg += this.$t('Components.Header.no_location') + '<br/>' }

      if (adults == -1 && children == -1) { msg += this.$t('Components.Header.no_people') + '<br/>' }
      if (adults == 0 && children == 0) { msg += this.$t('Components.Header.zero_people') + '<br/>' }
      if (adults == 0 && children == -1) { msg += this.$t('Components.Header.zero_people') + '<br/>' }
      if (adults == -1 && children == 0) { msg += this.$t('Components.Header.zero_people') + '<br/>' }

      if (checkPets && petsNote === '') { msg += this.$t('Components.Header.no_pet') + '<br/>' }

      if (city === '' && city_area === '') { msg += this.$t('Components.Header.incomplete_location') + '<br/>' }





      if (msg !== '') {
         this.$alert(msg, this.$t('Components.Header.notice'), {
          confirmButtonText: 'OK',
          dangerouslyUseHTMLString:true,
          callback: action => {
            return false
          }
        });
      } else {
        return true
      }

    },

    handleScroll(){
//      console.log('handleScroll', window.scrollY)
      if (window.scrollY == 0) {
        this.mode = ''
      } else {
        this.mode = 'headFix'
      }
    },
    searchOpen(){
      if (!this.inSearchMode) {
        console.log('App.vue 進入查詢模式')
        // this.$bus.$emit('AppInSearchMode', {mode:'searchOpen'})
        this.$emit('appInSearchMode', {mode:'searchOpen'})
        this.showSearchBox = 'showSearchBox'
        console.log('Header 展開查詢表單')
        this.inSearchMode = !this.inSearchMode
      } else {
        console.log('Header已經在查詢模式了')
      }
    },
    handleBodyClick(){
      if (this.inSearchMode) {
        this.mode = 'headFix'
        this.showSearchBox = ''
        this.inSearchMode = !this.inSearchMode
      }
    },

    loadService() {

      let query = {
        pageNum: 1,
        pageSize: 10
      }

      this.request.get("/service-cat", {params: query}).then(res => {
        if (res.code === '200') {
          this.serviceList = res.data.records
        } else {
          this.showResult('error', this.$t('action.get_error', {err: 'error'}))
        }
      })
    },

    clearSearchCondition(){
      console.log('訂單送出，清除查詢條件')
      this.form.query_service = -1
      // this.form.query_date = ''
      this.form.query_hour = -1
      this.form.query_minute = -1
      this.form.query_duration = 1
      this.form.adults = 0
      this.form.children = 0
      this.form.checkPets = false
      this.form.petsNote = ''

      this.form.query_placeId = ''
      this.form.query_placeName = ''
      this.form.query_location = ''
      this.form.city = ''
      this.form.city_area = ''

      // this.form.lat = 0
      // this.form.lng = 0
      this.form.formatted_address = ''

      this.form.query_assign_photographer = ''
      this.form.query_assign_ph_uuid = ''

      this.minHour = 1

    },

    queryMinHour(){
      console.log('queryMinHour:', this.form.city, this.form.city_area)

      if (this.form.city !== '') {
        let _city = this.form.city;
        let _district = this.form.city_area;

        if (this.form.city.length > 3) { //拆解
          _city = this.form.city.substring(0,3);
          _district = this.form.city.substring(3, this.form.city.length);
        }

        let query = {
          city: _city,
          district: _district
        }
        this.request.get('/area/min-hour',{params:query}).then(res => {
          if (res.code === '200') {
            this.minHour = res.data
          } else {
            this.minHour = 1
            //this.showResult('error', this.$t('action.get_error', {err: 'error'}))
          }
          console.log('minHour:', this.minHour);
        })
      }


    }
  },
  mounted(){

    const platform = navigator.platform.toLowerCase();
    if (/(android|webos|iphone|ipad|ipod|blackberry|windows phone)/.test(platform)) {
        this.deviceType = 'mobile';
    }

    let vm = this
    // let {query_date} = this.form


    this.$on('dateSelected', (results)=>{
       console.log('收到日期:', results)
      this.form.query_date = results
    })


    // 初始化Calendar
    new AirDatepicker( this.$refs.dp1,{
        query_dates:[this.query_date],
        inline: true,
        locale: this.dateLocale,
        minDate: dayjs().add(3, 'day'),
        dateFormat: 'yyyy/MM/dd',
        // buttons: ['today'],
        onSelect(date) {
          vm.$emit("dateSelected", date.formattedDate);
        },
        // onChangeView(view){
        //   console.log(view)
        //   // if (view=="months") {
        //   //   console.log()
        //   // }
        // },
        onRenderCell(cell){
          // console.log('cell:', cell)
        },
        onChangeViewDate(view){
          console.log('view:', view)
        }
      }
    );


    this.loadService()

    //監聽是否進行搜尋，如果是，則展開搜尋條件表單
    this.$bus.$on('HeaderInSearchMode', (results)=>{
      this.showSearchBox = 'showSearchBox'
      this.inSearchMode = !this.inSearchMode
      if (results.name && results.name !== '') {
        this.form.query_assign_photographer = results.name
        this.form.query_assign_ph_uuid = results.ph_uuid
      }


      // if (results.mode === 'headFix') {
      //   this.showSearchBox = ''
      //   this.inSearchMode = ''
      // } else {
      //   this.showSearchBox = 'showSearchBox'
      //   this.inSearchMode = !this.inSearchMode

      //   //搜尋指定攝影師

      //   if (results.name && results.name != '') {
      //     this.form.query_assign_photographer = results.name
      //     this.form.query_assign_ph_uuid = results.ph_uuid
      //   }
      // }
    })

    //監聽是否離開搜尋
    this.$bus.$on('HeaderLeaveSearchMode', (results)=>{
      if (results.mode === '') {
        this.showSearchBox = results.mode
        this.inSearchMode = false
      }
    })

    //監聽是否離開搜尋
    this.$bus.$on('OrderSubmitted', (results)=>{
      this.clearSearchCondition()
    })

  },
  watch:{
    //監測 district
    "form.city_area":{
      handler(newValue, oldValue){
        console.log('watch city_area:', this.form.city_area)
        this.queryMinHour()
      }
    }
  }
}
</script>

<style scoped>

.showSearchBox {
  display: block;
  box-shadow: 0 0 2px #f37a69;
}
.service-active {
  border: 4px solid #f27968 !important;
}
.date-picker-text {
  display: none;
}
.keyword-input {
  width: 100%;
}
.keyword-input >>> .el-input__inner {
  border-radius: 10px !important;
  background: #f6f6f6 !important;
}
.clear-query {
  text-align: right;
    margin-right: 20px;
    margin-top: 20px;
}

.menuSearch .bottom .block + .block {
  text-align: center;
}
.menuSearch {
  overscroll-behavior: contain ;
}
.menuSearch .bottom .dateBox .air-datepicker {
  width: 100%;
}
.listBox .air-datepicker--content {
  font-size: 20px;
}

.location-search >>> .el-scrollbar {
  max-height: 150px !important;
}

.search-input::placeholder {
  color: #b1b1b1 !important;
}

.remind{
  font-size:13px;
  color: #f37a69;
}

</style>
