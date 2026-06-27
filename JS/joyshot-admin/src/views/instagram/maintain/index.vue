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
            
            <el-table-column label="貼文圖片" width="220">

              <template slot-scope="scope">
                <img v-lazy="showImage(scope.row.igImageUuid)" class="ig-image" />
              </template>
            </el-table-column>
            <el-table-column prop="title" label="貼文標題" >
            </el-table-column>
            <el-table-column prop="igUrl" label="貼文網址">
            </el-table-column>
           
            <el-table-column :label="$t('action.name')" width="160">
              <template slot-scope="scope">
                <el-popconfirm
                    class="ml-10 popconfirm-bg"
                    :title="$t('message.delete_confirm')"
                    :confirm-button-text="$t('buttons.confirm')"
                    :cancel-button-text="$t('buttons.cancel')"
                    icon="el-icon-info"
                    icon-color="red"
                    @confirm="handleDelete(scope.row.id)"
                >
                  <el-button type="danger" circle slot="reference"><i class="el-icon-delete"></i></el-button>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>

          
          

        </el-main>
    </el-col>
    

    <!-------------------------------------------------------------------->
    <!-- dialog -->
    <!-------------------------------------------------------------------->
    <el-dialog title="Instagram資訊"
               :visible.sync="dialogFormVisible"
               :width="dw"
               @close="closeDialog">
      <el-form :model="form" label-position="top" :rules="rules" ref="dataForm" label-width="80px">
        
        <el-row>
          <el-col :xs="24" :sm="24" :md="24">
            <el-form-item label="貼文標題" prop="title">
              <el-input v-model="form.title" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :xs="24" :sm="24" :md="24">
            <el-form-item label="貼文照片">
              <UploadWidget :uuid="form.igImageUuid" usage="instagram" @uploadSuccess="uploadSuccess" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row>
          <el-col :xs="24" :sm="24" :md="24">
            <el-form-item label="貼文網址" prop="igUrl">
              <el-input v-model="form.igUrl" autocomplete="off"></el-input>
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
        title:'',
        igUrl:'',
        igImageUuid: ''
      },
      rules: {
        title: [{validator: checkName, trigger: 'change'}],
        igUrl: [{validator: checkName, trigger: 'change'}],
        igImageUuid: [{validator: checkName, trigger: 'change'}],
      }

    }
  },
  methods: {
    uploadSuccess(file){
      this.form.igImageUuid = file.uuid
    },
    reset_form(){
      this.form.id = null
      this.form.title = null;
      this.form.igUrl = null;
      this.form.igImageUuid = null;
    },
    handleAdd() {
      this.reset_form();
      this.dialogFormVisible = true
    },
    loadData() {
      
      this.request.get('/instagram').then(res => {
          if (res.code === '200') {
            this.tableData = res.data
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
          this.request.post("/instagram", this.form).then(res => {
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
      this.request.delete("/instagram/" + id).then(res => {
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

.ig-image {
  width: 150px;
  height: 150px;
  object-fit: cover;
}
</style>
