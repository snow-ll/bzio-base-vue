<template>
  <el-card class="search-container">
    <el-row :gutter="10">
      <el-col :span="7">
        <el-input v-model="queryParam.roleName" :placeholder="$t('table.username')" clearable ></el-input>
      </el-col>
      <el-button type="primary" :icon="Search" @click="initRoleList">
        {{ $t('operate.search') }}
      </el-button>
    </el-row>
  </el-card>

  <el-card>
    <el-button type="primary" size="small" @click="handleInfoDialog(null)">
      {{ $t('operate.add') }}
    </el-button>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column
          align="center"
          v-for="(item, index) in options"
          :prop="item.prop"
          :label="$t(`table.${item.label}`)"
          :key="index">
        <template v-slot="{ row }" v-if="item.prop === 'status'">
          <Dict dictType="enable_type" :key="dictKey" :dictValue="row.status" :timeout="500"></Dict>
        </template>
        <template #default="{ row }" v-else-if="item.prop === 'action'">
          <el-button type="primary" size="small" @click="handleInfoDialog(row)">编辑</el-button>
          <el-button type="danger" size="small" @click="delRole(row.roleId)">删除</el-button>
          <el-button type="danger" size="small" @click="assignRole(row.roleId)">分配角色</el-button>
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
import Info from './components/info.vue'
import router from "@/router";

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
  {
    label: 'action',
    prop: 'action',
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

const handleInfoDialog = (row : Role | null) => {
  if (isNull(row)) {
    dialog.value.type = 'add'
  } else {
    dialog.value.type = 'edit'
    dialog.value.roleId = row?.roleId ?? ''
  }
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

const assignRole = (roleId: string) => {
  router.push({
    name: 'assignRole',
    params: {
      id: roleId
    },
  })
}

const resetDialog = () => {
  dialog.value.roleId = ''
}
</script>

<style lang="scss" scoped>

</style>
