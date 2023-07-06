<template>
  <el-dialog
      :model-value="dialogVisible"
      :title="$t(`operate.${props.type}`) + $t('fields.role')"
      width="50%"
      @close="handleClose"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="auto" :disabled="props.type === 'view'">
      <el-row>
        <el-col :span="12" hidden="hidden">
          <el-form-item :label="$t('fields.roleId')" prop="userId">
            <el-input v-model="form.roleId"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item :label="$t('fields.roleName')" prop="roleName">
            <el-input v-model="form.roleName" ></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item :label="$t('fields.roleKey')" prop="roleKey">
            <el-input v-model="form.roleKey"/>
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-row>
        <el-col :span="24">
          <el-form-item :label="$t('fields.orderNum')" prop="orderNum">
            <el-input-number  v-model="form.orderNum"></el-input-number>
          </el-form-item>
        </el-col>

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
        <el-form-item label="菜单权限">
          <el-col>
            <el-checkbox v-model="menuRole.menuExpand" @change="handleCheckedTreeExpand($event, 'menu')">展开/折叠</el-checkbox>
            <el-checkbox v-model="menuRole.menuNodeAll" @change="handleCheckedTreeNodeAll($event, 'menu')">全选/全不选</el-checkbox>
            <el-checkbox v-model="form.menuCheckStrictly" @change="handleCheckedTreeConnect($event, 'menu')">父子联动</el-checkbox>
          </el-col>
          
          <el-col>
            <el-tree
                class="tree-border"
                :data="menuOptions"
                show-checkbox
                ref="menuRef"
                node-key="id"
                :default-expanded-keys="menuChecked"
                :check-strictly="!form.menuCheckStrictly"
                :props="defaultProps"
            ></el-tree>
          </el-col>
        </el-form-item>
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
import { save, info } from '@/api/system/role'
import { queryMenuIds } from '@/api/system/roleMenu'
import { tree } from '@/api/system/menu'
import { toRaw } from '@vue/reactivity'
import { isNull } from '@/util/object'
import { ElMessageBox } from 'element-plus'
import store from '@/store'

interface RoleInfo {
  roleId: string | undefined,
  roleName: string | undefined,
  roleKey: string | undefined,
  orderNum: number,
  status: number,
  menuCheckStrictly: boolean,
  menuIds: string[],
}

const props = defineProps({
  roleId: {
    type: String
  },
  type: {
    type: String
  }
})
const emits = defineEmits(['update:modelValue', 'init', 'reset'])
const formRef = ref<any>(null)
const menuRef = ref<any>(null)
const form = ref<RoleInfo>({
  roleId: undefined,
  roleName: undefined,
  roleKey: undefined,
  orderNum: 0,
  status: 0,
  menuCheckStrictly: true,
  menuIds: [],
})
const rules = ref({
  roleName: [
    {required: true, trigger: "blur", message: "请输入角色名称"}
  ],
  roleKey: [
    {required: true, trigger: "blur", message: "请输入权限字符"}
  ],
  orderNum: [
    {required: true, trigger: "blur", message: "请输入角色顺序"}
  ],
})
const menuRole = ref({
  menuExpand: false,
  menuNodeAll: false,
})
const menuOptions = ref()
const menuChecked = ref()
const defaultProps = ref({
  children: "children",
  label: "label"
})

const initRole = async (roleId: string) => {
  const res = await info(roleId)
  if (!isNull(res.data)) {
    form.value = res.data
  }
  await getMenuOptions()
  await getMenuChecked(roleId)
}

const getMenuOptions = async () => {
  const res = await tree(null)
  menuOptions.value = res.data
}

const getMenuChecked = async (roleId: string) => {
  const res = await queryMenuIds(roleId)
  menuChecked.value = res.data
  res.data.map((item: string) => {
    menuRef.value.setChecked(item, true, false)
  })
}

/**
 * 展开/折叠菜单
 */
const handleCheckedTreeExpand = (value: any, type: string) => {
  if (type == 'menu') {
    let treeList = menuOptions.value;
    for (let i = 0; i < treeList.length; i++) {
      menuRef.value.store.nodesMap[treeList[i].id].expanded = value;
    }
  }
}

/**
 * 菜单数据全选
 */
const handleCheckedTreeNodeAll = (value: any, type: string) => {
  if (type == 'menu') {
    menuRef.value.setCheckedNodes(value ? menuOptions.value: [])
  }
}

/**
 * 是否关联父菜单
 */
const handleCheckedTreeConnect = (value: any, type: string) => {
  if (type == 'menu') {
    form.value.menuCheckStrictly = value ? true: false;
  }
}

/**
 * 选中菜单节点数据
 */
const getCheckedMenu = () => {
  // 目前被选中的菜单节点
  let checkedKeys = menuRef.value.getCheckedKeys();
  // 半选中的菜单节点
  let halfCheckedKeys = menuRef.value.getHalfCheckedKeys();
  checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
  return checkedKeys;
}

const handleClose = () => {
  emits('reset')
  resetFrom()
  emits('update:modelValue', false)
}

const handleSave = () => {
  formRef.value!.validate((valid: any) => {
    if(valid) {
      if (!isNull(getCheckedMenu())) {
        form.value.menuIds = getCheckedMenu();
      }
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
    roleId: undefined,
    roleName: undefined,
    roleKey: undefined,
    orderNum: 0,
    status: 0,
    menuCheckStrictly: true,
    menuIds: [],
  }
  menuOptions.value = []
}

watch(
    () => props.roleId,
    () => {
      initRole(props.roleId!)
    },
    { deep: true, immediate: true }
)
</script>

<style scoped>
</style>
