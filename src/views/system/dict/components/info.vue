<template>
  <el-dialog
      :model-value="dialogVisible"
      :title="$t(`operate.${props.type}`) + $t('fields.dict')"
      width="30%"
      @close="handleClose"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="auto" :disabled="props.type === 'view'">
      <el-row>
        <el-col :span="24" hidden="hidden">
          <el-form-item prop="userId">
            <el-input v-model="form.dictId"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item :label="$t('fields.dictName')" prop="roleName">
            <el-input v-model="form.dictName" ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-row>
        <el-col :span="24">
          <el-form-item :label="$t('fields.dictType')" prop="roleKey">
            <el-input v-model="form.dictType"/>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item :label="$t('fields.role') + $t('fields.status')" prop="status">
            <el-radio-group v-model="form.status">
              <el-radio
                  v-for="dict in toRaw(store.getters.dict).get('enable_type')"
                  :key="dict.dictValue"
                  :label="Number(dict.dictValue)"
              >
                {{ dict.dictLabel }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-row>
        <el-col :span="24">
          <el-form-item :label="$t('fields.note')" prop="roleKey">
            <el-input v-model="form.note"/>
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
import { save, info } from '@/api/system/dict'
import { toRaw } from '@vue/reactivity'
import { isNull } from '@/util/object'
import { ElMessageBox } from 'element-plus'
import store from '@/store'

interface DictInfo {
  dictId: string | undefined,
  dictName: string | undefined,
  dictType: string | undefined,
  orderNum: number,
  status: number,
  note: string | undefined
}

const props = defineProps({
  dictId: {
    type: String
  },
  type: {
    type: String
  }
})
const emits = defineEmits(['update:modelValue', 'init', 'reset'])
const formRef = ref<any>(null)
const menuRef = ref<any>(null)
const form = ref<DictInfo>({
  dictId: undefined,
  dictName: undefined,
  dictType: undefined,
  orderNum: 0,
  status: 0,
  note: undefined,
})
const rules = ref({
  dictName: [
    {required: true, trigger: "blur", message: "请输入字典名称"}
  ],
  dictType: [
    {required: true, trigger: "blur", message: "请输入字典类型"}
  ],
  orderNum: [
    {required: true, trigger: "blur", message: "请输入角色顺序"}
  ],
})

const initDict = async (dictId: string) => {
  const res = await info(dictId)
  if (!isNull(res.data)) {
    form.value = res.data
  }
}

const handleClose = () => {
  emits('reset')
  resetFrom()
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

const resetFrom = () => {
  form.value = {
    dictId: undefined,
    dictName: undefined,
    dictType: undefined,
    orderNum: 0,
    status: 0,
    note: undefined,
  }
}

watch(
    () => props.dictId,
    () => {
      initDict(props.dictId!)
    },
    { deep: true, immediate: true }
)
</script>

<style scoped>
</style>
