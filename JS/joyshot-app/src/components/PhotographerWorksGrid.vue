<template>
  <div class="listBox">
    <div class="item" style="display: flex; flex-wrap: wrap;">
      <div class="demo-image__preview works" v-for="(work,idx) in workList" :key="work.id" v-if="idx<50">
        <el-image class="work-img"
                :src="showImage(work.fileUuid)"
                :preview-src-list="srcList"></el-image>
      </div>
    </div>
  </div>
</template>

<script>

export default {
	name: 'PhotographerWorksGrid',
	components:{

	},
	data(){
		return {
			ph_uuid:'',
      workList:[],
      srcList:[]
		}
	},
	methods:{
		getPhotographerWorks(){
      this.request.get("/photographer/info/works/"+this.ph_uuid).then(res => {
        if (res.code === '200') {
          this.workList = res.data
          this.srcList = res.data.map(img => this.showImage(img.fileUuid))
        } else {
          const message = this.$t('Components.PhotographerWorksGrid.load_works_failed')
          this.showResult('error', message+res.message)
        }
      })
    }
	},
	mounted(){
    this.ph_uuid = this.$route.params.pid
    this.getPhotographerWorks()
	}
}

</script>

<style scoped>


.work-img {
  width: 250px;
  height: 250px;
  margin: 4px 6px 0;
}
.work-img >>> .el-image__inner.el-image__preview {
  object-fit: cover;
}


</style>


