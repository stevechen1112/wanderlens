<template>
  <el-row :gutter="20" class="top-block">
    <Breadcrumb :route="this.$route"></Breadcrumb>
    <el-col :xs="24" :sm="24" :md="16" class="ml-20 mr-20">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span class="mr-20">{{ $t('header.profile') }}</span>
        </div>
        <el-form :model="form" :rules="rules" ref="userForm" label-width="80px">
          <el-row>
            <el-col :span="24" :xs="24" :sm="24" :md="10">
              <el-row>
                <el-col :span="24" :xs="24" :sm="24" :md="24">
                  <UploadWidget :uuid="form.avatar" usage="user_profile" @uploadSuccess="uploadSuccess" />
                </el-col>
              </el-row>
            </el-col>

            <el-col :span="24" :xs="24" :sm="24" :md="14">
              <el-row class="mb-20 text-right">
                <el-col :span="24" :xs="24" :sm="24" :md="24">
                  <el-tooltip class="item" effect="dark" :content="$t('profile.line_integration')" placement="top-start">
                    <el-button type="success" circle @click="connectLine" icon="el-icon-chat-line-round"></el-button>
                  </el-tooltip>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24" :xs="24" :sm="24" :md="24">
                  <el-form-item label="登入帳號" prop="empno">
                    <el-input :disabled="true" v-model="form.empno" autocomplete="off"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24" :xs="24" :sm="24" :md="24">
                  <el-form-item :label="$t('profile.form.username')" prop="username" :label-width="formLabelWidth">
                    <el-input v-model="form.username" autocomplete="off"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :xs="24" :sm="24" :md="24" style="text-align: right">
                  <el-button type="danger" @click="saveData('userForm')">{{ $t('buttons.confirm') }}</el-button>
                </el-col>
              </el-row>

            </el-col>

          </el-row>
        </el-form>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import UploadWidget from '@/components/upload/'
import {mapGetters} from 'vuex'

export default {
  name: "UseProfile",
  components: {
    Breadcrumb,UploadWidget
  },
  data() {
    let checkName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error( this.$t('message.required_field') ))
      } else {
        callback()
      }
    }

    return {
      clientId: process.env.VUE_APP_LINE_CLIENT_ID,
      callBack: process.env.VUE_APP_LINE_CALLBACK,
      notifyUrl: process.env.VUE_APP_LINE_NOTIFY,
      formLabelWidth: '',
      form: {
        id: '',
        empno: '',
        username: '',
        avatar: '',
        token:''
      },
      rules: {
        username: [{validator: checkName, trigger: 'change'}]
      }
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'token'])
  },
  methods: {

    loadData() {
      this.form.id = this.userInfo.id
      this.form.avatar = this.userInfo.avatar
      this.form.empno = this.userInfo.empno
      this.form.username = this.userInfo.username
      this.form.token = this.userInfo.token

      this.$router.push({path: '/detail'})


    },
    async saveData(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          try {
            await this.$store.dispatch('user/saveUser', this.form)
            await this.$store.dispatch('login/getUserInfo', this.form.token)
            this.showResult('success', this.$t('action.save_success'))
            this.loadData()
          } catch (e) {
            this.showResult('error', this.$t('action.save_error', {err: e}))
          }
        }
      })
    },
    uploadSuccess(res){
      this.form.avatar = res.uuid
    },
    connectLine(){
      //console.log(`${this.notifyUrl}&client_id=${this.clientId}&redirect_uri=${this.callBack}&state=${this.userInfo.id}`)
      window.open(`${this.notifyUrl}&client_id=${this.clientId}&redirect_uri=${this.callBack}&state=${this.userInfo.id}`,"_new")
    }
  },
  mounted() {
    this.loadData()
  }
}
</script>

<style scoped>
.el-table {
  border-radius: 10px;
  padding: 20px;
}

.el-table >>> .headerStyle {
  /*background-color: #1e8fc6;*/
}

.el-popover.el-popper .el-popconfirm {
  background-color: black !important;
  padding: 10px !important;
}

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
  width: 178px;
  height: 178px;
  display: block;
}

.display-avatar {
  width: 60px;
  height: 60px;
  border-radius: 999px;
}


/deep/ .el-upload-dragger {
  width: 180px !important;
}


</style>
