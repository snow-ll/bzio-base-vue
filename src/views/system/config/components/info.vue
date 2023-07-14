<template>
  <el-dialog 
      :model-value="dialogVisible"
      :title="$t(`operate.${props.type}`) + $t('fields.user')"
      width="40%"
      @close="handleClose"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="auto" :disabled="props.type === 'view'">
      <el-row>
        <el-col :span="12" hidden="hidden">
          <el-form-item :label="$t('fields.configId')" prop="configId">
            <el-input v-model="form.configId"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item :label="$t('fields.configName')" prop="configName">
            <el-input v-model="form.configName"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-row>
        <el-col :span="12">
          <el-form-item :label="$t('fields.configKey')" prop="configKey">
            <el-input v-model="form.configKey"/>
          </el-form-item>
        </el-col>
        
        <el-col :span="12">
          <el-form-item :label="$t('fields.configValue')" prop="configValue">
            <el-input v-model="form.configValue"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item :label="$t('fields.note')" prop="note">
            <el-input v-model="form.note"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">
          {{ $t('operate.cancel') }}
        </el-button>
        <el-button type="primary" @click="handleSave" :disabled="props.type === 'view'">
          {{ $t('operate.confirm') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { save, info } from '@/api/system/config'
import { toRaw } from '@vue/reactivity'
import { isNull } from '@/util/object'
import { ElMessageBox } from 'element-plus'
import store from '@/store'

interface ConfigInfo {
  configId: string | undefined,
  configName: string | undefined,
  configKey: string | undefined,
  configValue: string | undefined,
  note: string | undefined,
}

const props = defineProps({
  configId: {
    type: String
  },
  type: {
    type: String
  }
})
const emits = defineEmits(['update:modelValue', 'init', 'reset'])
const formRef = ref<any>(null)
const form = ref<ConfigInfo>({
  configId: undefined,
  configName: undefined,
  configKey: undefined,
  configValue: undefined,
  note: undefined,
})
const rules = ref({
  configName: [
    {required: true, trigger: "blur", message: "请输入配置名称"}
  ],
  configKey: [
    {required: true, trigger: "blur", message: "请输入配置键值"}
  ],
  configValue: [
    {required: true, trigger: "blur", message: "请输入配置属性"}
  ],
})

const initConfig = async (userId: string) => {
  const res = await info(userId)
  if (!isNull(res.data)) {
    form.value = res.data
  }
}

const handleClose = () => {
  emits('reset')
  resetForm()
  emits('update:modelValue', false)
}

const handleSave = () => {
  formRef.value!.validate((valid: any) => {
    if(valid) {
      save(form.value).then(res => {
        handleClose()
        emits('init')
        ElMessageBox.alert(res.msg)
      })
    } else {
      return false
    }
  })
}

const resetForm = () => {
  form.value = {
    configId: undefined,
    configName: undefined,
    configKey: undefined,
    configValue: undefined,
    note: undefined,
  }
}

watch(
    () => props.configId,
    () => {
      initConfig(props.configId!)
    },
    { deep: true, immediate: true }
)
</script>

<style scoped>
</style>
