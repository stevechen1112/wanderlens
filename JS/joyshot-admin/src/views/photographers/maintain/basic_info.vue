<template>
  <div>
    <el-row :gutter="20" class="mb-20">
      <el-col :xs="24" :sm="24" :lg="24">
        <el-card class="box-card">
          <el-form label-position="top"
              :model="form"
               :rules="rules"
               ref="dataForm"
               label-width="100px">

            <el-row>
              <el-col :xs="24" :sm="24" :md="24" :lg="24">
                <el-form-item label="前台攝影師介紹頁" >
                  <a :href="`${fontend}/photographer/${form.phUuid}`" target="_new">
                    {{fontend}}/photographer/{{form.phUuid}}
                  </a>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :xs="24" :sm="24" :md="24" :lg="5" class="pr-20">
                <el-form-item label="手機(登入帳號)" prop="phone">
                  <el-input v-model="form.phone" readonly :disabled="true"></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="24" :lg="5" class="pr-20">
                <el-form-item label="姓名" prop="name">
                  <el-input v-model="form.name" autocomplete="off"></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="24" :lg="5" class="pr-20">
                <el-form-item label="暱稱" prop="nickName">
                  <el-input v-model="form.nickName" autocomplete="off"></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="24" :lg="5" class="pr-20">
                <el-form-item label="Email" >
                  <el-input v-model="form.email" autocomplete="off"></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="24" :lg="4">
                <el-form-item label="是否上架" >
                  <el-switch
                    @change="changeLiveStatus(form.goLiveOn)"
                    v-model="form.goLiveOn"
                    active-color="#13ce66"
                    inactive-color="#DCDFE6">
                  </el-switch>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :xs="24" :sm="24" :md="12" :lg="4" class="mr-10">
                <el-form-item label="縣/市"  >
                  <el-select v-model="form.cityId" placeholder="縣/市" @visible-change="loadCity" @change="changeCity()">
                    <el-option
                        v-for="item in cityOption"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="4" class="mr-10">
                <el-form-item label="鄉/鎮/區" >
                  <el-select v-model="form.districtId" placeholder="鄉/鎮/區" @visible-change="loadDistrict" @change="changeDistrict()">
                    <el-option
                        v-for="item in districtOption"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="24" :lg="8" class="pr-10">
                <el-form-item label="地址" prop="address">
                  <el-input v-model="form.address" autocomplete="off" @blur="getGeo"></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="24" :lg="6">
                <el-form-item label="經緯度" prop="latLng">
                  <el-input v-model="latLng" autocomplete="off" readonly :disabled="true"></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :xs="24" :sm="24" :md="24" :lg="5" class="pr-20">
                <el-form-item label="身份別"  >
                  <el-select v-model="form.career" placeholder="身份別">
                    <el-option key="0" label="全職攝影" value="全職攝影"></el-option>
                    <el-option key="1" label="兼職攝影" value="兼職攝影"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="24" :lg="5" class="pr-20">
                <el-form-item label="攝影經歷(年)" prop="experience">
                  <el-input-number v-model="form.experience" :min="1" :step="0.5"></el-input-number>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :xs="24" :sm="24" :md="24" :lg="12" class="pr-20">
                <el-form-item label="攝影師介紹" prop="intro">
                  <el-input type="textarea" :rows="5" lazy v-model="form.intro"></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="24" :lg="6">
                <el-form-item label="擅長的拍攝類型">
                  <el-select v-model="form.service" multiple placeholder="請挑選" @change="$forceUpdate()">
                    <el-option
                      v-for="item in serviceOptions"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="24" :lg="6">
                <el-form-item :label="`星等評價 ${form.rating?form.rating:''}`">
                  <el-slider v-model="form.rating" :marks="marks" :step="1" :min="1" :max="5">
                  </el-slider>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="12" >
                <div style="text-align: center;" v-if="loading">
                  <i class="el-icon-loading" style="font-size:22px"></i>{{ $t('message.uploading') }}
                </div>
                <el-form-item label="大頭照(300x300頭像置中)" style="margin-bottom:0px"></el-form-item>

                <UploadWidget :uuid="form.avatar" usage="photographer_avatar" @uploadSuccess="uploadAvatarSuccess" />

              </el-col>
              <el-col :span="12" >
                <div style="text-align: center;" v-if="loading">
                  <i class="el-icon-loading" style="font-size:22px"></i>{{ $t('message.uploading') }}
                </div>
                <el-form-item label="封面照(2000x1200)" style="margin-bottom:0px"></el-form-item>
                <UploadWidget :uuid="form.bannerImg" usage="photographer_banner" @uploadSuccess="uploadBannerSuccess" />
              </el-col>
            </el-row>

            <el-row>
              <el-col :xs="24" :sm="24" :md="24" :lg="5" class="pr-20">
                <el-form-item label="暱稱(英)" prop="nickNameEn">
                  <el-input v-model="form.nickNameEn" autocomplete="off"></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="24" :lg="12" class="pr-20">
                <el-form-item label="攝影師介紹(英)" prop="introEn">
                  <el-input type="textarea" :rows="5" lazy v-model="form.introEn"></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :xs="24" :sm="24" :md="24" :lg="5" class="pr-20">
                <el-form-item label="暱稱(日)" prop="nickNameJp">
                  <el-input v-model="form.nickNameJp" autocomplete="off"></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="24" :lg="12" class="pr-20">
                <el-form-item label="攝影師介紹(日)" prop="introJp">
                  <el-input type="textarea" :rows="5" lazy v-model="form.introJp"></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :xs="24" :sm="24" :md="24" :lg="5" class="pr-20">
                <el-form-item label="暱稱(韓)" prop="nickNameKr">
                  <el-input v-model="form.nickNameKr" autocomplete="off"></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="24" :lg="12" class="pr-20">
                <el-form-item label="攝影師介紹(韓)" prop="introKr">
                  <el-input type="textarea" :rows="5" lazy v-model="form.introKr"></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <div class="text-right">
              <el-button type="primary" @click="saveData('dataForm')">儲存資料</el-button>
            </div>
          </el-form>
        </el-card>
      </el-col>
    </el-row>

    <!-- <el-row :gutter="20" class="mb-20">
      <PhotographerFeatures/>
    </el-row> -->
   </div>
</template>

<script>


import UploadWidget from '@/components/upload/'

export default {
  name: 'PhotographerBasicInfo',
  components:{
    UploadWidget
  },
  computed:{
    latLng(){
      return (this.form.addrLat)? `${this.form.addrLat},${this.form.addrLng}`: ''
    }
  },
  data(){

    let checkName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('請輸入資料'))
      } else {
        callback()
      }
    }

    return {
      fontend: process.env.VUE_APP_FRONTEND,
      loading:false,
      pid:0,
      checkList:[],
      serviceOptions:[],
      form:{
        phUuid:'',
        name:'',
        nickName:'',
        nickNameEn:'',
        nickNameJp:'',
        nickNameKr:'',
        phone:'',
        email:'',
        city:'',
        cityId:'',
        districtName:'',
        districtId:'',
        address:'',
        intro:'',
        introEn:'',
        introJp:'',
        introKr:'',
        avatar:'',
        bannerImg:'',
        service:[],
        rating:0,
        goLive:'',
        goLiveOn:false,
        career:'',
        experience:0
      },
      marks:{
        1: '1',
        2: '2',
        3: '3',
        4: '4',
        5: '5'
      },
      photographerFeatures:[],

      rules:{
        name: [{required: true, validator: checkName, trigger: 'change'}],
        nickName: [{required: true, validator: checkName, trigger: 'change'}]
      },

      /**地區資料**/
      cityOption: [],
      districtOption: []

    }
  },
  methods:{
    changeLiveStatus(live){
      console.log('changeLiveStatus:', live)
      if (live == true) {
        this.form.goLive = 'Y'
      } else {
        this.form.goLive = 'N'
      }
    },
    saveData(formName){

      this.$refs[formName].validate(async valid => {
        if (valid) {
          if (this.form.service && this.form.service.length > 0) {
            this.form.serviceItem = this.form.service.join(",")
          }

          this.request.post("/photographer", this.form).then(res => {
            if (res.code === '200') {
              this.showResult('success', '資料更新成功')
            } else {
              this.showResult('error', '資料更新失敗')
            }
          })

        }
      })

    },

    /**縣市資料**/
    loadCity() {
      console.log('load city:', this.cityOption.length)

      if (this.cityOption.length == 1) { //還沒有重選過，則需下載完整的縣市資料
        console.log('重新下載縣市資料')
        this.request.get("/area/area1").then(res => {
          if (res.code === '200') {
            this.cityOption = res.data
          } else {
            this.showResult('error', '無法取得 縣市 資料')
          }
        })
      } else {
        console.log('已有 縣市 資料')
      }
    },
    /**鄉鎮區資料**/
    loadDistrict() {
      console.log('load district:', this.districtOption.length)

      //length=1，表示第一次取得資料後就沒更動
      //length=0，表示有更動縣市選單
      if (this.districtOption.length <= 1) {
        this.request.get("/area/area3/" + this.form.cityId).then(res => {
          if (res.code === '200') {
            this.districtOption = res.data
            this.form.districtId = ''
            this.form.districtName = ''
          } else {
            this.showResult('error', '無法取得 鄉鎮區 資料')
          }
        })
      } else {
        console.log('已有 鄉鎮區 資料')
      }
    },

    changeCity() {
      const found = this.cityOption.filter( opt => opt.id == this.form.cityId )
      this.form.city = found[0].name
      this.districtOption = []
      this.loadDistrict()
    },

    changeDistrict() {
      const found = this.districtOption.filter( opt => opt.id == this.form.districtId )
      this.form.districtName = found[0].name
    },

    getGeo(){
      let {city, districtName, address} = this.form
      this.checkGeocoder(city, districtName, address, (geometry)=>{
        console.log('geometry:', geometry)
        this.form.addrLat = geometry.lat
        this.form.addrLng = geometry.lng
      })
    },


    /**攝影師基本資料**/
    loadBasicInfo(){
      this.request.get("/photographer/" + this.pid).then(res => {
        if (res.code === '200') {
          this.form = res.data
          if (res.data.serviceItem) {
            if (res.data.serviceItem.indexOf(',') !== -1) {
              let arr = res.data.serviceItem.split(',')
              this.form.service = arr.map((str)=>parseInt(str));
            } else{
              this.form.service = res.serviceItem
            }
          }
          this.setCityDistrict(res.data) //設定 縣市/鄉鎮區 資料
        } else {
          this.showResult('error', '無法取得攝影師資料')
        }
      })
    },

    setCityDistrict(data){
      let cityInfo = {
        id:data.cityId,
        name:data.city
       }
      this.cityOption.push(cityInfo)

      let districtInfo = {
        id:data.districtId,
        name:data.districtName
       }
      this.districtOption.push(districtInfo)
    },

    /**攝影師特色**/
    loadFeatures(){
      this.request.get("/photographer/feature/"+this.pid).then(res => {
        if (res.code === '200') {
          this.photographerFeatures = res.data
        } else {
          this.showResult('error', '無法取得攝影師特色資料')
        }
      })
    },
    handleEditFeature(){

    },
    handleDeleteFeature(){

    },

    /**圖片上傳**/
    uploadAvatarSuccess(res){
      this.form.avatar = res.uuid
    },
    uploadBannerSuccess(res){
      this.form.bannerImg = res.uuid
    },

    loadServiceCat(){
      let query = {
          pageNum: 1,
          pageSize: 10
      }
      this.request.get("/service-cat", {params:query}).then(res => {
        if (res.code === '200') {
          this.serviceOptions = res.data.records
          this.$nextTick(() => {
            this.loadBasicInfo()
          })

        } else {
          this.showResult('error', '無法取得服務項目資料')
        }
      })
    }
  },
  mounted(){
    this.pid = parseInt(this.$route.params.pid)
    this.loadServiceCat()
    //this.loadFeatures()// this.pid = this.$route.params.pid
  }
}

</script>

<style scoped>
.el-form--label-top >>> .el-form-item__label {
  padding: 0;
}

.el-slider__runway >>> .el-slider__bar{
  background: #F17B6D;
}
</style>


