<template>
  <el-card class="search-container">
    <el-row :gutter="10">
      <el-col :span="7">
        <el-input v-model="queryParam.roleName" :placeholder="$t('table.roleName')" clearable ></el-input>
      </el-col>
      <el-button type="primary" :icon="Search" @click="initRoleList">
        {{ $t('operate.search') }}
      </el-button>
    </el-row>
  </el-card>

  <el-card>
    <el-button type="primary" size="small" @click="handleInfoDialog(null, 'add')" v-if="$store.getters.perms.includes('sys:role:add')">
      {{ $t('operate.add') }}
    </el-button>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column
          align="center"
          v-for="(item, index) in options"
          :prop="item.prop"
          :label="$t(`table.${item.label}`)"
          :key="index"
      >
        <template v-slot="{ row }" v-if="item.prop === 'status'">
          <Dict dictType="enable_type" :key="dictKey" :dictValue="row.status" :timeout="500"></Dict>
        </template>
      </el-table-column>
      <el-table-column
          align="center"
          prop="action" 
          :label="$t('table.action')"
          width="300px"
          v-if="includesAny($store.getters.perms, ['sys:role:edit', 'sys:role:search', 'sys:role:delete', 'sys:role:auth'])"
      >
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="handleInfoDialog(row, 'edit')" v-if="$store.getters.perms.includes('sys:role:edit')">{{ $t('operate.edit') }}</el-button>
          <el-button type="primary" size="small" @click="handleInfoDialog(row, 'view')" v-if="$store.getters.perms.includes('sys:role:search')">{{ $t('operate.view') }}</el-button>
          <el-button type="danger" size="small" @click="delRole(row.roleId)" v-if="$store.getters.perms.includes('sys:role:delete')">{{ $t('operate.del') }}</el-button>
          <el-button type="primary" size="small" @click="auth(row.roleId)" v-if="$store.getters.perms.includes('sys:role:auth')">{{ $t('operate.auth') }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <Pagination
        :queryParam="queryParam"
        :total="total"
        @pagination="initRoleList"
    />
  </el-card>

  <Info v-model="dialog.visible" :type="dialog.type" :roleId="dialog.roleId" @init="initRoleList" @reset="resetDialog"></Info>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'
import { ref } from 'vue'
import { list, del } from '@/api/system/role'
import { isNull } from '@/util/object'
import { TableResponse } from '@/api/request'
import { setDictData } from '@/util/dict'
import { includesAny } from '@/util/array'
import Info from './components/info.vue'
import router from '@/router'

interface Role {
  roleId: string
  roleName: string
  roleKey: string
  roleSort: string
  status: number
}

interface Dialog {
  visible: boolean
  roleId: string
  type: string
}

const queryParam = ref({
  roleName: '',
  pageNum: 1,
  pageSize: 10,
})
const total = ref(0)
const tableData = ref<Role[]>([])
const options = [
  {
    label: 'roleName',
    prop: 'roleName'
  },
  {
    label: 'roleKey',
    prop: 'roleKey'
  },
  {
    label: 'orderNum',
    prop: 'orderNum'
  },
  {
    label: 'status',
    prop: 'status'
  },
]
const dialog = ref<Dialog>({
  visible: false,
  roleId: '',
  type: '',
})
const dicts = ['enable_type']
const dictKey = ref(0);

setDictData(dicts)

const initRoleList = async () => {
  const res : TableResponse<Role> = await list(queryParam.value)
  total.value = res.total
  tableData.value = res.rows

  dictKey.value += 1 
}
initRoleList()

const handleInfoDialog = (row : Role | null, type: string) => {
  if (!isNull(row)) {
    dialog.value.roleId = row?.roleId ?? ''
  }
  dialog.value.type = type
  dialog.value.visible = true
}

const delRole = (roleId: string) => {
  ElMessageBox.confirm('确认删除角色吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    del(roleId)
    initRoleList()
  }).catch(() => {

  })
}

const auth = (roleId: string) => {
  router.push({
    name: 'auth',
    params: {
      roleId: roleId
    },
  })
}

const resetDialog = () => {
  dialog.value.roleId = ''
}
</script>

<style lang="scss" scoped>

</style>
