<template>
  <el-row :gutter="20" class="top-block">
    <Breadcrumb :route="this.$route"></Breadcrumb>

    <!-------------------------------------------------------------------->
    <!-- action -->
    <!-------------------------------------------------------------------->
    <el-col :xs="24" :sm="24" :lg="24">
      <el-button type="normal" @click.prevent="goBack" class="ml-20"><i class="el-icon-d-arrow-left"> Back</i>
      </el-button>
    </el-col>

    <el-col :xs="24" :sm="24" :lg="24" style="padding: 20px 10px 20px 30px;">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="Basic Information" name="basicInfo">
          
          <el-row :gutter="20" class="mb-20">
            <el-col :xs="24" :sm="24" :lg="12">
                <el-card class="box-card" >
                    <el-form label-position="top"
                      :model="form"
                       :rules="rules"
                       ref="dataForm"
                       label-width="100px">
                    <!-- <el-row>
                      <el-col :xs="24" :sm="24" :md="12" :lg="12">
                        <el-form-item label="負責業務" prop="salesId">
                          <el-select v-model="form.salesId" placeholder="選擇負責業務">
                            <el-option
                                v-for="item in salesOptions"
                                :key="item.id"
                                :label="item.username"
                                :value="item.id">
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>

                      <el-col :xs="24" :sm="24" :md="12" :lg="12">
                        <el-form-item label="拜訪週期" prop="visitPeriod">
                          <el-select v-model="form.visitPeriod" placeholder="設定拜訪週期">
                            <el-option
                                v-for="item in visitOptions"
                                :key="item.id"
                                :label="item.name"
                                :value="item.value">
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                    </el-row> -->

                    <el-row>
                      <!-- <el-col :xs="24" :sm="24" :md="12" :lg="12">
                        <el-form-item label="客戶編號" prop="custNo" class="mr-20">
                          <el-input v-model="form.custNo" autocomplete="off"></el-input>
                        </el-form-item>
                      </el-col> -->
                      <el-col :xs="24" :sm="24" :md="12" :lg="12">
                        <el-form-item label="Name" prop="name" class="mr-20">
                          <el-input v-model="form.name" autocomplete="off"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :xs="24" :sm="24" :md="12" :lg="12">
                        <el-form-item label="Company" prop="company">
                          <el-input v-model="form.company" autocomplete="off"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>

                    <el-row>
                      <el-col :xs="24" :sm="24" :md="12" :lg="12">
                        <el-form-item label="Phone" prop="phone1" class="mr-20">
                          <el-input :max="10" v-model="form.phone1" autocomplete="off"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :xs="24" :sm="24" :md="12" :lg="12">
                        <el-form-item label="VAT No." prop="vat">
                          <el-input v-model="form.vat" autocomplete="off"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>

                    <!-- <el-row>
                      <el-col :xs="24" :sm="24" :md="12" :lg="12">
                        <el-form-item label="電話2" prop="phone2">
                          <el-input v-model="form.phone2" autocomplete="off"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row> -->

                    <el-row>
                      <el-col :xs="24" :sm="24" :md="12" :lg="12" >
                        <el-form-item label="Email" prop="email" class="mr-20">
                          <el-input v-model="form.email" autocomplete="off"></el-input>
                        </el-form-item>
                      </el-col>
                      <!-- <el-col :xs="24" :sm="24" :md="12" :lg="12">
                        <el-form-item label="身份別" prop="custType" class="mr-20">
                          <el-select v-model="form.custType" placeholder="選擇身份別">
                            <el-option
                                v-for="item in custTypeOption"
                                :key="item.id"
                                :label="item.value"
                                :value="item.value">
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </el-col> -->
                      <el-col :xs="24" :sm="24" :md="12" :lg="12" >
                        <el-form-item label="Fax" prop="fax">
                          <el-input v-model="form.fax" autocomplete="off"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>

                    <el-row>
                      <el-col :xs="24" :sm="24" :md="24" :lg="24" >
                        <el-form-item label="Notes" prop="haveCatalog" class="mr-20">
                          <el-input type="textarea" rows="3" v-model="form.haveCatalog" autocomplete="off"></el-input>
                          <!-- 
                          <el-select v-model="form.haveCatalog" placeholder="已送紙本?">
                            <el-option
                                v-for="item in haveCatalogOption"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                          </el-select> -->
                        </el-form-item>
                      </el-col>
                      
                    </el-row>

                    <!-- <el-row>
                      <el-col :xs="12" :sm="12" :md="12" :lg="12">
                        <el-form-item label="地址" prop="address">
                          <el-input v-model="form.address" autocomplete="off"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row> -->


                    <el-row v-for="(btn, i) in btnCount" :key="i" >
                      <el-col :xs="24" :sm="24" :md="24">
                        <el-form-item>
                          <el-input placeholder="Address" v-model="form.addressList[i]" autocomplete="off"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <!-- <el-row class="mb-20 mt-10">
                      <el-col :xs="24" :sm="24" :md="24">
                        <el-button size="small" type="primary" @click="addContact()">新增聯絡人</el-button>
                      </el-col>
                    </el-row> -->
                  </el-form>

                  <div class="text-right">
                    <el-button type="primary" @click="saveData('dataForm')">Save</el-button>
                  </div>
                </el-card>
            </el-col>

            <el-col :xs="24" :sm="24" :lg="12">
                <el-card class="box-card myAddressCard" >
                    <el-row class="mb-20 mt-10">
                      <el-col :xs="24" :sm="24" :md="24">
                        <el-button style="float: right;" size="small" type="primary" @click="handleNewAddress()">New Address</el-button>
                      </el-col>
                    </el-row>
                    <el-row class="mb-20 mt-10">
                      <el-table :data="customerAddressData" empty-text="No Data" stripe header-row-class-name="headerStyle">
                        <el-table-column label="Address" prop="address"></el-table-column>
                        
                        <el-table-column label="Action" width="120">
                          <template slot-scope="scope">
                            <el-button type="primary" circle @click="handleEditAddress(scope.row)"><i class="el-icon-edit"></i></el-button>

                            <el-popconfirm
                                class="ml-10 popconfirm-bg"
                                title="Delete this data?"
                                confirm-button-text="Confirm"
                                cancel-button-text="Cancel"
                                icon="el-icon-info"
                                icon-color="red"
                                @confirm="handleDeleteAddress(scope.row.id)">
                              <el-button type="danger" slot="reference" circle><i class="el-icon-delete"></i></el-button>
                            </el-popconfirm>
                          </template>
                        </el-table-column>

                      </el-table>
                    </el-row>
                </el-card>

                <el-card class="box-card mt-20">
                    <el-row class="mb-20 mt-10">
                      <el-col :xs="24" :sm="24" :md="24">
                        <el-button style="float: right;" size="small" type="primary" @click="handleNewContact()">new Contact</el-button>
                      </el-col>
                    </el-row>
                    <el-row class="mb-20 mt-10">
                      <el-table :data="customerContactData" empty-text="No Data" stripe header-row-class-name="headerStyle">
                        <el-table-column label="Contact" prop="contact" ></el-table-column>
                        <el-table-column label="Phone" prop="phone" ></el-table-column>
                        <el-table-column label="Email" prop="email"></el-table-column>
                        
                        <el-table-column label="Action" >
                          <template slot-scope="scope">
                            <el-button type="primary" circle @click="handleEditContact(scope.row)"><i class="el-icon-edit"></i></el-button>

                            <el-popconfirm
                                class="ml-10 popconfirm-bg"
                                title="Delete this data?"
                                confirm-button-text="Confirm"
                                cancel-button-text="Cancel"
                                icon="el-icon-info"
                                icon-color="red"
                                @confirm="handleDeleteContact(scope.row.id)">
                              <el-button type="danger" slot="reference" circle><i class="el-icon-delete"></i></el-button>
                            </el-popconfirm>
                          </template>
                        </el-table-column>

                      </el-table>
                    </el-row>
                </el-card>
            </el-col>
          </el-row>

          <el-row>
            <!-- 聯絡人 -->
            <!-- <el-card class="mt-20">
              <div slot="header" class="clearfix">
                <span class="mr-20">聯絡人</span>
                <el-button style="float: right; padding: 5px 12px; margin-top: -7px;" type="primary"
                         @click.prevent="handleAddContact" class="mr-20">
                         <i class="el-icon-circle-plus-outline"></i> 新增聯絡人
                </el-button>
              </div>
              <el-table empty-text="目前無資料">
                <el-table-column label="聯絡人"></el-table-column>
                <el-table-column label="電話"></el-table-column>
                <el-table-column label="備註"></el-table-column>
              </el-table>
            </el-card> -->
            <!-- end 聯絡人 -->

            <!-- 修改紀錄 -->
            <el-card class="mt-20">
              <div slot="header" class="clearfix">
                <span class="mr-20">Customer Update History</span>
              </div>
              <el-table :data="history.gridData" empty-text="No Data">
                <el-table-column property="createdAt" label="Date"></el-table-column>
                <el-table-column property="user.username" label="Update By"></el-table-column>
                <el-table-column width="300" label="Notes">
                  <template slot-scope="scope">
                    <div v-html="scope.row.notes"></div>
                  </template>
                </el-table-column>
              </el-table>
              <div style="border-radius:8px; margin-top:10px;padding:20px 10px; text-align: center; background-color: white">
                <el-pagination
                    background
                    layout="prev, pager, next"
                    :current-page="history.pageNum"
                    :page-size="history.pageSize"
                    :total="history.total"
                    @current-change="handleHistoryTableChange">
                </el-pagination>
              </div>
            </el-card>
            <!-- end 修改紀錄 -->
          </el-row>
        </el-tab-pane>
        

      </el-tabs>
    </el-col>
    



    <!-------------------------------------------------------------------->
    <!-- dialog -->
    <!-------------------------------------------------------------------->
    <el-dialog title="匯入客戶交易資料"
               :visible.sync="tx.impDialog"
               :width="tx.dw">
      <el-form ref="importForm" label-width="100px">
        <div style="text-align: center;" v-if="tx.processing">
              <i class="el-icon-loading" style="font-size:22px"></i>匯入處理中...
        </div>
        <el-upload drag
                  class="avatar-uploader"
                   :action="tx.importAction"
                   :show-file-list="false"
                   :before-upload="beforeImport"
                   :on-progress="importProcessing"
                   :on-success="handleImportSuccess"
                  :on-change="doneImport"
                   >
          <i class="el-icon-plus avatar-uploader-icon"></i>
          <div slot="tip" class="el-upload__tip">限上傳 xlsx、xls 格式</div>
        </el-upload>
      </el-form>
    </el-dialog>

    <el-dialog title="新增客戶地址"
               :visible.sync="customerAddressDialog"
               @close="cancelSetupAddress"
               :width="dw">
      <el-form ref="customerAddressForm" :form="customerAddressForm">
        <el-form-item label="地址" prop="address">
          <el-input placeholder="請輸入地址" v-model="customerAddressForm.address" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelSetupAddress">取 消</el-button>
        <el-button type="primary" @click="saveCustomerAddressData('customerAddressForm')">確 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改客戶地址"
               :visible.sync="update_customerAddressDialog"
               @close="update_cancelSetupAddress"
               :width="dw">
      <el-form ref="update_customerAddressForm" :form="update_customerAddressForm">
        <el-form-item label="地址" prop="address">
          <el-input placeholder="請輸入地址" v-model="update_customerAddressForm.address" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="update_cancelSetupAddress">取 消</el-button>
        <el-button type="primary" @click="update_saveCustomerAddressData('update_customerAddressForm')">確 定</el-button>
      </div>
    </el-dialog>
    


    <el-dialog title="新增聯絡人"
           :visible.sync="customerContactDialog"
           @close="cancelSetupContact"
           :width="dw">
      <el-form ref="customerContactForm" :form="customerContactForm">
        <el-form-item label="聯絡人" prop="name">
          <el-input placeholder="請輸入聯絡人" v-model="customerContactForm.contact" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="電話" prop="phone">
          <el-input placeholder="請輸入電話" v-model="customerContactForm.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="email" prop="email">
          <el-input placeholder="請輸入email" v-model="customerContactForm.email" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelSetupContact">取 消</el-button>
        <el-button type="primary" @click="saveCustomerContactData('customerContactForm')">確 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="修改聯絡人"
           :visible.sync="update_customerContactDialog"
           @close="update_cancelSetupContact"
           :width="dw">
      <el-form ref="update_customerContactForm" :form="update_customerContactForm">
        <el-form-item label="聯絡人" prop="name">
          <el-input placeholder="請輸入聯絡人" v-model="update_customerContactForm.contact" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="電話" prop="phone">
          <el-input placeholder="請輸入電話" v-model="update_customerContactForm.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="email" prop="email">
          <el-input placeholder="請輸入email" v-model="update_customerContactForm.email" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="update_cancelSetupContact">取 消</el-button>
        <el-button type="primary" @click="update_saveCustomerContactData('update_customerContactForm')">確 定</el-button>
      </div>
    </el-dialog>

  </el-row>


</template>

<script>
import {mapState} from 'vuex'
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import dayjs from "dayjs"


export default {
  name: "CustomerDetail",
  components: {
    Breadcrumb
  },
  data() {
    let checkName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('請輸入資料'))
      } else {
        callback()
      }
    }

    return {

      dw: '60%',
      activeName: 'basicInfo',

      btnCount:0,

      customerAddressDialog: false,
      update_customerAddressDialog: false,
      customerContactDialog: false,
      update_customerContactDialog: false,

      /**上頁接收的參數**/
      cid:'',

      custTypeOption: [],

      /**業務人員選項**/
      salesOptions:[],

      /**拜訪周期選項**/
      visitOptions:[],

      /**客戶修改紀錄**/
      history: {
        gridData: [],
        pageNum: 0,
        pageSize: 10,
        total: 0
      },

      /**基本資料表單**/
      form: {
        area1: '',
        area2: '',
        area3: '',
        custNo: '',
        company: '',
        name: '',
        phone1: '',
        phone2: '',
        custType: '',
        fax: '',
        address: '',
        vat: '',
        email: '',
        haveCatalog: '',
        notes: '',
        salesId:0,
        visitPeriod:0,
        addressList:[]
      },

      

      /**報價資料**/
      quotation: {
        tableData:[],
        total:0,
        pageNum:0,
        pageSize:15
      },

      /**交易資料**/
      tx: {
        dw: '30%',
        tableData:[],
        total:0,
        pageNum:0,
        pageSize:15,
        impDialog: false,
        processing: false,
        importAction: ''
      },

      customerAddressData:[],
      customerAddressForm: {
        id:'',
        cid:'',
        address:''
      },
      update_customerAddressForm: {
        id:'',
        cid:'',
        address:''
      },

      customerContactData:[],
      customerContactForm: {
        id:null,
        cid:0,
        contact:'',
        phone:'',
        email:''
      },
      update_customerContactForm: {
        id:null,
        cid:0,
        contact:'',
        phone:'',
        email:''
      },
      
      
      


      rules: {
        name: [{required: true, validator: checkName, trigger: 'change'}],
        company: [{required: true, validator: checkName, trigger: 'change'}],
        cell: [
          {required: true, validator: checkName, trigger: 'change'},
          // { pattern: /^1[1-9]\d{9}$/, message: "手機號碼只限數字", trigger: 'blur' }
        ],
        address: [{required: true, validator: checkName, trigger: 'change'}],
        area1: [{required: true, validator: checkName, trigger: 'change'}],
        area2: [{required: true, validator: checkName, trigger: 'change'}],
        area3: [{required: true, validator: checkName, trigger: 'change'}]
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
  methods: {
    beforeImport(file) {
      const isExcel = (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type === 'application/vnd.ms-excel');
      if (!isExcel) {
        this.$message.error('限上傳 xlsx、xls 格式');
      }
      return isExcel
    },
    importProcessing(){
      this.tx.processing = true
    },
    handleImportSuccess(res, file) {
      this.tx.impDialog = false
      if (res.code === '200') {
        this.showResult('success', '匯入完成')
        this.getTransaction()
      } else {
        this.showResult('error', res.message)
      }
    },
    doneImport(){
      this.tx.processing = false
    },
    saveData(formName) {
      this.$refs[formName].validate(async valid => {

        if (valid) {

          this.request.post("/customer/update", this.form).then(res => {
            if (res.code === '200') {
              this.getCustomerBasicInfo()
              this.getCustomerUpdateHistory()
              this.showResult('success', '資料更新成功.')
            } else {
              this.showResult('error', '資料更新失敗'+res.message)
            }
          })

        }
      })
    },
    getCustomerBasicInfo() {
      this.request.get("/customer/" + this.cid).then(res => {
        if (res.code === '200') {
          this.form = res.data
          
          this.getCustomerAddress();
          this.getCustomerContact();
        }
      })
    },
    handleClick(tab, event) {
      console.log(tab.name);
      if (tab.name === 'QuotationInfo') {
        this.getQuotation()
      } else if (tab.name === 'TransactionInfo') {
        this.getTransaction()
      }
    },
    goBack(){
      this.$router.push('/customers/maintain')
    },

    prepareCustomerType() {
      
      let req = '/dic/type?queryField=customer_type'
      this.request.get(req).then(res => {
        if (res.code === '200') {
          this.custTypeOption = res.data

          this.getCustomerBasicInfo()

        }
      })
    },

    prepareVisitPeriodOption() {
      
      let req = '/dic/type?queryField=visit_period'
      this.request.get(req).then(res => {
        if (res.code === '200') {
          this.visitOptions = res.data
        }
      })
    },

    setDialogWidth() {
      let windowSize = document.body.clientWidth;
      const defaultWidth = '400'; // 預設寬度
      if (windowSize < defaultWidth) {
        this.dw = "90%";
        this.tx.dw = "90%"
      } else {
        this.dw = "60%"
        this.tx.dw = "30%"
      }
    },

    getCustomerUpdateHistory() {
      try {
        let {pageNum, pageSize} = this.history
        this.request.get(`/customer/history?pageNum=${pageNum}&pageSize=${pageSize}&cid=${this.cid}`).then(res => {
          if (res.code === '200') {
            this.history.gridData = res.data.records
            this.history.total = res.data.total
          }
        })
      } catch (e) {
        this.showResult('error', e.message)
      }
    },

    getSalesList() {
      try {
        this.request.get("/user/sales" ).then(res => {
          if (res.code === '200') {
            this.salesOptions = res.data
          }
        })
      } catch (e) {
        this.showResult('error', e.message)
      }
    },

    getQuotation() {
      this.request.get(`/quotation/customer?pageNum=${this.quotation.pageNum}&pageSize=${this.quotation.pageSize}&cid=${this.cid}`).then(res => {
        if (res.code === '200') {
          this.quotation.tableData = res.data.records
          this.quotation.total = res.data.total
        } else {
          this.quotation.tableData = []
          this.quotation.total = 0
          this.showResult('error', '撈取報價單出錯')
        }
      })
    },

    getTransaction() {
      this.request.get(`/customer/tx?pageNum=${this.tx.pageNum}&pageSize=${this.tx.pageSize}&cid=${this.cid}`).then(res => {
        if (res.code === '200') {
          this.tx.tableData = res.data.records
          this.tx.total = res.data.total
        } else {
          this.tx.tableData = []
          this.tx.total = 0
          this.showResult('error', '撈取交易歷史出錯')
        }
      })
    },


    handleHistoryTableChange(val) {
      this.history.pageNum = val
      this.getCustomerUpdateHistory()
    },
    handleQuotationTableChange(val) {
      this.quotation.pageNum = val
      this.getQuotation()
    },
    handleTransactionTableChange(val) {
      this.tx.pageNum = val
      this.getTransaction()
    },


    ////// address
    clearCustomerAddressForm() {
      this.customerAddressForm.id = null
      this.customerAddressForm.address = ''
    },
    cancelSetupAddress() {
      this.clearCustomerAddressForm()
      this.customerAddressDialog = false
    },
    update_cancelSetupAddress() {
      this.update_customerAddressDialog = false
      this.getCustomerAddress()
    },
    handleNewAddress(){
      this.customerAddressDialog = true
      this.$nextTick(function () {
        this.clearCustomerAddressForm()
      })
    },
    handleEditAddress(rowData){
      this.update_customerAddressForm = rowData
      this.update_customerAddressDialog = true
    },
    handleDeleteAddress(id){
      this.request.delete('/customer/address/' + id).then(res => {
        if (res.code === '200') {
          this.getCustomerAddress()
          this.showResult('success', '地址刪除成功')
        } else {
          this.showResult('error', '地址刪除失敗')
        }
      })
    },
    saveCustomerAddressData() {
      this.request.post('/customer/address', this.customerAddressForm).then(res => {
        if (res.code === '200') {
          this.customerAddressDialog = false
          this.customerAddressForm.address = ''
          this.getCustomerAddress()
          this.showResult('success', '地址更新成功')
        } else {
          this.showResult('error', '地址更新失敗')
        }
      })
    },
    update_saveCustomerAddressData() {
      this.request.post('/customer/address', this.update_customerAddressForm).then(res => {
        if (res.code === '200') {
          this.update_customerAddressDialog = false
          this.getCustomerAddress()
          this.showResult('success', '地址更新成功')
        } else {
          this.showResult('error', '地址更新失敗')
        }
      })
    },

    getCustomerAddress() {
      this.request.get('/customer/address/' + this.cid).then(res => {
        if (res.code === '200') {
          this.customerAddressData = res.data
          this.getCustomerUpdateHistory()
        } else {
          this.showResult('error', '地址取得失敗')
        }
      })
    },

    ////// contact
    clearCustomerContactForm() {
      this.customerContactForm.id = null
      this.customerContactForm.contact = ''
      this.customerContactForm.phone = ''
      this.customerContactForm.email = ''
    },
    cancelSetupContact() {
      this.clearCustomerContactForm()
      this.customerContactDialog = false
    },
    update_cancelSetupContact() {
      this.update_customerContactDialog = false
      this.getCustomerContact()
    },
    handleNewContact(){
      this.customerContactDialog = true
      this.$nextTick(function () {
        this.clearCustomerContactForm()
      })
    },
    handleEditContact(rowData){
      this.update_customerContactDialog = true
      this.$nextTick(function () {
        this.update_customerContactForm = rowData
      })
    },
    handleDeleteContact(id){
      this.request.delete('/customer/contact/' + id).then(res => {
        if (res.code === '200') {
          this.getCustomerContact()
          this.showResult('success', '聯絡人刪除成功')
        } else {
          this.showResult('error', '聯絡人刪除失敗')
        }
      })
    },
    saveCustomerContactData() {
      this.request.post('/customer/contact', this.customerContactForm).then(res => {
        if (res.code === '200') {
          this.customerContactDialog = false
          this.getCustomerContact()
          this.showResult('success', '聯絡人更新成功')
        } else {
          this.showResult('error', '聯絡人更新失敗')
        }
      })
    },
    
    update_saveCustomerContactData() {
      this.request.post('/customer/contact', this.update_customerContactForm).then(res => {
        if (res.code === '200') {
          this.update_customerContactDialog = false
          this.getCustomerContact()
          this.showResult('success', '聯絡人更新成功')
        } else {
          this.showResult('error', '聯絡人更新失敗')
        }
      })
    },

    getCustomerContact() {
      this.request.get('/customer/contact/' + this.cid).then(res => {
        if (res.code === '200') {
          this.customerContactData = res.data
          this.getCustomerUpdateHistory()
        } else {
          this.showResult('error', '聯絡人取得失敗')
        }
      })
    }


  },
  mounted() {
    this.tx.importAction = '/api/customer/imp/tx?token=' + this.userInfo.token

    this.cid = parseInt(this.$route.params.cid)
    this.customerAddressForm.cid = parseInt(this.$route.params.cid)
    this.customerContactForm.cid = parseInt(this.$route.params.cid)

    

    this.getSalesList()

    this.prepareVisitPeriodOption()

    this.prepareCustomerType()
    
    this.getCustomerUpdateHistory()

    this.setDialogWidth();
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
