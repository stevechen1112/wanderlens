<template>
	<el-card class="box-card">
		<div class="mb-20">地區(最低拍攝時數)</div>
		<el-tree
	      :data="tableData"
	      show-checkbox
	      node-key="id"
	      ref="tree"
	      :check-on-click-node="true"
	      :expand-on-click-node="false"
	      :props="props"
	      :default-expanded-keys="rootNodes"
	      :default-checked-keys="checkedNodes">
	  </el-tree>

	  <div class="text-right">
      <el-button type="primary" @click="saveData()">儲存服務區域資料</el-button>
  	</div>


	</el-card>
</template>

<script>

import {mapState} from 'vuex'

export default {
	name: 'PhotographerServiceArea',
	components:{

	},
	computed:{
    ...mapState('login', ['userInfo'])
  },
	data(){
		return {
			phId:'',
			tableData:[],
			props: {
        label: 'treeName', //name+minHour
        // label: 'name',
        children: 'children',
        isLeaf: true
      },
      rootNodes: [],
      checkedNodes: [],
      allIds: []
		}
	},
	methods:{
		saveData(){
      //let selectedIds = this.$refs.tree.getCheckedKeys();
      console.log(this.$refs.tree.getCheckedKeys())
      //console.log(this.$refs.tree.getHalfCheckedKeys())

      //selectedIds = selectedIds.concat(this.$refs.tree.getHalfCheckedKeys())
      //console.log(selectedIds)

      let form = {
      	rootNodes: this.rootNodes,
      	selectedNodes: this.$refs.tree.getCheckedKeys()
      }

      // console.log(form)

      this.request.post("/photographer/service/area/"+this.phId, form).then(res => {
        if (res.code === '200') {
          this.loadData()
          this.showResult('success', '資料更新成功.')

        } else {
          this.showResult('error', '資料更新失敗'+res.message)
        }
      })

		},
		loadData(){
			this.request.get("/photographer/service/area/"+this.phId).then(res => {
        this.tableData = res.data
        this.rootNodes = this.tableData.map(e => e.id)
        this.allChildNodes = this.tableData.map(e => {
        	if (e.children.length > 0) {
        		return e.children.map(c => c.id)
        	} else {
        		return e.id
        	}
        }).flat()

        this.allIds = this.rootNodes.concat(this.allChildNodes)
        // console.log('allIds:', this.allIds)

        this.$nextTick(function () {
  				//set checked menu
		      this.request.get("/photographer/service/area/setting/" + this.phId).then(res1 => {
		        this.checkedNodes = res1.data
		        this.allIds.forEach(id => {
		        	if (!this.checkedNodes.includes(id)) {
		            this.$refs.tree.setChecked(id, false)
		           }
		         })
		      })
  			})
      })
		}
	},
	mounted(){
		// this.phId = parseInt(this.$route.params.pid)
		this.phId = this.userInfo.phId
		this.loadData()
	}
}

</script>

<style scoped>

</style>


