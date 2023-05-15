<template>
  <el-breadcrumb separator="">
    <el-breadcrumb-item v-for="(item, index) in breadcrumbList" :key="index">
      {{ $t(`menus.${item.name}`) }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const breadcrumbList= ref([] )

const initBreadcrumbList = () => {
  breadcrumbList.value = route.matched
}

watch(
    route, 
    () => {
      initBreadcrumbList()
    },
    {deep: true, immediate: true})
</script>

<style lang="scss" scoped>

</style>
