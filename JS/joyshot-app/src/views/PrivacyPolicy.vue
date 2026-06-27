<template>
	<main class="siteMain viewpointBox" ref="siteMain" aria-label="main" itemscope>
    <div class="banner">
      <div class="titleBox">
        <h1>{{ $t('Views.PrivacyPolicy.title') }}</h1>
      </div>
    </div>
    <div class="mainBox reserve">
      <div class="container">
        <div class="elementor-widget-container" v-html="$t('Views.PrivacyPolicy.content')"></div>
      </div>
    </div>
  </main>
</template>

<script>

export default {
	name: 'PrivacyPolicy',
	components: {
	},
	data() {
		return {
		}
	},
	methods: {
	},
	mounted() {
	}
}
</script>
