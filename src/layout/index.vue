<template>
  <el-container>
    <el-aside :width="asideWidth" class="sidebar-container">
      <SysMenu />
    </el-aside>
    <el-container class="container" :class="{hidderContainer: !$store.getters.sideType}">
      <el-header><SysHeader /></el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import SysMenu from './system/menu'
import SysHeader from './system/header'
import variables from '@/assets/styles/variables.module.scss'

const store = useStore()

const asideWidth = computed(() => {
  return store.getters.sideType ? variables.sideBarWidth : variables.hideSideBarWidth
})
</script>

<style lang="scss" scoped>
.app-container {
  position: relative;
  width: 100%;
  height: 100%;
}
.sib-container {
  width: $sideBarWidth;
}
.container {
  width: calc(100% - $sideBarWidth);
  height: 100%;

  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  transition: all 0.28s;
  &.hidderContainer {
    width: calc(100% - $hideSideBarWidth);
  }
}
:deep(.el-header) {
  padding: 0;
}
</style>
