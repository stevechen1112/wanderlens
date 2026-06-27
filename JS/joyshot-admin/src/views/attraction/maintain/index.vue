<template>
  <el-main>
    <el-row :gutter="20" class="top-block">
      <Breadcrumb :route="this.$route"></Breadcrumb>
    </el-row>

      <!-------------------------------------------------------------------->
      <!-- action -->
      <!-------------------------------------------------------------------->

    <el-row>
      <el-col :xs="24" :sm="24" :lg="24" style="text-align: right">
        <el-button type="primary" @click.prevent="handleAdd" class="mr-20">{{$t('buttons.new')}} <i class="el-icon-circle-plus-outline"></i>
        </el-button>
      </el-col>
    </el-row>

      <!-------------------------------------------------------------------->
      <!-- table -->
      <!-------------------------------------------------------------------->

    <el-row >


        <el-col :xs="24" :sm="24" :lg="4">
          <el-main>
            <el-table :data="groupByTableData"
                      default-expand-all
                      row-key="id"
                      empty-text="No Data"
                      stripe header-row-class-name="headerStyle">
              <el-table-column label="Type">
                <template slot-scope="scope">
                  <el-button type="text" @click.prevent="searchTerm(scope.row.id)"> {{scope.row.col}} ({{scope.row.count}})</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-main>
        </el-col>

        <el-col :xs="24" :sm="24" :lg="20">
          <el-main>
            <el-table :data="tableData" empty-text="No data" stripe header-row-class-name="headerStyle">

              <el-table-column prop="language" label="語系">
              </el-table-column>
              <el-table-column label="景點照片" width="220">
                <template slot-scope="scope">
                  <img v-lazy="showImage(scope.row.imageUuid)" class="ig-image" />
                </template>
              </el-table-column>
              <el-table-column prop="cityName" label="景點縣市" >
              </el-table-column>
              <el-table-column prop="name" label="景點名稱" >
              </el-table-column>
              <el-table-column prop="postUrl" label="景點介紹文章網址">
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

            <AppPagination :pageNum="pageNum" :pageSize="pageSize" :total="total" @pageChange="pageChange" />
          </el-main>
        </el-col>

    </el-row>

    <!-------------------------------------------------------------------->
    <!-- dialog -->
    <!-------------------------------------------------------------------->
    <el-dialog title="景點文章資訊"
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
            <el-form-item label="景點照片">
              <UploadWidget :uuid="form.imageUuid" usage="attraction" @uploadSuccess="uploadSuccess" />
            </el-form-item>
          </el-col>
        </el-row>


        <el-row>
          <el-col :xs="24" :sm="24" :md="12">
            <el-form-item label="景點縣市">
              <el-select v-model="form.area" placeholder="選擇縣市">
                <el-option v-for="area in areaList"
                           :key="area.id"
                           :label="area.name"
                           :value="area.id"></el-option>
                </el-select>
              </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12">
            <el-form-item label="景點名稱">
              <el-input v-model="form.name" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>


        <el-row>
          <el-col :xs="24" :sm="24" :md="24">
            <el-form-item label="文章網址">
              <el-input v-model="form.postUrl" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('buttons.cancel')}}</el-button>
        <el-button type="primary" @click="saveData('dataForm')">{{ $t('buttons.confirm')}}</el-button>
      </div>
    </el-dialog>

  </el-main>
</template>

<script>
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import UploadWidget from '@/components/upload/'
import AppPagination from '@/components/pagination/AppPagination'

export default {
  name: "AttractionMaintain",
  components: {
    Breadcrumb,UploadWidget,AppPagination
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
      areaList:[],
      groupByTableData:[],
      tableData:[],
      pageSize:20,
      pageNum: 1,
      total:0,
      areaId:0,

      form:{
        language:'',
        area:'',
        name:'',
        imageUuid: '',
        postUrl:''
      },
      rules: {
        area: [{validator: checkName, trigger: 'change'}],
        name: [{validator: checkName, trigger: 'change'}],
        imageUuid: [{validator: checkName, trigger: 'change'}],
        postUrl: [{validator: checkName, trigger: 'change'}]
      }

    }
  },
  methods: {
    uploadSuccess(file){
      this.form.imageUuid = file.uuid
    },
    reset_form(){
      this.form.language = 'tw'
      this.form.area = null
      this.form.name = null;
      this.form.imageUuid = null;
      this.form.postUrl = null;
    },
    handleAdd() {
      this.reset_form();
      this.dialogFormVisible = true
    },
    loadData() {
      this.loadGroupbyData()

      let query = {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          areaId: this.areaId
      }
      this.request.get('/attraction',{params:query}).then(res => {
          if (res.code === '200') {
            this.tableData = res.data.records
            this.form.total = res.data.total
          } else {
            this.showResult('error', this.$t('action.get_error', {err: 'error'}))
          }
        })
    },
    pageChange(val) {
      this.pageNum = val
      this.loadData()
    },


    //處理增刪修
    saveData(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          this.request.post("/attraction", this.form).then(res => {
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
      this.request.delete("/attraction/" + id).then(res => {
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
    },
    loadCity(){
      this.request.get("/area/area1").then(res => {
          if (res.code === '200') {
            this.areaList = res.data
          } else {
            this.showResult('success', this.$t('action.get_error',{ err:res.message}))
          }
      })
    },
    loadGroupbyData() {
      this.request.get("/attraction/groupby").then(res => {
        if (res.code === '200') {
          this.groupByTableData = res.data
        }
      })
    },
    searchTerm(areaId){
      this.areaId = areaId
      this.loadData()
    }
  },
  mounted() {
    this.loadCity()
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
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 999px;
}
</style>
