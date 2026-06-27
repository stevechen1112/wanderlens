<template>
	<el-col :xs="24" :sm="24" :lg="24">
    <el-card class="box-card" >
      <div slot="header" class="clearfix">
        <span>攝影師特色</span>
        <el-button style="float: right; padding: 3px 0" type="text" icon="el-icon-circle-plus-outline" @click="addFeature">新增特色</el-button>
      </div>
      <div>
        <el-table :data="featureList" empty-text="目前無資料" stripe header-row-class-name="headerStyle">
          <el-table-column label="語系" prop="language" width="100"></el-table-column>
          <el-table-column label="特色類型" prop="featureTitle" width="200"></el-table-column>
          <el-table-column label="簡短說明" prop="featureContent">
            <template slot-scope="scope">
              <div v-html="fmtNotes(scope.row.featureContent)"></div>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="120">
            <template slot-scope="scope">
              <el-button type="primary" circle @click="handleEditFeature(scope.row)"><i class="el-icon-edit"></i></el-button>

              <el-popconfirm
                  class="ml-10 popconfirm-bg"
                  title="確定刪除此筆資料嗎?"
                  confirm-button-text="確定"
                  cancel-button-text="取消刪除"
                  icon="el-icon-info"
                  icon-color="red"
                  @confirm="handleDeleteFeature(scope.row.id)">
                <el-button type="danger" slot="reference" circle><i class="el-icon-delete"></i></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>

    <el-dialog title="建立攝影師基本資訊"
               :visible.sync="dialogFormVisible"
               width="45%"
               @close="closeDialog">

      <el-form label-position="top"
               :model="form"
               :rules="rules"
               ref="dataForm" class="myform">

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
          <el-col :xs="24" :sm="24" :md="24" :lg="24" class="pr-10">
            <el-form-item label="特色類型" prop="featureTitle">
              <el-select v-model="form.featureTitle" placeholder="選擇">
                <el-option
                  v-for="item in options"
                  :key="item.id"
                  :label="item.displayName"
                  :value="item.displayName">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" class="pr-10">
            <el-form-item label="簡短說明" prop="featureContent">
              <el-input type="textarea" :rows="4" v-model="form.featureContent" autocomplete="off" placeholder="自然可愛的日系風格..."></el-input>
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

import {mapState} from 'vuex'

export default {
	name: 'PhotographerFeatures',
	components:{

	},
  computed:{
    ...mapState('login', ['userInfo'])
  },
	data(){
    let checkName = (rule, value, callback) => {
      if (value === '' || value == null) {
        callback(new Error( this.$t('message.required_field') ))
      } else {
        callback()
      }
    }

    return {
       dialogFormVisible:false,
       featureList:[],
       form:{
        language:'',
        featureTitle:'',
        featureContent:'',
        enable:1,
        sort:1,
        phId:0
       },
       options:[],
       rules: {
        featureTitle: [{validator: checkName, trigger: 'change'}],
        featureContent: [{validator: checkName, trigger: 'change'}]
      }
    }
	},
	methods:{
    addFeature(){
      this.reset_form()
      this.dialogFormVisible = true
    },
    reset_form(){
      this.form.language = 'tw'
      this.form.featureTitle = null
      this.form.featureContent = null
      this.form.id = null
    },
		loadData(){
      this.request.get("/photographer/feature/"+this.form.phId).then(res => {
        if (res.code === '200') {
          this.featureList = res.data
        } else {
          this.showResult('error', '無法取得攝影師特色資料')
        }
      })
		},
    loadFeatureType(){
      let query = {
        queryField: 'feature_type'
      }
      this.request.get("/dic/type",{params: query}).then(res => {
        if (res.code === '200') {
          this.options = res.data
        } else {
          this.showResult('error', '無法取得攝影師特色資料')
        }
      })
    },
    saveData(formName){
      this.$refs[formName].validate(async valid => {
        if (valid) {
          console.log('valid:', valid)
          this.request.post("/photographer/feature", this.form).then(res => {
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

    handleEditFeature(rowData){
      this.form = rowData
      this.dialogFormVisible = true
    },

    handleDeleteFeature(id){
      this.request.delete("/photographer/feature/"+id).then(res => {
        if (res.code === '200') {
          this.loadData()
          this.showResult('success', '資料刪除成功')
        } else {
          this.showResult('error', '資料刪除失敗')
        }
      })
    }
  },
  watch: {
    "form.language"(lang) {
      this.options.forEach((option) => {
        if (lang === "tw") {
          option.displayName = option.value;
        } else if (lang === "en") {
          option.displayName = option.valueEn;
        } else if (lang === "jp") {
          option.displayName = option.valueJp;
        } else if (lang === "kr") {
          option.displayName = option.valueKr;
        }
      });
    }
	},
	mounted(){
    // this.form.phId = parseInt(this.$route.params.pid)
    this.form.phId = this.userInfo.phId
    this.loadData()
    this.loadFeatureType()
	}
}

</script>

<style scoped>
.el-form--label-top >>> .el-form-item__label {
  padding: 0;
}
</style>

