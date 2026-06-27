<template>
	<main class="siteMain viewpointBox" ref="siteMain" aria-label="main" itemscope>
    <div class="banner">
      <NoticeBox />
      <div class="titleBox">
        <h1>{{ $t('Views.Faq.title') }}</h1>
      </div>
    </div>

    <div class="mainBox reserve">
      <div class="container">

        <el-collapse>
				  <el-collapse-item :name="idx" v-for="(faq,idx) in faqList" :key="faq.id">
			     	<template slot="title">
				      <!-- <i class="header-icon el-icon-info"></i>-->
               <div class="question">{{faq.question}}</div>

				    </template>
				    <div v-html="fmtNotes(faq.answer, false)" class="pl-20"></div>
				  </el-collapse-item>
				</el-collapse>

      </div>
    </div>
  </main>
</template>

<script>

import NoticeBox from '@/components/NoticeBox.vue'

export default {
	name: 'FAQ',
	components:{
		NoticeBox
	},
	data(){
		return {
			 activeNames: ['0'],
			 faqList:[]
		}
	},
	methods:{
		loadData(){
			let query = {
				pageNum: 1,
				pageSize: 100,
				lang: this.getLang(),
			}
			this.request.get('/faq',{params:query}).then(res => {
		    if (res.code === '200') {
		      this.faqList = res.data.records
		    } else {
		      this.showResult('error', this.$t('action.get_error', {err: 'error'}))
		    }
		  })
		},
    handleBodyClick(){
      this.$emit('appInSearchMode',  {mode:''})
    }
	},
	mounted(){
    this.$refs.siteMain.addEventListener('click', this.handleBodyClick);
		this.loadData()
	}
}

</script>

<style scoped>

.banner {
  position: relative;
  background-position: center;
  background-repeat: no-repeat;
  background-image: url('~@/assets/images/in/banner_reserve.jpg');
}
.banner::before {
  content: "";
  position: absolute;
  inset: 0;
  display: block;
  z-index: 2;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgb(0, 0, 0) 100%);
  opacity: 0.3;
}
.banner::after {
  content: "";
  position: absolute;
  inset: 0;
  display: block;
  z-index: 1;
  background: #465464;
  opacity: 0.2;
}
.container .pic {
  line-height: 0;
}
.container .pic:hover,
.container .infoBox:hover {
  cursor: pointer;
}
.viewpointBox .banner {
  min-height: 360px;
}
@media screen and (max-width: 1000px) {
  .viewpointBox .banner {
    min-height: 200px;
  }
}
.viewpointBox .banner .titleBox {
  position: absolute;
  inset: 50px 20px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #fff;
  z-index: 2;
}
.viewpointBox .banner .titleBox h1 {
  font-size: 2.625rem;
  padding: 0;
  margin: 0 0 0px 0;
}
@media screen and (max-width: 1000px) {
  .viewpointBox .banner .titleBox h1 {
    font-size: 1.875rem;
  }
}
.viewpointBox .banner .titleBox .info {
  font-size: 1.5rem;
}
@media screen and (max-width: 1000px) {
  .viewpointBox .banner .titleBox .info {
    font-size: 1.375rem;
  }
}
.viewpointBox .container {
  max-width: 1720px;
}
.container {
/*	border: 1px solid;*/
  padding: 4% 6%;
  background-color: #f6f6f6;
}
.container >>> .el-collapse-item__header {
	font-weight: 300;
	font-size: 20px;
  background-color: #f6f6f6;
position: relative;
    padding: 5px 0 5px 25px;
}
.container >>> .el-collapse-item__header .question:before {
  content: "";
  position: absolute;
  width: 8px;
  aspect-ratio: 1/1;
  background: #52b6cc;
  display: block;
  left: 2px;
  top: 14px;
  border-radius: 100%;
}
.container >>> .header-icon.el-icon-info {
	color: #f37a69;
	margin-right: 4px;
}
.container >>> .el-collapse-item__content {
	font-size: 17px;
	padding: 30px;
}
.container >>> .el-collapse-item {
  border-bottom: 1px solid #e3e3e3;
}
.container >>> .el-collapse {
  width: calc(94% - 40px);
}
.container >>> .el-collapse-item__wrap {
  border-radius: 10px;
}
.wrapper .siteMain .mainBox {
	padding: 1% 10% 3%;
}
.wrapper .siteMain .mainBox {
  padding: 0;
  margin: 0;
}
@media screen and (max-width:767px){
  .container >>> .el-collapse {
    width: calc(100% - 10px);
  }
  .container >>> .el-collapse-item__content {
    font-size: 16px;
    padding: 20px;
  }
  .container >>> .el-collapse-item__header {
    font-size: 17px;
  }
}



</style>


