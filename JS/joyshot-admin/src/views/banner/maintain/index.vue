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
      <el-main>
          <el-table :data="tableData" empty-text="No data" stripe header-row-class-name="headerStyle">


            <el-table-column label="圖片" >

              <template slot-scope="scope">
                <img v-lazy="showImage(scope.row.imageUuid)" class="ig-image" />
              </template>
            </el-table-column>
            <el-table-column prop="language" label="語系">
            </el-table-column>
            <el-table-column prop="imageUsage" label="類型" >
            </el-table-column>
            <el-table-column prop="notes" label="備註">
            </el-table-column>

            <el-table-column :label="$t('action.name')" width="160">
              <template slot-scope="scope">
                <el-button type="primary" @click="handleEdit(scope.row)"><i class="el-icon-edit"></i></el-button>
              </template>
            </el-table-column>

            <el-table-column label="是否上架">
                <template slot-scope="scope">
                  <el-switch
                    @change="changeLiveStatus(scope.row)"
                    v-model="scope.row.activeOn"
                    active-color="#13ce66"
                    inactive-color="#DCDFE6">
                  </el-switch>
                </template>
              </el-table-column>
          </el-table>




        </el-main>
    </el-col>


    <!-------------------------------------------------------------------->
    <!-- dialog -->
    <!-------------------------------------------------------------------->
    <el-dialog title="Banner圖片設定"
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
            <el-form-item label="照片">
              <UploadWidget :uuid="form.imageUuid" usage="banner_desktop" @uploadSuccess="uploadSuccess" />
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
import UploadWidget from '@/components/upload/'

export default {
  name: "InstagramMaintain",
  components: {
    Breadcrumb,UploadWidget
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

      form:{
        language:'',
        // imageUsage:'',
        // notes:'',
        imageUuid: ''
      },
      rules: {
        imageUuid: [{validator: checkName, trigger: 'change'}],
      }

    }
  },
  methods: {

    changeLiveStatus(row){
      if (row.active === 'Y') {
        row.active = 'N'
      } else {
        row.active = 'Y'
      }

      this.request.post('/banner/live', row).then(res => {
          if (res.code === '200') {
            this.showResult('success', this.$t('action.save_success'))
            this.loadData()
          } else {
            this.showResult('error', this.$t('action.save_error',{ err:res.message}))
          }
      })
    },
    uploadSuccess(file){
      this.form.imageUuid = file.uuid
    },
    reset_form(){
      this.form.id = null
      this.form.language = 'tw'
      this.form.imageUuid = null;
    },

    loadData() {

      this.request.get('/banner').then(res => {
          if (res.code === '200') {
            this.tableData = res.data
          } else {
            this.showResult('error', this.$t('action.get_error', {err: 'error'}))
          }
        })
    },

    //處理增刪修
    saveData(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          this.request.post("/banner", this.form).then(res => {
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

.ig-image {
  width: 350px;
  height: 200px;
  object-fit: contain;
}
</style>
