<template>
  <el-menu-item v-if="!item.children.length" :index="item.path">
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

    <SubMenu v-for="it in item.children" :index="it.path" :key="it" :item="it"></SubMenu>
  </el-sub-menu>
</template>

<script setup>
defineProps(['item'])
</script>

<style scoped>

</style>
