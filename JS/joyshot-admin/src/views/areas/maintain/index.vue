<template>

  <el-row :gutter="20" class="top-block">
    <Breadcrumb :route="this.$route"></Breadcrumb>

    <!-------------------------------------------------------------------->
    <!-- action -->
    <!-------------------------------------------------------------------->
    <el-col :xs="24" :sm="24" :lg="16">
      <el-input v-model="keyword" style="width: 200px" placeholder="輸入區域名稱查詢" class="ml-20"
                suffix-icon="el-icon-search"></el-input>
      <el-button type="primary" @click.prevent="search" class="ml-10">查詢</el-button>
      <el-button type="normal" @click.prevent="clearQuery" class="ml-10">清除條件</el-button>
    </el-col>

    <el-col :xs="24" :sm="24" :lg="8" style="text-align: right">
      <el-button type="primary" @click.prevent="handleAdd" class="mr-20">新增 <i class="el-icon-circle-plus-outline"></i>
      </el-button>
    </el-col>


    <!-------------------------------------------------------------------->
    <!-- table -->
    <!-------------------------------------------------------------------->
    <el-col :xs="24" :sm="24" :lg="24">
      <el-main>
        <el-table :data="tableData"
                  row-key="id"
                  empty-text="無資料"
                  :tree-props="{children: 'children', hasChildren: 'hasChildren'}">


          <el-table-column prop="name" label="區域名稱" width="200">
              <template slot-scope="scope">
                <img v-if="scope.row.imageUuid" :src="showImage(scope.row.imageUuid)" class="display-avatar">
                {{scope.row.name}}
              </template>
            </el-table-column>
          <el-table-column prop="minHour" label="最低拍攝時數">
          </el-table-column>

          <el-table-column label="操作" width="400">
            <template slot-scope="scope">
              <!--                <el-button type="info" @click="handleMenu(scope.row.id)">設定功能選單 <i class="el-icon-menu"></i></el-button>-->
              <el-button type="warning" circle @click="handleEdit(scope.row)"> <i class="el-icon-edit"></i></el-button>
              <el-popconfirm
                  class="ml-10 popconfirm-bg"
                  title="確定刪除此筆資料嗎?"
                  confirm-button-text="確定"
                  cancel-button-text="取消刪除"
                  icon="el-icon-info"
                  icon-color="red"
                  @confirm="handleDelete(scope.row.id)"
              >
                <el-button type="danger" circle slot="reference"> <i class="el-icon-delete"></i></el-button>
              </el-popconfirm>
              <el-button class="ml-10" type="default" @click="addChildren(scope.row.id)">新增子區 <i
                  class="el-icon-circle-plus-outline"></i></el-button>
            </template>
          </el-table-column>
        </el-table>
        <!--          <div style="border-radius:8px; margin-top:10px;padding:20px 10px; text-align: center; background-color: white" >-->
        <!--            <el-pagination-->
        <!--                background-->
        <!--                layout="prev, pager, next"-->
        <!--                :current-page="pageNum"-->
        <!--                :page-size="pageSize"-->
        <!--                :total="total"-->
        <!--                @current-change="handleCurrentChange">-->
        <!--            </el-pagination>-->
        <!--          </div>-->
      </el-main>
    </el-col>


    <!-------------------------------------------------------------------->
    <!-- dialog -->
    <!-------------------------------------------------------------------->
    <el-dialog title="區域資訊"
               :visible.sync="dialogFormVisible"
               width="50%"
               @close="closeAreaDialog">
      <el-form :model="form"
               :rules="rules"
               ref="dataForm"
               label-width="100px">
        <div class="image_upload">
          <el-upload
            drag
            :multiple="false"
            class="avatar-uploader"
            action="/api/file/upload/area_feature_image"
            :show-file-list="false"
            :on-success="uploadImageSuccess"
            :before-upload="beforeUpload">
          <img v-if="form.imageUuid" :src="showImage(form.imageUuid)" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          <div slot="tip" class="el-upload__tip">{{ $t('profile.form.file_limit') }}</div>
        </el-upload>
        </div>


        <el-form-item label="區域名稱" prop="name">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="區域名稱(英)" prop="nameEn">
          <el-input v-model="form.nameEn" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="區域名稱(日)" prop="nameJp">
          <el-input v-model="form.nameJp" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="區域名稱(韓)" prop="nameKr">
          <el-input v-model="form.nameKr" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="最低拍攝時數" prop="minHour">
          <el-input type="number" v-model.number="form.minHour" autocomplete="off"></el-input>
        </el-form-item>

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
  name: "AreaMaintain",
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
      tableData: [],
      keyword: '',
      dialogFormVisible: false,
      formLabelWidth: '',
      form: {
        name: '',
        nameEn: '',
        nameJp: '',
        nameKr: '',
        minHour: '',
        imageUuid:''
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
    uploadImageSuccess(res) {
      if (res.error) {
        this.showResult('error', this.$t('action.upload_error', {'err': res.error}))
      } else {
        this.form.imageUuid = res.uuid
      }
    },
    beforeUpload(file) {
      const isJPG = (file.type === 'image/jpeg' || file.type === 'image/png');
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('限上傳 jpg、png 格式');
      }
      if (!isLt2M) {
        this.$message.error('圖片大小超過 2M');
      }
      return isJPG && isLt2M;
    },

    search() {
      this.loadData()
    },
    clearQuery() {
      this.keyword = ''
      this.loadData()
    },


    /** data crud **/
    async loadData() {
      let data = {
        keyword: this.keyword
      }
      let result = await this.$store.dispatch('area/getAllAreasNoPage', data);
      this.tableData = result.data
    },
    async saveData(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          try {
            await this.$store.dispatch('area/saveArea', this.form)
            this.showResult('success', '資料更新成功.')

            await this.loadData()
            this.dialogFormVisible = false

          } catch (e) {
            this.showResult('error', '資料更新失敗')
          }
        }
      })
    },
    handleAdd() {
      this.dialogFormVisible = true
    },
    handleEdit(rowData) {
      this.dialogFormVisible = true
      this.form = rowData
    },
    async handleDelete(id) {
      try {
        await this.$store.dispatch('area/deleteArea', id)
        this.showResult('success', '資料刪除成功.')

        await this.loadData()
        this.dialogFormVisible = false

      } catch (e) {
        this.showResult('error', '資料刪除失敗.')
      }
    },

    closeAreaDialog() {
      this.loadData()
      this.$refs['dataForm'].resetFields()
    },
    addChildren(pid) {
      this.form = {}
      this.form.parentId = pid
      this.dialogFormVisible = true
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
.image_upload{
  text-align: center;
  margin-bottom: 20px;
  width: 200px;
}
.display-avatar{
  width: 60px;
  border-radius: 999px;
  margin-right: 8px;
}

</style>
