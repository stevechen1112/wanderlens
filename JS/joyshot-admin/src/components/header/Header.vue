<template>
  <div class="header">
    <div class="logo" :class="{'is-active':isActive}">
      <img src="@/assets/joyshot.png" alt="" height="30px">
      <img src="@/assets/joyshot2.png" alt="" >
    </div>

    <div class="navbar">
      <div class="btn" :class="{'is-active':isActive}" @click="handleMenu">
        <span :class="menuBtn"></span>
      </div>
      <div>

        <!-- <el-dropdown trigger="click">
          <span v-if="$i18n.locale === 'zh'" class="el-dropdown-link mr-20">
            {{ $t('message.language_zh') }}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <span v-if="$i18n.locale === 'en'" class="el-dropdown-link mr-20">
            {{ $t('message.language_en') }}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>

          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="switchLang('en')">{{ $t('message.language_en') }}</el-dropdown-item>
            <el-dropdown-item @click.native="switchLang('zh')">{{ $t('message.language_zh') }}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown> -->

        <el-dropdown trigger="click">
          <span class="el-dropdown-link">
            <!-- {{$i18n.locale}} -->
            <img v-if="userInfo.avatar" :src="showImage(userInfo.avatar)" class="profile">
            {{ userInfo.username }}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <router-link to="/data/users/profile">
                <i class="el-icon-s-custom"></i> {{ $t('header.profile') }}
              </router-link>
            </el-dropdown-item>
            <el-dropdown-item>
              <router-link to="/data/users/change_password">
                <i class="el-icon-key"></i> {{ $t('header.change_pwd') }}
              </router-link>
            </el-dropdown-item>
            <el-dropdown-item @click.native="logout"><i class="el-icon-right"></i> {{ $t('header.logout') }}</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>



      </div>


    </div>
  </div>
</template>

<script>
import {mapMutations, mapState} from 'vuex'

export default {
  name: 'Header',
  data() {
    return {
      docUrl : process.env.VUE_APP_LH_DOC_URL,
      menuBtn: 'el-icon-newfont-caidan'
    }
  },
  computed: {
    ...mapState('login', ['userInfo', 'badgeInfo']),
    isActive() {
      return !this.$store.getters.sidebar.opened
    }
  },
  methods: {
    ...mapMutations({
      bindLogout: 'BIND_LOGOUT',
    }),
    handleMenu() {
      this.$store.dispatch('ToggleSideBar')
    },
    logout() {
      this.$confirm( this.$t('message.logout_now'), this.$t('message.alert'), {
        confirmButtonText: this.$t('buttons.confirm'),
        cancelButtonText: this.$t('buttons.cancel'),
        type: 'warning'
      }).then(() => {
        this.request.get("/user/logout").then(() => {
          this.$store.state.login.token = null
          this.$store.state.login.userInfo = {}
          this.bindLogout()
          this.$router.push({
            path: '/login'
          })
        })

      }).catch((e) => {
        console.log('push error:', e.message)
      })
    },
    switchLang(locale){
      this.$i18n.locale = locale
      this.$bus.$emit('switchLang', locale)
    },
    showAvatar(avatar) {
      return this.displayAvatar(avatar)
    },
    openMessage() {
      this.$router.push('/message/notification')
    }

  },
  mounted() {
    // console.log("docUrl:", this.docUrl)
  }
}
</script>

<style scoped>
.profile {
  width: 36px;
  height: 36px;
  border-radius: 999px;
}
</style>
<style scoped lang="stylus">
.header
  width 100%
  height 50px
  display flex
  background #ffffff

  .logo
    width 200px
    height 50px
    background #000
    color #fff
    text-indent 15px
    font-size 18px
    line-height 50px
    font-weight 600
    transition .4s ease

    &.is-active
      width 64px

    img
      padding 0 5px 5px 0

  .navbar
    flex 1
    display flex
    align-items center
    justify-content space-between
    padding 0 10px
    color #000000

    .btn
      height 50px
      line-height 50px;
      cursor pointer
      transition .4s ease

      &.is-active
        transform: rotateY(180deg)

      span
        font-size 28px
        line-height 50px
        transition 0.5s
        color #f27968
        font-weight 400

    .el-dropdown-link
      color #000000
      font-weight bold
      cursor pointer

@media all and (max-width: 768px) {
  .header .logo.is-active {
    width: 0;
    overflow: hidden;
  }
}
</style>
