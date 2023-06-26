<template>
  <el-tag>
    {{ dictData }}
  </el-tag>
</template>

<script lang="ts" setup>
import {ref, watch} from 'vue'
import { useStore } from 'vuex'
import { toRaw } from '@vue/reactivity'
import { isNull } from '@/util/object'

const store = useStore()
const props = defineProps({
  dictType: {
    type: String,
    required: true
  },
  dictValue: {
    type: [String, Number],
    required: true
  },
  timeout: {
    type: Number,
    default: 200
  },
  key: {
    type: Number,
    default: 0
  }
})

const dictData = ref<string>('')

const getData = (): void => {
  const d = store.getters.dict.get(props.dictType)
  const list = toRaw(d)
  if (typeof list !== "undefined" && !isNull(list)) {
    list.map((item: { dictValue: string; dictLabel: string }) => {
      if (!props.dictValue.toString().indexOf(item.dictValue)) {
        dictData.value = item.dictLabel
      }
    })
  }
}

setTimeout(getData, props.timeout)

/**
 * 监听key（用于刷新列表等情况下，同时刷新字典）
 */
watch(
    () => props.key,
    () => {
      getData()
    },
    { deep: true, immediate: true }

)
</script>

<style scoped>

</style>
