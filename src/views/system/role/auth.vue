<template>
  <el-dialog
      :model-value="dialogVisible"
      :title="$t('fields.user') + $t(`operate.auth`)"
      width="55%"
      @close="handleClose"
  >
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

    <el-card>
      <el-table 
          :data="tableData" 
          style="width: 100%"
          @selection-change="handleSelectionChange"
      >
        <el-table-column
            align="center"
            v-for="(item, index) in options"
            :prop="item.prop"
            :label="$t(`fields.${item.label}`)"
            :key="index">
          <template v-slot="{ row }" v-if="item.prop === 'select'">
            <el-table-column type="selection" width="55"></el-table-column>
          </template>
        </el-table-column>
      </el-table>

      <Pagination
          :queryParam="queryParam"
          :total="total"
          @pagination="initUserList"
      />
    </el-card>

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
import { Search } from '@element-plus/icons-vue'
import { ref } from "vue";
import { queryUserByRole } from '@/api/system/userRole'
import { authUser } from '@/api/system/userRole'
import { TableResponse } from '@/api/request'
import { type User } from '@/views/system/user/index.vue'

const props = defineProps({
  roleId: {
    type: String
  }
})
const emits = defineEmits(['update:modelValue', 'init'])

const queryParam = ref({
  roleId: props.roleId,
  username: '',
  nickname: '',
  isRoleId: true,
  pageNum: 1,
  pageSize: 10,
})
const total = ref(0)
const tableData = ref<User[]>([])
const options = [
  {
    label: 'select',
    prop: 'select'
  },
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
]
const selectUserIds: string[] = []

const initUserList = async () => {
  const res : TableResponse<User> = await queryUserByRole(queryParam.value)
  total.value = res.total
  tableData.value = res.rows
}
initUserList()

const handleSelectionChange = (selection: User[]) => {
  selectUserIds.splice(0, selectUserIds.length);
  selection.map(item => {
    selectUserIds.push(item.userId)
  })
}

const handleClose = () => {
  initUserList()
  emits('update:modelValue', false)
  emits('init', false)
}

const handleSave = () => {
  const data = {
    userIds: selectUserIds,
    roleId: props.roleId
  }
  authUser(data).then(() => {
    initUserList()
    handleClose()
  })
}
</script>

<style scoped>

</style>
