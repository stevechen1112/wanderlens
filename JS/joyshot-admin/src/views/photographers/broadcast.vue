<template>
	<div>
    <el-row :gutter="20" class="top-block">
      <Breadcrumb :route="this.$route"></Breadcrumb>
    </el-row>
    <el-row :gutter="20" class="mb-20">
	    <el-col :xs="24" :sm="24" :lg="12">
	      <el-card class="box-card">
	        <el-form label-position="top"
            :model="form"
             :rules="rules"
             ref="dataForm"
             label-width="100px">

            <el-row>
	            <el-col :xs="24" :sm="24" :md="24">
	              <el-form-item label="訊息">
	                <el-input type="textarea" :rows="5" lazy v-model="form.lineMessage"></el-input>
	              </el-form-item>
	            </el-col>
	          </el-row>

	          <el-row>
	            <el-col :xs="24" :sm="24" :md="24">
	              <el-form-item label="圖片" style="margin-bottom:0px"></el-form-item>
	              <UploadWidget :uuid="form.imageUuid" usage="line_notify_image" @uploadSuccess="uploadLineImageSuccess" />
	            </el-col>
	          </el-row>

	          <el-row>
	            <el-col :xs="24" :sm="24" :md="24">
	            	<el-form-item label="發送對象" style="margin-bottom:0px"></el-form-item>
	              <el-radio v-model="form.targetUser" label="photographer">攝影師</el-radio>
	              <el-radio v-model="form.targetUser" label="manager">JoyShot</el-radio>
	            </el-col>
	          </el-row>

	          

	          <el-row>
	            <el-col :xs="24" :sm="24" :md="24">
	              <div class="text-right">
	              	<el-popconfirm
	                    class="ml-10 popconfirm-bg"
	                    title="群發訊息給選定的發送對象?"
	                    :confirm-button-text="$t('buttons.confirm')"
	                    :cancel-button-text="$t('buttons.cancel')"
	                    icon="el-icon-info"
	                    icon-color="red"
	                    @confirm="saveData('dataForm')"
	                >
	                  <el-button type="success" slot="reference">LINE群發 <i class="el-icon-chat-line-square"></i></el-button>
	                </el-popconfirm>
			            
			        	</div>
	            </el-col>
	          </el-row>



           </el-form>
         </el-card>
       </el-col>
     </el-row>
	</div>
</template>

<script>

import Breadcrumb from "@/components/breadcrumb/Breadcrumb";	
import UploadWidget from '@/components/upload/'

export default {

	name: 'PhotographerBroadcast',
	components:{
		Breadcrumb,UploadWidget
	},
	data(){
		return {
			loading: false,
			form:{
				lineMessage:'',
				imageUuid:'',
				targetUser:'photographer'
			},
			rules:{

			}
		}
	},
	methods:{
		uploadLineImageSuccess(res){
    	this.form.imageUuid = res.uuid
    },
		saveData(){
			console.log(this.form)
			this.request.post("/group-notify", this.form).then(res => {
        if (res.code === '200') {
         	this.showResult('success', '群發訊息成功送出') 
        }
      })
		}
	},
	mounted(){

	}
}

</script>

<style scoped>

</style>


