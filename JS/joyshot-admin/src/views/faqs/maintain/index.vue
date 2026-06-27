<template>
  <el-row :gutter="20" class="top-block">
    <Breadcrumb :route="this.$route"></Breadcrumb>

    <!-------------------------------------------------------------------->
    <!-- action -->
    <!-------------------------------------------------------------------->

    <el-col :xs="24" :sm="24" :lg="24" style="text-align: right">
      <el-button type="primary" @click.prevent="handleAdd" class="mr-20">{{$t('buttons.new')}} <i class="el-icon-circle-plus-outline"></i>
      </el-button>
    </el-col>

    <!-------------------------------------------------------------------->
    <!-- table -->
    <!-------------------------------------------------------------------->

    <el-col :xs="24" :sm="24" :lg="24">
      <el-main>
          <el-table :data="tableData" empty-text="No data" stripe header-row-class-name="headerStyle">

            <el-table-column prop="language" label="語系">
            </el-table-column>
            <el-table-column prop="question" label="問題">
            </el-table-column>
            <el-table-column label="回覆">
              <template slot-scope="scope">
                <div v-html="fmtNotes(scope.row.answer)"></div>
              </template>
            </el-table-column>

            <el-table-column :label="$t('action.name')" width="400">
              <template slot-scope="scope">
                <el-button type="warning" @click="handleEdit(scope.row)">{{$t('buttons.edit')}} <i class="el-icon-edit"></i></el-button>
                <el-popconfirm
                    class="ml-10 popconfirm-bg"
                    :title="$t('message.delete_confirm')"
                    :confirm-button-text="$t('buttons.confirm')"
                    :cancel-button-text="$t('buttons.cancel')"
                    icon="el-icon-info"
                    icon-color="red"
                    @confirm="handleDelete(scope.row.id)"
                >
                  <el-button type="danger" slot="reference">{{$t('buttons.delete')}} <i class="el-icon-delete"></i></el-button>
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
    <el-dialog title="常見問題資訊"
               :visible.sync="dialogFormVisible"
               :width="dw"
               @close="closeDialog">
      <el-form :model="form" label-position="top" :rules="rules" ref="dataForm" label-width="80px">

        <el-row>
          <el-col>
            <el-form-item label="語系">
              <el-radio v-model="form.language" label="tw">tw</el-radio>
              <el-radio v-model="form.language" label="en">en</el-radio>
              <el-radio v-model="form.language" label="jp">jp</el-radio>
              <el-radio v-model="form.language" label="kr">kr</el-radio>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :xs="24" :sm="24" :md="24">
            <el-form-item label="問題" prop="question">
              <el-input v-model="form.question" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :xs="24" :sm="24" :md="24">
            <el-form-item label="回覆" prop="answer">
              <el-input type="textarea" v-model="form.answer" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('buttons.cancel')}}</el-button>
        <el-button type="primary" @click="saveData('dataForm')">{{ $t('buttons.confirm')}}</el-button>
      </div>
    </el-dialog>

  </el-row>


</template>

<script>
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";

export default {
  name: "FaqsMaintain",
  components: {
    Breadcrumb
  },
  data() {
    let checkName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error( this.$t('message.required_field') ))
      } else {
        callback()
      }
    }

    return {
      dw: '50%',
      dialogFormVisible: false,

      tableData: [],
      pageNum: 1,
      pageSize: 20,
      total: 0,

      form:{
        language:'tw',
        question:'',
        answer: ''
      },
      rules: {
        question: [{validator: checkName, trigger: 'change'}],
        answer: [{validator: checkName, trigger: 'change'}]
      }

    }
  },
  methods: {
    reset_form(){
      this.form.id = null
      this.form.language = 'tw'
      this.form.question = '';
      this.form.answer = '';
    },
    handleAdd() {
      this.reset_form();
      this.dialogFormVisible = true
    },
    loadData() {

      let query = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }

      this.request.get('/faq', { params: query }).then(res => {
          if (res.code === '200') {
            this.tableData = res.data.records
            this.total = res.data.total
          } else {
            this.showResult('error', this.$t('action.get_error', {err: 'error'}))
          }
        })
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.loadData()
    },

    //處理增刪修
    saveData(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          this.request.post("/faq", this.form).then(res => {
            if (res.code === '200') {
              this.dialogFormVisible = false
              this.loadData()
              this.showResult('success', this.$t('action.save_success'))
            } else {
              this.showResult('error', this.$t('action.save_error', {err: res.message}))
            }
          })
        }
      })
    },

    handleDelete(id) {
      this.request.delete("/faq/" + id).then(res => {
          if (res.code === '200') {
            this.showResult('success', this.$t('action.delete_success'))
            this.loadData()
          } else {
            this.showResult('success', this.$t('action.delete_error',{ err:res.message}))
          }
      })
    },
    handleEdit(rowData) {
      // this.reset_form();
      this.dialogFormVisible = true
      this.form = rowData
    },
    closeDialog() {
      console.log('closeDialog')
      this.loadData()
    }
  },
  mounted() {
    this.loadData()
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
  object-fit: cover;
}

.display-avatar {
  width: 100px;
  height: 100px;
  object-fit: cover;
/*  border-radius: 999px;*/
}


/deep/ .el-upload-dragger {
  width: 180px !important;
}

/deep/ .el-form--label-top .el-form-item__label {
  padding: 0;
}

</style>
