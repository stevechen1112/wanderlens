<template>
	<el-col :xs="24" :sm="24" :lg="24">
    <el-card class="box-card" >
      <div slot="header" class="clearfix">
        <span>客戶對攝影師的評價</span>
        <el-button style="float: right; padding: 3px 0" type="text" icon="el-icon-circle-plus-outline" @click="addRating">新增評價</el-button>
      </div>
      <div>
        <el-table :data="ratingList" empty-text="目前無資料" stripe header-row-class-name="headerStyle">
          <el-table-column label="評論員名稱" prop="author"></el-table-column>
          <el-table-column label="星等" prop="stars"></el-table-column>
          <el-table-column label="評價內容">
            <template slot-scope="scope"> 
              <div v-html="fmtNotes(scope.row.comments)"></div>
            </template>
          </el-table-column>
          
          <el-table-column label="操作" width="120">
            <template slot-scope="scope">
              <el-button type="primary" circle @click="handleEdit(scope.row)"><i class="el-icon-edit"></i></el-button>

              <el-popconfirm
                  class="ml-10 popconfirm-bg"
                  title="確定刪除此筆資料嗎?"
                  confirm-button-text="確定"
                  cancel-button-text="取消刪除"
                  icon="el-icon-info"
                  icon-color="red"
                  @confirm="handleDelete(scope.row.id)">
                <el-button type="danger" slot="reference" circle><i class="el-icon-delete"></i></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>

    <el-dialog title="輸入對攝影師的評價"
               :visible.sync="dialogFormVisible"
               width="45%"
               @close="closeDialog">

      <el-form label-position="top"
               :model="form"
               :rules="rules"
               ref="dataForm" class="myform">

        <el-row>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" class="pr-10">
            <el-form-item label="評論員名稱" prop="author">
              <el-input v-model="form.author" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
        	<el-col :xs="24" :sm="24" :md="24" :lg="24" class="pr-10">
            <el-form-item :label="`星等評價 ${form.stars?form.stars:''}`">
            	<el-slider v-model="form.stars" :marks="marks" :step="1" :min="1" :max="5">
					    </el-slider>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" class="pr-10">
            <el-form-item label="評價內容" prop="comments">
              <el-input type="textarea" :rows="4" v-model="form.comments" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="saveData('dataForm')">確認</el-button>
      </div>
    </el-dialog>

  </el-col>
</template>

<script>

export default {
	name: 'PhotographerRating',
	components:{

	},
	data(){
    let checkName = (rule, value, callback) => {
      if (value === '' || value == null || value == 'undefined') {
        callback(new Error( this.$t('message.required_field') ))
      } else {
        callback()
      }
    }

    return {
       dialogFormVisible:false,
       ratingList:[],
       form:{
        comments:'',
        author:'',
        stars:5,
        phId:0
       },

			marks:{
      	1: '1',
      	2: '2',
      	3: '3',
      	4: '4',
      	5: '5'
      },
       options:[],
       rules: {
        author: [{validator: checkName, trigger: 'change'}],
        comments: [{validator: checkName, trigger: 'change'}]
      }
    }
	},
	methods:{
    addRating(){
      this.reset_form()
      this.dialogFormVisible = true
    },
    reset_form(){
      this.form.author = null
      this.form.comments = null
      this.form.stars = 5
      this.form.id = null
    },
		loadData(){
      this.request.get("/photographer/rating/"+this.form.phId).then(res => {
        if (res.code === '200') {
          this.ratingList = res.data
        } else {
          this.showResult('error', '無法取得攝影師特色資料')
        }
      })
		},
    saveData(formName){
      this.$refs[formName].validate(async valid => {
        if (valid) {
          this.request.post("/photographer/rating", this.form).then(res => {
            if (res.code === '200') {
              this.loadData()
              this.reset_form()
              this.dialogFormVisible = false
              this.showResult('success', '資料更新成功')
            } else {
              this.showResult('error', '資料更新失敗')
            }
          })
        }
      })
    },
    closeDialog() {
      // this.$refs['dataForm'].resetFields()
      this.loadData()
    },

    handleEdit(rowData){
      this.form = rowData
      this.dialogFormVisible = true
    },

    handleDelete(id){
      this.request.delete("/photographer/rating/"+id).then(res => {
        if (res.code === '200') {
          this.loadData()
          this.showResult('success', '資料刪除成功')
        } else {
          this.showResult('error', '資料刪除失敗')
        }
      })
    }
	},
	mounted(){
    this.form.phId = parseInt(this.$route.params.pid)
    this.loadData()
	}
}

</script>

<style scoped>
.el-form--label-top >>> .el-form-item__label {
  padding: 0;
}
</style>

