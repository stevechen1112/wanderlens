<template>
	<el-col :xs="24" :sm="24" :lg="24">
    <el-card class="box-card" >
      <div slot="header" class="clearfix">
        <span>客戶對攝影師的評價</span>
      </div>
      <div>
        <el-table :data="ratingList" empty-text="目前無資料" stripe header-row-class-name="headerStyle">
          <el-table-column label="客戶名稱" prop="author"></el-table-column>
          <el-table-column label="星等" prop="stars"></el-table-column>
          <el-table-column label="評價內容">
            <template slot-scope="scope"> 
              <div v-html="fmtNotes(scope.row.comments)"></div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>

   

  </el-col>
</template>

<script>

export default {
	name: 'PhotographerRating',
	components:{

	},
	data(){
    return {
       ratingList:[]
    }
	},
	methods:{
    loadData(){
      this.request.get("/photographer/rating/"+this.form.phId).then(res => {
        if (res.code === '200') {
          this.ratingList = res.data
        } else {
          this.showResult('error', '無法取得攝影師特色資料')
        }
      })
		}
	},
	mounted(){
    this.form.phId = parseInt(this.$route.params.pid)
    this.loadData()
	}
}

</script>

<style scoped>
.el-form--label-top >>> .el-form-item__label {
  padding: 0;
}
</style>

