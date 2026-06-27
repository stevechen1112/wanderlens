<template>

  <el-row :gutter="20" class="top-block">

    <Breadcrumb :route="this.$route"></Breadcrumb>

    <!-------------------------------------------------------------------->
    <!-- action -->
    <!-------------------------------------------------------------------->


    <!-------------------------------------------------------------------->
    <!-- table -->
    <!-------------------------------------------------------------------->
    <el-col :xs="24" :sm="24" :lg="24">

      <el-col :xs="24" :sm="24" :lg="5">
        <el-main>
          <el-table :data="groupByTableData"
                    default-expand-all
                    row-key="id"
                    empty-text="無資料"
                    stripe header-row-class-name="headerStyle">
            <el-table-column label="流程名稱">
              <template slot-scope="scope">
                <el-button type="text" @click.prevent="searchTerm(scope.row.col)"> {{scope.row.col}} ({{scope.row.count}})</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-main>
      </el-col>

      <el-col :xs="24" :sm="24" :lg="19">
        <el-main>
          <el-table :data="tableData"
                    default-expand-all
                    row-key="id"
                    empty-text="無資料"
                    stripe header-row-class-name="headerStyle">
            <el-table-column prop="flowName" label="系統流程" width="200">
            </el-table-column>

            <el-table-column prop="notifyUser" label="通知人">
              <template slot-scope="scope">
                  <span v-for="(s,idx) in scope.row.notifyUser" :key="idx">
                    <el-tag class="mr-10 mt-10">{{s.username}}</el-tag>
                  </span>
              </template>
            </el-table-column>

            <!-- <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="warning" @click="handleEdit(scope.row)" >編輯 <i class="el-icon-edit"></i></el-button>
              </template>
            </el-table-column> -->
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
    </el-col>

    <!-------------------------------------------------------------------->
    <!-- dialog -->
    <!-------------------------------------------------------------------->
    <el-dialog title="系統流程資訊"
               :visible.sync="dialogFormVisible"
               :width="dw"
               @close="closeDialog">

      <el-form :model="form"
               :rules="rules"
               ref="dataForm"
               label-width="120px">
        <el-row>
          <el-col :xs="24" :sm="24" :md="24">
            <el-form-item label="名稱" prop="name">
              <el-input :disabled="true" v-model="form.flowName" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :xs="24" :sm="24" :md="24">
            <el-form-item label="流程通知人" :label-width="formLabelWidth">
              <el-select
                  v-model="form.lineNotifyUserOption"
                  multiple
                  :clearable="true"
                  placeholder="通知人" style="width: 100%">
                <el-option
                    v-for="item in mgrOptions"
                    :key="item.id"
                    :label="item.username"
                    :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveData('dataForm')">確 定</el-button>
      </div>
    </el-dialog>


  </el-row>

</template>

<script>
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";

export default {
  name: "AppFlowMaintain",
  components: {
    Breadcrumb
  },
  data() {
    return {
      signLimitForm:{
        id: '',
        vpThreshold: 0
      },
      signLimitDialog: false,
      groupByTableData:[],
      checkList: [],
      options: [],
      mgrOptions: [],
      dw: '50%',
      tableData: [],
      queryField: '',
      keyword: '',
      pageNum: 1,
      pageSize: 15,
      total: 0,
      dialogFormVisible: false,
      formLabelWidth: '',
      selectedUser: '',
      form: {
        name: '',
        value: '',
        type: '',
        lineNotifyUser: '',
        lineNotifyUserOption: [],
        lineNotifyUserOptionDisplay: []
      },
      rules: {
        // step1UserOption: [{validator: checkLength, trigger: 'select'}]
      }
    }
  },
  methods: {
    searchTerm(term){
      this.keyword = term
      this.loadData()
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.loadData()
    },
    loadFlow() {
      this.request.get("/dic/type?queryField=job_type").then(res => {
        if (res.code === '200') {
          this.options = res.data
        }
      })
    },
    loadAdmin() {
      this.request.get("/user/mgr").then(res => {
        if (res.code === '200') {
          this.mgrOptions = res.data
        }
      })
    },
    
    loadData() {
      let { pageNum, pageSize, keyword } = this
      let query = {pageNum, pageSize, keyword}

      this.request.get('/appflow/page',{params:query}).then(res => {
          this.tableData = res.data.records
          this.total = res.data.total
      })

      // let result = await this.$store.dispatch('signoff/getAllSignoffs', data);
      // this.tableData = result.data.records
      // this.total = result.data.total
    },

    async saveData(formName) {

      this.$refs[formName].validate(async valid => {
        if (valid) {
          try {
            
            console.log(this.form)
            this.request.post("/appflow", this.form).then(res => {
              if (res.code === '200') {
                this.loadData()
                this.dialogFormVisible = false
                
                this.showResult('success', '資料更新成功.')
              } else {
                this.showResult('error', '資料更新失敗'+res.message)
              }
            })

          } catch (e) {
            this.showResult('error', '資料更新失敗')
          }
        }
      })
    },
    
    handleEdit(row) {
      this.dialogFormVisible = true
      this.form = row


      this.form.lineNotifyUserOption = row.lineNotifyUser.map(({userId})=> userId)

      // console.log('after:', this.form.step1UserOption)
      // this.form.step1UserOptionDisplay = this.form.step1UserOption
    },
    closeDialog() {
      this.loadData()
      this.$refs['dataForm'].resetFields();
    },
    addUser() {
      this.step1User.push(this.selectedUser);
      this.selectedUser = '';
    },
    handleClose() {

    },
    loadGroupbyData() {
      this.request.get("/appflow/groupby").then(res => {
        if (res.code === '200') {
          this.groupByTableData = res.data
        }
      })
    }

  },
  mounted() {
    this.loadData()
    // //this.loadFlow()
    this.loadAdmin()
    this.loadGroupbyData()
  }
}
</script>

<style scoped>
.el-table {
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

.el-main {
  padding: 20px 4px;
}

</style>
