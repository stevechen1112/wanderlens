<template>
  <el-row :gutter="20" class="top-block">
    <Breadcrumb :route="this.$route"></Breadcrumb>

    <!-------------------------------------------------------------------->
    <!-- action -->
    <!-------------------------------------------------------------------->
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

    <!-------------------------------------------------------------------->
    <!-- table -->
    <!-------------------------------------------------------------------->
    <el-col :xs="24" :sm="24" :lg="24">
      <!-- <el-col :xs="24" :sm="24" :lg="6">
        <el-main>
          <el-table :data="groupByTableData"
                    default-expand-all
                    row-key="id"
                    :empty-text="$t('message.no_data')"
                    stripe header-row-class-name="headerStyle">
            <el-table-column :label="$t('page.user_maintain.column.area')">
              <template slot-scope="scope">
                <el-button type="text" @click.prevent="searchTerm(scope.row.col)"> {{scope.row.col}} ({{scope.row.count}})</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-main>
      </el-col> -->

      <el-col :xs="24" :sm="24" :lg="24">
        <el-main>
          <el-table :data="tableData" empty-text="No data" stripe header-row-class-name="headerStyle">
            <el-table-column prop="username" :label="$t('page.user_maintain.form.username')" width="200">
              <template slot-scope="scope">
                <img v-if="scope.row.avatar" :src="showImage(scope.row.avatar)" class="display-avatar">
                {{scope.row.username}}
              </template>
            </el-table-column>
            <el-table-column prop="empno" :label="$t('page.user_maintain.form.account')" width="140">
            </el-table-column>
            <el-table-column prop="role.name" :label="$t('page.user_maintain.form.role')">
            </el-table-column>

            <el-table-column :label="$t('action.name')" width="400">
              <template slot-scope="scope">
                <el-button v-if="scope.row.role.name !== 'photographer'" type="warning" @click="handleEdit(scope.row)">{{$t('buttons.edit')}} <i class="el-icon-edit"></i></el-button>
                <el-popconfirm
                    class="ml-10 popconfirm-bg"
                    :title="$t('message.delete_confirm')"
                    :confirm-button-text="$t('buttons.confirm')"
                    :cancel-button-text="$t('buttons.cancel')"
                    icon="el-icon-info"
                    icon-color="red"
                    @confirm="handleDelete(scope.row.id)"
                >
                  <el-button v-if="scope.row.role.name !== 'photographer'" type="danger" slot="reference">{{$t('buttons.delete')}} <i class="el-icon-delete"></i></el-button>
                </el-popconfirm>

              </template>
            </el-table-column>
          </el-table>

          <AppPagination :pageNum="pageNum" :pageSize="pageSize" :total="total" @pageChange="pageChange" />


        </el-main>
      </el-col>
    </el-col>

    <!-------------------------------------------------------------------->
    <!-- dialog -->
    <!-------------------------------------------------------------------->
    <el-dialog :title="$t('page.user_maintain.form.title')"
               :visible.sync="dialogFormVisible"
               :width="dw"
               @close="closeDialog">
      <el-form :model="form" label-position="top" :rules="rules" ref="userForm" label-width="80px">
        <el-row>
          <el-col :span="24">
            <UploadWidget :uuid="form.avatar" usage="user_profile" @uploadSuccess="uploadSuccess" />
          </el-col>
        </el-row>
        <el-row>
          <el-col :xs="24" :sm="24" :md="8" class="pr-10">
            <el-form-item :label="$t('page.user_maintain.form.account')" prop="empno">
              <el-input v-model="form.empno" autocomplete="off" @blur="checkExist" :disabled="!canEdit"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="8" class="pr-10">
            <el-form-item :label="$t('page.user_maintain.form.username')" prop="username" :label-width="formLabelWidth">
              <el-input v-model="form.username" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="8" v-show="showPasswordField">
            <el-form-item :label="$t('page.user_maintain.form.password')" prop="password" :label-width="formLabelWidth">
              <el-input type="password" v-model="form.password" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>

        </el-row>

        <el-row>
          <el-col :xs="24" :sm="24" :md="8" class="pr-10">
            <el-form-item :label="$t('page.user_maintain.form.role')" :label-width="formLabelWidth">
              <el-select v-model="form.roleId" :placeholder="$t('page.user_maintain.form.select_role')">
                <el-option v-for="role in roles"
                           :key="role.id"
                           :label="role.name"
                           :value="role.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="8">
            <el-form-item :label="$t('page.user_maintain.form.area')" :label-width="formLabelWidth">
              <el-select v-model="form.area" :placeholder="$t('page.user_maintain.form.select_area')">
                <el-option label="TW" value="TW"></el-option>
                <!-- <el-option label="中區" value="中區"></el-option>
                <el-option label="南區" value="南區"></el-option> -->
              </el-select>
            </el-form-item>
          </el-col>
          <!-- <el-col :xs="24" :sm="24" :md="8">
            <el-form-item label="Can Remove Customer">
              <el-select v-model="form.deletePermission"  placeholder="select" >

                <el-option v-for="(p,idx) in permissionList"
                           :key="idx"
                           :label="p.label"
                           :value="p.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col> -->

        </el-row>


      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('buttons.cancel')}}</el-button>
        <el-button type="primary" @click="saveData('userForm')">{{ $t('buttons.confirm')}}</el-button>
      </div>
    </el-dialog>
  </el-row>


</template>

<script>
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import UploadWidget from '@/components/upload/'
import AppPagination from '@/components/pagination/AppPagination'

export default {
  name: "UserMaintain",
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
      tableData: [],
      options: [
        {value: 'username', label: this.$t('page.user_maintain.filter.by_name') },
        {value: 'area', label: this.$t('page.user_maintain.filter.by_area')}
        ],
      permissionList: [{
        value: 0,
        label: 'No'
      }, {
        value: 1,
        label: 'Yes'
      }],

      queryField: '',
      keyword: '',
      pageNum: 1,
      pageSize: 20,
      total: 0,
      dialogFormVisible: false,
      formLabelWidth: '',
      form: {
        empno: '',
        roleId: '',
        username: '',
        password: '',
        phone: '',
        avatar: '',
        checked1:true,
        uploadNew:'N',
        fileId:''
      },
      showPasswordField: false,
      canEdit: true,
      groupByTableData:[],
      roles: [],
      rules: {
        empno: [{validator: checkName, trigger: 'change'}],
        username: [{validator: checkName, trigger: 'change'}],
        phone: [{validator: checkName, trigger: 'change'}]
        // password: [
        //   {validator: checkName, trigger: 'change'},
        //   {min: 6, max: 8, message: '密碼 6~8 碼之間', trigger: 'blur'},
        // ]
      }
    }
  },
  methods: {
    searchTerm(term){
      this.queryField = 'area'
      this.keyword = term
      this.loadData()
    },
    setupCustomers(row) {
      this.$router.push('/users/set-customer/' + row.id)
    },
    search() {
      this.loadData()
    },
    pageChange(val) {
      this.pageNum = val
      this.loadData()
    },
    clearQuery() {
      this.keyword = ''
      this.queryField = ''
      this.loadData()
    },

    /** data crud **/
    async loadData() {
      let data = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        queryField: this.queryField,
        keyword: this.keyword
      }
      try {
        let result = await this.$store.dispatch('user/getAllUsers', data);
        this.tableData = result.data.records
        this.total = result.data.total
      } catch (e) {
        this.tableData = []
        this.total = 0
        this.showResult('error', e.message)
      }

    },
    async saveData(formName) {
      this.$refs[formName].validate(async valid => {
        // console.log('valid saveData:', valid)
        if (valid) {
          try {
            if (this.showPasswordField) {
              await this.$store.dispatch('user/saveUser', this.form)
              this.showResult('success', '資料新增成功.')
            } else {
              //不傳password，後端api使用saveOrUpdate()時就不會去更新password欄位
              // eslint-disable-next-line
              const { password, ...rest } = this.form;
              await this.$store.dispatch('user/saveUser', rest)
              this.showResult('success', '資料更新成功')
            }


            await this.loadData()
            this.dialogFormVisible = false

          } catch (e) {
            this.showResult('error', '資料更新失敗')
          }
        }
      })
    },
    handleAdd() {
      this.canEdit = true
      this.showPasswordField = true
      this.dialogFormVisible = true
      this.loadRole()
      this.form.empno = ''
      this.form.roleId = ''
      this.form.username = ''
      this.form.password = ''
      this.form.phone = ''
      this.form.avata = ''
    },
    async loadRole() {
      if (this.roles.length === 0) {
        const result = await this.$store.dispatch('role/getAllRolesNoPage')
        this.roles = result.data
      }
    },
    handleEdit(rowData) {
      this.canEdit = false
      this.dialogFormVisible = true
      // this.form = rowData


      this.form.id = rowData.id
      this.form.empno = rowData.empno
      this.form.roleId = rowData.roleId
      this.form.username = rowData.username
      this.form.area = rowData.area
      this.form.avatar = rowData.avatar
      this.showPasswordField = false

    },
    async handleDelete(id) {
      try {
        // console.log('delete:', id)
        await this.$store.dispatch('user/deleteUser', id)
        this.showResult('success', this.$t('action.delete_success'))

        await this.loadData()
        this.dialogFormVisible = false

      } catch (e) {
        this.showResult('error', this.$t('action.delete_error', {'err': e}))
      }
    },

    closeDialog() {
      this.$refs['userForm'].resetFields()
      this.form.avatar = ''
      this.loadData()
    },

    uploadSuccess(file){
      this.form.uploadNew = 'Y'
      this.form.avatar = file.uuid
      this.form.fileId = file.fileId
    },

    checkExist() {
      console.log('checkExist:', this.form.empno)
      this.request.get("/user/account/exists?empno="+this.form.empno).then(res => {
        if (res.code === '200') {
          //pass
        } else {
          this.showResult('error', '帳號 '+this.form.empno+' 已被使用，請重新輸入')
          this.form.empno = ''
        }
      })
    },
    setDialogWidth() {
      let windowSize = document.body.clientWidth;
      const defaultWidth = 400; // 預設寬度
      if (windowSize < defaultWidth) {
        this.dw = "90%";
      } else {
        this.dw = "50%";
      }
    },

    loadGroupbyData() {
      this.request.get("/user/groupby").then(res => {
        if (res.code === '200') {
          this.groupByTableData = res.data
        }
      })
    }

  },
  mounted() {
    this.loadData()
    this.loadRole()
    this.setDialogWidth()
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

.avatar {
  width: 178px;
  height: 178px;
  display: block;

}

.display-avatar {
  width: 70px;
  height: 70px;
  border-radius: 999px;
  object-fit: cover;
  margin-right: 10px;
}

</style>
