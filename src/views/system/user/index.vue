<template>
  <el-card class="search-container">
    <el-row :gutter="10">
      <el-col :span="7">
        <el-input v-model="queryParam.username" :placeholder="$t('table.username')" clearable ></el-input>
      </el-col>      
      <el-col :span="7">
        <el-input v-model="queryParam.nickname" :placeholder="$t('table.nickname')" clearable ></el-input>
      </el-col>
      <el-button type="primary" :icon="Search" @click="initUserList">
        {{ $t('operate.search') }}
      </el-button>
    </el-row>
  </el-card>
  
  <el-card>
    <el-button type="primary" size="small" @click="handleInfoDialog(null, 'add')" v-if="$store.getters.perms.includes('sys:user:add')">
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
          <el-switch
              v-model="row.status"
              :active-value="0"
              :inactive-value="1"
              :disabled="!$store.getters.perms.includes('sys:user:edit')"
              @change="handleStatusChange(row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column 
          align="center"
          prop="action"
          :label="$t('table.action')"
          v-if="includesAny($store.getters.perms, ['sys:user:edit', 'sys:user:search', 'sys:user:delete'])"
      >
        <template v-slot="{ row }">
          <el-button type="primary" size="small" @click="handleInfoDialog(row, 'edit')" v-if="$store.getters.perms.includes('sys:user:edit')">{{ $t('operate.edit') }}</el-button>
          <el-button type="primary" size="small" @click="handleInfoDialog(row, 'view')" v-if="$store.getters.perms.includes('sys:user:search')">{{ $t('operate.view') }}</el-button>
          <el-button type="danger" size="small" @click="delUser(row.username)" v-if="$store.getters.perms.includes('sys:user:delete')">{{ $t('operate.del') }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <Pagination
        :queryParam="queryParam"
        :total="total"
        @pagination="initUserList"
    />
  </el-card>
  
  <Info v-model="dialog.visible" :userId="dialog.userId" :type="dialog.type" @init="initUserList" @reset="resetDialog"/>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'
import { ref } from 'vue'
import { list, changeStatus, del } from '@/api/system/user'
import { isNull } from '@/util/object'
import { TableResponse } from '@/api/request'
import { setDictData } from '@/util/dict'
import Info from './components/info.vue'
import { includesAny } from '@/util/array'

export interface User {
  userId: string
  username: string
  nickname: string
  birthday: string
  deptName: string
  status: number
}

interface Dialog {
  visible: boolean
  userId: string | undefined
  type: string
}

const queryParam = ref({
  username: '',
  nickname: '',
  pageNum: 1,
  pageSize: 10,
})
const total = ref(0)
const tableData = ref<User[]>([])
const options = [
  {
    label: 'username',
    prop: 'username'
  },
  {
    label: 'nickname',
    prop: 'nickname'
  },
  {
    label: 'birthday',
    prop: 'birthday'
  },
  {
    label: 'deptName',
    prop: 'deptName'
  },
  {
    label: 'status',
    prop: 'status'
  },
]
const dialog = ref<Dialog>({
  visible: false,
  userId: '',
  type: '',
})
const dicts = ['enable_type', 'sex_type']

setDictData(dicts)

const initUserList = async () => {
  const res : TableResponse<User> = await list(queryParam.value)
  total.value = res.total
  tableData.value = res.rows
}
initUserList()

const handleStatusChange = (row: User) => {
  let text = (row.status === 0) ? "启用" : "停用";
  ElMessageBox.confirm(
      '确认要"' + text + '""' + row.username + '"用户吗？'
  ).then(() => {
    changeStatus(row.userId, row.status)
  }).catch(function() {
    row.status = row.status === 0 ? 1 : 0;
  });
}

const handleInfoDialog = async (row: User | null, type: string) => {
  if (!isNull(row)) {
    dialog.value.userId = row?.userId ?? ''
  }
  dialog.value.type = type
  dialog.value.visible = true
}

const delUser = (username: string) => {
  ElMessageBox.confirm('确认删除用户吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    del(username)
    initUserList()
  }).catch(() => {

  })
}

const resetDialog = () => {
  dialog.value.userId = undefined
}
</script>

<style lang="scss" scoped>

</style>
