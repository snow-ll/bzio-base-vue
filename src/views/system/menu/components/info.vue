<template>
  <el-dialog
      :model-value="dialogVisible"
      :title="$t(`operate.${props.type}`) + $t('table.menu')"
      width="40%"
      @close="handleClose"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="auto">
      <el-row>
        <el-col :span="12" hidden="hidden">
          <el-form-item prop="menuId">
            <el-input v-model="form.menuId"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-row>
        <el-col :span="24">
          <el-form-item :label="$t('table.parentMenu')" prop="parentId">
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
          <el-form-item :label="$t('table.menuName')" prop="menuName">
            <el-input v-model="form.menuName"/>
          </el-form-item>
        </el-col>
        
        <el-col :span="12">
          <el-form-item :label="$t('table.orderNum')" prop="orderNum">
            <el-input-number  v-model="form.orderNum"></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item :label="$t('table.path')" prop="path">
            <el-input v-model="form.path"/>
          </el-form-item>
        </el-col>
        
        <el-col :span="12">
          <el-form-item :label="$t('table.component')" prop="component">
            <el-tooltip content="系统组件，用于区分i18n读取菜单名配置，实现中英文切换菜单" placement="top" >
              <el-input v-model="form.component"/>
            </el-tooltip>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item :label="$t('table.icon')" prop="icon">
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
      </el-row>
      
      <el-row>
        <el-col :span="12">
          <el-form-item :label="$t('table.visible')" prop="visible">
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

        <el-col :span="12">
          <el-form-item :label="$t('table.menu') + $t('table.status')" prop="status">
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
        <el-col :span="12">
          <el-form-item :label="$t('table.isFrame')" prop="isFrame">
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

        <el-col :span="12">
          <el-form-item :label="$t('table.perms')" prop="perms">
            <el-tooltip content="控制器中定义的权限字符，如：@PreAuthorize(`@ss.hasPerm('system:user:list')`)" placement="top" >
              <el-input v-model="form.perms"/>
            </el-tooltip>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">
          {{ $t('operate.cancel') }}
        </el-button>
        <el-button type="primary" @click="handleSave">
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
  menuType: undefined,
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
// const treeProps = {
//   id: 'id',
//   label: 'label',
// }

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

// const load = async (node: any, resolve: any) => {
//   // 加载一个根节点
//   if (typeof node.data.value === 'undefined') {
//     return resolve([
//       {
//         value: null,
//         label: "根节点",
//         level: treeProps.level++
//       }
//     ]);
//   }
//  
//   if (node.data.isLeaf) return resolve([])
//   const result = await child(node.data.value)
//   const childs = result.data.map((item: any) => ({
//     value: item.menuId,
//     label: item.menuName,
//     isLeaf: item.isLeaf != 0,
//     isRoot: false,
//     level: treeProps.level++
//   }))
//   resolve(childs)
// }

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
    menuType: undefined,
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
</script>

<style scoped>

</style>
