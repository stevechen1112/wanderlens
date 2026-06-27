<template>
  <el-row :gutter="20" class="top-block">
    <Breadcrumb :route="this.$route"></Breadcrumb>

    <!-------------------------------------------------------------------->
    <!-- action -->
    <!-------------------------------------------------------------------->
    <el-col :xs="24" :sm="24" :lg="24">
    
        <el-select v-model="form.area1" placeholder="選擇地區1" @change="loadArea2()">
          <el-option
              v-for="item in areaOption1"
              :key="item.id"
              :label="item.name"
              :value="item.id">
          </el-option>
        </el-select>

        <el-select v-model="form.area2" placeholder="選擇地區2" @change="loadArea3()" class="pl-10">
                <el-option
                    v-for="item in areaOption2"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
              </el-select>
<el-select v-model="form.area3" placeholder="選擇地區3" class="pl-10">
                <el-option
                    v-for="item in areaOption3"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
              </el-select>



      
      <el-button type="normal" @click.prevent="clearQuery" class="ml-10">清除條件</el-button>
    </el-col>

    


    <!-------------------------------------------------------------------->
    <!-- table -->
    <!-------------------------------------------------------------------->
    <el-col :xs="24" :sm="24" :lg="24">
      <el-main>
        <el-table :data="tableData" empty-text="目前尚無資料" stripe header-row-class-name="headerStyle">
          <el-table-column prop="custNo" label="客戶編號" width="80">
          </el-table-column>
          <el-table-column prop="name" label="客戶">
            <template slot-scope="props">
              <p><b>{{ props.row.company }}</b></p>
              <p>{{ props.row.name }}</p>
            </template>
          </el-table-column>
          <el-table-column prop="phone1" label="電話1">
          </el-table-column>
          <el-table-column prop="custType" label="身份別">
          </el-table-column>
          <el-table-column type="expand" label="更多訊息..." width="100">
            <template slot-scope="props">
              <p class="mt-10">地址: {{ props.row.address }}</p>
              <p class="mt-10">電話2: {{ props.row.phone2 }}</p>
              <p class="mt-10">傳真: {{ props.row.fax }}</p>
              <p class="mt-10">統編: {{ props.row.vat }}</p>
              <p class="mt-10">email: {{ props.row.email }}</p>
              <p class="mt-10">已送紙本型錄: {{ props.row.haveCatalog }}</p>
            </template>
          </el-table-column>

          <el-table-column prop="lastVisit" label="最近拜訪時間">
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
      if (value === '') {
        callback(new Error('請輸入資料'))
      } else {
        callback()
      }
    }

    return {
      importAction: '',
      executingImport: 'stop_import',
      dw: '',
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
        label: '依客戶名稱'
      }, {
        value: 'company',
        label: '依公司名稱'
      }, {
        value: 'phone',
        label: '依聯絡電話'
      }, {
        value: 'address',
        label: '依地址'
      }],
      queryField: '',
      keyword: '',
      pageNum: 1,
      pageSize: 10,
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
      roles: [],
      rules: {
        // custNo: [{ required: true, message: 'no input', trigger: 'change' }],
        custNo: [{validator: checkName, trigger: 'change'}],
        name: [{validator: checkName, trigger: 'change'}],
        company: [{validator: checkName, trigger: 'change'}],
        cell: [
          {validator: checkName, trigger: 'change'},
          // { pattern: /^1[1-9]\d{9}$/, message: "手機號碼只限數字", trigger: 'blur' }
        ],
        address: [{validator: checkName, trigger: 'change'}],
        area1: [{validator: checkName, trigger: 'change'}],
        area2: [{validator: checkName, trigger: 'change'}],
        area3: [{validator: checkName, trigger: 'change'}]
      }
    }
  },
  computed: {
    ...mapState('login', ['userInfo']),
  },
  methods: {
    isImporting() {
      if (this.importing) {

      }
    },
    search() {
      this.loadData()
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.loadData()
    },
    clearQuery() {
      this.keyword = ''
      this.queryField = ''
      this.loadData()
    },

    /** data crud **/
    loadData() {
      let data = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        queryField: this.queryField,
        keyword: this.keyword
      }
      // try {
      //   let result = await this.$store.dispatch('customer/getCustomers', data);
      //   this.tableData = result.data.records
      //   this.total = result.data.total
      // } catch (e) {
      //   this.tableData = []
      //   this.total = 0
      //   this.showResult('error', e.message)
      // }


      this.request.post(`/customer/visited?pageNum=${data.pageNum}&pageSize=${data.pageSize}&queryField=${data.queryField}&keyword=${data.keyword}`).then(res => {
          this.tableData = result.data.records
          this.total = result.data.total
      })

    },
    async saveData(formName) {
      this.$refs[formName].validate(async valid => {

        if (valid) {
          try {
            await this.$store.dispatch('customer/saveCustomer', this.form)

            this.showResult('success', '資料更新成功.')

            await this.loadData()
            this.dialogFormVisible = false

          } catch (e) {
            this.showResult('success', '資料更新失敗')
          }
        }
      })
    },
    handleAdd() {
      this.dialogFormVisible = true
      this.form.id = null
      thils.executingImport = 'stop_import'
    },
    handleEdit(rowData) {
      this.dialogFormVisible = true
      this.form = rowData
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
      console.log(file.type)
      const isExcel = (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type === 'application/vnd.ms-excel');
      if (!isExcel) {
        this.$message.error('限上傳 xlsx、xls 格式');
      }
      return isExcel
    },
    handleImportSuccess(res, file) {
      console.log('handleImportSuccess')
      this.executingImport = 'stop_import'
      this.dialogImportFormVisible = false
      if (res.code === '200') {
        this.showResult('success', '匯入完成')
        this.loadData()
      } else {
        this.showResult('error', res.message)
      }
    },
    handleImportError() {
      console.log('handleImportError')
      this.executingImport = 'stop_import'
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
      const defaultWidth = 600; // 預設寬度
      if (windowSize < defaultWidth) {
        this.dw = "90%";
      } else {
        this.dw = defaultWidth + "px";
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
    }


  },
  mounted() {
    this.importAction = '/api/customer/imp?token=' + this.userInfo.token
    this.loadData()
    this.loadArea1()
    window.onresize = () => {
      return (() => {
        this.setDialogWidth();
      })();
    };
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


</style>
