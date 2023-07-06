<template>
  <el-card>
    <el-card class="search-container">
      <el-row :gutter="10">
        <el-col :span="7">
          <el-input v-model="queryParam.username" :placeholder="$t('fields.username')" clearable ></el-input>
        </el-col>
        <el-col :span="7">
          <el-input v-model="queryParam.nickname" :placeholder="$t('fields.nickname')" clearable ></el-input>
        </el-col>
        <el-button type="primary" :icon="Search" @click="initUserList">
          {{ $t('operate.search') }}
        </el-button>
      </el-row>
    </el-card>
    
    <el-button type="primary" size="small" @click="handleInfoDialog()" v-if="$store.getters.perms.includes('sys:role:add')">
      {{ $t('operate.add') }}
    </el-button>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column
          align="center"
          v-for="(item, index) in options"
          :prop="item.prop"
          :label="$t(`fields.${item.label}`)"
          :key="info"
      >
        <template v-slot="{ row }" v-if="item.prop === 'status'">
          <el-switch
              v-model="row.status"
              :active-value="0"
              :inactive-value="1"
              disabled
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column
          align="center"
          prop="action"
          :label="$t('fields.action')"
          v-if="$store.getters.perms.includes('sys:role:auth')"
      >
        <template #default="{ row }">
          <el-button type="danger" size="small" @click="delUser(row.userId)">取消授权</el-button>
        </template>
      </el-table-column>
    </el-table>

    <Pagination
        :queryParam="queryParam"
        :total="total"
        @pagination="initUserList"
    />
  </el-card>

  <Auth v-model="dialog.visible" :roleId="queryParam.roleId" @init="initUserList"></Auth>
</template>

<script lang="ts" setup>
import { ElMessageBox } from 'element-plus'
import { ref } from 'vue'
import { queryUserByRole, cancel } from '@/api/system/userRole'
import { TableResponse } from '@/api/request'
import { useRoute } from 'vue-router'
import { type User } from '@/views/system/user/index.vue'
import Auth from '../../auth.vue'

interface Dialog {
  visible: boolean
}

const route = useRoute()
const queryParam = ref({
  roleId: route.params.roleId,
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
})

const initUserList = async () => {
  const res : TableResponse<User> = await queryUserByRole(queryParam.value)
  total.value = res.total
  tableData.value = res.rows
}
initUserList()

const handleInfoDialog = async () => {
  dialog.value.visible = true
}

const delUser = (userId: string) => {
  ElMessageBox.confirm('确认取消授权用户吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    cancel({
      userId: userId,
      roleId: queryParam.value.roleId
    })
    initUserList()
  }).catch(() => {

  })
}
</script>

<style lang="scss" scoped>

</style>
