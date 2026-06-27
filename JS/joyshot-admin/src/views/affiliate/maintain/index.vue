<template>
  <div>
    <el-row :gutter="20" class="top-block">
      <Breadcrumb :route="this.$route"></Breadcrumb>
    </el-row>

      <!-------------------------------------------------------------------->
      <!-- action -->
      <!-------------------------------------------------------------------->

    <el-row>
      <el-col :xs="24" :sm="24" :lg="16">
        <el-select v-model="queryField" :placeholder="$t('message.data_filter')" style="padding: 0 0 0 20px">
          <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
        <el-input v-model="keyword" style="width: 200px" :placeholder="$t('page.user_maintain.filter.keyword')" class="ml-10"
                  suffix-icon="el-icon-search"></el-input>

        <el-button type="primary" @click.prevent="search" class="ml-10">{{$t('buttons.search')}}</el-button>
        <el-button type="normal" @click.prevent="clearQuery" class="ml-10">{{$t('buttons.clear')}}</el-button>
      </el-col>

      <el-col :xs="24" :sm="24" :lg="8" style="text-align: right">
        <el-button type="primary" @click.prevent="handleAdd" class="mr-20">{{$t('buttons.new')}} <i class="el-icon-circle-plus-outline"></i>
        </el-button>
      </el-col>
    </el-row>


    <el-row>



        <el-col :xs="24" :sm="24" :lg="24" class="mymain">
          <el-main>
            <el-table :data="tableData" empty-text="無資料" stripe header-row-class-name="headerStyle">
              <el-table-column prop="name" label="姓名" width="200">
                <template slot-scope="scope">
                  <img v-if="scope.row.avatar" :src="showImage(scope.row.avatar)" class="display-avatar mr-10">
                  {{scope.row.name}}
                </template>
              </el-table-column>
              <el-table-column prop="nickName" label="暱稱">
              </el-table-column>
              <el-table-column prop="phone" label="電話">
              </el-table-column>
              <el-table-column prop="email" label="email" width="220">
              </el-table-column>
              <el-table-column label="銀行資訊" width="220">
                <template slot-scope="scope" v-if="scope.row.bankName">
                  <div>{{scope.row.bankName}}({{scope.row.bankCode}}) {{scope.row.bankBranch}}</div>
                  <div>戶名：{{scope.row.bankAccountName}}</div>
                  <div>帳號：{{scope.row.bankAccountNo}}</div>
                </template>
              </el-table-column>
              <el-table-column prop="bankNotes" label="備註">
              </el-table-column>

              <el-table-column label="操作" width="180">
                <template slot-scope="scope">
                  <el-button type="warning" @click="handleEdit(scope.row)" circle> <i class="el-icon-edit"></i></el-button>
                  <el-popconfirm
                      class="ml-10 popconfirm-bg"
                      title="確定刪除此筆資料嗎?"
                      confirm-button-text="確定"
                      cancel-button-text="取消刪除"
                      icon="el-icon-info"
                      icon-color="red"
                      @confirm="handleDelete(scope.row.id)"
                  >
                    <el-button type="danger" slot="reference" circle> <i class="el-icon-delete"></i></el-button>
                  </el-popconfirm>
                </template>
              </el-table-column>
            </el-table>

            <AppPagination :pageNum="pageNum" :pageSize="pageSize" :total="total" @pageChange="pageChange" />

          </el-main>
        </el-col>


      <!-------------------------------------------------------------------->
      <!-- dialog -->
      <!-------------------------------------------------------------------->

      <el-dialog title="建立推廣員基本資訊"
               :visible.sync="dialogFormVisible"
               width="50%"
               @close="closeDialog">

      <el-form label-position="top"
               :model="form"
               :rules="rules"
               ref="dataForm" class="myform">

        <el-row>
          <el-col :xs="24" :sm="24" :md="12" :lg="8" class="pr-10">
            <el-form-item label="手機" prop="phone">
              <el-input v-model="form.phone" autocomplete="off" @blur="checkExist"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="8" class="pr-10">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="form.name" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="8" class="pr-10">
            <el-form-item label="暱稱" prop="nickName">
              <el-input v-model="form.nickName" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :xs="24" :sm="24" :md="12" :lg="12">
            <el-form-item label="Email" prop="email">
              <el-input v-model="form.email" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :xs="24" :sm="24" :md="8"  class="pr-10">
            <el-form-item label="銀行代碼" prop="bankCode">
              <el-input v-model="form.bankCode" autocomplete="off" ></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="8"  class="pr-10">
            <el-form-item label="銀行" prop="bankName">
              <el-input v-model="form.bankName" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="8">
            <el-form-item label="分行" prop="bankBranch">
              <el-input v-model="form.bankBranch" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :xs="24" :sm="24" :md="12"  class="pr-10">
            <el-form-item label="戶名" prop="bankAccountName">
              <el-input v-model="form.bankAccountName" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12">
            <el-form-item label="帳號" prop="bankAccountNo">
              <el-input v-model="form.bankAccountNo" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :xs="24" :sm="24" :md="24" >
            <el-form-item label="備註" prop="bankNotes">
              <el-input type="textarea" :rows="5" lazy v-model="form.bankNotes"></el-input>
            </el-form-item>
          </el-col>
        </el-row>



      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="saveData('dataForm')">確認</el-button>
      </div>
    </el-dialog>
    </el-row>
  </div>
</template>

<script>

import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import AppPagination from '@/components/pagination/AppPagination'

export default {
  name: "affiliateMaintain",
  components: {
    Breadcrumb,AppPagination
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
      pageNum: 1,
      pageSize: 20,
      total: 0,

      options: [
        {value: 'name', label: "依姓名或暱稱" },
        {value: 'phone', label: "依電話"}
      ],
      queryField:'',
      keyword:'',


      groupByTableData:[],
      tableData:[],

      /**dialog**/
      dialogFormVisible: false,

      /**new affiliate form**/
      form:{
        id:null,
        name:'',
        nickName:'',
        phone:'',
        email:'',
        goLive:'Y',
        bankCode:'',
        bankName:'',
        bankBranch:'',
        bankAccountName:'',
        bankAccountNo:'',
        bankNotes:''
      },

      /**form validation rule**/
      rules:{
        name: [{required: true, validator: checkName, trigger: 'change'}],
        nickName: [{required: true, validator: checkName, trigger: 'change'}],
        phone: [{required: true, validator: checkName, trigger: 'change'}],
        email: [{required: true, validator: checkName, trigger: 'change'}]
      },


      /**地區資料**/
      cityOption: [],
      districtOption: [],

      totalaffiliate:0,
      liveaffiliateCount:0,

      didQuery: false,

    }
  },
  methods: {
    clearAll(){
      this.form.id = null
      this.form.name = ''
      this.form.nickName = ''
      this.form.phone = ''
      this.form.email = ''
      this.form.goLive = 'Y'
      this.form.bankCode = ''
      this.form.bankName = ''
      this.form.bankBranch = ''
      this.form.bankAccountName = ''
      this.form.bankAccountNo = ''
      this.form.bankNotes = ''
    },
    checkExist() {
      this.request.get("/user/account/exists?empno="+this.form.phone).then(res => {
        if (res.code === '200') {
          //pass
        } else {
          this.showResult('error', '手機號碼 '+this.form.phone+' 已被使用，請重新輸入')
          this.form.phone = ''
        }
      })
    },
    openDashboard(){
      this.$router.push('/affiliate/dashboard')
    },
    changeLiveStatus(row){
      if (row.goLive === 'Y') {
        row.goLive = 'N'
      } else {
        row.goLive = 'Y'
      }

      this.request.post('/affiliate/live', row).then(res => {
          if (res.code === '200') {
            this.showResult('success', this.$t('action.save_success'))
            this.loadData()
          } else {
            this.showResult('success', this.$t('action.save_error',{ err:res.message}))
          }
      })
    },

    getQueryParam(){
      // let data = {
      //   pageNum: this.pageNum,
      //   pageSize: this.pageSize,
      //   queryField: this.queryField,
      //   keyword: this.keyword
      // }
      // return data


      let url = '/affiliate/all?'
      url += 'pageNum=' + this.pageNum
      url += '&pageSize=' + this.pageSize
      url += '&queryField='+ this.queryField
      url += '&keyword='+ this.keyword

      return url
    },

    /**負責取得推廣員的資料**/
    loadData(){

      let data = ''
      if (this.didQuery) {
        data = this.getQueryParam()
        localStorage.setItem('JS_QUERY_affiliate_URL', data)

      } else {
        //從localStorage取回查詢條件，主要用在回上頁時
         data = localStorage.getItem('JS_QUERY_affiliate_URL')
         console.log('url=>', data)
         if (data === null || typeof data === 'undefined') {
            data = this.getQueryParam()
         }
      }

      this.request.get(data).then(res => {
        if (res.code === '200') {
            this.tableData = res.data.records
            this.total = res.data.total
        } else {
          this.showResult('error', '推廣員資料取得失敗')
        }
      })
    },

    /**進行查詢**/
    search() {
      this.didQuery = true
      this.loadData()
    },

    /**點擊分區後**/
    searchTerm(term){
      this.didQuery = true
      this.queryField = 'city'
      this.keyword = term
      this.loadData()
    },

    /**清除查詢條件**/
    clearQuery() {
      this.didQuery = true
      this.queryField = ''
      this.keyword = ''
      this.loadData()
    },

    /**點擊新增按鈕**/
    handleAdd() {
      this.dialogFormVisible = true
    },

    /**點擊刪除按鈕**/
    handleDelete(id) {
      this.request.delete("/affiliate/" + id).then(res => {
          if (res.code === '200') {
            this.showResult('success', this.$t('action.delete_success'))
            this.loadData()
          } else {
            this.showResult('success', this.$t('action.delete_error',{ err:res.message}))
          }
      })
    },

    /**點擊編輯按鈕**/
    handleEdit(rowData) {
      this.form = rowData
      this.dialogFormVisible = true
    },

    /**處理分頁點擊**/
    pageChange(val) {
      this.didQuery = true
      this.pageNum = val
      this.loadData()
    },

    /**dialog**/
    closeDialog(){
      this.dialogFormVisible = false
    },

    saveData(formName){
      this.$refs[formName].validate(async valid => {

        if (valid) {
          this.request.post("/affiliate", this.form).then(res => {
            if (res.code === '200') {
              this.dialogFormVisible = false
              this.showResult("success", "資料更新成功")
              this.loadData()
            } else {
              this.showResult("error", "資料更新錯誤")
            }
          })
        }
      })


    },


  },
  mounted() {
    this.loadData()
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

.el-form--label-top >>> .el-form-item__label {
  padding: 0;
}

</style>
