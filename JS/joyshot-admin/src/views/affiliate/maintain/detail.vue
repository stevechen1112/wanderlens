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
        
        <el-tabs v-model="activeName" >
          
          <el-tab-pane label="基本資料" name="basicInfo">
            <AffiliateBasicInfo />
          </el-tab-pane>

         <!--  <el-tab-pane label="匯款資料" name="bankInfo" :lazy="true">
            <PhotographerBankInfo />
          </el-tab-pane>
 -->
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
import AffiliateBasicInfo from "@/views/affiliate/maintain/basic_info";
import dayjs from "dayjs"


export default {
  name: "AffiliateDetail",
  components: {
    Breadcrumb,AffiliateBasicInfo
  },
  data() {
    return {
      affid:0,
      currentTab:'',
      activeName:'basicInfo'
    }
  },
  computed: {
    ...mapState('login', ['userInfo']),
  },
  methods: {
    goBack(){
      this.$router.push('/affiliate/maintain')
    }
  },
  mounted() {
    this.affid = parseInt(this.$route.params.affid)
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
