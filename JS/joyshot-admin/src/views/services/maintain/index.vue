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

            <el-table-column width="150">
              <template slot-scope="scope">
                <img v-if="scope.row.fileUuid" :src="showImage(scope.row.fileUuid)" class="display-avatar">
              </template>
            </el-table-column>
            <el-table-column width="150">
              <template slot-scope="scope">
                <img v-if="scope.row.iconFileUuid" :src="showImage(scope.row.iconFileUuid)" class="display-icon">
              </template>
            </el-table-column>

            <el-table-column prop="name" :label="$t('page.service_category_maintain.form.name')">
            </el-table-column>

            <el-table-column prop="price" :label="$t('page.service_category_maintain.form.price')">
               <template slot-scope="scope">
                <span>${{scope.row.price}}</span>
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
    <el-dialog :title="$t('page.service_category_maintain.form.title')"
               :visible.sync="dialogFormVisible"
               :width="dw"
               @close="closeDialog">
      <el-form :model="form" label-position="top" :rules="rules" ref="dataForm" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="服務代表圖" style="margin-bottom:0px"></el-form-item>

            <UploadWidget :uuid="form.fileUuid" usage="service_cat" @uploadSuccess="imageUploadSuccess" />

            <!-- <el-upload
                drag
                :multiple="false"
                class="avatar-uploader"
                action="/api/file/upload/service_cat"
                :show-file-list="false"
                :on-success="imageUploadSuccess"
                :before-upload="isImageValid">
              <img v-if="form.fileUuid" :src="showImage(form.fileUuid)" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              <div slot="tip" class="el-upload__tip">照片圖</div>
              <div slot="tip" class="el-upload__tip">{{ $t('profile.form.file_limit') }}</div>
            </el-upload> -->
          </el-col>

          <el-col :span="12">

            <el-form-item label="Icon圖" style="margin-bottom:0px"></el-form-item>
            <UploadWidget :uuid="form.iconFileUuid" usage="service_cat" @uploadSuccess="iconUploadSuccess" avatar="icon" />

           <!--  <el-upload
                drag
                :multiple="false"
                class="avatar-uploader"
                action="/api/file/upload/service_cat"
                :show-file-list="false"
                :on-success="iconUploadSuccess"
                :before-upload="isImageValid">
              <img v-if="form.iconFileUuid" :src="showImage(form.iconFileUuid)" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              <div slot="tip" class="el-upload__tip">Icon圖</div>
              <div slot="tip" class="el-upload__tip">{{ $t('profile.form.file_limit') }}</div>
            </el-upload> -->
          </el-col>
        </el-row>
        <el-row>
          <el-col :xs="24" :sm="24" :md="10" class="mr-10">
            <el-form-item :label="$t('page.service_category_maintain.form.name')" prop="name">
              <el-input v-model="form.name" autocomplete="off" @focusout="checkExist"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="10">
            <el-form-item :label="$t('page.service_category_maintain.form.price')" prop="price">
              <el-input type="number" v-model.number="form.price" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :xs="24" :sm="24" :md="10" class="mr-10">
            <el-form-item label="服務名稱(英)" prop="nameEn">
              <el-input v-model="form.nameEn" autocomplete="off" @focusout="checkExist"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :xs="24" :sm="24" :md="10" class="mr-10">
            <el-form-item label="服務名稱(日)" prop="nameJp">
              <el-input v-model="form.nameJp" autocomplete="off" @focusout="checkExist"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :xs="24" :sm="24" :md="10" class="mr-10">
            <el-form-item label="服務名稱(韓)" prop="nameKr">
              <el-input v-model="form.nameKr" autocomplete="off" @focusout="checkExist"></el-input>
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
  name: "ServiceCatMaintain",
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
      pageNum: 1,
      pageSize: 20,
      total: 0,

      form:{
        name:'',
        nameEn: '',
        nameJp: '',
        nameKr: '',
        fileUuid: '',
        iconFileUuid: '',
        price:0
      },
      rules: {
        name: [{validator: checkName, trigger: 'change'}],
        nameEn: [{validator: checkName, trigger: 'change'}],
        nameJp: [{validator: checkName, trigger: 'change'}],
        nameKr: [{validator: checkName, trigger: 'change'}],
      }

    }
  },
  methods: {
    reset_form(){
      this.form.name = ''
      this.form.nameEn = ''
      this.form.nameJp = ''
      this.form.nameKr = ''
      this.form.fileUuid = ''
      this.form.iconFileUuid = ''
      this.form.price = 0
      this.form.id = ''
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

      this.request.get('/service-cat', { params: query }).then(res => {
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
          this.request.post("/service-cat", this.form).then(res => {
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
      this.request.delete("/service-cat/" + id).then(res => {
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
    },
    checkExist() {

    },
    setDialogWidth() {
      let windowSize = document.body.clientWidth;
      const defaultWidth = 300; // 預設寬度
      if (windowSize < defaultWidth) {
        this.dw = "90%";
      } else {
        this.dw = "40%";
      }
    },

    imageUploadSuccess(res) {
      if (res.error) {
        this.showResult('error', this.$t('action.upload_error', {'err': res.error}))
      } else {
        this.form.fileUuid = res.uuid
      }
    },
    iconUploadSuccess(res) {
      if (res.error) {
        this.showResult('error', this.$t('action.upload_error', {'err': res.error}))
      } else {
        this.form.iconFileUuid = res.uuid
      }
    }


  },
  mounted() {
    this.setDialogWidth()
    this.loadData()
    // this.$bus.$on('switchLang', (results)=>{
    //   this.loadData()
    // })
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
.display-icon {
  width: 50px;
  height: 50px;
  object-fit: cover;
}



/deep/ .el-upload-dragger {
  width: 180px !important;
}

/deep/ .el-form--label-top .el-form-item__label {
  padding: 0;
}

</style>
