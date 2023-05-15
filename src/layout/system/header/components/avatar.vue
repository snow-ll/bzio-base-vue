<template>
  <el-dropdown>
    <span>
      <el-avatar shape="square" :size="50" src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"></el-avatar>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="logout">退出</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>

</template>

<script setup>
import { useStore } from 'vuex'
import { ElMessageBox } from 'element-plus'

const store = useStore()

const logout = () => {
  ElMessageBox.confirm('确认注销并退出登录？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    store.dispatch('logout')
  }).catch(() => {
    
  })
}
</script>

<style lang="scss" scoped>

</style>
