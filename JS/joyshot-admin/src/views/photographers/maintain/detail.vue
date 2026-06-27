<template>
  <div>
    <el-row :gutter="20" class="top-block">
      <Breadcrumb :route="this.$route"></Breadcrumb>
    </el-row>

    <el-row>
      <el-col :xs="24" :sm="24" :lg="24">
        <el-button type="normal" @click.prevent="goBack" class="ml-20"><i class="el-icon-d-arrow-left"> 回前頁</i>
        </el-button>
      </el-col>
    </el-row>

    <el-row>
      <el-col :xs="24" :sm="24" :lg="24" style="padding: 20px 10px 20px 30px;">

        <el-tabs v-model="activeName" @tab-click="handleTabClick">

          <el-tab-pane label="基本資料" name="basicInfo">
            <PhotographerBasicInfo />
          </el-tab-pane>

          <el-tab-pane label="設定接案時段" name="schedule" :lazy="true">
            <Schedule />
          </el-tab-pane>

          <el-tab-pane label="可服務地區" name="serviceArea" :lazy="true">
            <PhotographerServiceArea />
          </el-tab-pane>

          <el-tab-pane label="匯款資料" name="bankInfo" :lazy="true">
            <PhotographerBankInfo />
          </el-tab-pane>

          <el-tab-pane label="特色資料" name="featureInfo" :lazy="true">
            <PhotographerFeatures />
          </el-tab-pane>

          <el-tab-pane label="作品集" name="photoWorks" :lazy="true">
            <PhotographerPhotoWorks />
          </el-tab-pane>

          <el-tab-pane label="評價" name="rating" :lazy="true">
            <PhotographerRating />
          </el-tab-pane>

          <!-- <el-tab-pane label="訂單紀錄" name="orderInfo" :lazy="true">
            <PhotographerOrderInfo />
          </el-tab-pane> -->

        </el-tabs>
      </el-col>
    </el-row>


  </div>
</template>

<script>
import {mapState} from 'vuex'
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import PhotographerBasicInfo from "@/views/photographers/maintain/basic_info";
import PhotographerBankInfo from "@/views/photographers/maintain/bank_info";
import PhotographerFeatures from '@/views/photographers/maintain/basic_info_features'
import PhotographerServiceArea from "@/views/photographers/maintain/service_area";
import Schedule from "@/views/photographers/maintain/schedule";
import PhotographerPhotoWorks from "@/views/photographers/maintain/photo_works";
import PhotographerRating from "@/views/photographers/maintain/rating";
//import PhotographerOrderInfo from "@/views/photographers/maintain/order_info";
import dayjs from "dayjs"


export default {
  name: "PhotographerDetail",
  components: {
    Breadcrumb,PhotographerBasicInfo,PhotographerServiceArea,Schedule,
    PhotographerPhotoWorks,PhotographerFeatures,PhotographerBankInfo,PhotographerRating,
    //PhotographerOrderInfo,
  },
  data() {
    return {
      pid:0,
      currentTab:'',
      activeName:'basicInfo',
      form:{
        name:'',
        phone:'',
        email:'',
        password:'',
        area2:'',
        area3:'',
        address:'',
        intro:'',
        service:[]
      }
    }
  },
  computed: {
    ...mapState('login', ['userInfo']),
  },
  filters: {
    fmtDate(value) {
      return dayjs(value).format("YYYY-MM-DD HH:mm")
    }
  },
  methods:{
    goBack(){
      this.$router.push('/photographer/maintain')
    },

    handleTabClick(){
      //console.log('handleTabClick:', this.activeName)
    }

  },
  mounted() {
    this.pid = parseInt(this.$route.params.pid)
  }
}
</script>

<style scoped>
.el-table {
  border-radius: 10px;
  padding: 20px;
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

.start_import {
  display: block;
}

.stop_import {
  display: none;
}

.box-card >>> .el-form--label-top .el-form-item__label {
  padding: 0;
}

.myAddressCard >>> .el-table {
  padding: 0;
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

/deep/ .el-upload-dragger {
  width: 260px !important;
  border: 3px dashed #d9d9d9;
}



</style>
