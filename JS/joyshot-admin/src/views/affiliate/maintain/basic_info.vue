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
	                <template slot-scope="scope">
                  <el-switch 
                    @change="changeLiveStatus(form.goLiveOn)"
                    v-model="form.goLiveOn"
                    active-color="#13ce66"
                    inactive-color="#DCDFE6">
                  </el-switch>
                </template>
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
	            
	          </el-row>

	          <el-row>  
	          	<el-col :xs="24" :sm="24" :md="12" :lg="2" class="pr-10">
	              <el-form-item label="銀行代碼">
	                <el-input v-model="form.bankCode" autocomplete="off" ></el-input>
	              </el-form-item>
	            </el-col>
	            <el-col :xs="24" :sm="24" :md="12" :lg="4" class="pr-10">
	              <el-form-item label="銀行" >
	                <el-input v-model="form.bankName" autocomplete="off"></el-input>
	              </el-form-item>
	            </el-col>
	            <el-col :xs="24" :sm="24" :md="12" :lg="4" class="pr-10">
	              <el-form-item label="分行" >
	                <el-input v-model="form.bankBranch" autocomplete="off"></el-input>
	              </el-form-item>
	            </el-col>
	          	<el-col :xs="24" :sm="24" :md="12" :lg="4" class="pr-10">
	              <el-form-item label="戶名" >
	                <el-input v-model="form.bankAccountName" autocomplete="off"></el-input>
	              </el-form-item>
	            </el-col>
	            <el-col :xs="24" :sm="24" :md="12" :lg="6" class="pr-10">
	              <el-form-item label="帳號" >
	                <el-input v-model="form.bankAccountNo" autocomplete="off"></el-input>
	              </el-form-item>
	            </el-col>
	          </el-row>
	          <el-row>
	            <el-col :xs="24" :sm="24" :md="24" :lg="6">
	              <el-form-item label="備註" prop="bankNotes">
	                <el-input type="textarea" :rows="5" lazy v-model="form.bankNotes"></el-input>
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
	name: 'AffiliateBasicInfo',
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
			affid:0,
			checkList:[],
			serviceOptions:[],
			form:{
				phUuid:'',
				name:'',
        nickName:'',
        phone:'',
        email:'',
        city:'',
        cityId:'',
        districtName:'',
        districtId:'',
        address:'',
        intro:'',
        avatar:'',
        bannerImg:'',
        service:[],
        rating:0,
        goLive:'',
        goLiveOn:false,

        bankCode:'',
        bankName:'',
        bankBranch:'',
        bankAccountName:'',
        bankAccountNo:'',
        bankNotes:''
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

    changeCity(val) {
    	const found = this.cityOption.filter( opt => opt.id == this.form.cityId )
      this.form.city = found[0].name
      this.districtOption = []
    	this.loadDistrict()
    },
    
		changeDistrict(val) {
    	const found = this.districtOption.filter( opt => opt.id == this.form.districtId )
      this.form.districtName = found[0].name
    },

    


    /**推廣員 基本資料**/
    loadBasicInfo(){
    	this.request.get("/affiliate/" + this.affid).then(res => {
        if (res.code === '200') {
          this.form = res.data
        } else {
          this.showResult('error', '無法取得 推廣員 資料')
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
    }

	},
	mounted(){
		this.affid = parseInt(this.$route.params.affid)
		this.loadBasicInfo()
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


