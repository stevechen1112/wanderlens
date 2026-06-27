<template>
	<footer class="footerBox">
		<div class="container">
		<div class="copyright">Copyright © JOYSHOT All Rights Reserved.
			<router-link to="/privacy-policy">{{ $t('Components.Footer.privacy_policy') }}</router-link>
			<p>{{ $t('Components.Footer.company_info') }}</p>
		</div>
		</div>
	</footer>
</template>

<script>

export default {
	name: 'AppFooter'
}

</script>



<style scoped>
.copyright a {
	margin-right: 10px;
}
</style>


