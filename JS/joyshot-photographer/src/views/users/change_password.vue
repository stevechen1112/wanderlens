<template>
  <el-row :gutter="20" class="top-block">
    <Breadcrumb :route="this.$route"></Breadcrumb>
    <el-col :xs="24" :sm="24" :md="8" class="ml-20 mr-20">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span class="mr-20">{{ $t('route.meta.title.change_password') }}</span>
        </div>

        <el-form :model="form" :rules="rules" ref="userForm" label-width="100px">

          <el-row>
            <el-col :xs="24" :sm="24" :md="24">
              <el-form-item :label="$t('page.change_password.form.old_password')" prop="oldPassword">
                <el-input show-password prefix-icon="el-icon-lock" v-model="form.oldPassword" autocomplete="off"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :xs="24" :sm="24" :md="24">
              <el-form-item :label="$t('page.change_password.form.new_password')" prop="newPassword">
                <el-input show-password prefix-icon="el-icon-lock" v-model="form.newPassword" autocomplete="off" ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :xs="24" :sm="24" :md="24">
              <el-form-item :label="$t('page.change_password.form.new_password1')" prop="newPassword1">
                <el-input show-password prefix-icon="el-icon-lock" v-model="form.newPassword1" autocomplete="off" ></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :xs="24" :sm="24" :md="24" style="text-align: right">
              <el-button type="primary" @click="saveData('userForm')">{{ $t('buttons.confirm') }}</el-button>
            </el-col>
          </el-row>
        </el-form>

      </el-card>
    </el-col>


  </el-row>


</template>

<script>
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import {mapGetters} from 'vuex'
import {removeToken} from "@/util";

export default {
  name: "ChangePassword",
  components: {
    Breadcrumb
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
      formLabelWidth: '',
      loading: false,
      form: {
        id: '',
        oldPassword: '',
        newPassword: '',
        newPassword1: ''
      },
      rules: {
        oldPassword: [{validator: checkName, trigger: 'change'}],
        newPassword: [{validator: checkName, trigger: 'change'}],
        newPassword1: [{validator: checkName, trigger: 'change'}]
      }
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'token'])
  },
  methods: {

     saveData(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          if (this.form.newPassword !== this.form.newPassword1) {
            this.showResult('error', this.$t('action.password_not_match'))
          } else {

            this.request.post("/user/change-password", this.form).then(res => {
              if (res.code === '200') {
                //如果密碼換了，token使用就會出問題，因為已經是不正確的token了
                //所以更新成功後，要強制登出，刪除token
                let msg = this.$t('action.force_logout')
                let title = this.$t('message.alert')
                this.$alert(msg, title, {
                  confirmButtonText: 'OK',
                  callback: () => {
                    //清除token
                    removeToken('JS_P_TOKEN')
                    this.$router.push('/')
                  }
                });
               // this.showResult('success', this.$t('action.save_success'))
              } else {
                this.showResult('error', this.$t('action.save_error', {err: res.message}))
              }
            })

          }

        }
      })
    }

  },
  mounted() {
    this.form.id = this.userInfo.id
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


</style>
