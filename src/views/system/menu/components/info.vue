<template>
  <el-dialog
      :model-value="dialogVisible"
      :title="$t(`operate.${props.type}`) + $t('fields.menu')"
      width="40%"
      @close="handleClose"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="auto" :disabled="props.type === 'view'">
      <el-row>
        <el-col :span="12" hidden="hidden">
          <el-form-item prop="menuId">
            <el-input v-model="form.menuId"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-row>
        <el-col :span="12">
          <el-form-item :label="$t('fields.parentMenu')" prop="parentId">
            <el-tree-select
                v-model="form.parentId"
                :data="data"
                node-key="id"
                check-strictly
                :render-after-expand="false"
                @change="select"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item :label="$t('fields.menuName')" prop="menuName">
            <el-input v-model="form.menuName"/>
          </el-form-item>
        </el-col>
        
        <el-col :span="12">
          <el-form-item :label="$t('fields.orderNum')" prop="orderNum">
            <el-input-number  v-model="form.orderNum"></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item :label="$t('fields.menuType')" prop="menuType">
            <el-radio-group v-model="form.menuType" @change="handleMenuTypeChange">
              <el-radio label="catalogue">目录</el-radio>
              <el-radio label="menu">菜单</el-radio>
              <el-radio label="button">按钮</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12" v-if="form.menuType!=='button'">
          <el-form-item :label="$t('fields.path')" prop="path">
            <el-tooltip content="调用后台接口的地址" placement="top" >
              <el-input v-model="form.path"/>
            </el-tooltip>
          </el-form-item>
        </el-col>
        
        <el-col :span="12" v-if="form.menuType==='menu'">
          <el-form-item :label="$t('fields.component')" prop="component">
            <el-tooltip content="组件路由" placement="top" >
              <el-input v-model="form.component"/>
            </el-tooltip>
          </el-form-item>
        </el-col>

        <el-col :span="12" v-if="form.menuType!=='button'">
          <el-form-item :label="$t('fields.icon')" prop="icon">
            <el-select v-model="form.icon">
              <el-option
                  v-for="item in icons"
                  :label="item"
                  :value="item"
                  :key="item"
              >
                <svg-icon :icon="item" /><span>{{ item }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :label="$t('fields.perms')" prop="perms">
            <el-tooltip content="控制器中定义的权限字符，如：@PreAuthorize(`@ss.hasPerm('system:user:list')`)" placement="top" >
              <el-input v-model="form.perms"/>
            </el-tooltip>
          </el-form-item>
        </el-col>
        
        <el-col :span="12" v-if="form.menuType!=='button'">
          <el-form-item :label="$t('fields.visible')" prop="visible">
            <el-radio-group v-model="form.visible">
              <el-radio
                  v-for="dict in toRaw(store.getters.dict).get('visible_type')"
                  :key="dict.dictValue"
                  :label="Number(dict.dictValue)"
              >
                {{ dict.dictLabel }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>

        <el-col :span="12" v-if="form.menuType!=='button'">
          <el-form-item :label="$t('fields.menu') + $t('fields.status')" prop="status">
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
        
        <el-col :span="12" v-if="form.menuType!=='button'">
          <el-form-item :label="$t('fields.isFrame')" prop="isFrame">
            <el-radio-group v-model="form.isFrame">
              <el-radio
                  v-for="dict in toRaw(store.getters.dict).get('yes_no_type')"
                  :key="dict.dictValue"
                  :label="Number(dict.dictValue)"
              >
                {{ dict.dictLabel }}
              </el-radio>
            </el-radio-group>
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
import { tree } from '@/api/system/menu'
import { toRaw } from '@vue/reactivity'
import { isNull } from '@/util/object'
import { info, save } from '@/api/system/menu'
import { ElMessageBox } from 'element-plus'
import store from '@/store'
import icons from '@/util/icon'

interface MenuInfo {
  menuId: string | undefined,
  menuName: string | undefined,
  parentName: string | undefined,
  parentId: string | undefined,
  orderNum: number | undefined,
  path: string | undefined,
  component: string | undefined,
  isFrame: number,
  menuType: string | undefined,
  visible: number,
  status: number,
  perms: string | undefined,
  icon: string | undefined,
}

const props = defineProps({
  type: {
    type: String
  },
  menuId: {
    type: String
  },
  parentId: {
    type: String
  },
  key: {
    type: Number,
    default: 0
  }
})
const emits = defineEmits(['update:modelValue', 'init', 'reset'])

const formRef = ref<any>(null)
const form = ref<MenuInfo>({
  menuId: undefined,
  menuName: undefined,
  parentName: undefined,
  parentId: undefined,
  orderNum: 0,
  path: undefined,
  component: undefined,
  isFrame: 0,
  menuType: 'menu',
  visible: 0,
  status: 0,
  perms: undefined,
  icon: undefined,
})
const rules = ref({
  parentName: [
    {required: true, trigger: "blur", message: "请选择上级目录"}
  ],
  menuName: [
    {required: true, trigger: "blur", message: "请输入目录名称"}
  ],
  orderNum: [
    {required: true, trigger: "blur", message: "请输入菜单书讯"}
  ],
  component: [
    {required: true, trigger: "blur", message: "请输入组件路径"}
  ],
})
const data = ref()

const loadData = () => {
  tree(null).then(res => {
    data.value = res.data
  })
}
loadData()

const select = () => {
  if (form.value.parentId === props.menuId) {
    ElMessageBox.alert("不能选择自身菜单！", '提示', {
      confirmButtonText: '确定',
      type: 'warning'
    })
    form.value.parentId = ''
  }
}


const initMenu = async (menuId: string) => {
  const res = await info(menuId)
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

const handleMenuTypeChange = (value: string) => {
  form.value.menuType = value
}

const resetForm = ()=> {
  form.value = {
    menuId: undefined,
    menuName: undefined,
    parentName: undefined,
    parentId: undefined,
    orderNum: 0,
    path: undefined,
    component: undefined,
    isFrame: 0,
    menuType: 'menu',
    visible: 0,
    status: 0,
    perms: undefined,
    icon: undefined,
  }
}

watch(
    () => props.menuId,
    () => {
      initMenu(props.menuId!)
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
