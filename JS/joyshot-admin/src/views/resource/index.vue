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
        <el-table :data="tableData" row-key="id" empty-text="無資料">
          <el-table-column prop="desc" label="資料說明">
          </el-table-column>

          <el-table-column label="操作" width="400">
            <template slot-scope="scope">
              <el-button type="primary" @click="exportData(scope.row.url)">下載 <i class="el-icon-download"></i>
              </el-button>
            </template>
          </el-table-column>
        </el-table>

      </el-main>
    </el-col>

  </el-row>
</template>

<script>
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";

export default {
  name: "Resource",
  components: {
    Breadcrumb
  },
  data() {
    return {
      tableData: [
        {desc: '客戶匯入範本檔', url: '/customer/export'},
        {desc: '商品匯入範本檔', url: '/product/export'},
        {desc: '用品匯入範本檔', url: '/item/export'},
      ]
    }
  },
  methods: {
    exportData(url) {
      window.open(process.env.VUE_APP_API_SERVER + url, "new")
    }
  },
  mounted() {

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


</style>
