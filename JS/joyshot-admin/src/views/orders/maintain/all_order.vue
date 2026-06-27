<template>
  <div>
    <el-row>
      <el-col :xs="24" :sm="24" :lg="16">
        <el-select :xs="24" v-model="queryField" placeholder="選擇" style="padding: 0 0 0 20px">
          <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
        <el-input v-model="keyword" style="width: 200px" placeholder="keyword" class="ml-10"
                  suffix-icon="el-icon-search"></el-input>

        <el-button type="primary" @click.prevent="search" class="ml-10">搜尋</el-button>
        <el-button type="normal" @click.prevent="clearQuery" class="ml-10">清除查詢</el-button>
      </el-col>

      <el-col :xs="24" :sm="24" :lg="8" style="text-align: right">
      </el-col>
    </el-row>

    <el-row>
      <el-col :xs="24" :sm="24" :lg="24" class="mymain">
        <el-main>
          <el-table id="product_table" :data="tableData" empty-text="無資料" stripe header-row-class-name="headerStyle">
            <el-table-column label="訂單編號" width="180">
              <template slot-scope="scope">
                <div>{{scope.row.orderNo}}</div>
                <div>
                  <el-button v-if="scope.row.status != 'cancel' && scope.row.status !='auto_cancel'" size="mini" type="normal" @click.prevent="cancelOrder(scope.row)" class="ml-10">取消</el-button>
                  <el-button v-if="scope.row.status != 'cancel' && scope.row.status !='auto_cancel'" size="mini" type="normal" @click.prevent="updateOrder(scope.row)" class="ml-10">變更</el-button>
                  <el-button v-if="scope.row.status != 'cancel' && scope.row.status !='auto_cancel'" size="mini" type="normal" @click.prevent="orderPay(scope.row)" class="ml-10">設成已付款</el-button>
                  <el-button size="mini" type="normal" @click.prevent="showHistory(scope.row)" class="ml-10">訂單歷程</el-button>
                </div>
              </template>
            </el-table-column>

            <el-table-column label="客戶">
              <template slot-scope="scope">
                <div>{{scope.row.customerName}}</div>
                <div>{{scope.row.customerPhone}}</div>
              </template>
            </el-table-column>

            <el-table-column label="拍攝日期" width="120">
              <template slot-scope="scope">
                <div>{{scope.row.shootingDate}}</div>
                <div>{{scope.row.shootingTime}} ({{scope.row.shootingDuration}}小時)</div>
              </template>
            </el-table-column>



            <el-table-column label="訂單金額">
              <template slot-scope="scope">
                <span>${{scope.row.totalFee}}</span>
              </template>
            </el-table-column>

            <el-table-column label="攝影師" width="130">
              <template slot-scope="scope">
                <span>{{scope.row.photographer.nickName}}</span>
                <!-- <div>
                  <el-button size="mini" type="normal" @click.prevent="clearQuery" class="ml-10">更換攝影師</el-button>
                </div>
 -->
              </template>
            </el-table-column>

            <el-table-column label="訂單總成本/拍攝酬勞/交通補貼(總交通費-交通收入)" width="220">
              <template slot-scope="scope">
                <div>${{scope.row.photographerProfit}}/${{scope.row.shootingDuration * 800}}/${{scope.row.transportationFeeCustomerActualPay}}</div>
              </template>
            </el-table-column>

            <el-table-column prop="couponCode" label="折扣碼">
            </el-table-column>

            <el-table-column label="手動單">
              <template slot-scope="scope">
                <span v-if="scope.row.manualOrder=='Y'">是</span>
              </template>
            </el-table-column>

            <el-table-column label="訂單狀態" width="140">
              <template slot-scope="scope">
                <div v-if="scope.row.status == 'processing'">
                  <el-tag size="mini" type="warning" effect="dark">
                    {{ scope.row.orderStatus }}
                  </el-tag>
                </div>
                <div v-else-if="scope.row.status == 'pay_success'">
                  <el-tag size="mini" type="success" effect="dark">
                    {{ scope.row.orderStatus }}
                  </el-tag>
                </div>
                <div v-else-if="scope.row.status == 'contact'">
                  <el-tag size="mini" type="info" effect="plain">
                    {{ scope.row.orderStatus }}
                  </el-tag>
                </div>
                <div v-else-if="scope.row.status == 'pay_failed'">
                  <el-tag size="mini" type="danger" effect="plain">
                    {{ scope.row.orderStatus }}
                  </el-tag>
                </div>
                <div v-else-if="scope.row.status == 'uploaded'">
                  <el-tag size="mini" type="info" effect="plain">
                    {{ scope.row.orderStatus }}
                  </el-tag>
                </div>
                <div v-else-if="scope.row.status == 'confirm-uploaded'">
                  <el-tag size="mini" type="info" effect="plain">
                    {{ scope.row.orderStatus }}
                  </el-tag>
                </div>
                <div v-else-if="scope.row.status == 'close'">
                  <el-tag size="mini" effect="plain">
                    {{ scope.row.orderStatus }}
                  </el-tag>
                </div>
                <div v-else>
                  <el-tag size="mini" effect="plain">
                    {{ scope.row.orderStatus }}
                  </el-tag>
                </div>
              </template>
            </el-table-column>

            <el-table-column label="結帳日" prop="payDate">
            </el-table-column>

            <el-table-column type="expand" label="更多訊息..." width="120">
              <template slot-scope="props">
                <div class="ml-20">
                  <p class="mt-10">－方便聯絡時間 : {{ props.row.contactTime }}</p>
                  <p class="mt-10">－拍攝類型 : {{ props.row.serviceCat }}</p>
                  <p class="mt-10">－地點 : {{ props.row.shootingLocation }}</p>
                  <p class="mt-10">－人數 : {{props.row.shootingPersons}}</p>
                  <p class="mt-10">－社群聯絡方式 : {{ props.row.social }}</p>
                  <p class="mt-10">－社群帳號 : {{ props.row.socialAccount }}</p>
                  <p class="mt-10" v-if="props.row.email">－email : {{ props.row.email }}</p>
                  <p class="mt-10" v-if="props.row.customerCity">－客戶來自縣市 : {{ props.row.customerCity }}</p>
                  <p class="mt-10" v-if="props.row.extraInfo">－附加資訊 : {{ props.row.extraInfo }}</p>
                </div>
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
    </el-row>


    <el-dialog title="更新訂單"
               :visible.sync="dialogFormVisible"
               >
      <el-form :model="form" label-position="top" :rules="rules" ref="orderForm" label-width="80px">
        <el-row>
          <el-col :span="12" class="pr-10">
            <el-form-item label="訂單編號" prop="orderNo">
              <el-input v-model="form.orderNo" readonly :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客戶" prop="customerName">
              <el-input v-model="form.customerName" readonly :disabled="true"></el-input>
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
          <el-col :span="6" class="pr-10">
            <el-form-item label="拍攝時間" prop="shootingTime">
              <el-input v-model="form.shootingTime" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="時數" prop="shootingDuration">
              <el-input v-model="form.shootingDuration" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="拍攝地點" prop="shootingLocation">
              <el-input v-model="form.shootingLocation" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>

          <el-col :span="12">
            <el-form-item label="攝影師" prop="phUuid">
              <el-autocomplete
                  class="inline-input full-width-input mt-10"
                  v-model="form.photographer.nickName"
                  :fetch-suggestions="queryPhotographer"
                  placeholder="輸入姓名或暱稱"
                  :trigger-on-focus="false"
                  @select="handleSelect"
                  clearable
                  @clear="form.phUuid=''"
                ></el-autocomplete>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="訂單狀態" prop="status">
             <el-input v-model="form.status" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="訂單更新備註" prop="notes">
              <el-input type="textarea" :rows="5" lazy v-model="form.notes" placeholder="請務必填寫變更備註"></el-input>
            </el-form-item>
          </el-col>
        </el-row>


      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('buttons.cancel')}}</el-button>


        <el-popconfirm
            class="ml-10 popconfirm-bg"
            title="確定更新訂單"
            :confirm-button-text="$t('buttons.confirm')"
            :cancel-button-text="$t('buttons.cancel')"
            icon="el-icon-info"
            icon-color="red"
            @confirm="saveData('orderForm')"
        >
          <el-button slot="reference" type="primary">{{ $t('buttons.confirm')}}</el-button>
          <!-- <el-button v-if="scope.row.role.name !== 'photographer'" type="danger" slot="reference">{{$t('buttons.delete')}} <i class="el-icon-delete"></i></el-button> -->
        </el-popconfirm>


      </div>

    </el-dialog>


    <el-dialog title="取消訂單"
               :visible.sync="cancelOrderDialog"
               >
      <el-form :model="cancelForm" label-position="top" :rules="cancelRules" ref="cancelForm" label-width="80px">
        <el-row>
          <el-col :span="12" class="pr-10">
            <el-form-item label="訂單編號" prop="orderNo">
              <el-input v-model="cancelForm.orderNo" readonly :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客戶" prop="customerName">
              <el-input v-model="cancelForm.customerName" readonly :disabled="true"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="攝影師">
              <el-input v-model="cancelForm.photographer.nickName" readonly :disabled="true"></el-input>
            </el-form-item>
          </el-col>

        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="訂單取消備註" prop="notes">
              <el-input type="textarea" :rows="5" lazy v-model="cancelForm.notes" placeholder="請務必填寫備註"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelOrderDialog = false">{{ $t('buttons.cancel')}}</el-button>

        <el-popconfirm
            class="ml-10 popconfirm-bg"
            title="確定取消訂單"
            :confirm-button-text="$t('buttons.confirm')"
            :cancel-button-text="$t('buttons.cancel')"
            icon="el-icon-info"
            icon-color="red"
            @confirm="saveCancelData('cancelForm')"
        >
          <el-button slot="reference" type="primary">{{ $t('buttons.confirm')}}</el-button>
        </el-popconfirm>


      </div>

    </el-dialog>



    <el-dialog title="訂單歷程"
               :visible.sync="historyFormDialog" width="80%">
      <el-table id="order_history_table" :data="orderHistoryTable" empty-text="無資料" stripe header-row-class-name="headerStyle">

        <el-table-column label="時間" width="150">
          <template slot-scope="props">
            <div>{{props.row.createdAt | fmtDateTime}}</div>
          </template>
        </el-table-column>
        <el-table-column label="執行人員" prop="execBy" width="120">
        </el-table-column>
        <el-table-column label="動作" prop="orderAction" width="120">
        </el-table-column>
        <el-table-column label="變更內容" prop="actionDetail" width="280">
        </el-table-column>
        <el-table-column label="變更備註" prop="updateNotes">
        </el-table-column>


      </el-table>
    </el-dialog>



  </div>
</template>

<script>

export default {
  name: 'AllOrder',
  components:{

  },
  data(){
    let checkName = (rule, value, callback) => {
      if (value === '' || value === null || typeof value === 'undefined') {
        callback(new Error('請輸入資料'))
      } else {
        callback()
      }
    }
    return {
      cancelOrderDialog: false,
      dialogFormVisible:false,
      historyFormDialog: false,
      orderHistoryTable:[],
      pageNum:0,
      pageSize:20,
      total:0,
      tableData:[],
      queryField:'',
      keyword:'',
      form:{
        orderNo:'',
        customerName:'',
        shootingDate:'',
        shootingTime:'',
        shootingDuration:'',
        shootingLocation:'',
        photographer:{

        },
        notes:'',
        phUuid:'',
        status:''
      },
      cancelForm:{
        photographer:{
        },
        notes:'',
        orderNo:'',
        customerName:''
      },
      rules:{
        notes: [{required: true, validator: checkName, trigger: 'change'}],
      },
      cancelRules:{
        notes: [{required: true, validator: checkName, trigger: 'change'}],
      },

      options: [{
        value: 'orderNo',
        label: '訂單編號'
      }, {
        value: 'customerPhone',
        label: '客戶電話'
      }, {
        value: 'customerName',
        label: '客戶姓名'
      }, {
        value: 'photograhperName',
        label: '攝影師'
      }]
    }
  },
  methods:{
    search(){
      this.getData()
    },
    clearQuery(){
      this.pageNum = 1
      this.queryField = ''
      this.keyword = ''
      this.getData()
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.getData()
    },

    getData(){
      let query = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        queryField: this.queryField,
        keyword: this.keyword
      }

      this.request.get('/order/all', {params:query}).then(res => {
        if (res.code === "200") {
          this.tableData = res.data.records
          this.total = res.data.total
        } else {
          this.showResult('error', this.$t('action.get_error', {err: 'error'}))
        }
      })
    },

    cancelOrder(row){
      console.log(row)
      this.cancelForm = row
      this.cancelOrderDialog = true
    },

    updateOrder(row){
      this.form = row
      this.dialogFormVisible = true
    },

    orderPay() {

    },

    showHistory(row){
      this.request.get("/order/history?orderNo=" + row.orderNo).then(res => {
        if (res.code === '200') {
          this.orderHistoryTable = res.data
          this.historyFormDialog = true
        }
      })
    },

    saveData(formName){
      this.$refs[formName].validate(async valid => {
        if (valid) {
          this.request.post("/order/update", this.form).then(res => {
            if (res.code === '200') {
              this.dialogFormVisible = false
              this.getData()
              this.showResult('success', '訂單資料新增成功.')
            } else {
              this.showResult('error', '訂單資料更新失敗')
            }
          })
        }
      })
    },

    saveCancelData(formName){
      this.$refs[formName].validate(async valid => {
        if (valid) {
          this.request.post("/order/cancel", this.cancelForm).then(res => {
            if (res.code === '200') {
              this.cancelOrderDialog = false
              this.getData()
              this.showResult('success', '訂單取消成功.')
            } else {
              this.showResult('error', '訂單取消失敗')
            }
          })
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

    handleSelect(item){
      this.form.phUuid = item.id
    }


  },
  mounted(){
    this.getData()
  }
}

</script>

<style scoped>
.finish {
  color: green;
}
.not-finish {
  color: red;
}

#order_history_table >>> .el-table__row .cell {
  white-space: pre-line !important;
}
</style>


