<template>

  <el-row :gutter="20" class="top-block mydic">

    <Breadcrumb :route="this.$route"></Breadcrumb>

    <!-------------------------------------------------------------------->
    <!-- action -->
    <!-------------------------------------------------------------------->
    <el-col :xs="24" :sm="24" :lg="16">
      <el-select :xs="24" v-model="queryField" placeholder="選擇類型" class="pl-20">
        <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
        </el-option>
      </el-select>
      <el-input v-model="keyword" style="width: 200px" placeholder="keyword" class="ml-10"
                suffix-icon="el-icon-search"></el-input>
      <el-button type="primary" @click.prevent="search" class="ml-10">查詢</el-button>
      <el-button type="normal" @click.prevent="clearQuery" class="ml-10">清除查詢</el-button>
    </el-col>

    <el-col :xs="24" :sm="24" :lg="8" style="text-align: right">
      <!-- <el-button type="primary" @click.prevent="exportData">匯出 <i class="el-icon-upload2"></i></el-button> -->
      <el-button type="primary" @click.prevent="handleAdd" class="mr-20">新增 <i class="el-icon-circle-plus-outline"></i>
      </el-button>
    </el-col>

    <!-------------------------------------------------------------------->
    <!-- table -->
    <!-------------------------------------------------------------------->



    <el-col :xs="24" :sm="24" :lg="24">
      <el-col :xs="24" :sm="24" :lg="5">
        <el-main>
          <el-table :data="groupByTableData"
                    default-expand-all
                    row-key="id"
                    empty-text="No Data"
                    stripe header-row-class-name="headerStyle">
            <el-table-column label="Type">
              <template slot-scope="scope">

                <el-button type="text" @click.prevent="searchTerm(scope.row.col)"> {{scope.row.col | transformType}} ({{scope.row.count}})</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-main>
      </el-col>

      <el-col :xs="24" :sm="24" :lg="19" class="mymain">
        <el-main class="mymain">
          <el-table :data="tableData"
                    default-expand-all
                    row-key="id"
                    empty-text="No Data"
                    stripe header-row-class-name="headerStyle">

            <el-table-column prop="name" label="名稱" width="160">
            </el-table-column>
            <el-table-column prop="value" label="設定值">
              <template slot-scope="scope">
                <i :class="scope.row.value" style="font-size:16px"></i> {{scope.row.value}}
              </template>
            </el-table-column>
            <el-table-column label="類型">
              <template slot-scope="scope">
                {{scope.row.type | transformType}}
              </template>
            </el-table-column>
            <el-table-column prop="notes" label="備註"></el-table-column>

            <el-table-column label="Action">
              <template slot-scope="scope">
                <el-button type="warning" circle @click="handleEdit(scope.row)"> <i class="el-icon-edit"></i></el-button>
                <el-popconfirm
                    class="ml-10 popconfirm-bg"
                    title="Delete this record?"
                    confirm-button-text="Confirm"
                    cancel-button-text="Cancel"
                    icon="el-icon-info"
                    icon-color="red"
                    @confirm="handleDelete(scope.row.id)"
                >
                  <el-button type="danger" circle slot="reference"> <i class="el-icon-delete"></i></el-button>
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
    </el-col>

    <!-------------------------------------------------------------------->
    <!-- dialog -->
    <!-------------------------------------------------------------------->
    <el-dialog title="Data Definition"
               :visible.sync="dialogFormVisible"
               width="50%"
               @close="closeDialog">

      <el-form :model="form"
               :rules="rules"
               ref="dataForm"
               label-width="100px">
        <el-form-item label="名稱" prop="name">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="設定值" prop="value">
          <el-input v-model="form.value" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="設定值(英)" prop="valueEn" v-if="form.type == 'feature_type'">
          <el-input v-model="form.valueEn" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="設定值(日)" prop="valueJp" v-if="form.type == 'feature_type'">
          <el-input v-model="form.valueJp" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="設定值(韓)" prop="valueKr" v-if="form.type == 'feature_type'">
          <el-input v-model="form.valueKr" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="類型" prop="type">
          <el-select prop="form.type" placeholder="選類型" v-model="form.type">
            <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="備註" prop="notes">
          <el-input v-model="form.notes" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="saveData('dataForm')">Confirm</el-button>
      </div>
    </el-dialog>

  </el-row>

</template>

<script>
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";

export default {
  name: "DicMaintain",
  components: {
    Breadcrumb
  },
  data() {
    let checkName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Fields should not be empty'))
      } else {
        callback()
      }
    }
    return {
      groupByTableData:[],
      tableData: [],
      options: [
        {value: 'menu_icon', label: '選單 Icon'},
        {value: 'subsidy', label: '交通費'},
        {value: 'unit_price', label: '價格'},
        {value: 'feature_type', label: '攝影師特色類型'},
        {value: 'general', label: '通用字典'},
        // {value: 'pre_check', label: '出勤前檢查工作'},
        // {value: 'quotation_notes', label: '報價注意事項'},
        // {value: 'customer_type', label: '客戶身份別'},
        // {value: 'visit_period', label: '客戶拜訪週期'},
        // {value: 'sales_manager_task', label: '業務主管工作'},
        // {value: 'painting_type', label: '彩繪效果'},
        // {value: 'item_type', label: 'Item Category'}
        // {value: 'item_view', label: '用品不分區'},
        // {value: 'product_cat', label: '商品系列'}
      ],
      queryField: '',
      keyword: '',
      pageNum: 1,
      pageSize: 20,
      total: 0,
      dialogFormVisible: false,
      formLabelWidth: '',
      form: {
        name: '',
        value: '',
        valueEn: '',
        valueJp: '',
        valueKr: '',
        type: '',
        notes:''
      },
      rules: {
        name: [{validator: checkName, trigger: 'change'}],
        value: [{validator: checkName, trigger: 'change'}],
        valueEn: [{validator: checkName, trigger: 'change'}],
        valueJp: [{validator: checkName, trigger: 'change'}],
        valueKr: [{validator: checkName, trigger: 'change'}],
        type: [{validator: checkName, trigger: 'change'}],
      }
    }
  },
  methods: {
    searchTerm(term){
      this.queryField = term
      this.loadData()
    },
    search() {
      this.loadData()
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.loadData()
    },
    clearQuery() {
      this.queryField = ''
      this.keyword = ''
      this.loadData()
    },

    /** data crud **/
    loadData() {
      let {pageNum, pageSize, queryField, keyword} = this

      this.request.get(`/dic/page?pageNum=${pageNum}&pageSize=${pageSize}&queryField=${queryField}&keyword=${keyword}`).then(res => {
        if (res.code === '200') {
          this.tableData = res.data.records
          this.total = res.data.total
          this.loadGroupbyData()
        } else {
          this.showResult("error", "Get Data Failed")
        }
      })
    },
    saveData(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {

          this.request.post('/dic', this.form).then(res => {
            if (res.code === '200') {
              this.loadData()
              this.showResult("success", "Data Update Successfully")
              this.dialogFormVisible = false
            } else {
              this.showResult("error", "Data Update Failed")
            }
          })

        }
      })
    },
    handleAdd() {
      this.dialogFormVisible = true
      this.form = {}
    },
    handleEdit(rowData) {
      this.dialogFormVisible = true
      this.form = rowData
    },
    handleDelete(id) {
      this.request.delete("/dic/" + id).then(res => {
        if (res.code === '200') {
          this.loadData();
          this.showResult("success", "Data Delete Successfully")
        } else {
          this.showResult("error", "Data Delete Failed")
        }
      })
    },

    closeDialog() {
      this.loadData()
      this.$refs['dataForm'].resetFields();
    },

    addChildren(pid) {
      this.form = {}
      this.form.parentId = pid
      this.dialogFormVisible = true
    },

    loadGroupbyData() {
      this.request.get("/dic/groupby").then(res => {
        if (res.code === '200') {
          this.groupByTableData = res.data
        }
      })
    }

  },
  filters: {

    transformType(value) {
      let label = ''
      switch (value) {
        case 'menu_icon':
          label = "選單 Icon"
          break;
        case 'subsidy':
          label = "交通費"
          break;
        case 'unit_price':
          label = "價格"
          break;
        case 'feature_type':
          label = "攝影師特色類型"
          break;
        default:
          label = "通用字典"
      }
      return label
    }
  },
  mounted() {
    this.loadData()
    //this.loadGroupbyData()
    console.log(this.$route)
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

.mydic >>> .el-main {
  padding: 20px 0;

}


</style>
