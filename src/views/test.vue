<template>
  <el-tree-select
      v-model="localDeptId"
      :data="data"
      node-key="id"
      check-strictly
      :render-after-expand="false"
  />
</template>

<script lang="ts" setup>
import { tree } from '@/api/system/dept'
import { ref, watch } from 'vue'

const props = defineProps({
  deptId: {
    type: String
  }
})

const localDeptId = ref(props.deptId)
const data = ref()

const loadData = () => {
  tree(null).then(res => {
    data.value = res.data
  })
}
loadData()

watch(
    () => props.deptId,
    (newDeptId) => {
      localDeptId.value = newDeptId
    }
)

watch(
    localDeptId,
    (newLocalDeptId) => {
      localDeptId.value = newLocalDeptId
    }
)
</script>

<style scoped>
</style>
