<template>
  <div class="pagination-container">
    <el-pagination 
        v-model:current-page="queryParam.pageNum"
        v-model:page-size="queryParam.pageSize"
        :page-sizes="[10, 20, 30, 40, 50]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper, Slots"
        v-show="total>0"
        small
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
    />
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  queryParam: {
    type: Object,
    required: true
  },
  total: {
    type: Number,
    required: true
  }
})

const emits = defineEmits([
    'pagination'
])

const handleSizeChange = (pageSize: number): void => {
  props.queryParam.pageNum = 1
  props.queryParam.pageSize = pageSize
  emits('pagination', { pageNum: props.queryParam.pageNum, pageSize })
}

const handleCurrentChange = (pageNum: number): void => {
  props.queryParam.pageNum = pageNum
  emits('pagination', { pageNum, pageSize: props.queryParam.pageSize })
}

</script>

<style lang="scss" scoped>
.pagination-container {
  background: #fff;
  padding: 32px 16px;
}

.pagination-container.hidden {
  display: none;
}
</style>
