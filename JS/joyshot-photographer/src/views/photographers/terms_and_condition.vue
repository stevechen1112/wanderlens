<template>
	<div>
    <el-row :gutter="20" class="top-block">
      <Breadcrumb :route="this.$route"></Breadcrumb>
    </el-row> 

    <el-row :gutter="20" class="top-block">
    	<el-card class="box-card">
    		<h2>一、隱私權保護政策的適用範圍</h2>
				<div class="terms">請說明該網站隱私權保護政策的適用範圍。</div>

				<h2>二、個人資料的蒐集、處理及利用方式</h2>
				<div class="terms">
					請說明該網站針對個人資料的蒐集、處理及利用方式。另外必須保留一個管道讓用戶可提出個人資料的刪除請求。	
				</div>
    	</el-card>
		</el-row>
	</div>
</template>

<script>

import Breadcrumb from "@/components/breadcrumb/Breadcrumb";

export default {
	name: 'TermsAndCondition',
	components:{
		Breadcrumb
	},
	data(){
		return {

		}
	},
	methods:{

	},
	mounted(){

	}
}

</script>

<style scoped>

h2{
	font-size: 24px;
}
.terms {
	font-size: 18px;
	font-weight: 300;
	padding: 20px;
}
</style>


