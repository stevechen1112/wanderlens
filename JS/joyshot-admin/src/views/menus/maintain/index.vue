<template>

  <el-row :gutter="20" class="top-block">

    <Breadcrumb :route="this.$route"></Breadcrumb>

    <!-------------------------------------------------------------------->
    <!-- action -->
    <!-------------------------------------------------------------------->
    <el-col :xs="24" :sm="24" :lg="16">
      <el-input v-model="keyword" style="width: 200px" placeholder="Search by name" class="ml-20"
                suffix-icon="el-icon-search"></el-input>
      <el-button type="primary" @click.prevent="search" class="ml-10">Query</el-button>
      <el-button type="normal" @click.prevent="clearQuery" class="ml-10">Clear</el-button>
    </el-col>

    <el-col :xs="24" :sm="24" :lg="8" style="text-align: right">
      <!-- <el-button type="primary" @click.prevent="exportData">匯出 <i class="el-icon-upload2"></i></el-button> -->
      <el-button type="primary" @click.prevent="handleAdd" class="mr-20">New <i class="el-icon-circle-plus-outline"></i>
      </el-button>
    </el-col>


    <!-------------------------------------------------------------------->
    <!-- table -->
    <!-------------------------------------------------------------------->
    <el-col :xs="24" :sm="24" :lg="24">
      <el-main>
        <el-table
            :data="tableData"
            default-expand-all
            row-key="id"
            empty-text="無資料"
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
          <el-table-column prop="name" label="name" width="280">
          </el-table-column>
          <el-table-column prop="path" label="path" width="280">
          </el-table-column>
          <el-table-column prop="icon" label="icon" width="100">
            <template slot-scope="scope">
              <i :class="scope.row.icon" style="font-size: 20px"></i>
            </template>
          </el-table-column>
          <el-table-column prop="description" label="description" >
          </el-table-column>
          <el-table-column label="action" width="350">
            <template slot-scope="scope">
              <el-button type="warning" @click="handleEdit(scope.row)" circle> <i class="el-icon-edit"></i></el-button>
              <el-popconfirm
                  class="ml-10 popconfirm-bg"
                  title="確定刪除此筆資料嗎?"
                  confirm-button-text="確定"
                  cancel-button-text="取消刪除"
                  icon="el-icon-info"
                  icon-color="red"
                  @confirm="handleDelete(scope.row.id)"
              >
                <el-button type="danger" slot="reference" circle> <i class="el-icon-delete"></i></el-button>
              </el-popconfirm>
              <el-button class="ml-10" type="default" v-if="!scope.row.parentId" @click="addChildren(scope.row.id)">
                 Sub Menu <i class="el-icon-circle-plus-outline"></i></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
    </el-col>


    <!-------------------------------------------------------------------->
    <!-- dialog -->
    <!-------------------------------------------------------------------->
    <el-dialog title="選單資訊"
               :visible.sync="dialogFormVisible"
               width="50%"
               @close="closeDialog">
      <el-form :model="form"
               :rules="rules"
               ref="dataForm"
               label-width="100px">
        <el-form-item label="選單名稱" prop="name">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="選單路徑" prop="path">
          <el-input v-model="form.path" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="選單圖示" prop="icon">
          <!--            <el-input v-model="form.icon" autocomplete="off"></el-input>-->
          <el-select prop="form.icon" placeholder="選擇圖示" v-model="form.icon" style="width: 100%">
            <el-option
                v-for="item in options" :key="item.id" :label="item.name" :value="item.value">
              <i :class="item.value"/> {{item.name}}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="選單描述" prop="description">
          <el-input v-model="form.description" autocomplete="off"></el-input>
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
  name: "MenuMaintain",
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
      title: this.$route.meta.title,
      tableData: [],
      options: [],
      keyword: '',
      pageNum: 1,
      pageSize: 10,
      total: 0,
      dialogFormVisible: false,
      formLabelWidth: '',
      form: {
        name: '',
        path: '',
        icon: '',
        description: '',
        parentId: ''
      },
      rules: {
        name: [{validator: checkName, trigger: 'change'}],
        // path: [{validator: checkName, trigger: 'change'}],
        icon: [{validator: checkName, trigger: 'change'}]
      }

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
      this.loadData()
    },

    /** data crud **/
    async loadData() {
      let data = {
        keyword: this.keyword
      }
      let result = await this.$store.dispatch('menu/getAllMenus', data);
      this.tableData = result.data

      let result1 = await this.$store.dispatch('menu/getMenuIcons');
      this.options = result1.data

    },
    async saveData(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          try {
            await this.$store.dispatch('menu/saveMenu', this.form)

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
    async handleAdd() {
      this.dialogFormVisible = true
      this.form.id = null
    },
    async handleEdit(rowData) {
      this.dialogFormVisible = true
      this.form = rowData
    },
    async handleDelete(id) {
      try {
        console.log('delete:', id)
        await this.$store.dispatch('menu/deleteMenu', id)

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

    closeDialog() {
      this.loadData()
      this.$refs['dataForm'].resetFields();
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


</style>
