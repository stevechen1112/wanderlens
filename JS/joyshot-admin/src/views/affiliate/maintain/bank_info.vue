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
	          	<el-col :xs="24" :sm="24" :md="12" :lg="2" class="pr-20">
	              <el-form-item label="銀行代碼">
	                <el-input v-model="form.bankCode" autocomplete="off" ></el-input>
	              </el-form-item>
	            </el-col>
	            <el-col :xs="24" :sm="24" :md="12" :lg="4" class="pr-20">
	              <el-form-item label="銀行" >
	                <el-input v-model="form.bank" autocomplete="off"></el-input>
	              </el-form-item>
	            </el-col>
	            <el-col :xs="24" :sm="24" :md="12" :lg="4" class="pr-20">
	              <el-form-item label="分行" >
	                <el-input v-model="form.bankBranch" autocomplete="off"></el-input>
	              </el-form-item>
	            </el-col>
	          	<el-col :xs="24" :sm="24" :md="12" :lg="4" class="pr-20">
	              <el-form-item label="戶名" >
	                <el-input v-model="form.name" autocomplete="off"></el-input>
	              </el-form-item>
	            </el-col>
	            <el-col :xs="24" :sm="24" :md="12" :lg="6" class="pr-20">
	              <el-form-item label="帳號" >
	                <el-input v-model="form.account" autocomplete="off"></el-input>
	              </el-form-item>
	            </el-col>
	          </el-row>
	          <el-row>
	            <el-col :xs="24" :sm="24" :md="24" :lg="6">
	              <el-form-item label="備註" prop="notes">
	                <el-input type="textarea" :rows="5" lazy v-model="form.notes"></el-input>
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



export default {
	name: 'PhotographerBankInfo',
	components:{
		
	},
	data(){
		return {
			form:{
				phId:0,
				name:'',
        bankCode:'',
        bank:'',
        bankBranch:'',
        account:'',
        notes:''
      },
      rules:{}
		}
	},
	methods:{
		saveData(){
			

			this.request.post("/photographer/bank", this.form).then(res => {
        if (res.code === '200') {
          this.showResult('success', '資料更新成功')
          this.loadBankInfo()
        } else {
          this.showResult('error', '資料更新失敗')
        }
      })
		},

		
    loadBankInfo(){
    	this.request.get("/photographer/bank/" + this.form.phId).then(res => {
        if (res.code === '200') {
        	if (res.data) {
        		this.form = res.data	
        	} 
          
        } else {
          this.showResult('error', '無法取得銀行帳號資料')
        }
      })
    }

    
	},
	mounted(){
		this.form.phId = parseInt(this.$route.params.pid)
		this.loadBankInfo()
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


