<template>
  <el-row :gutter="20" class="top-block">
    <Breadcrumb :route="this.$route"></Breadcrumb>

    <!-------------------------------------------------------------------->
    <!-- action -->
    <!-------------------------------------------------------------------->
    <el-col :xs="24" :sm="24" :lg="16">
      <el-select :xs="24" v-model="queryField" placeholder="Search Criteria" style="padding: 0 0 0 20px">
        <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
        </el-option>
      </el-select>
      <el-input v-model="keyword" style="width: 200px" placeholder="keyword" class="ml-10"
                suffix-icon="el-icon-search"></el-input>

      <el-button type="primary" @click.prevent="search" class="ml-10">Search</el-button>
      <el-button type="normal" @click.prevent="clearQuery" class="ml-10">Clear</el-button>
    </el-col>

    <el-col :xs="24" :sm="24" :lg="8" style="text-align: right">
      <!-- <el-button @click.prevent="exportCurrent">Export <i class="el-icon-upload2"></i></el-button> -->
      <!-- <el-button @click.prevent="dialogImportFormVisible = true">Import <i class="el-icon-download"></i></el-button> -->
      <el-button type="primary" @click.prevent="handleAdd" class="mr-20">New <i
          class="el-icon-circle-plus-outline"></i></el-button>
    </el-col>


    <!-------------------------------------------------------------------->
    <!-- table -->
    <!-------------------------------------------------------------------->
    <el-col :xs="24" :sm="24" :lg="24">
      <el-main>
        <el-table :data="tableData" empty-text="No Data" stripe header-row-class-name="headerStyle">
          <el-table-column prop="custNo" label="Customer No." width="120">
          </el-table-column>
          <el-table-column prop="company" label="Company">
            <template slot-scope="scope">
              <router-link :to="`/customers/detail/${scope.row.id}`">{{scope.row.company}}</router-link>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="Customer Name">
          </el-table-column>
          <el-table-column prop="phone1" label="Phone">
          </el-table-column>
          <!-- <el-table-column prop="custType" label="身份別">
          </el-table-column> -->
          <!-- <el-table-column type="expand" label="更多訊息..." width="100">
            <template slot-scope="props">
              <p class="mt-10">地址: {{ props.row.address }}</p>
              <p class="mt-10">電話2: {{ props.row.phone2 }}</p>
              <p class="mt-10">傳真: {{ props.row.fax }}</p>
              <p class="mt-10">統編: {{ props.row.vat }}</p>
              <p class="mt-10">email: {{ props.row.email }}</p>
              <p class="mt-10">已送紙本型錄: {{ props.row.haveCatalog }}</p>
            </template>
          </el-table-column> -->


          <el-table-column label="Action" width="260">
            <template slot-scope="scope">
              <el-button type="warning" @click="handleEdit(scope.row)">Edit <i class="el-icon-edit"></i></el-button>
              <el-popconfirm
                  class="ml-10 popconfirm-bg"
                  title="Delete this data?"
                  confirm-button-text="Confirm"
                  cancel-button-text="Cancel"
                  icon="el-icon-info"
                  icon-color="red"
                  @confirm="handleDelete(scope.row.id)"
              >
                <el-button v-if="userInfo.deletePermission === 1" type="danger" slot="reference">Delete <i class="el-icon-delete"></i></el-button>
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
    <el-dialog title="Customer Information"
               :visible.sync="dialogFormVisible"
               :width="dw"
               @close="closeDialog">
      <el-form label-position="top"
               :model="form"
               :rules="rules"
               ref="dataForm" class="myform">
        <el-row>
          <el-col :xs="24" :sm="24" :md="12" :lg="12" class="pr-10">
            <el-form-item label="Name" prop="name">
              <el-input v-model="form.name" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
          <!-- <el-col :xs="24" :sm="24" :md="12" :lg="12" class="pr-10">
            <el-form-item label="Customer No" prop="custNo">
              <el-input v-model="form.custNo" autocomplete="off" ></el-input>
            </el-form-item>
          </el-col> -->
          <el-col :xs="24" :sm="24" :md="12" :lg="12">
            <el-form-item label="Company" prop="company">
              <el-input v-model="form.company" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :xs="24" :sm="24" :md="12" :lg="12" class="pr-10">
            <el-form-item label="Phone" prop="phone1">
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
            <el-form-item label="Phone 2" prop="phone2">
              <el-input v-model="form.phone2" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row> -->

        <el-row>
          <!-- <el-col :xs="24" :sm="24" :md="12" :lg="12" class="pr-10">
            <el-form-item label="身份別" prop="custType">
              <el-select v-model="form.custType" placeholder="選擇身份別">
                <el-option
                    v-for="item in custTypeOption"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col> -->
          <el-col :xs="24" :sm="24" :md="12" :lg="12" class="pr-10">
            <el-form-item label="email" prop="email">
              <el-input v-model="form.email" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="12">
            <el-form-item label="Fax" prop="fax">
              <el-input v-model="form.fax" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- <el-row>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" class="pr-10">
            <el-form-item label="Notes" prop="haveCatalog">
              <el-input type="textarea" rows="3" v-model="form.haveCatalog" autocomplete="off"></el-input>

              <el-select v-model="form.haveCatalog" placeholder="已送紙本?">
                <el-option
                    v-for="item in haveCatalogOption"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row> -->


        <!-- <el-row>
          <el-col :xs="24" :sm="24" :md="8" :lg="8" class="pr-10">
            <el-form-item label="地區" prop="area1" label-width="80px">
              <el-select v-model="form.area1" placeholder="選擇地區1" @change="loadArea2()">
                <el-option
                    v-for="item in areaOption1"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="8" :lg="8" class="pr-10">
            <el-form-item label="地區" prop="area2" label-width="0px">
              <el-select v-model="form.area2" placeholder="選擇地區2" @change="loadArea3()" class="pl-10">
                <el-option
                    v-for="item in areaOption2"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="8" :lg="8">
            <el-form-item label="地區" prop="area3" label-width="0px">
              <el-select v-model="form.area3" placeholder="選擇地區3" class="pl-10">
                <el-option
                    v-for="item in areaOption3"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row> -->

        <el-row>
          <el-col :xs="24" :sm="24" :md="24" :lg="24">
            <el-form-item label="Address" prop="address">
              <el-input v-model="form.address" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>


        <!--        <el-row>-->
        <!--          <el-col :xs="24" :sm="24" :md="24" :lg="24">-->
        <!--            <el-form-item label="備註" prop="notes" >-->
        <!--              <el-input type="textarea" v-model="form.notes" autocomplete="off"></el-input>-->
        <!--            </el-form-item>-->
        <!--          </el-col>-->
        <!--        </el-row>-->
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="saveData('dataForm')">Confirm</el-button>
      </div>
    </el-dialog>

    <el-dialog title="Import Customer Data"
               :visible.sync="dialogImportFormVisible"
               :width="dw">

      <el-form ref="importForm" label-width="100px">
        <div style="text-align: center;" v-if="loading">
          <i class="el-icon-loading" style="font-size:22px"></i>data processing...
        </div>
        <el-upload drag
                   class="avatar-uploader"
                   :show-file-list="false"
                   :action="importAction"
                   :on-progress="avatarProgress"
                   :on-change="avatarChanged"
                   :on-success="handleImportSuccess"
                   :before-upload="beforeImport"
                   :on-error="handleImportError">
          <i class="el-icon-plus avatar-uploader-icon"></i>
          <div slot="tip" class="el-upload__tip">xlsx、xls only</div>
        </el-upload>
      </el-form>
      <div :class="executingImport" style="text-align: center;font-size: 18px;"><i class="el-icon-loading"></i></div>
    </el-dialog>


    <el-dialog title="Customer Information"
               :visible.sync="dupDialog"
               :width="dw">

      <el-row>
        <el-col :xs="24" :sm="24" :md="24" :lg="24">
          <!-- <div style="text-align: center;" v-if="loading">
            <i class="el-icon-loading" style="font-size:22px"></i>更新中...
          </div> -->
          <div>
            Customer exsits, do you really want to update？
          </div>

          <el-table :data="dupTableData" empty-text="No Data" stripe header-row-class-name="headerStyle">
            <el-table-column prop="company" label="Company">
            </el-table-column>
            <el-table-column prop="name" label="Name">
            </el-table-column>
            <el-table-column prop="custType" label="身份別">
            </el-table-column>
          </el-table>

          <!-- <div :class="executingImport" style="text-align: center;font-size: 18px;"><i class="el-icon-loading"></i></div> -->
        </el-col>
      </el-row>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dupDialog = false">Cancel Update</el-button>
        <el-button type="primary" @click="confirmUpdate()">Confirm Update</el-button>
      </div>
    </el-dialog>

  </el-row>


</template>

<script>
import {mapState} from 'vuex'
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";

export default {
  name: "CustomerMaintain",
  components: {
    Breadcrumb
  },
  data() {
    let checkName = (rule, value, callback) => {
      if (value === '' || value === null || typeof value === 'undefined') {
        callback(new Error('請輸入資料'))
      } else {
        callback()
      }
    }

    return {
      loading: false,
      importAction: '',
      executingImport: 'stop_import',
      dw: '50%',
      gridData: [],
      tableData: [],
      areaOption1: [],
      areaOption2: [],
      areaOption3: [],
      custTypeOption: [
        {value: '設計公司/設計師', label: '設計公司/設計師'},
        {value: '裝修工程公司', label: '裝修工程公司'},
        {value: '木工師傅 / 個人裝修單位', label: '木工師傅 / 個人裝修單位'},
      ],
      haveCatalogOption: [
        {value: '是', label: '是'},
        {value: '否', label: '否'},
      ],
      options: [{
        value: 'name',
        label: 'Customer Name'
      }, {
        value: 'company',
        label: 'Company Name'
      }, {
        value: 'phone1',
        label: 'Phone'
      }],
      queryField: '',
      keyword: '',
      pageNum: 1,
      pageSize: 20,
      total: 0,
      dialogFormVisible: false,
      dialogImportFormVisible: false,
      formLabelWidth: '',
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
        notes: ''
      },
      dupTableData:[],
      dupDialog: false,
      importSession:'',
      roles: [],
      rules: {
        // custNo: [{ required: true, message: 'no input', trigger: 'change' }],
        custType: [{required: true, validator: checkName, trigger: 'change'}],
        name: [{required: true, validator: checkName, trigger: 'change'}],
        company: [{required: true, validator: checkName, trigger: 'change'}],
        cell: [
          {required: true, validator: checkName, trigger: 'change'},
          // { pattern: /^1[1-9]\d{9}$/, message: "手機號碼只限數字", trigger: 'blur' }
        ],
        address: [{required: true, validator: checkName, trigger: 'change'}],
        // area1: [{required: true, validator: checkName, trigger: 'change'}],
        // area2: [{required: true, validator: checkName, trigger: 'change'}],
        // area3: [{required: true, validator: checkName, trigger: 'change'}]
      }
    }
  },
  computed: {
    ...mapState('login', ['userInfo']),
  },
  methods: {
    avatarProgress(){
      this.loading = true
    },
    avatarChanged(){
      this.loading = false
    },

    search() {
      let q = {
        pageNum:this.pageNum,
        pageSize:this.pageSize,
        queryField:this.queryField,
        keyword:this.keyword
      }

      localStorage.setItem('LH_CUSTOMER_QUERY', JSON.stringify(q))

      this.loadData()
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.loadData()
    },
    clearQuery() {
      this.pageNum = 1
      this.keyword = ''
      this.queryField = ''

      let q = {
        pageNum:this.pageNum,
        pageSize:this.pageSize,
        queryField:this.queryField,
        keyword:this.keyword
      }

      localStorage.setItem('LH_CUSTOMER_QUERY', JSON.stringify(q))

      this.loadData()
    },

    /** data crud **/
    async loadData() {
      let data = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        queryField: this.queryField,
        keyword: this.keyword
      }
      try {
        let result = await this.$store.dispatch('customer/getAllCustomers', data);
        this.tableData = result.data.records
        this.total = result.data.total
      } catch (e) {
        this.tableData = []
        this.total = 0
        this.showResult('error', e.message)
      }

    },

    saveData(formName) {
      this.$refs[formName].validate(async valid => {

        if (valid) {
          try {
            this.request.post("/customer", this.form).then(res => {
              if (res.code === '200') {
                this.clearQuery()
                // this.loadData()
                this.dialogFormVisible = false
                this.showResult('success', '資料更新成功')
              } else {
                this.showResult("error", "資料更新失敗:"+res.message)
              }
            })
          } catch (e) {
            this.showResult('error', '資料更新失敗'+e)
          }
        }
      })
    },
    handleAdd() {
      this.dialogFormVisible = true
      this.form.id = null
      this.executingImport = 'stop_import'
    },
    handleEdit(rowData) {

      this.$router.push('/customers/detail/' + rowData.id)

      // this.dialogFormVisible = true
      // this.form = rowData
    },
    async handleDelete(id) {
      try {
        await this.$store.dispatch('customer/deleteCustomer', id)
        this.showResult('success', '資料刪除成功.')

        await this.loadData()
        this.dialogFormVisible = false

      } catch (e) {
        this.showResult('error', '資料刪除失敗.')
      }
    },

    closeDialog() {
      this.$refs['dataForm'].resetFields()
      this.loadData()
    },
    beforeImport(file) {
      const isExcel = (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type === 'application/vnd.ms-excel');
      if (!isExcel) {
        this.$message.error('限上傳 xlsx、xls 格式');
      }
      return isExcel
    },
    handleImportSuccess(res) {
      this.dialogImportFormVisible = false
      if (res.code === '200') {
        if(res.data != null && res.data != '') {

          console.log('有匯入重複的客戶，請確認是否做客戶資料更新', res.data)
          this.importSession = res.data
          this.request.get("/customer/dup/"+this.importSession).then(res1 => {
            if (res1.code === '200') {
              this.dupTableData = res1.data
              this.dupDialog = true
            } else {
              this.importSession = ''
              this.showResult('error', '無法取得資料')
            }
          })

        } else {
          this.showResult('success', '匯入完成')
        }
        this.loadData()

      } else {
        this.showResult('error', res.message)
      }
    },
    handleImportError() {
      this.loading = false
      this.showResult('error', '匯入失敗')
    },
    loadArea1() {
      this.request.get("/area/area1").then(res => {
        if (res.code === '200') {
          this.areaOption1 = res.data
        } else {
          this.showResult('error', '無法取得地區1資料')
        }
      })
    },
    loadArea2() {
      this.request.get("/area/area2/" + this.form.area1).then(res => {
        if (res.code === '200') {
          this.areaOption2 = res.data
        } else {
          this.showResult('error', '無法取得地區2資料')
        }
      })
    },
    loadArea3() {
      this.request.get("/area/area3/" + this.form.area2).then(res => {
        if (res.code === '200') {
          this.areaOption3 = res.data
        } else {
          this.showResult('error', '無法取得地區3資料')
        }
      })
    },
    setDialogWidth() {
      let windowSize = document.body.clientWidth;
      const defaultWidth = 400; // 預設寬度
      if (windowSize < defaultWidth) {
        this.dw = "90%";
      } else {
        this.dw = "50%";
      }
    },
    getHistory(row) {
      try {
        this.request.get("/customer/history/" + row.id).then(res => {
          if (res.code === '200') {
            this.gridData = res.data.records
          }
        })

        // let result = await this.$store.dispatch('reqPay/getSignOffHistory', row.id)


      } catch (e) {
        this.showResult('error', e.message)
      }
    },
    exportCurrent() {
      let url = "/customer/export-current?pageNum=" + this.pageNum + "&pageSize=" + this.pageSize + "&queryField=" + this.queryField + "&keyword=" + this.keyword
      // window.open(url, "_new")
      window.open(process.env.VUE_APP_API_SERVER + url, "new")
    },
    confirmUpdate(){
      this.request.get("/customer/dup/confirm/" + this.importSession).then(res => {
        this.importSession = ''
        if (res.code === '200') {
          this.dupDialog = false
          this.showResult('success', '更新完成')
        } else {
          this.dupDialog = false
          this.showResult('error', '更新失敗')
        }
      })
    }


  },
  mounted() {
    // let cache = localStorage.getItem('LH_CUSTOMER_QUERY')
    // let cacheObj = JSON.parse(cache)
    // if (cache !== null) {
    //   this.pageNum = cacheObj.pageNum
    //   this.pageSize = cacheObj.pageSize
    //   this.queryField = (typeof cacheObj.queryField === 'undefined')? '': cacheObj.queryField
    //   this.keyword = (typeof cacheObj.keyword === 'undefined')? '': cacheObj.keyword
    // }

    // this.importAction = '/api/customer/imp?token=' + this.userInfo.token
    // this.loadData()
    // this.loadArea1()
    // this.setDialogWidth();
  }
}
</script>

<style scoped>
.el-table {
  border-radius: 10px;
  padding: 20px;
}



.start_import {
  display: block;
}

.stop_import {
  display: none;
}

.myform >>> .el-form-item {
  margin-bottom: 10px;
}
.myform >>> .el-form-item__label {
  padding: 0px;
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
