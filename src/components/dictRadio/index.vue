<template>
  <el-radio
      v-for="dict in dicts"
      :key="dict.dictValue"
      :label="Number(dict.dictValue)"
  >
    {{ dict.dictLabel }}
  </el-radio>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { toRaw } from '@vue/reactivity'
import store from '@/store'

const dicts = ref()
const props = defineProps({
  dictType: {
    type: String,
    required: true
  },
  timeout: {
    type: Number,
    default: 200
  },
})

const getDict = () => {
  dicts.value = toRaw(store.getters.dict).get(props.dictType)
}

setTimeout(getDict, props.timeout)
</script>

<style scoped lang="scss">

</style>