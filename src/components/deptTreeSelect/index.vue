<template>
  <el-tree-select
      v-model="selectedDeptId"
      :data="data"
      node-key="id"
      check-strictly
      :render-after-expand="false"
      @change="handleSelectionChange"
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
const emits = defineEmits(['deptChange'])

const selectedDeptId = ref(props.deptId)
const data = ref([])

const loadData = () => {
  tree(null).then(res => {
    data.value = res.data
  })
}

watch(
    () => props.deptId,
    (newDeptId) => {
      selectedDeptId.value = newDeptId
    }
)

loadData()

// 监听选中值的变化
const handleSelectionChange = (selectedValue: any) => {
  emits('deptChange', selectedValue)
}
</script>

<style scoped>
</style>
