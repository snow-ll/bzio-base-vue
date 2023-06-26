<template>
  <el-dialog
      :model-value="dialogVisible"
      :title="$t(`operate.${props.type}`) + $t('table.dept')"
      width="40%"
      @close="handleClose"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="auto" :disabled="props.type === 'view'">
      <el-row>
        <el-col :span="12" hidden="hidden">
          <el-form-item :label="$t('table.deptId')" prop="deptId">
            <el-input v-model="form.deptId"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item :label="$t('table.parentDept')" prop="parentId">
            <el-tree-select
                v-model="form.parentId"
                :data="data"
                node-key="id"
                check-strictly
                :render-after-expand="false"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item :label="$t('table.deptName')" prop="deptName">
            <el-input v-model="form.deptName"/>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :label="$t('table.orderNum')" prop="orderNum">
            <el-input-number v-model="form.orderNum"></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item :label="$t('table.leader')" prop="leader">
            <el-input v-model="form.leader"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :label="$t('table.phone')" prop="phone">
            <el-input v-model="form.phone"/>
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-row>
        <el-col :span="12">
          <el-form-item :label="$t('table.email')" prop="email">
            <el-input v-model="form.email"></el-input>
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
import { tree, save, info } from '@/api/system/dept'
import { ElMessageBox } from 'element-plus'
import { isNull } from '@/util/object'

interface DeptInfo {
  deptId: string | undefined,
  deptName: string | undefined,
  parentId: string | undefined,
  parentName: string | undefined,
  orderNum: number,
  leader: string | undefined,
  phone: string | undefined,
  email: string | undefined,
  status: number,
}

const props = defineProps({
  deptId: {
    type: String
  },  
  parentId: {
    type: String
  },
  type: {
    type: String
  },
  key: {
    type: Number,
    default: 0
  }
})
const emits = defineEmits(['update:modelValue', 'init', 'reset'])

const formRef = ref<any>(null)
const form = ref<DeptInfo>({
  deptId: undefined,
  deptName: undefined,
  parentId: undefined,
  parentName: undefined,
  leader: undefined,
  phone: undefined,
  email: undefined,
  orderNum: 0,
  status: 0,
})
const rules = ref({
  deptName: [
    {required: true, trigger: "blur", message: "请输入工作单位名称"}
  ],
  parentId: [
    {required: true, trigger: "blur", message: "请选择上级单位"}
  ],
})
const data = ref()

const initDept = async (menuId: string) => {
  const res = await info(menuId)
  if (!isNull(res.data)) {
    form.value = res.data
  }
}
const loadData = () => {
  tree(null).then(res => {
    data.value = res.data
  })
}
loadData()

const select = () => {
  if (form.value.parentId === props.deptId) {
    ElMessageBox.alert("不能选择自身菜单！", '提示', {
      confirmButtonText: '确定',
      type: 'warning'
    })
    form.value.parentId = ''
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

const resetForm = ()=> {
  form.value = {
    deptId: undefined,
    deptName: undefined,
    parentName: undefined,
    parentId: undefined,
    leader: undefined,
    phone: undefined,
    email: undefined,
    orderNum: 0,
    status: 0,
  }
}

watch(
    () => props.deptId,
    () => {
      initDept(props.deptId!)
    },
    { deep: true, immediate: true },
)

watch(
    () => props.parentId,
    () => {
      form.value.parentId = props.parentId
    },
    { deep: true, immediate: true },
)

watch(
    () => props.key,
    () => {
      loadData()
    },
    { deep: true, immediate: true },
)
</script>

<style scoped>

</style>
