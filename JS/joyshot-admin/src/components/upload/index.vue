<template>
	<div class="upload-container">
		<div style="text-align: center;" v-if="loading" class="mb-20">
	    <i class="el-icon-loading" style="font-size:22px"></i>{{ $t('message.uploading') }}
	  </div>

		<el-upload
		    drag
		    :multiple="false"
		    class="avatar-uploader"
		    :action="`/api/file/upload/${usage}`"
		    :show-file-list="false"
		    :on-success="handleAvatarSuccess"
		    :before-upload="beforeAvatarUpload"
		    :on-progress="avatarProgress"
        :on-change="avatarChanged">
		  <img v-if="imageUuid" :src="showImage(imageUuid)" :class="avatar">
		  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
		  <div slot="tip" class="el-upload__tip">{{ $t('profile.form.file_limit') }}</div>
		</el-upload>
	</div>
</template>

<script>

export default {
	name: 'UploadWidget',
	props:{
		uuid:String,
		usage:String,
		avatar:{
			type:String,
			default:'avatar'
		}
	},
	data(){
		return {
			loading: false
		}
	},
	computed: { //運用computed，讓父組件的值可以在子組件裡修改
		imageUuid: {
	    get() {
	      return this.uuid; //讀props，表示從父組件取得值
	    },
	    set(f) {//更新時，通知父組件更新，就會讓父組件傳新的值給子組件
	      this.$emit('uploadSuccess', f)
	    }
	  }
	},
	methods:{
		handleAvatarSuccess(res) {
      if (res.error) {
        this.showResult('error', this.$t('action.upload_error', {'err': res.error}))
      } else {
      	this.imageUuid = res
      }
    },
    beforeAvatarUpload(file) {
    	console.log(file.type)
      const isJPG = (file.type === 'image/jpeg' || file.type === 'image/png');
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('限上傳 jpg、png 格式');
      }
      if (!isLt2M) {
        this.$message.error('圖片大小超過 2M');
      }
      return isJPG && isLt2M;
    },
    avatarProgress(){
      this.loading = true
      console.log("avatarProgress.....")
    },
    avatarChanged(){
      this.loading = false
      console.log("avatarChanged.....")
    },
	},
	mounted(){

	}
}

</script>

<style scoped>
.avatar-uploader {
  /*border: 1px dashed #d9d9d9;*/
  /*border-radius: 6px;*/
  cursor: pointer;
  position: relative;
  overflow: hidden;
  margin-bottom: 20px;
  text-align: center;
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
  width: 100%;
  height: 178px;
  display: block;
  object-fit: contain;
}
.icon {
  width: 100%;
  height: 50px;
  display: block;
  object-fit: contain;
}

.upload-container{
	float: left;
}

/deep/ .el-upload-dragger {
  width: 180px !important;
}

</style>


