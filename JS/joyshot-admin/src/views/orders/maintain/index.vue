<template>
  <div>
    <el-row :gutter="20" class="top-block">
      <Breadcrumb :route="this.$route"></Breadcrumb>
    </el-row>
    
    <el-row>
      <el-col :xs="24" :sm="24" :lg="24" style="text-align: right">
        <el-button type="primary" @click.prevent="handleAdd" class="mr-20">{{$t('buttons.new')}} <i class="el-icon-circle-plus-outline"></i>
        </el-button>
      </el-col>

      <el-col :xs="24" :sm="24" :lg="24" style="padding: 20px 10px 20px 30px;">
        
        <el-tabs v-model="activeName">
          <el-tab-pane label="全部狀態" name="allOrder" :lazy="true">
            <AllOrder />
          </el-tab-pane>

          <el-tab-pane label="未付款" name="waitForPayment" :lazy="true">
            <WaitForPayment />
          </el-tab-pane>

          <el-tab-pane label="已付款" name="finishPayment" :lazy="true">
            <FinishPayment />
          </el-tab-pane>

          <el-tab-pane label="照片已上傳" name="photoUpload" :lazy="true">
            <PhotoUpload />
          </el-tab-pane>

          <el-tab-pane label="結案" name="orderClose" :lazy="true">
            <OrderClose />
          </el-tab-pane>

          

        </el-tabs>
      </el-col>
    </el-row>

    <el-dialog title="後台建立訂單"
               :visible.sync="dialogFormVisible"
               >
      <el-form :model="form" label-position="top" :rules="rules" ref="userForm" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="拍攝類型" prop="serviceCat">
              <el-select v-model="form.serviceCat" placeholder="Select">
                <el-option key="1" label="旅遊拍攝" value="旅遊拍攝"></el-option>
                <el-option key="2" label="風格街拍" value="風格街拍"></el-option>
                <el-option key="3" label="家庭聚會" value="家庭聚會"></el-option>
                <el-option key="4" label="活動紀錄" value="活動紀錄"></el-option>
                <el-option key="5" label="紀念時刻" value="紀念時刻"></el-option>
                <el-option key="6" label="情侶閏蜜聚" value="情侶閏蜜聚"></el-option>
                <el-option key="7" label="露營野餐" value="露營野餐"></el-option>
                <el-option key="8" label="公司活動" value="公司活動"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="pr-10">
            <el-form-item label="攝影師" prop="phUuid">
              <el-autocomplete
                  class="inline-input full-width-input mt-10"
                  v-model="photographerName"
                  :fetch-suggestions="queryPhotographer"
                  placeholder="輸入姓名或暱稱"
                  :trigger-on-focus="false"
                  @select="handleSelect"
                  clearable
                  @clear="form.phUuid=''"
                ></el-autocomplete>
            </el-form-item>
          </el-col>
          
        </el-row>
        <el-row>
          <el-col :span="12" class="pr-10">
            <el-form-item label="客戶姓名" prop="customerName">
              <el-input v-model="form.customerName" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="pr-10">
            <el-form-item label="客戶電話" prop="customerPhone">
              <el-input v-model="form.customerPhone" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" class="pr-10">
            <el-form-item label="方便連絡的時間" prop="contactTime">
              <el-input v-model="form.contactTime" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="email" prop="email">
              <el-input v-model="form.email" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" class="pr-10">
            <el-form-item label="拍攝日期" prop="shootingDate">
              <el-date-picker
                v-model="form.shootingDate"
                type="date"
                format="yyyy/MM/dd"
                value-format="yyyy/MM/dd"
                placeholder="選擇日期" class="mt-10">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="拍攝時間" prop="shootingTime">
              <el-input v-model="form.shootingTime" autocomplete="off" placeholder="13:00"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12" class="pr-10">
            <el-form-item label="拍攝時數" prop="shootingDuration">
              <el-select @change="calcFee" v-model="form.shootingDuration" placeholder="Select">
                <el-option 
                  v-for="item in durationOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="pr-10">
            <el-form-item label="費用" prop="serviceFee">
              <el-input v-model="form.serviceFee" autocomplete="off" ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12" class="pr-10">
            <el-form-item label="大人人數" prop="adultNum">
              <el-input type="number" v-model.number="form.adultNum" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="pr-10">
            <el-form-item label="小孩人數" prop="childNum">
              <el-input type="number" v-model.number="form.childNum" autocomplete="off" placeholder="輸入數字"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12" class="pr-10">
            <el-form-item label="社群聯絡" prop="social">
              <el-select v-model="form.social" placeholder="Select">
                <el-option key="1" label="Line" value="Line"></el-option>
                <el-option key="2" label="WhatsApp" value="WhatsApp"></el-option>
                <el-option key="3" label="Wechat" value="Wechat"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="社群帳號" prop="socialAccount">
              <el-input v-model="form.socialAccount" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="地點" prop="shootingLocation">
              <el-input v-model="form.shootingLocation" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="備註" prop="extraInfo">
              <el-input type="textarea" v-model="form.extraInfo" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('buttons.cancel')}}</el-button>
        
        <el-popconfirm
            class="ml-10 popconfirm-bg"
            title="確定新增訂單"
            :confirm-button-text="$t('buttons.confirm')"
            :cancel-button-text="$t('buttons.cancel')"
            icon="el-icon-info"
            icon-color="red"
            @confirm="saveData('userForm')"
        >
          <el-button slot="reference" type="primary">{{ $t('buttons.confirm')}}</el-button>
        </el-popconfirm>

      </div>

    </el-dialog>

  </div>
</template>

<script>

import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import AllOrder from '@/views/orders/maintain/all_order'
import WaitForPayment from '@/views/orders/maintain/wait_for_payment'
import FinishPayment from '@/views/orders/maintain/finish_payment'
import PhotoUpload from '@/views/orders/maintain/photo_upload'
import OrderClose from '@/views/orders/maintain/order_close'
import dayjs from "dayjs";

export default {
  name: "OrdersMaintain",
  components: {
    Breadcrumb, AllOrder, WaitForPayment, FinishPayment, PhotoUpload, OrderClose
  },
  data() {
    return {
      durationOptions: [
        {value: 1, label: '1'},
        {value: 1.5, label: '1.5'},
        {value: 2, label: '2'},
        {value: 2.5, label: '2.5'},
        {value: 3, label: '3'},
        {value: 3.5, label: '3.5'},
        {value: 4, label: '4'},
        {value: 4.5, label: '4.5'},
        {value: 5, label: '5'},
        {value: 5.5, label: '5.5'},
        {value: 6, label: '6'},
        {value: 6.5, label: '6.5'},
        {value: 7, label: '7'},
        {value: 7.5, label: '7.5'},
        {value: 8,label: '8'}
        ],
      dialogFormVisible:false,
      photographerName:'',
      form: {
        orderNo:'',
        phUuid:0,
        custId:-1,
        serviceCat:'',
        serviceFee:0,
        unitPrice:1288,
        transportationFee:0,
        transportationFeeOnCustomer:0,
        transportationFeeCustomerActualPay:0,
        couponDiscount:0,
        totalFee:0,
        customerName:'',
        customerPhone:'',
        contactTime:'',
        shootingDate:'',
        shootingTime:'',
        shootingDuration:0,
        shootingLocation:'',
        adultNum:0,
        childNum:0,
        hasPets:0,
        distance:0,
        photographerProfit:0,
        ratioOnCustomer:0,
        email:'',
        customerCity:'',
        social:'',
        socialAccount:'',
        extraInfo:'',
        status:'processing',
        manualOrder:'Y'
      },
      rules: {
        // empno: [{validator: checkName, trigger: 'change'}]
      },

      activeName:'allOrder',
      pageNum:0,
      pageSize:10,
      total:0,
      tableData:[],
      queryField:'',
      keyword:'',
      options: [{
        value: 'orderNo',
        label: '訂單編號'
      }, {
        value: 'customerPhone',
        label: '客戶電話'
      }, {
        value: 'customerName',
        label: '客戶姓名'
      }]
    }
  },
  methods: {
    saveData(){
     this.form.orderNo = dayjs().format('YYYYMMDDHHmmss')
     this.request.post("/order/manual-order", this.form).then(res => {
        if (res.code === '200') {
          this.getData()
          this.showResult('success', '建立手動訂單成功')
          this.dialogFormVisible = false
        } else {
          this.dialogFormVisible = false
          this.showResult('error', '建立手動訂單失敗')
        }
      })
    },
    queryPhotographer(str, cb){

      this.request.get("/photographer/q?keyword=" + str).then(res => {
        if (res.code === '200') {

          let list = res.data.map((item) => {
            return {
              value: item.name+'('+item.nickName+')',
              id: item.phUuid
            }
          })
          cb(list)
        }
      })
    },
    handleSelect(item) {
      this.form.phUuid = item.id
    },
    calcFee(){
      if (this.form.shootingDuration == 2) {
        this.form.serviceFee = 2488
      } else {
        this.form.serviceFee = this.form.shootingDuration * 1288
      }
      this.form.totalFee = this.form.serviceFee
      this.form.photographerProfit = this.form.shootingDuration * 800

    },
    handleAdd(){
      this.dialogFormVisible = true
    },
    
    getData(){
      window.location.reload(true)
      // let query = {
      //   pageNum: this.pageNum,
      //   pageSize: this.pageSize,
      //   queryField: this.queryField,
      //   keyword: this.keyword
      // }

      // this.request.get('/order/all', {params:query}).then(res => {
      //   if (res.code === "200") {
      //     this.tableData = res.data.records
      //     this.total = res.data.total
      //   } else {
      //     this.showResult('error', this.$t('action.get_error', {err: 'error'}))
      //   }
      // })
    }
  },
  mounted() {
    // this.getData()
    
  }
}
</script>

<style scoped>
.el-5able {
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
  width: 240px;
  height: 178px;
  display: block;
}

.display-avatar {
  width: 60px;
  height: 60px;
  border-radius: 999px;
}


/deep/ .el-upload-dragger {
  width: 260px !important;
  border: 3px dashed #d9d9d9;
}

/deep/ .el-form--label-top .el-form-item__label {
  padding: 0;
}

</style>
