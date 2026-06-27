<template>
	<nav class="mainMenu" itemscope itemtype="https://schema.org/siteNavigationElement">
    <ul>
      <!-- <li><a href="#">景點</a></li> -->
      <li><router-link to="/photographer-list">{{ $t('menu.photographer') }}</router-link></li>
      <!-- <li><a href="#">聯絡</a></li> -->
    </ul>
  </nav>
</template>

<script>

export default {
	name: 'TopMenu',
	components:{

	},
	data(){
		return {

		}
	},
	methods:{

	},
	mounted(){

	}
}

</script>

<style scoped>

</style>


