<template>
  <el-card class="search-container">
    <el-row :gutter="10">
      <el-col :span="7">
        <el-input v-model="queryParam.dictValue" :placeholder="$t('fields.dictName')" clearable ></el-input>
      </el-col>
      <el-button type="primary" :icon="Search" @click="initDataList">
        {{ $t('operate.search') }}
      </el-button>
    </el-row>
  </el-card>

  <el-card>
    <el-button type="primary" size="small" @click="handleInfoDialog(null, 'add')" v-if="$store.getters.perms.includes('sys:dict:add')">
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
          <Dict dictType="enable_type" :key="dictKey" :dictValue="row.status" :timeout="500"></Dict>
        </template>
      </el-table-column>
      <el-table-column
          align="center"
          prop="action"
          :label="$t('fields.action')"
          width="300px"
          v-if="includesAny($store.getters.perms, ['sys:dict:edit', 'sys:dict:search', 'sys:dict:delete'])"
      >
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="handleInfoDialog(row, 'edit')" v-if="$store.getters.perms.includes('sys:dict:edit')">{{ $t('operate.edit') }}</el-button>
          <el-button type="primary" size="small" @click="handleInfoDialog(row, 'view')" v-if="$store.getters.perms.includes('sys:dict:search')">{{ $t('operate.view') }}</el-button>
          <el-button type="danger" size="small" @click="delData(row.dictCode)" v-if="$store.getters.perms.includes('sys:dict:delete')">{{ $t('operate.del') }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <Pagination
        :queryParam="queryParam"
        :total="total"
        @pagination="initDataList"
    />
  </el-card>

  <Info v-model="dialog.visible" :type="dialog.type" :dictCode="dialog.dictCode" :dictType="dialog.dictType" @init="initDataList" @reset="resetDialog"></Info>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'
import { ref } from 'vue'
import { dataList, delData as del } from '@/api/system/dict'
import { isNull } from '@/util/object'
import { useRoute } from 'vue-router'
import { TableResponse } from '@/api/request'
import { setDictData } from '@/util/dict'
import { includesAny } from '@/util/array'
import Info from './components/data/info.vue'

interface DictData {
  dictCode: string
  dictValue: string
  dictLabel: string
  dictType: string
  status: number
  orderNum: number
}

interface Dialog {
  visible: boolean
  dictCode: string
  dictType: string
  type: string
}

const route = useRoute()
const queryParam = ref({
  dictType: route.params.dictType,
  dictValue: '',
  pageNum: 1,
  pageSize: 10,
})
const total = ref(0)
const tableData = ref<DictData[]>([])
const options = [
  {
    label: 'dictLabel',
    prop: 'dictLabel'
  },
  {
    label: 'dictValue',
    prop: 'dictValue'
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
  dictCode: '',
  dictType: '',
  type: '',
})
const dicts = ['enable_type']
const dictKey = ref(0);

setDictData(dicts)

const initDataList = async () => {
  const res : TableResponse<DictData> = await dataList(queryParam.value)
  total.value = res.total
  tableData.value = res.rows

  dictKey.value += 1
}
initDataList()

const handleInfoDialog = (row : DictData | null, type: string) => {
  if (!isNull(row)) {
    dialog.value.dictCode = row?.dictCode ?? ''
  }
  dialog.value.dictType = route.params.dictType.toString()
  dialog.value.type = type
  dialog.value.visible = true
}

const delData = (dictCode: string) => {
  ElMessageBox.confirm('确认删除字典项吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    del(dictCode)
    initDataList()
  }).catch(() => {

  })
}

const resetDialog = () => {
  dialog.value.dictCode = ''
}
</script>

<style lang="scss" scoped>

</style>
