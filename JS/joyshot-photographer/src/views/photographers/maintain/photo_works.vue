<template>
	<div>
		<el-card class="box-card mb-20" >
			<div class="upload-container">
				<div style="text-align: center;" v-if="loading" class="mb-20">
			    <i class="el-icon-loading" style="font-size:22px"></i>{{ $t('message.uploading') }}
			  </div>

				<el-upload
				    drag
				    :multiple="true"
				    class="avatar-uploader"
				    :action="`/api/file/upload-works/${phId}`"
				    :show-file-list="false"
				    :on-success="handleAvatarSuccess"
				    :before-upload="beforeAvatarUpload"
				    :on-progress="avatarProgress"
		        :on-change="avatarChanged">
				  <i class="el-icon-plus avatar-uploader-icon"></i>
				  <div slot="tip" class="el-upload__tip">檔案限2M</div>
				</el-upload>
			</div>
		</el-card>

		<el-card class="box-card">
			<div slot="header" class="clearfix">
	        <span>已上傳的作品({{workList.length}}/50)</span>
	     </div>
	     <div style="display: flex; flex-wrap: wrap;">

					<div class="demo-image__preview works" v-for="work in workList" :key="work.id">
						<el-popconfirm
                class="ml-10 popconfirm-bg"
                :title="$t('message.delete_confirm')"
                :confirm-button-text="$t('buttons.confirm')"
                :cancel-button-text="$t('buttons.cancel')"
                icon="el-icon-info"
                icon-color="red"
                @confirm="handleDelete(work.id)">
              <el-button slot="reference" plain icon="el-icon-delete" circle class="btn-del"></el-button>
            </el-popconfirm>
					  <el-image class="work-img"
					  				:src="showImage(work.fileUuid)"
					  				:preview-src-list="srcList"></el-image>
					</div>

	     </div>
		</el-card>


	</div>
</template>

<script>

import {mapState} from 'vuex'

export default {
	name: 'PhotographerPhotoWorks',
	components:{

	},
	computed:{
		...mapState('login', ['userInfo'])
	},
	data(){
		return {
			loading: false,
			dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      workList:[],
      phId:0,
      srcList: [],
      queuedFiles:[]
		}
	},
	methods:{
		loadData(){
			this.request.get('/photographer/works/'+this.phId).then(res => {
		    if (res.code === '200') {
		      this.workList = res.data
		      // console.log('loadData:', this.workList.length)
		      this.srcList = res.data.map(img => this.showImage(img.fileUuid))
		    } else {
		      this.showResult('error', this.$t('action.get_error', {err: 'error'}))
		    }
		  })
		},
		avatarProgress(){
      this.loading = true
      //console.log("avatarProgress.....")
    },
    avatarChanged(){
      this.loading = false
      // console.log("avatarChanged.....")
    },
		uploadAll(){
			this.$refs.uploadWorks.submit();
		},
		handleRemove(file) {
      console.log(file);
    },
    beforeAvatarUpload(file) {

      const isJPG = (file.type === 'image/jpeg' || file.type === 'image/png');
      const isLt2M = file.size / 1024 / 1024 < 2;
      console.log(file.size / 1024 / 1024)
      if (!isJPG) {
        this.$message.error('圖片非jpg、png 格式，停止上傳');
        return false
      }
      if (!isLt2M) {
        this.$message.error('圖片大小超過2M，停止上傳');
        return false
      }

      // console.log('目前的檔案數:', this.workList.length)

      return true
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleDownload(file) {
      console.log(file);
    },

		handleAvatarSuccess() {
      this.loadData()
      // this.$refs.uploadWorks.clearFiles()
    },
    handleDelete(id){
    	this.request.delete("/photographer/works/"+id).then(res => {
        if (res.code === '200') {
          this.loadData()
          this.showResult('success', '資料刪除成功')
        } else {
          this.showResult('error', '資料刪除失敗')
        }
      })
    }
	},
	mounted(){
		//console.log('攝影師作品')
		// this.phId = parseInt(this.$route.params.pid)
		this.phId = this.userInfo.phId
		this.loadData()


	}
}

</script>

<style scoped>
.box-card >>> .el-upload-list--picture-card .el-upload-list__item {
	width: 220px ;
	height: 220px ;
}
.box-card >>> .el-upload-list--picture-card .el-upload-list__item img {
	object-fit: contain;
}

.works {
	position: relative;
	margin-top: 8px;
}
.btn-del {
	position: absolute;
  z-index: 2;
  right: 8px;
  bottom: 10px;
}
.work-img {
	width: 160px;
	height: 160px;
}
.work-img >>> .el-image__inner.el-image__preview {
	object-fit: cover;
}


.works >>> .el-button {
	background: #f1f1f1cc;
	color: #f25656;
}
.upload-container{
	float: left;
	margin-bottom: 20px;
}


.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }

</style>


