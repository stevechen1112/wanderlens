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
        <el-table :data="tableData" empty-text="無資料" stripe header-row-class-name="headerStyle">
          <el-table-column label="訊息">
            <template slot-scope="scope">
              <a href="#" @click.prevent="setRead(scope.row.id, scope.row.messageUrl)">{{scope.row.message}}</a>
              <p>{{scope.row.createdAt | fmtDateTime}}</p>
            </template>
          </el-table-column>
         
          <el-table-column prop="isRead" label="狀態" :class="readNoNotColor" width="100">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.isRead === 'N'" type="warning">未讀</el-tag>
              <el-tag v-if="scope.row.isRead === 'Y'" type="info">已讀</el-tag>
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

  </el-row>


</template>

<script>

import store from "@/store";

import Breadcrumb from "@/components/breadcrumb/Breadcrumb";

import dayjs from "dayjs"

export default {
  name: "NotifyMessage",
  components: {
    Breadcrumb
  },
  data() {
    return {
      dw: '50%',
      tableData: [],
      pageNum: 1,
      pageSize: 10,
      total: 0,
      dialogFormVisible: false,
      formLabelWidth: '',
      readNoNotColor: 'not_read'
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
    loadData() {
      this.request.get(`/notify/page?pageNum=${this.pageNum}&pageSize=${this.pageSize}`).then(res => {
        console.log(res)
        if (res.code === '200') {
          this.tableData = res.data.records
          this.total = res.data.total
        } else {
          this.showResult('error', 'load_error')
        }
      })
    },
    saveData(formName) {

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
     setRead(id, url) {
      this.request.get("/notify/set-read/" + id).then( async res => {

        if (res.code === '200') {
          try {
            await store.dispatch('login/getUserBadge')

            this.$router.push(url)  

          } catch (e) {
            this.showResult('error', 'load_badge_error')
          }

          
        }


        
      })
    }

  },
  filters: {
    
    readOrNot(value) {
      return value === 'N' ? '否' : '是';
    }
  },
  mounted() {
    this.loadData()
    this.setDialogWidth();

    
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
}

.display-avatar {
  width: 60px;
  height: 60px;
  border-radius: 999px;
}


/deep/ .el-upload-dragger {
  width: 180px !important;
}

main >>> .el-card__body {
  padding: 0px;
}

</style>
