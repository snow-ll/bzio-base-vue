<template>
  <el-card class="search-container">
    <el-row :gutter="10">
      <el-col :span="7">
        <el-input v-model="queryParam.dictName" :placeholder="$t('table.dictName')" clearable ></el-input>
      </el-col>
      <el-button type="primary" :icon="Search" @click="initDictList">
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
          :label="$t(`table.${item.label}`)"
          :key="index"
      >
        <template v-slot="{ row }" v-if="item.prop === 'dictType'">
          <a style="color:blue;cursor:pointer" @click="data(row.dictType)">{{ row.dictType }}</a>
        </template>
        <template v-slot="{ row }" v-else-if="item.prop === 'status'">
          <Dict dictType="enable_type" :key="dictKey" :dictValue="row.status" :timeout="500"></Dict>
        </template>
      </el-table-column>
      <el-table-column
          align="center"
          prop="action"
          :label="$t('table.action')"
          width="300px"
          v-if="includesAny($store.getters.perms, ['sys:dict:edit', 'sys:dict:search', 'sys:dict:delete'])"
      >
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="handleInfoDialog(row, 'edit')" v-if="$store.getters.perms.includes('sys:dict:edit')">{{ $t('operate.edit') }}</el-button>
          <el-button type="primary" size="small" @click="handleInfoDialog(row, 'view')" v-if="$store.getters.perms.includes('sys:dict:search')">{{ $t('operate.view') }}</el-button>
          <el-button type="danger" size="small" @click="delDict(row.dictType)" v-if="$store.getters.perms.includes('sys:dict:delete')">{{ $t('operate.del') }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <Pagination
        :queryParam="queryParam"
        :total="total"
        @pagination="initDictList"
    />
  </el-card>
  
  <Info v-model="dialog.visible" :type="dialog.type" :dictId="dialog.dictId" @init="initDictList" @reset="resetDialog"></Info>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'
import { ref } from 'vue'
import { list, del } from '@/api/system/dict'
import { isNull } from '@/util/object'
import { TableResponse } from '@/api/request'
import { setDictData } from '@/util/dict'
import { includesAny } from '@/util/array'
import router from '@/router'
import Info from '@/views/system/dict/components/info.vue'

interface DictType {
  dictId: string
  dictName: string
  dictType: string
  status: number
}

interface Dialog {
  visible: boolean
  dictId: string
  type: string
}

const queryParam = ref({
  dictName: '',
  pageNum: 1,
  pageSize: 10,
})
const total = ref(0)
const tableData = ref<DictType[]>([])
const options = [
  {
    label: 'dictName',
    prop: 'dictName'
  },
  {
    label: 'dictType',
    prop: 'dictType'
  },
  {
    label: 'status',
    prop: 'status'
  },
  {
    label: 'note',
    prop: 'note'
  },
]
const dialog = ref<Dialog>({
  visible: false,
  dictId: '',
  type: '',
})
const dicts = ['enable_type']
const dictKey = ref(0);

setDictData(dicts)

const initDictList = async () => {
  const res : TableResponse<DictType> = await list(queryParam.value)
  total.value = res.total
  tableData.value = res.rows

  dictKey.value += 1
}
initDictList()

const handleInfoDialog = (row : DictType | null, type: string) => {
  if (!isNull(row)) {
    dialog.value.dictId = row?.dictId ?? ''
  }
  dialog.value.type = type
  dialog.value.visible = true
}

const delDict = (dictType: string) => {
  ElMessageBox.confirm('确认删除字典吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    del(dictType)
    initDictList()
  }).catch(() => {

  })
}

const data = (dictType: string) => {
  router.push({
    name: 'data',
    params: {
      dictType: dictType
    },
  })
}

const resetDialog = () => {
  dialog.value.dictId = ''
}
</script>

<style lang="scss" scoped>

</style>
