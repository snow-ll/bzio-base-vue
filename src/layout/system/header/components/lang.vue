<template>
  <el-dropdown @command="handleCommand">
    <svg-icon icon="language"/>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="zh-CN" :disabled="language.includes('zh-CN')">中文</el-dropdown-item>
        <el-dropdown-item command="en" :disabled="language.includes('en')">English</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'

const i18n = useI18n()

const language = computed(() => {
  return i18n.locale.value
})

const handleCommand = (val) => {
  i18n.locale.value = val
}
</script>

<style lang="scss" scoped>

</style>
