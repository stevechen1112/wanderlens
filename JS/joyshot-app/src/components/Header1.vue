<template>
	<header class="siteHeader" itemscope="itemscope" itemtype="https://schema.org/WPHeader">
    <div class="headerBox">
      <div class="top">
        <div class="logo" itemprop="headline">
          <router-link to="/" itemprop="url">
            <img class="picAnimated" data-src="" alt="JOYSHOT" src="@/assets/logo.svg" />
          </router-link>
        </div>

        <div class="menuSearch">
          <div class="searchBox">
            <div class="closeClassType">
              <button class="moibleSearchBtn" type="submit">{{ $t('Components.Header1.search_photographer') }}</button>
              <input @click.stop.prevent="openSearchForm" type="text" class="form-control" name="search" :placeholder="$t('Components.Header1.search_photographer2')" />
              <button class="searchBtn" type="submit">{{ $t('buttons.search') }}</button>
            </div>
            <div class="openClassType">
              <ul>
                <li class="typeBox" v-html="$t('Components.Header1.search_category')"></li>
                <li class="mapBox" v-html="$t('Components.Header1.search_location')"></li>
                <li class="dateBox" v-html="$t('Components.Header1.search_date')"></li>
                <li class="timeBox" v-html="$t('Components.Header1.search_time')"></li>
                <li class="peopleBox" v-html="$t('Components.Header1.search_people')"></li>
              </ul>
              <button class="searchBtn" type="submit">{{ $t('buttons.search') }}</button>
            </div>
          </div>
          <div class="bottom">
            <div class="content">
              <button class="close"></button>
              <div class="block typeBox">
                <div class="gatherTitle">{{ $t('Components.Header1.category') }}<span class="currentText"></span></div>
                <div class="panel">
                  <div class="blockTitle" >
                    {{ $t('search_bar.service') }}
                    <font color='red'>{{ $t('search_bar.service_note') }}</font>
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
              </div>
              <div class="block mapBox">
                <div class="gatherTitle">{{ $t('Components.Header1.location') }}<span class="currentText"></span></div>
                <div class="panel">
                  <div class="blockTitle">{{ $t('Components.Header1.choose_location') }}</div>
                  <div class="listBox">
                    <select class="inputUse searchMap searchIcon">
                      <option value="幾小時">{{ $t('Components.Header1.hours') }}</option>
                      <option value="01">01</option>
                      <option value="02">02</option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="block dateBox">
                <div class="gatherTitle">{{ $t('Components.Header1.date') }}<span class="currentText"></span></div>
                <div class="panel">
                  <div class="blockTitle">{{ $t('Components.Header1.choose_date') }}</div>
                  <div class="listBox">
                    <input type="text" id="dpMin" data-language="zh" />
                    <input type="text" id="dpMax" data-language="zh" />
                  </div>
                </div>
                <div class="btn">
                  <button type="submit" class="skip">{{ $t('Components.Header1.skip') }}</button>
                  <button type="submit" class="continue">{{ $t('Components.Header1.continue') }}</button>
                </div>
              </div>
              <div class="block timeBox">
                <div class="gatherTitle">{{ $t('Components.Header1.time_and_hours') }}<span class="currentText"></span></div>
                <div class="panel">
                  <div class="blockTitle">{{ $t('Components.Header1.choose_time') }}</div>
                  <div class="listBox">
                    <div class="item">
                      <select class="inputUse chooseHour">
                        <option value="時">{{ $t('Components.Header1.min') }}</option>
                        <option value="01">01</option>
                        <option value="02">02</option>
                        <option value="03">03</option>
                        <option value="05">05</option>
                        <option value="04">04</option>
                        <option value="06">06</option>
                        <option value="07">07</option>
                        <option value="08">08</option>
                        <option value="09">09</option>
                        <option value="10">10</option>
                        <option value="11">11</option>
                        <option value="12">12</option>
                        <option value="13">13</option>
                        <option value="14">14</option>
                        <option value="15">15</option>
                        <option value="16">16</option>
                        <option value="17">17</option>
                        <option value="18">18</option>
                        <option value="19">19</option>
                        <option value="20">20</option>
                        <option value="21">21</option>
                        <option value="22">22</option>
                        <option value="23">23</option>
                        <option value="24">24</option>
                      </select>
                    </div>
                    <span>：</span>
                    <div class="item">
                      <select class="inputUse chooseMinute">
                        <option value="分">{{ $t('Components.Header1.min') }}</option>
                        <option value="01">01</option>
                        <option value="02">02</option>
                        <option value="03">03</option>
                        <option value="05">05</option>
                        <option value="04">04</option>
                        <option value="06">06</option>
                        <option value="07">07</option>
                        <option value="08">08</option>
                        <option value="09">09</option>
                        <option value="10">10</option>
                        <option value="11">11</option>
                        <option value="12">12</option>
                        <option value="13">13</option>
                        <option value="14">14</option>
                        <option value="15">15</option>
                        <option value="16">16</option>
                        <option value="17">17</option>
                        <option value="18">18</option>
                        <option value="19">19</option>
                        <option value="20">20</option>
                        <option value="21">21</option>
                        <option value="22">22</option>
                        <option value="23">23</option>
                        <option value="24">24</option>
                        <option value="25">25</option>
                        <option value="24">24</option>
                        <option value="26">26</option>
                        <option value="27">27</option>
                        <option value="28">28</option>
                        <option value="29">29</option>
                        <option value="30">30</option>
                        <option value="31">31</option>
                        <option value="32">32</option>
                        <option value="33">33</option>
                        <option value="35">35</option>
                        <option value="34">34</option>
                        <option value="36">36</option>
                        <option value="37">37</option>
                        <option value="38">38</option>
                        <option value="39">39</option>
                        <option value="40">40</option>
                        <option value="41">41</option>
                        <option value="42">42</option>
                        <option value="43">43</option>
                        <option value="45">45</option>
                        <option value="44">44</option>
                        <option value="46">46</option>
                        <option value="47">47</option>
                        <option value="48">48</option>
                        <option value="49">49</option>
                        <option value="50">50</option>
                        <option value="51">51</option>
                        <option value="52">52</option>
                        <option value="53">53</option>
                        <option value="55">55</option>
                        <option value="54">54</option>
                        <option value="56">56</option>
                        <option value="57">57</option>
                        <option value="58">58</option>
                        <option value="59">59</option>
                        <option value="60">60</option>
                      </select>
                    </div>
                  </div>
                  <div class="blockTitle">{{ $t('Components.Header1.choose_film_hours') }}</div>
                  <div class="listBox">
                    <div class="item">
                      <select class="inputUse hour">
                        <option value="幾小時">{{ $t('Components.Header1.hours') }}</option>
                        <option value="01">01</option>
                        <option value="02">02</option>
                        <option value="03">03</option>
                        <option value="05">05</option>
                        <option value="04">04</option>
                        <option value="06">06</option>
                        <option value="07">07</option>
                        <option value="08">08</option>
                        <option value="09">09</option>
                        <option value="10">10</option>
                        <option value="11">11</option>
                        <option value="12">12</option>
                        <option value="13">13</option>
                        <option value="14">14</option>
                        <option value="15">15</option>
                        <option value="16">16</option>
                        <option value="17">17</option>
                        <option value="18">18</option>
                        <option value="19">19</option>
                        <option value="20">20</option>
                        <option value="21">21</option>
                        <option value="22">22</option>
                        <option value="23">23</option>
                        <option value="24">24</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div class="block peopleBox">
                <div class="gatherTitle">{{ $t('Components.Header1.people_and_pets') }}<span class="currentText"></span></div>
                <div class="panel">
                  <div class="blockTitle">{{ $t('Components.Header1.choose_people') }}</div>
                  <div class="listBox">
                    <div class="item">
                      <select class="inputUse">
                        <option value="大人">{{ $t('Components.Header1.adults') }}</option>
                        <option value="01">01</option>
                        <option value="02">02</option>
                        <option value="03">03</option>
                        <option value="05">05</option>
                        <option value="04">04</option>
                        <option value="06">06</option>
                        <option value="07">07</option>
                        <option value="08">08</option>
                        <option value="09">09</option>
                        <option value="10">10</option>
                      </select>
                      <b>{{ $t('Components.Header1.adults2') }}</b>
                      <div class="numSelect">
                        <button class="reduce"></button>
                        <div class="num">0</div>
                        <button class="add active"></button>
                      </div>
                    </div>
                    <div class="item">
                      <select class="inputUse">
                        <option value="小孩">{{ $t('Components.Header1.child') }}</option>
                        <option value="01">01</option>
                        <option value="02">02</option>
                        <option value="03">03</option>
                        <option value="05">05</option>
                        <option value="04">04</option>
                        <option value="06">06</option>
                        <option value="07">07</option>
                        <option value="08">08</option>
                        <option value="09">09</option>
                        <option value="10">10</option>
                      </select>
                      <b>{{ $t('Components.Header1.child') }}</b>
                      <div class="numSelect">
                        <button class="reduce"></button>
                        <div class="num">0</div>
                        <button class="add active"></button>
                      </div>
                    </div>
                  </div>
                  <div class="listBoxBottom">
                    <div class="checkPets"><input type="checkbox" name="checkPets" id="checkPets" /><label for="checkPets">{{ $t('Components.Header1.with_pets') }}</label></div>
                    <div class="item">
                      <input type="text" class="inputUse" name="info" :placeholder="$t('Components.Header1.pets_placeholder')" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="btnBox">
              <button type="submit" class="clear">{{ $t('Components.Header1.clear_all') }}</button>
              <button type="submit" class="reserve">{{ $t('Components.Header1.booking_immediately') }}</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  </header>
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
	name: 'Header1',
	components:{
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
	props:['changeSearchMode','appInSearchMode'],
	methods:{
		handleScroll(){
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
    initSearch() {
    	let isMobile = this.isMobileDevice()

		  console.log('isMobile:', isMobile);
		  const searchBox = document.querySelector('.menuSearch');

		  if (isMobile) {
		    searchBox.classList.remove('pcMenu'); // new mobile search
		    searchBox.classList.add('moibleMenu');

		    // moibleSeatch();
		  } else {
		    searchBox.classList.remove('moibleMenu');
		    searchBox.classList.add('pcMenu'); // new pc search
		    this.NewPCSearch(); // new pc search

		    // OriginPCVersionSearch();
		  }
    },
    NewPCSearch() {
		  console.log('NewPCSearch')

		  let body = document.querySelector('body');
		  let overLayer = document.createElement('div');
		  overLayer.className = 'overLayer';
		  let searchInput = document.querySelector('.menuSearch .searchBox input');
		  const menuBox = document.querySelector('.menuBox');
		  const headerBox = document.querySelector('.headerBox');

		  const blocks = document.querySelectorAll('.pcMenu .bottom .content .block');
		  const openClassType = document.querySelector('.openClassType') || null;

		  if (openClassType !== null) {
		  	const classTypeItems = openClassType.querySelectorAll('li');

		  }
		},
    isMobileDevice() {
			return /Mobi|Android/i.test(navigator.userAgent);
		},
		closeAllBlocks(blocks) {
		  for (let i = 0; i < blocks.length; i++) {
		    blocks[i].style.display = 'none';
		  }
		},
		removeActiveMenus(classTypeItems) {
		  for (let j = 0; j < classTypeItems.length; j++) {
		    classTypeItems[j].classList.remove('active', 'active-prev', 'active-next');
		  }
		},

		//點擊查詢項目
		itemsSetActive(items, index) {
      const lastItemIndex = items.length - 1;
      items[index].classList.add('active');
      if (index === 0) {
        items[index].nextElementSibling.classList.add('active-next');
      }

      if (index > 0 && index < lastItemIndex) {
        items[index].nextElementSibling.classList.add('active-next');
        items[index].previousElementSibling.classList.add('active-prev');
      }

      if (index === lastItemIndex) {
        items[index].previousElementSibling.classList.add('active-prev');
      }
    },
    openSearchForm() {

    	let body = document.querySelector('body');
    	let overLayer = document.createElement('div');
		  overLayer.className = 'overLayer';

      body.append(overLayer);
      body.classList.toggle('searchOpen');
      document.querySelector('.menuSearch .bottom').style.display = 'block';

      const headerBox = document.querySelector('.headerBox');
      headerBox.classList.add('pcHeaderBox');

      // open first block
      const blocks = document.querySelectorAll('.pcMenu .bottom .content .block');
      const openClassType = document.querySelector('.openClassType') || null;
      const classTypeItems = openClassType.querySelectorAll('li');
      for (let i = 0; i < classTypeItems.length; i++) {
        classTypeItems[0].classList.add('active');
        classTypeItems[0].nextElementSibling.classList.add('active-next');
        blocks[0].style.display = 'block';
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
		handleSelectedService(serviceId){
      this.form.query_service = serviceId
    },




	},
	mounted(){
		this.initSearch()

		this.loadService()

	}
}

</script>

<style scoped>

.service-active {
  border: 4px solid #f27968 !important;
}


.siteHeader {
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 99;
  background: #fff;
}

.headerBox {
  position: relative;
  background: #fff;
}

@media screen and (max-width: 1000px) {
  .headerBox {
    text-align: center;
  }
}

.headerBox .top {
  padding: 24px 3%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  border-bottom: #dddddd 1px solid;
  position: relative;
  transition: all 0.3s ease;
}

.pcHeaderBox .top {
  justify-content: space-between;
}

@media screen and (max-width: 1000px) {
  .headerBox .top {
    flex-direction: column;
    justify-content: center;
    padding: 10px 0 0;
    border: none;
  }
}

.headerBox .logo {
  line-height: 0;
  margin: 0 auto 0 0;
  z-index: 90;
}

.pcHeaderBox .logo {
  margin: 0 150px 0 0;
}

@media screen and (max-width: 1000px) {
  .headerBox .logo {
    margin: 0 auto 10px;
  }

  .headerBox .logo img {
    height: 30px;
  }
}

.headFix .siteHeader {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.1);
}

.headFix .siteHeader .logo img {
  height: 30px;
}

.headFix .menuSearch {
  top: 13px;
}

@media screen and (max-width: 1000px) {
  .headFix .menuSearch {
    top: 0;
  }
}

.wrapper {
  padding-top: 100px;
}

@media screen and (max-width: 1000px) {
  .wrapper {
    padding-top: 97px;
  }
}

.wrapper .noticeBox {
  padding: 12px 0 10px;
  width: 100%;
  color: #fff;
  font-weight: 500;
  font-size: 1.125rem;
  text-align: center;
  letter-spacing: 2px;
  text-indent: 2px;
  position: absolute;
  left: 0;
  top: 0;
  background: rgba(82, 182, 204, 0.8);
  z-index: 5;
}

.wrapper .siteMain {
  min-height: 100px;
}

.wrapper .siteMain .mainBox {
  padding-top: 3%;
}

@media screen and (max-width: 1000px) {
  .wrapper .siteMain .mainBox {
    padding-top: 30px;
  }
}

.searchOpen .menuBox {
  width: 100%;
  right: 0;
  top: 0;
  bottom: 0;
  padding: 0;
}

@media screen and (min-width: 1260px) {
  .menuBox {
    position: absolute;
    padding: 0 150px 0 0;
  }
}

@media screen and (max-width: 1000px) {
  .menuBox {
    width: 100%;
    transition: none;
    position: relative;
    inset: auto;
    margin: 0;
    flex-direction: column;
    position: fixed;
    top: 50px;
    height: calc(100% - 50px);
    left: 0;
    background: #000;
    transform: translateX(-100%);
    padding: 0;
  }
}

.menuBox.active {
  transition: all 0.3s ease;
}

.menuBox .mainMenu {
  width: 100%;
  height: 100%;
  margin: 0;
  transition: all 0.3s ease;
}

@media screen and (max-width: 1000px) {
  .menuBox .mainMenu {
    order: 1;
  }
}

.menuBox .mainMenu > ul {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pcMenuBox .mainMenu > ul {
  display: none;
}

@media screen and (max-width: 1000px) {
  .menuBox .mainMenu > ul {
    display: block;
  }
}

.menuBox .mainMenu > ul > li {
  flex-shrink: 0;
  position: relative;
  margin: 0 20px;
}

@media screen and (max-width: 1000px) {
  .menuBox .mainMenu > ul > li {
    margin: 0;
  }
}

.menuBox .mainMenu > ul ul {
  background: #1a1a1a;
  display: none;
  position: absolute;
}

.menuBox .mainMenu a {
  white-space: nowrap;
  font-weight: 400;
  font-size: 1.125rem;
  display: block;
}

@media screen and (min-width: 1000px) {
  .menuBox .mainMenu a::after {
    content: '';
    border-bottom: solid 2px transparent;
    transform: scaleX(0);
    visibility: hidden;
    display: block;
    transition: all 0.3s ease;
  }

  .menuBox .mainMenu a:hover {
    color: #000;
  }

  .menuBox .mainMenu a:hover::after {
    border-color: #000;
    visibility: visible;
    transform: scaleX(1);
  }
}

@media screen and (max-width: 1000px) {
  .menuBox .mainMenu a {
    color: #fff;
    padding: 15px 20px;
  }

  .menuBox .mainMenu a:hover {
    color: #000;
    background: #fff;
  }

  .menuBox .mainMenu a:hover::after {
    display: none;
  }
}

.menuBox .mainMenu > ul > li > ul {
  position: fixed;
  left: 0;
  right: 0;
  background: #fff;
  border-top: #000 1px solid;
  display: none;
  flex-wrap: wrap;
  width: 100%;
  max-width: 1540px;
  left: 50%;
  transform: translateX(-50%);
}

.menuBox .mainMenu > ul > li > ul li {
  display: inline-block;
  margin: 0;
}

.menuBox .mainMenu > ul > li > ul a {
  display: block;
  padding: 20px;
}

.rightNav {
  display: flex;
}

.language,
.menuMember {
  position: relative;
  z-index: 8;
  margin: 0 0 0 30px;
}

@media screen and (max-width: 1000px) {
  .language,
  .menuMember {
    width: 50px;
    height: 50px;
    padding: 0;
    margin: 0;
    position: fixed;
    justify-content: center;
    align-items: center;
  }
}

.language .btn,
.menuMember .btn {
  position: relative;
  display: flex;
  align-items: center;
  height: 25px;
  cursor: pointer;
}

@media screen and (max-width: 1000px) {
  .language .btn,
  .menuMember .btn {
    width: 50px;
    height: 50px;
    padding-right: 0 !important;
    justify-content: center;
    align-items: center;
  }
}

.language .btn::before,
.menuMember .btn::before {
  content: '';
  width: 25px;
  height: 25px;
  display: block;
  background: #000;
}

.language .btn:hover span,
.menuMember .btn:hover span {
  color: #888;
}

.language .btn:hover::before,
.menuMember .btn:hover::before {
  background: #888;
}

.language .btn:hover::after,
.menuMember .btn:hover::after {
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 5px 4px 0 4px;
  border-color: #888 transparent transparent transparent;
}

.language ul,
.menuMember ul {
  width: 140px;
  left: 50%;
  transform: translateX(-50%);
  display: none;
  position: absolute;
  padding-top: 10px;
}

@media screen and (max-width: 1000px) {
  .language ul,
  .menuMember ul {
    padding-top: 0;
    position: fixed;
    top: 50px;
    width: 100%;
    left: 0%;
    transform: translateX(0%);
  }
}

.language ul a,
.menuMember ul a {
  white-space: nowrap;
  color: #fff;
  font-size: 0.875rem;
  display: block;
  padding: 5px 10px 3px;
  background: #000;
  text-align: center;
  transition: all 0.3s ease;
}

@media screen and (max-width: 1000px) {
  .language ul a,
  .menuMember ul a {
    padding: 8px 10px 6px;
  }
}

.language ul a:hover,
.menuMember ul a:hover {
  background: #fff;
  color: #000;
}

.active.language .btn::before,
.active.menuMember .btn::before {
  background: #888;
}

.active.language .btn span,
.active.menuMember .btn span {
  color: #888;
}

.overLayer {
  display: none;
  position: fixed;
  inset: 0;
  z-index: 90;
  background-color: rgba(0, 0, 0, 0.3);
}

.searchOpen .overLayer {
  display: block;
}

.searchOpen .menuSearch {
  left: 0;
  right: 0;
  background: #fff;
  top: calc(100% + 1px);
  bottom: auto;
  padding: 24px 0;
  position: absolute;
}

.searchOpen .pcMenu {
  position: relative;
  padding: 0;
  background: transparent;
  z-index: 10;
  max-width: 1100px;
}

@media screen and (max-width: 1000px) {
  .searchOpen .menuSearch {
    padding: 0px 0 0;
  }
}

@media screen and (max-width: 1000px) {
  .searchOpen .menuSearch.moibleMenu {
    z-index: 999;
  }
}

.menuSearch {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

@media screen and (min-width: 1260px) {
  .menuSearch {
    transition: all 0.3s ease;
    position: absolute;
    width: 100%;
    top: 24px;
    left: 0;
  }
}

@media screen and (max-width: 1000px) {
  .menuSearch {
    position: relative;
    width: 100%;
    top: 0;
  }
}

.menuSearch .searchBox {
  max-width: 330px;
  position: relative;
}

@media screen and (max-width: 1000px) {
  .menuSearch .searchBox {
    max-width: none;
    width: 100%;
  }
}

.menuSearch .searchBox input {
  border-radius: 30px;
  border: 1px solid #f37a69;
  padding: 15px 150px 15px 20px;
  color: 1.125rem;
  color: #000000;
  box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.2);
}

.menuSearch .searchBox .moibleSearchBtn {
  display: none;
}

@media screen and (max-width: 1000px) {
  .menuSearch .searchBox input {
    border-radius: 0px;
    box-shadow: none;
  }
}

@media screen and (max-width: 1000px) {
  .menuSearch .searchBox input {
    display: none;
  }

  .moibleMenu .searchBox .moibleSearchBtn {
    display: block;
    border: 1px solid #f37a69;
    padding: 15px 150px 15px 20px;
    color: #000000;
    width: 100%;
    text-align: left;
    font-weight: 400;
    background: #fff;
    font-size: 1.125rem;
  }
}

.menuSearch .searchBox input::-moz-placeholder {
  color: 1.125rem;
  color: #000000;
}

.menuSearch .searchBox input::placeholder {
  color: 1.125rem;
  color: #000000;
}

.menuSearch .searchBox .searchBtn {
  width: 40%;
  border: none;
  border-radius: 30px;
  background: #f37a69;
  position: relative;
  color: #fff;
  font-weight: 700;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  padding: 0 20px;
}

@media screen and (max-width: 1260px) {
  .menuSearch .searchBox .searchBtn {
    font-size: 1.125rem;
  }
}

@media screen and (max-width: 1000px) {
  .menuSearch .searchBox .searchBtn {
    width: auto;
    border-radius: 0;
  }
}



@media screen and (max-width: 1000px) {
  .menuSearch .searchBox .searchBtn::before {
    width: 20px;
    height: 20px;
  }
}

.searchOpen .pcMenu .searchBox {
  max-width: 1100px;
}

.searchBox .openClassType,
.searchOpen .pcMenu .closeClassType {
  display: none;
}

.searchOpen .pcMenu .openClassType {
  display: flex;
}

.pcMenu .openClassType ul {
  display: flex;
  border-radius: 32px;
  overflow: hidden;
  border-left: 1px solid #dddddd;
  border-right: 1px solid #dddddd;
}

.pcMenu .openClassType li {
  height: 49px;
  background: #f2f2f2;
  padding: 14px 32px;
  line-height: 21px;
  cursor: pointer;
  display: flex;
  border-top: 1px solid #dddddd;
  border-bottom: 1px solid #dddddd;
  overflow: hidden;
}

.pcMenu .openClassType li:last-child {
  border-radius: 0 32px 32px 0;
}

.pcMenu .openClassType li + li {
  border-left: 1px solid #ffffff;
}

.pcMenu .openClassType li:first-child.active {
  margin: 0 -20px 0 0;
}

.pcMenu .openClassType li:last-child.active {
  margin: 0 0 0-20px;
}

.pcMenu .openClassType li.active {
  background: #fff;
  border: 1px solid #f37a69;
  border-radius: 32px;
  padding-right: 160px;
  margin: 0 -20px;
  position: relative;
  z-index: 5;
}

.pcMenu .openClassType li.active-next {
  border-radius: 32px 0 0 32px;
}

.pcMenu .openClassType li.active-prev {
  border-radius: 0 32px 32px 0;
}

.pcMenu .openClassType li b {
  display: block;
  font-size: 1.125rem;
  color: #000000;
  font-weight: 400;
  margin-right: 15px;
  flex-shrink: 0;
}

.pcMenu .openClassType li span {
  display: block;
  font-size: 1rem;
  color: #878787;
  flex-shrink: 0;
}

.pcMenu .openClassType .searchBtn {
  max-width: 134px;
  position: static;
  margin-left: -20px;
  z-index: 10;
}

.menuSearch .bottom {
  width: 100%;
  max-width: 780px;
  padding: 0 5px 15px 0;
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  display: none;
  z-index: -1;
  background: #fff;
  border-radius: 0 0 20px 20px;
  border-top: 1px solid #ddd;
  transition: all 0.3s ease;
}

.pcMenu .bottom {
  max-width: 100%;
  padding: 0;
  width: 100%;
  transform: translateX(0);
  left: 0;
  /* border-radius: 32px; */
  border: 0;
  /* box-shadow   : 0 0 0 1px rgba(0, 0, 0, 0.04), 0 8px 16px rgba(0, 0, 0, 0.15); */
  margin: 20px 0 0 0;
  background: transparent;
}

.moibleMenu .bottom {
  top: calc(-100% - 50px);
}

@media screen and (max-width: 1000px) {
  .searchOpen .moibleMenu .bottom {
    z-index: 100;
    border: 0;
    padding: 0;
    top: 0;
    border-radius: 0;
    display: block;
    height: 100vh;
    left: 0;
    transform: inherit;
    max-width: 100%;
    position: fixed;
  }
}

.menuSearch .bottom .content .close {
  display: none;
}

.moibleMenu .bottom .content .close {
  position: absolute;
  top: 22px;
  left: 20px;
  width: 32px;
  height: 32px;
  text-align: center;
  border: 1px solid rgb(176, 176, 176);
  background: transparent;
  border-radius: 50%;
  display: block;
}



.menuSearch .bottom .content {
  max-height: 50vh;
  overflow: hidden;
  overflow-y: auto;
  scrollbar-color: #f37a69 rgba(0, 0, 0, 0.2);
  scrollbar-width: thin;
  background: #fff;
}

.menuSearch .bottom .content::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}

.menuSearch .bottom .content::-webkit-scrollbar-thumb {
  border-radius: 100px;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: #f37a69;
}

.menuSearch .bottom .content::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 0;
  background: rgba(0, 0, 0, 0.1);
}

.pcMenu .bottom .content {
  background: transparent;
  max-height: 100%;
}

.menuSearch .bottom .content::-webkit-scrollbar-thumb {
  right: -10px;
}

@media screen and (max-width: 1000px) {
  .menuSearch .bottom .content {
    position: relative;
    top: 0;
    left: auto;
    transform: translateX(0%);
    z-index: 0;
  }
}

@media screen and (max-width: 1000px) {
  .moibleMenu .bottom .content {
    max-height: 50vh;
    position: relative;
    top: 0px;
    left: auto;
    transform: translateX(0%);
    z-index: 0;
  }

  .moibleMenu .bottom .content {
    top: -50px;
    height: 100vh;
    max-height: 100vh;
  }

  .searchOpen .moibleMenu .bottom .content {
    background: #f7f7f7;
    padding: 0 12px 30px;
    top: 0;
    /* overflow: auto; */
    /* width   : 100%; */
    /* height  : calc(100vh - 71px); */
  }
}

.menuSearch .bottom .gatherTitle {
  display: none;
}

.moibleMenu .bottom .gatherTitle {
  display: flex;
  justify-content: space-between;
  color: #717171;
  line-height: 1;
}

.moibleMenu .bottom .block.open .gatherTitle {
  display: none;
}

.moibleMenu .bottom .block .gatherTitle .currentText {
  display: block;
  color: #222222;
}

.menuSearch .bottom .blockTitle {
  font-size: 1.125rem;
  color: #000000;
  margin-bottom: 10px;
}

.pcMenu .bottom .blockTitle {
  font-size: 0.875rem;
  margin: 0px 0 28px 5px;
}

.moibleMenu .bottom .blockTitle {
  font-size: 1.571rem;
  color: #000000;
  margin-bottom: 10px;
  font-weight: 500;
  text-align: left;
}

.menuSearch .bottom .block {
  padding: 20px;
}

.pcMenu .bottom .block {
  display: none;
  position: absolute;
  left: 0;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.04), 0 8px 16px rgba(0, 0, 0, 0.15);
  background: #fff;
  border-radius: 32px;
  padding: 16px 32px;
}

.pcMenu .bottom .block.typeBox {
  max-width: 672px;
  padding: 24px 44px;
  left: 0;
}

.moibleMenu .bottom .block {
  padding: 21px 20px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05), 0 4px 6px rgba(0, 0, 0, 0.03);
  background: #fff;
  border-radius: 16px;
  animation: fadeInDown-frfrv50 ease 0.5s;
}

@keyframes fadeInDown-frfrv50 {
  0% {
    opacity: 0;
    transform: translateY(-100px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.moibleMenu .bottom .block:nth-child(2) {
  animation-delay: 0s;
  margin-top: 75px;
}

.moibleMenu .bottom .block:nth-child(3) {
  animation-delay: 0.05s;
}

.moibleMenu .bottom .block:nth-child(4) {
  animation-delay: 0.1s;
}

.moibleMenu .bottom .block:nth-child(5) {
  animation-delay: 0.15s;
}

.moibleMenu .bottom .block:nth-child(6) {
  animation-delay: 0.2s;
}

.moibleMenu .bottom .block.open {
  padding: 24px;
  box-shadow: 0 0 0 1px rgb(0 0 0 / 4%), 0 6px 20px rgb(0 0 0 / 20%);
  border-radius: 24px;
  height: auto;
}

.menuSearch .bottom .block + .block {
  border-top: #dddddd 1px solid;
}

.pcMenu .bottom .block + .block {
  border: 0;
}

.moibleMenu .bottom .block + .block {
  margin-top: 12px;
  border: 0;
}

.moibleMenu .bottom .panel {
  display: none;
}

.menuSearch .bottom .typeBox .listBox {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -8px;
}

.pcMenu .bottom .typeBox .panel {
  padding: 16px 8px;
}

@media screen and (max-width: 1000px) {
  .menuSearch .bottom .typeBox .listBox {
    flex-wrap: nowrap;
    margin: 0 0px;
    overflow-x: auto;
    scrollbar-color: #f37a69 rgba(0, 0, 0, 0.2);
    scrollbar-width: thin;
    background: #fff;
  }

  .menuSearch .bottom .typeBox .listBox::-webkit-scrollbar {
    width: 5px;
    height: 5px;
  }

  .menuSearch .bottom .typeBox .listBox::-webkit-scrollbar-thumb {
    border-radius: 100px;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: #f37a69;
  }

  .menuSearch .bottom .typeBox .listBox::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 0;
    background: rgba(0, 0, 0, 0.1);
  }
}

@media screen and (max-width: 1000px) {
  .moibleMenu .bottom .typeBox .listBox {
    margin: 0 0 0 -8px;
  }

  .moibleMenu .bottom .typeBox .listBox::-webkit-scrollbar-thumb {
    display: none;
  }

  .moibleMenu .bottom .typeBox .listBox::-webkit-scrollbar-track {
    display: none;
  }
}

.menuSearch .bottom .typeBox .item {
  display: block;
  width: calc(25% - 16px);
  min-width: 130px;
  margin: 0 8px 16px;
  position: relative;
  border-radius: 10px;
  border: 1px solid transparent;
  overflow: hidden;
  cursor: pointer;
}

.pcMenu .bottom .typeBox .item {
  margin-bottom: 20px;
  overflow: auto;
  border: 0;
}

.moibleMenu .bottom .typeBox .item {
  margin: 0 8px;
  padding: 0 0 20px;
  border-radius: 0;
}

.menuSearch .bottom .typeBox .item [type='checkbox'] {
  opacity: 0;
  position: absolute;
}

.menuSearch .bottom .typeBox .item .pic {
  width: 100%;
  line-height: 0;
}

.pcMenu .bottom .typeBox .item .pic {
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #dddddd;
}

.moibleMenu .bottom .typeBox .item .pic {
  border-radius: 10px;
  overflow: hidden;
}

.menuSearch .bottom .typeBox .item .pic img {
  display: block;
  aspect-ratio: 1/1;
  -o-object-fit: contain;
  object-fit: contain;
}

.menuSearch .bottom .typeBox .item .txt {
  position: absolute;
  inset: 0;
  color: #fff;
  font-size: 1.125rem;
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding: 0px 0 10px;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 70%, rgba(0, 0, 0, 0.8) 100%);
  transition: all 0.3s ease;
}

.pcMenu .bottom .typeBox .item .txt {
  color: #222222;
  font-size: 0.875rem;
  justify-content: left;
  /* top            : 100%; */
  margin-top: 6px;
  position: static;
  background: transparent;
}

.moibleMenu .bottom .typeBox .item .txt {
  color: #222222;
  font-size: 1rem;
  justify-content: left;
  top: 100%;
  margin-top: 5px;
}

.menuSearch .bottom .typeBox .item.active,
.menuSearch .bottom .typeBox .item:hover {
  border: 1px solid #f37a69;
}

.pcMenu .bottom .typeBox .item:hover {
  border: 0;
}

.moibleMenu .bottom .typeBox .item.active,
.moibleMenu .bottom .typeBox .item:hover {
  border: 0;
}

.menuSearch .bottom .typeBox .item.active .txt,
.menuSearch .bottom .typeBox .item:hover .txt {
  background: linear-gradient(to bottom, rgba(243, 122, 105, 0) 70%, rgba(243, 122, 105, 0.8) 100%);
}

.pcMenu .bottom .typeBox .item:hover .txt {
  background: transparent;
}

.pcMenu .bottom .typeBox .item:hover .pic {
  border: 1px solid #000;
}

.moibleMenu .bottom .typeBox .item.active .txt,
.moibleMenu .bottom .typeBox .item:hover .txt {
  background: transparent;
}

.pcMenu .bottom .dateBox {
  left: 0;
  width: 100%;
  padding: 40px 32px;
}

.menuSearch .bottom .dateBox .listBox {
  display: flex;
  justify-content: space-between;
}

.moibleMenu .bottom .dateBox.open {
  position: absolute;
  width: calc(100% - 24px);
  /* height     : calc(100% - 220px); */
  border-radius: 16px 16px 0 0;
  padding-bottom: 71px;
}

.moibleMenu .bottom .dateBox .listBox {
  display: block;
  overflow: auto;
}

.menuSearch .bottom .dateBox .air-datepicker {
  width: 45%;
  border: none;
}

.moibleMenu .bottom .dateBox .air-datepicker {
  width: 100%;
  margin-bottom: 30px;
}

.menuSearch .bottom .dateBox #dpMin,
.menuSearch .bottom .dateBox #dpMax {
  position: absolute;
  opacity: 0;
}

.menuSearch .bottom .dateBox .btn {
  display: none;
}

.moibleMenu .bottom .dateBox .btn {
  display: none;
}

.moibleMenu .bottom .dateBox.open .btn {
  display: flex;
  border-top: 1px solid #ebebeb;
  justify-content: space-between;
  padding: 12px 24px;
  margin: 0 -24px;
  position: absolute;
  width: 100%;
  bottom: 0;
}

.moibleMenu .bottom .dateBox .btn button {
  margin: 0;
  line-height: 46px;
  border-radius: 8px;
  padding: 0 24px;
  background: transparent;
  font-size: 1.143rem;
  font-weight: 400;
}

.moibleMenu .bottom .dateBox .btn .skip {
  padding: 0 10px;
  text-decoration: underline;
  color: #222;
}

.moibleMenu .bottom .dateBox .btn .continue {
  background: #222222;
  color: #fff;
}

.pcMenu .bottom .timeBox {
  right: 270px;
  left: auto;
  width: 100%;
  max-width: 305px;
  padding: 40px 32px;
}

.menuSearch .bottom .timeBox .listBox {
  display: flex;
  align-items: center;
}

.menuSearch .bottom .timeBox .listBox + .blockTitle {
  margin-top: 20px;
}

.pcMenu .bottom .timeBox .listBox + .blockTitle {
  margin-top: 45px;
}

.menuSearch .bottom .timeBox .item {
  flex-grow: 1;
  position: relative;
}


.menuSearch .bottom .timeBox span {
  padding: 0 10px;
}

.menuSearch .bottom .mapBox .listBox {
  position: relative;
}

.pcMenu .bottom .mapBox {
  left: 155px;
  width: 100%;
  max-width: 320px;
  padding: 40px 32px;
}



.menuSearch .bottom .mapBox .select2.select2-container.select2-container--default {
  width: 100% !important;
}

.menuSearch .bottom .mapBox .select2-container .select2-selection--single,
.menuSearch .bottom .mapBox .select2-container--default .select2-selection--single,
.menuSearch .bottom .mapBox .select2-container .select2-selection--single .select2-selection__rendered {
  width: 100% !important;
  padding: 0;
  border: none;
  background: none;
  line-height: 1;
  height: auto;
}

.menuSearch .bottom .mapBox .select2-container--default .select2-selection--single .select2-selection__arrow {
  display: none;
}

.pcMenu .bottom .peopleBox {
  right: 115px;
  left: auto;
  padding: 40px 32px;
}

.menuSearch .bottom .peopleBox .listBox {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.pcMenu .bottom .peopleBox .listBox {
  display: block;
}

.moibleMenu .bottom .peopleBox .listBox {
  display: block;
}

.menuSearch .bottom .peopleBox .listBox .item {
  width: 48%;
  flex-grow: 1;
  position: relative;
  flex-grow: 0;
}

.pcMenu .bottom .peopleBox .listBox .item,
.moibleMenu .bottom .peopleBox .listBox .item {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgb(235, 235, 235);
  padding: 16px 4px 16px 0;
  font-size: 1.143rem;
}

.pcMenu .bottom .peopleBox .listBox .item {
  padding: 24px 4px 24px 0;
}



.pcMenu .bottom .peopleBox .listBox .item::before,
.moibleMenu .bottom .peopleBox .listBox .item::before {
  display: none;
}

.menuSearch .bottom .peopleBox .listBox .item b {
  display: none;
}

.pcMenu .bottom .peopleBox .listBox .item b,
.moibleMenu .bottom .peopleBox .listBox .item b {
  display: inline-block;
  font-weight: 400;
}

.pcMenu .bottom .peopleBox .listBox .item b {
  font-size: 1rem;
}

.menuSearch .bottom .peopleBox .numSelect,
.pcMenu .bottom .peopleBox .listBox .inputUse,
.moibleMenu .bottom .peopleBox .listBox .inputUse {
  display: none;
}

.pcMenu .bottom .peopleBox .numSelect,
.moibleMenu .bottom .peopleBox .numSelect {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.menuSearch .bottom .peopleBox .numSelect button {
  display: none;
}



.pcMenu .bottom .peopleBox .numSelect button.active,
.moibleMenu .bottom .peopleBox .numSelect button.active {
  border-color: #b0b0b0;
}


.moibleMenu .bottom .peopleBox .numSelect .num {
  width: 40px;
}

.pcMenu .bottom .peopleBox .numSelect .num {
  width: 45px;
  font-size: 1rem;
}

.pcMenu .bottom .peopleBox .numSelect .num {
  text-align: center;
}

.menuSearch .bottom .peopleBox .listBoxBottom {
  display: flex;
  align-items: center;
  margin-top: 20px;
}

.pcMenu .bottom .peopleBox .listBoxBottom {
  margin-top: 24px;
}

.menuSearch .bottom .peopleBox .listBoxBottom .checkPets {
  display: flex;
  position: relative;
  align-items: center;
}


.menuSearch .bottom .peopleBox .listBoxBottom .checkPets [type='checkbox'] {
  margin-right: 5px;
  opacity: 0;
}



.menuSearch .bottom .peopleBox .listBoxBottom .item {
  flex-grow: 1;
  margin-left: 20px;
}

.menuSearch .bottom .btnBox {
  padding: 20px;
  border-top: #ddd 1px solid;
}

.pcMenu .bottom .btnBox {
  display: none;
}

.moibleMenu .bottom .btnBox {
  padding: 12px 24px;
  display: flex;
  justify-content: space-between;
  background: rgba(255, 255, 255);
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

.menuSearch .bottom .btnBox button {
  width: 220px;
  margin: 0 auto;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: none;
  background: #f37a69;
  border-radius: 50px;
  padding: 11px 30px;
  font-size: 1.5rem;
  font-weight: 700;
}

.moibleMenu .bottom .btnBox button {
  width: 106px;
  height: 46px;
  text-align: center;
  border-radius: 8px;
  padding: 11px 0;
  background: transparent;
  font-size: 1.5rem;
  font-weight: 400;
}

.menuSearch .bottom .btnBox .clear {
  display: none;
}

.moibleMenu .bottom .btnBox .clear {
  display: block;
  text-decoration: underline;
  padding: 0;
  width: auto;
  color: #222222;
}

.moibleMenu .bottom .btnBox .reserve {
  background: #f37a69;
  display: block;
}

@media screen and (max-width: 1000px) {
  .menuSearch .bottom .btnBox button {
    font-size: 1.25rem;
  }
}

@media screen and (max-width: 1000px) {
  .moibleMenu .bottom .btnBox button {
    font-size: 1.143rem;
    margin: 0;
  }
}



.moibleMenu .bottom .btnBox button::after {
  display: none;
}

.menuSearch .select2-container,
.menuSearch .inputUse {
  width: 100%;
  background: #f6f6f6;
  border: #dddddd 1px solid;
  border-radius: 10px;
  padding: 10px 30px 10px 10px;
  appearance: none;
  -moz-appearance: none;
  -webkit-appearance: none;
  position: relative;
}

.moibleMenu .select2-container,
.moibleMenu .inputUse {
  padding: 21px 30px 21px 15px;
  appearance: none;
  -moz-appearance: none;
  -webkit-appearance: none;
  color: #222;
}

.select2-container--open .select2-dropdown--below {
  background: #f6f6f6;
  border-color: #dddddd;
  border-radius: 0 0 10px 10px;
}

.select2-results__option--selectable {
  position: relative;
  padding-left: 30px;
}



@media screen and (max-width: 1000px) {
  .menuMember {
    order: 0;
    right: 50px;
    top: 0;
  }
}



.language {
  margin-right: 0;
}

@media screen and (max-width: 1000px) {
  .language {
    right: 0;
    top: 0;
  }
}

.language .btn {
  padding-right: 15px;
}



@media screen and (max-width: 1000px) {
  .language .btn::before {
    margin: 0;
  }
}

.language .btn::after {
  content: '';
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  transition: all 0.3s ease;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 5px 4px 0 4px;
  border-color: #000 transparent transparent transparent;
}

@media screen and (max-width: 1000px) {
  .language .btn::after {
    display: none;
  }
}

.language .btn span {
  color: #000000;
  transition: all 0.3s ease;
}

@media screen and (max-width: 1000px) {
  .language .btn span {
    display: none;
  }
}

</style>


