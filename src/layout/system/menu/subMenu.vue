<template>
  <el-menu-item v-if="!item.children.length"  @click="jump(item.path)">
    <div>
      <svg-icon :icon=item.icon />
    </div>
    <span>
      {{ item.label }}
    </span>
  </el-menu-item>
  
  <el-sub-menu v-else :index="item.id" :key="item.id">
    <template #title>
      <div>
        <svg-icon :icon=item.icon />
      </div>
      <span>
      {{ item.label }}
      </span>
    </template>

    <SubMenu v-for="it in item.children" :key="it" :item="it"></SubMenu>
  </el-sub-menu>
</template>

<script lang="ts" setup>
import router from '@/router'

defineProps(['item'])

const jump = (path: string) => {
  router.push({
    name: path,
  })
}
</script>

<style scoped>

</style>
