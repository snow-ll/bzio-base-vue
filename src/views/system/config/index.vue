<template>
  <el-card class="search-container">
    <el-row :gutter="10">
      <el-col :span="7">
        <el-input v-model="queryParam.configName" :placeholder="$t('fields.configName')" clearable ></el-input>
      </el-col>
      <el-button type="primary" :icon="Search" @click="initConfigList">
        {{ $t('operate.search') }}
      </el-button>
    </el-row>
  </el-card>

  <el-card>
    <el-button type="primary" size="small" @click="handleInfoDialog(null, 'add')" v-if="$store.getters.perms.includes('sys:config:add')">
      {{ $t('operate.add') }}
    </el-button>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column
          align="center"
          v-for="(item, index) in options"
          :prop="item.prop"
          :label="$t(`fields.${item.label}`)"
          :key="index"
      >
        <template v-slot="{ row }" v-if="item.prop === 'status'">
          <el-switch
              v-model="row.status"
              :active-value="0"
              :inactive-value="1"
              :disabled="!$store.getters.perms.includes('sys:config:edit')"
              @change="handleStatusChange(row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column
          align="center"
          prop="action"
          :label="$t('fields.action')"
          v-if="includesAny($store.getters.perms, ['sys:config:edit', 'sys:config:search', 'sys:config:delete'])"
      >
        <template v-slot="{ row }">
          <el-button type="primary" size="small" @click="handleInfoDialog(row, 'edit')" v-if="$store.getters.perms.includes('sys:config:edit')">{{ $t('operate.edit') }}</el-button>
          <el-button type="primary" size="small" @click="handleInfoDialog(row, 'view')" v-if="$store.getters.perms.includes('sys:config:search')">{{ $t('operate.view') }}</el-button>
          <el-button type="danger" size="small" @click="delConfig(row.configId)" v-if="$store.getters.perms.includes('sys:config:delete')">{{ $t('operate.del') }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <Pagination
        :queryParam="queryParam"
        :total="total"
        @pagination="initConfigList"
    />
  </el-card>

  <Info v-model="dialog.visible" :configId="dialog.configId" :type="dialog.type" @init="initConfigList" @reset="resetDialog"/>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'
import { ref } from 'vue'
import { list, del } from '@/api/system/config'
import { isNull } from '@/util/object'
import { TableResponse } from '@/api/request'
import { setDictData } from '@/util/dict'
import { includesAny } from '@/util/array'
import Info from '@/views/system/config/components/info.vue'

export interface Config {
  configId: string
  configName: string
  configKey: string
  configValue: string
  note: string
}

interface Dialog {
  visible: boolean
  configId: string | undefined
  type: string
}

const queryParam = ref({
  configName: '',
  pageNum: 1,
  pageSize: 10,
})
const total = ref(0)
const tableData = ref<Config[]>([])
const options = [
  {
    label: 'configName',
    prop: 'configName'
  },
  {
    label: 'configKey',
    prop: 'configKey'
  },
  {
    label: 'configValue',
    prop: 'configValue'
  },
  {
    label: 'note',
    prop: 'note'
  },
]
const dialog = ref<Dialog>({
  visible: false,
  configId: '',
  type: '',
})
const dicts = ['enable_type', 'sex_type']

setDictData(dicts)

const initConfigList = async () => {
  const res : TableResponse<Config> = await list(queryParam.value)
  total.value = res.total
  tableData.value = res.rows
}
initConfigList()


const handleInfoDialog = async (row: Config | null, type: string) => {
  if (!isNull(row)) {
    dialog.value.configId = row?.configId ?? ''
  }
  dialog.value.type = type
  dialog.value.visible = true
}

const delConfig = (configId: string) => {
  ElMessageBox.confirm('确认删除系统配置吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    del(configId)
    initConfigList()
  }).catch(() => {

  })
}

const resetDialog = () => {
  dialog.value.configId = undefined
}
</script>

<style lang="scss" scoped>

</style>
