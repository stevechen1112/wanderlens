<template>
	<div class="pagination-box">
    <el-pagination
        background
        layout="prev, pager, next"
        :current-page="pageNo"
        :page-size="pageSize"
        :total="total"
        @current-change="pageChange">
    </el-pagination>
  </div>
</template>

<script>

export default {
	name: 'AppPagination',
	props:['pageNum','pageSize','total'],
	computed:{
		pageNo: {
	    get() {
	      return this.pageNum; //讀props，表示從父組件取得值
	    },
	    set(no) {//更新時，通知父組件更新，就會讓父組件傳新的值給子組件
	      this.$emit('pageChange', no)
	    }
	  }
	},
	methods:{
		pageChange(val){
			this.pageNo = val
		}
	}
}

</script>


<style scoped>
.pagination-box {
	border-radius:8px; 
	margin-top:10px;
	padding:20px 10px; 
	text-align: center;
	background-color: white;
}
</style>


