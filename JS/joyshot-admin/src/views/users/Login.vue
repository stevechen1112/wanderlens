<template>
  <div class="login-wrapper">
    <!--      <img :src="imgUrl" alt="" width="100%" height="100%" class="page-bg">-->
    <div class="login">
      
      <div style="display: block; text-align: center">
        <img alt="Logo" src="@/assets/logo.svg" style="width: 220px"/>
      </div>

      <!-- use el-form to validate fields -->
      <el-form
          :model="ruleForm"
          status-icon
          :rules="rules"
          ref="ruleForm"
          label-width="0"
          class="demo-ruleForm"
      >
        <el-form-item prop="empno">
          <el-input v-model="ruleForm.empno" prefix-icon="el-icon-user" auto-complete="on"
                    :placeholder="$t('message.account')"></el-input>

        </el-form-item>
        <el-form-item prop="password">
          <el-input show-password v-model="ruleForm.password" prefix-icon="el-icon-lock" auto-complete="on"
                    :placeholder="$t('message.password')"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="login('ruleForm')" style="width:100%;">{{ $t('buttons.login') }}</el-button>
        </el-form-item>
      </el-form>
    </div>

  </div>
</template>

<script>
import {mapMutations} from 'vuex'

export default {
  name: 'Login',
  data() {
    let checkName = (rule, value, callback) => {
      if (value === '') {
        // callback(new Error('請輸入資料'))
        callback(new Error(this.$t('message.required_field')))
      } else {
        callback()
      }
    }
    return {
      appVersion: localStorage.getItem('JS_VERSION'),
      showLoading: true,
      imgUrl: require('@/assets/images/14.png'),
      ruleForm: {
        empno: '',
        password: ''
      },
      rules: {
        empno: [{validator: checkName, trigger: 'change'}],
        password: [
          {validator: checkName, trigger: 'change'},
          {min: 6, max: 12, message: '密碼需 6~12 碼', trigger: 'blur'}
        ],
      }
    }
  },
  mounted() {
    let bgImg = new Image()
    bgImg.src = this.imgUrl
    bgImg.onerror = () => {
      console.log('img onerror')
    }
    bgImg.onload = () => {
      this.showLoading = false
    }

    this.checkReload()
  },
  methods: {
    ...mapMutations({
      bindLogin: 'BIND_LOGIN',
      saveUser: 'SAVE_USER'
    }),
    checkReload(){
      console.log('appVersion:', this.appVersion)
      console.log('static version:', this.version)
      if (this.appVersion === null) {
        localStorage.setItem('JS_VERSION', this.version)
        location.reload()
      } else {
        if (this.appVersion !== this.version) {
          localStorage.setItem('JS_VERSION', this.version)
          this.appVersion = this.version
          window.location.reload()
        }
      }
    },
    login(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {

          try {
            await this.$store.dispatch('login/submitLoginForm', this.ruleForm)

            this.$notify({
              title: this.$t('message.success'),
              message: this.$t('login.success'),
              duration: 1000,
              type: 'success'
            })
            setTimeout(() => {
              console.log('after login')

              let toPath = this.$route.query.redirect
              console.log(this.$route.query.redirect)
              if (typeof toPath !== 'undefined' && toPath !== '') {
                this.$router.push({path: toPath})
              } else {
                this.$router.push({path: '/'})
              }


            }, 500)
          } catch (e) {
            console.log('login ee:', e)
            this.$notify({
              title: this.$t('message.error'),
              message: this.$t('login.failed'),
              duration: 3000,
              type: 'error'
            })
          }


        }
      })
    },
    gotoRegist() {
      this.$router.push({
        path: '/register'
      })
    }
  }
}
</script>
<style scoped>
.loading-wrapper {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  /*background: #aedff8;*/
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-wrapper {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  /*background-color: #f5f8fa;*/

  background-image: url('~@/assets/images/big-roupe-joyshot.png');
  background-repeat: no-repeat;
  background-size: 1000px;
  background-attachment: fixed;
  background-position: center bottom;
}

.login-wrapper img {
  /*position: absolute;*/
  /*z-index: 0;*/
}

.login {
  max-width: 340px;
  margin: 100px auto;
  background: white;
  padding: 20px 40px;
  border-radius: 10px;
  position: relative;
  margin-top: 200px;

  -webkit-box-shadow: 0 .1rem 1rem .25rem rgba(0, 0, 0, .15);
  box-shadow: 0 .1rem 1rem .25rem rgba(0, 0, 0, .15);
  /*z-index: 9;*/
}

.title {
  font-size: 26px;
  line-height: 50px;
  font-weight: bold;
  margin: 10px;
  text-align: center;
}

#login-form > input {
  width: 100%;
  height: 34px;
  display: block;
  margin-top: 26px;
  background: #fff;
  color: #333;
  border: 1px solid #7da9c7;
  outline: none;
  text-indent: 20px;
  font-size: 14px;
}

#login-form > button {
  width: 100%;
  height: 34px;
  display: block;
  margin-top: 26px;
  background: #1ab2ff;
  color: #fff;
  border: 1px solid #1ab2ff;
  outline: none;
  border-radius: 100px;
  text-align: center;
  font-size: 16px;
  cursor: pointer;
}

.register {
  margin-top: 10px;
  font-size: 14px;
  line-height: 22px;
  text-indent: 8px;
  color: #1ab2ff;
  cursor: pointer;
  display: inline-block;
}

.register:hover {
  color: #2c2fd6;
}

.demo-ruleForm {
  margin-top: 20px;
}

.page-bg {
  position: absolute;
  z-index: -1;
}

@media (max-width: 768px) {
  .login {
    max-width: 260px;
    margin: 60px auto;
    background: #fff;
    padding: 20px 20px;
    border-radius: 10px;
    position: relative;
    /*z-index: 9;*/
  }
}
</style>
