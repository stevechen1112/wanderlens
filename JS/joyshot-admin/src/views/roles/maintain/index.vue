<template>

  <el-row :gutter="20" class="top-block">
    <Breadcrumb :route="this.$route"></Breadcrumb>


    <!-------------------------------------------------------------------->
    <!-- action -->
    <!-------------------------------------------------------------------->
    <el-col :xs="24" :sm="24" :lg="16">
      <el-select :xs="24" v-model="queryField" placeholder="Search By" style="padding: 0 0 0 20px">
        <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
        </el-option>
      </el-select>
      <el-input v-model="keyword" style="width: 200px" placeholder="keyword.." class="ml-10"
                suffix-icon="el-icon-search"></el-input>
      <el-button type="primary" @click.prevent="search" class="ml-10">Query</el-button>
      <el-button type="normal" @click.prevent="clearQuery" class="ml-10">Clear</el-button>
    </el-col>

    <el-col :xs="24" :sm="24" :lg="8" style="text-align: right">
      <el-button type="primary" @click.prevent="handleAdd" class="mr-20">New <i class="el-icon-circle-plus-outline"></i>
      </el-button>
    </el-col>


    <!-------------------------------------------------------------------->
    <!-- table -->
    <!-------------------------------------------------------------------->
    <el-col :xs="24" :sm="24" :lg="24">
      <el-main>
        <el-table :data="tableData" empty-text="no data" stripe header-row-class-name="headerStyle">
          <el-table-column prop="name" label="role name" width="140">
          </el-table-column>
          <el-table-column prop="engName" label="role english name">
          </el-table-column>
          <el-table-column prop="description" label="role desc.">
          </el-table-column>

          <el-table-column label="action" width="300">
            <template slot-scope="scope">
              <el-button type="info" @click="handleMenu(scope.row.id)">Setup menu <i class="el-icon-menu"></i></el-button>
              <el-button type="warning" @click="handleEdit(scope.row)">Edit <i class="el-icon-edit"></i></el-button>
              <el-popconfirm
                  class="ml-10 popconfirm-bg"
                  title="Delete this data?"
                  confirm-button-text="Confirm"
                  cancel-button-text="Cancel"
                  icon="el-icon-info"
                  icon-color="red"
                  @confirm="handleDelete(scope.row.id)"
              >
                <!-- <el-button type="danger" slot="reference">刪除 <i class="el-icon-delete"></i></el-button> -->
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
    <el-dialog title="Role Information"
               :visible.sync="dialogFormVisible"
               width="50%"
               @close="closeRoleDialog">
      <el-form :model="form"
               :rules="rules"
               ref="dataForm"
               label-width="100px">
        <el-form-item label="Role Name" prop="name">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="Role English Name" prop="engName">
          <el-input v-model="form.engName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="Role Desc." prop="description">
          <el-input v-model="form.description" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="saveData('dataForm')">Confirm</el-button>
      </div>
    </el-dialog>


    <el-dialog title="Menu"
               :visible.sync="dialogMenuFormVisible"
               @close="closeMenuDialog"
               width="50%">
      <el-tree
          :data="menuData"
          show-checkbox
          node-key="id"
          ref="tree"
          :props="props"
          :default-expanded-keys="expandNodes"
          :default-checked-keys="checkedNodes">
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogMenuFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleMenuData">確 定</el-button>
      </div>
    </el-dialog>

  </el-row>


</template>

<script>
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";

export default {
  name: "RoleMaintain",
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
      options: [{
        value: 'name',
        label: 'role name'
      }],
      queryField: '',
      keyword: '',
      pageNum: 1,
      pageSize: 20,
      total: 0,
      dialogFormVisible: false,
      dialogMenuFormVisible: false,
      formLabelWidth: '',
      form: {
        name: '',
        description: '',
        engName: ''
      },
      rules: {
        name: [{validator: checkName, trigger: 'change'}],
        engName: [{validator: checkName, trigger: 'change'}]
      },
      menuData: [],
      props: {
        label: 'name',
        children: 'children',
        isLeaf: true
      },
      roleId: 0,
      expandNodes: [],
      checkedNodes: []
    }
  },
  methods: {
    search() {
      this.loadData()
    },
    handleCurrentChange(val) {
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
      let result = await this.$store.dispatch('role/getAllRoles', data);
      this.tableData = result.data.records
      this.total = result.data.total
    },
    async saveData(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          try {
            await this.$store.dispatch('role/saveRole', this.form)

            this.$notify({
              title: '成功',
              message: '資料新增成功',
              duration: 1000,
              type: 'success'
            })

            await this.loadData()
            this.dialogFormVisible = false

          } catch (e) {
            this.$notify({
              title: '失敗',
              message: e.message,
              duration: 3000,
              type: 'error'
            })
          }
        }
      })
    },
    handleAdd() {
      this.dialogFormVisible = true
      this.form.id = null
    },
    handleEdit(rowData) {
      this.dialogFormVisible = true
      this.form = rowData
    },
    async handleMenu(rowId) {
      this.roleId = rowId
      this.dialogMenuFormVisible = true
      this.expandNodes = []
      this.checkedNodes = []

      //get all menu
      this.request.get("/menu?keyword=").then(res => {
        this.menuData = res.data
        this.expandNodes = this.menuData.map(e => e.id)
      })

      //set checked menu
      this.request.get("/role/menu/" + this.roleId).then(res => {
        this.checkedNodes = res.data

        //取得所有選單
        this.request.get("/role/allmenu").then(response => {
          const allIds = response.data
          allIds.forEach(id => {
            if (!this.checkedNodes.includes(id)) {
              this.$refs.tree.setChecked(id, false)
            }
          })
        })
      })

    },
    async handleDelete(id) {
      try {
        console.log('delete:', id)
        await this.$store.dispatch('role/deleteRole', id)

        this.$notify({
          title: '成功',
          message: '資料刪除成功',
          duration: 1000,
          type: 'success'
        })

        await this.loadData()
        this.dialogFormVisible = false

      } catch (e) {
        this.$notify({
          title: '失敗',
          message: e.message,
          duration: 3000,
          type: 'error'
        })
      }
    },

    closeRoleDialog() {
      this.$refs['dataForm'].resetFields()
      this.loadData()
    },
    closeMenuDialog() {
      this.checkedNodes = []
    },
    saveRoleMenuData() {
      let selectedIds = this.$refs.tree.getCheckedKeys();
      // console.log(this.$refs.tree.getCheckedKeys())
      console.log(this.$refs.tree.getCheckedKeys())
      console.log(this.$refs.tree.getHalfCheckedKeys())

      selectedIds = selectedIds.concat(this.$refs.tree.getHalfCheckedKeys())
      console.log(selectedIds)

      this.request.post("/role/menu/" + this.roleId, selectedIds).then(() => {
        this.$notify({
          title: '成功',
          message: '功能選單設定成功',
          duration: 2000,
          type: 'success'
        })
        this.dialogMenuFormVisible = false
      })
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


</style>
