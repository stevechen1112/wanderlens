<template>
  <div class="notFind">
    <img src="@/assets/images/joyshot-ig.jpg" alt="" class="page-404">
    <el-button type="danger" round　@click="backHome" icon="el-icon-back">{{ $t('Views.404.title') }}</el-button>
  </div>
</template>

<script>
export default {
  name: 'NotFind',
  methods: {
    backHome() {
      this.$router.push({
        path: '/'
      })
    }
  }
}
</script>

<style scoped>
  .notFind {
    width: 300px;
    text-align: center;
    margin: 80px auto;
  }
.page-404{
  width: 100%;
  margin-bottom: 20px;
}
</style>

