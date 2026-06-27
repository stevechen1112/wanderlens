<template>
  <el-col :xs="24" :sm="24" :lg="24">
    <div class="p20">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">{{ $t('route.home') }}</el-breadcrumb-item>
        <el-breadcrumb-item>{{ $t(breadcrumb) }}</el-breadcrumb-item>
        <el-breadcrumb-item>
          {{ $t(title) }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
  </el-col>

</template>

<script>
export default {
  name: 'Breadcrumb',
  props: ['route'],
  computed: {
    breadcrumb() {
      return this.route.meta.breadcrumb
    },
    title(){
      return this.route.meta.title
    }
  }
}
</script>

<style scoped lang="stylus">
.breadcrumb
  line-height 40px
  // background #fff
  border-radius 4px
  margin-bottom 10px

  .el-breadcrumb
    line-height 2
    padding-left 4px
</style>
