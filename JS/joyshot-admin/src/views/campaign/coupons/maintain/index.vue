<template>
  <div>
    <el-row :gutter="20" class="top-block">
      <Breadcrumb :route="this.$route"></Breadcrumb>
    </el-row>

      <!-------------------------------------------------------------------->
      <!-- action -->
      <!-------------------------------------------------------------------->

    <el-row>
      <el-col :xs="24" :sm="24" :lg="24" style="text-align: right">
        <el-button type="primary" @click.prevent="handleAdd" class="mr-20">{{$t('buttons.new')}} <i class="el-icon-circle-plus-outline"></i>
        </el-button>
      </el-col>
    </el-row>


    <el-row>


      <el-col :xs="24" :sm="24" :lg="24" class="mymain">
        <el-main>
          <el-table :data="couponList" empty-text="無資料" stripe header-row-class-name="headerStyle">
            <el-table-column prop="couponName" label="活動名稱">
            </el-table-column>
            <el-table-column prop="couponCode" label="折扣碼">
            </el-table-column>
            <el-table-column label="推廣員">
              <template slot-scope="scope" v-if="scope.row.affiliateOwner">
                <div>{{scope.row.affiliateOwner.name}}({{scope.row.affiliateOwner.nickName}})</div>
              </template>
            </el-table-column>
            <el-table-column label="折扣金額">
              <template slot-scope="scope">
                <div>${{scope.row.discount}}</div>
              </template>
            </el-table-column>
            <el-table-column label="可使用次數／已使用次數">
              <template slot-scope="scope">
                <div>{{scope.row.usageCount}}／{{scope.row.usageCountCurrent}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="usagePrice" label="最低金額">
            </el-table-column>
            <el-table-column prop="usageService" label="適用項目">
            </el-table-column>
            <el-table-column label="使用期限">
              <template slot-scope="scope">
                <div>{{scope.row.dateStart}}~{{scope.row.dateEnd}}</div>
              </template>
            </el-table-column>


            <el-table-column label="操作" width="180">
              <template slot-scope="scope">

                <el-button type="warning" @click="handleEdit(scope.row)" circle> <i class="el-icon-edit"></i></el-button>

                <el-button type="primary" @click="handleAffiliate(scope.row)" circle> <i class="el-icon-user"></i></el-button>

                <el-popconfirm v-if="scope.row.usageCountCurrent == 0"
                    class="ml-10 popconfirm-bg"
                    title="確定刪除此筆資料嗎?"
                    confirm-button-text="確定"
                    cancel-button-text="取消刪除"
                    icon="el-icon-info"
                    icon-color="red"
                    @confirm="handleDelete(scope.row)"
                >
                  <el-button type="danger" slot="reference" circle> <i class="el-icon-delete"></i></el-button>
                </el-popconfirm>




              </template>
            </el-table-column>
          </el-table>

          <div style="border-radius:8px; margin-top:10px;padding:20px 10px; text-align: center; background-color: white">
            <el-pagination
                background
                layout="prev, pager, next"
                :current-page="pageNum"
                :page-size="pageSize"
                :total="total"
                @current-change="handleCurrentChange">
            </el-pagination>
          </div>

        </el-main>
      </el-col>


      <!-------------------------------------------------------------------->
      <!-- dialog -->
      <!-------------------------------------------------------------------->

      <el-dialog title="建立折價券"
                width="560px"
               :visible.sync="dialogFormVisible"
               >
        <el-form :model="form" label-position="top" :rules="rules" ref="userForm" label-width="80px">
          <el-row>
            <el-col :span="10" class="mr-10">
              <el-form-item label="名稱" prop="couponName">
                <el-input clearable v-model="form.couponName" autocomplete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6" class="mr-10">
              <el-form-item label="折扣碼" prop="couponCode">
                <el-input clearable v-model="form.couponCode" autocomplete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item label=" ">
                <el-button icon="el-icon-magic-stick" type="success" circle @click="generateCouponCode" ></el-button>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="折扣金額" prop="discount">
                <el-input type="number" v-model.number="form.discount"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11" class="mr-10">
              <el-form-item label="使用期-起 (不選表示不限制)" prop="dateStart">
                <el-date-picker
                  v-model="form.dateStart"
                  type="date"
                  format="yyyy/MM/dd"
                  value-format="yyyy/MM/dd"
                  placeholder="選擇日期" class="mt-10">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="使用期-迄 (不選表示不限制)" prop="dateEnd">
                <el-date-picker
                  v-model="form.dateEnd"
                  type="date"
                  format="yyyy/MM/dd"
                  value-format="yyyy/MM/dd"
                  placeholder="選擇日期" class="mt-10">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11" class="mr-10">
              <el-form-item label="可使用次數 (0表示不限制)" prop="usageCount">
                <el-input type="number" v-model.number="form.usageCount"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="最低使用金額 (0表示不限制)" prop="usagePrice">
                <el-input type="number" v-model.number="form.usagePrice"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="適用服務 (不選表示不限制)" prop="usageServiceOption">
                <el-select v-model="form.usageServiceOption" multiple placeholder="請挑選" @change="$forceUpdate()">
                    <el-option
                      v-for="item in serviceOptions"
                      :key="item.id"
                      :label="item.name"
                      :value="item.name">
                    </el-option>
                  </el-select>
              </el-form-item>
            </el-col>
          </el-row>


        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">Cancel</el-button>
          <el-button type="primary" @click="saveCoupon">Confirm</el-button>
        </span>
      </el-dialog>


      <el-dialog title="設定推廣員"
                width="560px"
               :visible.sync="affiliateDialog"
               >
        <el-form :model="affiliateForm" label-position="top" ref="affiliateForm" label-width="80px">

          <el-row>
            <el-col :span="12">
              <el-form-item label="選擇推廣員" prop="usageServiceOption">

                <el-autocomplete
                  class="inline-input full-width-input mt-10"
                  v-model="affiliateForm.couponOwnerName"
                  :fetch-suggestions="queryAffiliate"
                  placeholder="輸入推廣員姓名或暱稱"
                  :trigger-on-focus="false"
                  @select="handleSelect"
                ></el-autocomplete>


              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="affiliateDialog = false">Cancel</el-button>
          <el-button type="primary" @click="saveAffiliate">Confirm</el-button>
        </span>
      </el-dialog>


    </el-row>
  </div>
</template>

<script>
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import generator from 'generate-password'

export default {
  name: "CouponsMaintain",
  components: {
    Breadcrumb
  },
  data() {
    return {
      dialogFormVisible: false,
      affiliateDialog: false,
      form: {
        id:'',
        couponName:'',
        couponCode:'',
        discount:0,
        dateStart:'',
        dateEnd:'',
        usageCount:0,
        usagePrice:0,
        usageServiceOption:[],
        usageService:''
      },
      affiliateForm:{
        id:'',
        couponOwner:0,
        couponOwnerName:''
      },
      couponList:[],
      serviceOptions:[],
      pageNum:0,
      pageSize:20,
      total:0,
      rules:{

      }
    }
  },
  methods: {
    saveAffiliate(){
      let query = {
        id: this.affiliateForm.id,
        couponOwner: this.affiliateForm.couponOwner
      }
      this.request.get("/coupon/affiliate", {params: query}).then(res => {
        if (res.code === '200') {
          this.showResult('success', '推廣員設定完成')
          this.affiliateDialog = false
          this.getData()
        } else {
          this.showResult('error', '推廣員設定失敗')
        }
      })
    },
    handleAffiliate(row){
      this.affiliateForm.couponOwnerName = ''
      this.affiliateDialog = true
      this.affiliateForm.id = row.id
    },
    handleSelect(item) {
      this.affiliateForm.couponOwner = item.id
    },
    queryAffiliate(str, cb){

      this.request.get("/affiliate/q?keyword=" + str).then(res => {
        if (res.code === '200') {

          let list = res.data.map((item) => {
            return {
              value: item.name+'('+item.nickName+')',
              id: item.id
            }
          })
          cb(list)
        }
      })
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.getData()
    },
    clear(){
      this.form.couponName = ''
      this.form.couponCode = ''
      this.form.discount = 0
      this.form.usageCount = 0
      this.form.usagePrice = 0
      this.form.dateStart = ''
      this.form.dateEnd = ''
      this.form.usageServiceOption = []
      this.form.usageService = ''
      this.form.id = ''
    },
    handleAdd(){
      this.dialogFormVisible = true
      this.clear()
    },
    generateCouponCode(){
      var code = generator.generate({
        length: 8,
        numbers: true
      });
      this.form.couponCode = code
    },
    loadServiceCat(){
      let query = {
          pageNum: 1,
          pageSize: 20
      }
      this.request.get("/service-cat", {params:query}).then(res => {
        if (res.code === '200') {
          this.serviceOptions = res.data.records
        } else {
          this.showResult('error', '無法取得服務項目資料')
        }
      })
    },
    getData(){
      let query = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      this.request.get("/coupon", {params:query}).then(res => {
        if (res.code === '200') {
          this.couponList = res.data.records
          this.total = res.data.total
        } else {
          this.showResult('error', '無法取得coupon資料')
        }
      })
    },
    saveCoupon(){

      this.request.get("/coupon/check/duplicate/"+this.form.couponCode).then(res => {
          let canSave = true
          if (res.code === '401') {
            if (res.data.id !== this.form.id) {
              canSave = false
              this.$alert('折扣碼重覆，請重新輸入', '提醒', {confirmButtonText: 'OK'});
            }
          }

          if(canSave) {
            if (this.form.usageServiceOption.length >= 0) {
              this.form.usageService = this.form.usageServiceOption.join(",")
            }

            // 沒有重複，可以新增
            this.request.post("/coupon", this.form).then(res1 => {
              if (res1.code === '200') {
                this.dialogFormVisible = false
                this.getData()
                this.showResult('success', '更新成功')
              } else {
                this.showResult('error', '更新失敗')
              }
            })
          }
        })


    },
    handleDelete(row){
      this.request.delete('/coupon/' + row.id).then(res => {
        if (res.code === '200') {
          this.getData()
          this.showResult('success', 'coupon刪除成功')
        } else {
          this.showResult('error', 'coupon刪除失敗')
        }
      })
    },
    handleEdit(row) {
      this.form = row
      this.dialogFormVisible = true

      if (this.form.usageService != '') {
        if (this.form.usageService.indexOf(',') !== -1) {
          let arr = this.form.usageService.split(',')
          this.form.usageServiceOption = arr
        } else{
          this.form.usageServiceOption = this.form.usageService
        }
      }


    }
  },
  mounted() {
    this.loadServiceCat()
    this.getData()
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
