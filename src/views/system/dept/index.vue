<template>
  <el-card class="search-container">
    <el-row :gutter="10">
      <el-col :span="7">
        <el-input v-model="queryParam.deptName" :placeholder="$t('fields.deptName')" clearable ></el-input>
      </el-col>
      <el-button type="primary" :icon="Search" @click="initDeptList">
        {{ $t('operate.search') }}
      </el-button>
    </el-row>
  </el-card>

  <el-card>
    <el-tooltip content="单选选择一列，在当前级别新建（选中高亮）" placement="top" >
      <el-button type="primary" size="small" @click="handleInfoDialog(null)" v-if="$store.getters.perms.includes('sys:dept:add')">
        {{ $t('operate.add') }}
      </el-button>
    </el-tooltip>
    <el-button type="primary" size="small" @click="delDept(null)" v-if="$store.getters.perms.includes('sys:dept:delete')">
      {{ $t('operate.del') }}
    </el-button>
    <el-table 
        style="width: 100%"
        row-key="id"
        highlight-current-row
        :data="tableData"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        @current-change="handleCurrentChange"
        @selection-change="handleSelectionChange"
    >
      <el-table-column
          align="center"
          v-for="(item, index) in options"
          :prop="item.prop"
          :label="$t(`fields.${item.label}`)"
          :key="index"
      >
        <template v-slot="{ row }" v-if="item.prop === 'label'">
          <a style="color:blue;cursor:pointer" @click="handleInfoDialog(row)">{{ row.label }}</a>
        </template>
        <template v-slot="{ row }" v-else-if="item.prop === 'select'">
          <el-table-column type="selection" width="55"></el-table-column>
        </template>
        <template v-slot="{ row }" v-else-if="item.prop === 'status'">
          <Dict :key="dictKey" dictType="enable_type" :dictValue="row.status" :timeout="500"></Dict>
        </template>
      </el-table-column>
    </el-table>

    <Pagination
        :queryParam="queryParam"
        :total="total"
        @pagination="initDeptList"
    />
  </el-card>

  <Info v-model="dialog.visible" :deptId="dialog.deptId" :type="dialog.type" :key="dictKey" :parentId="dialog.parentId" @init="initDeptList" @reset="resetDialog"/>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'
import { ref } from 'vue'
import { useStore } from 'vuex'
import { tree, delBatch } from '@/api/system/dept'
import { isNull } from '@/util/object'
import { AjaxResponse } from '@/api/request'
import { includesAny } from '@/util/array'
import { setDictData } from '@/util/dict'
import Info from './components/info.vue'

export interface Dept {
  id: string
  label: string
  pid: string
  parentName: string
  orderNum: number
  status: number
}

interface Dialog {
  visible: boolean
  deptId: string | undefined
  parentId: string | undefined
  type: string
}

const store = useStore()
const queryParam = ref({
  deptName: '',
  pageNum: 1,
  pageSize: 10,
})
const total = ref(0)
const tableData = ref<Dept[]>([])
const options = [
  {
    label: 'select',
    prop: 'select'
  },
  {
    label: 'deptName',
    prop: 'label'
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
  deptId: '',
  parentId: '',
  type: '',
})
const ids: string[] = []
const currentId = ref<string>()
const dicts = ['enable_type']
const dictKey = ref(0);
setDictData(dicts)

const initDeptList = async () => {
  const res : AjaxResponse<Dept[]> = await tree(queryParam.value)
  tableData.value = res.data!
  
  dictKey.value += 1
}
initDeptList()

const handleCurrentChange = (dept: Dept) => {
  if (!isNull(dept)) {
    currentId.value = dept.id
  }
}

const handleSelectionChange = (selection: Dept[]) => {
  ids.splice(0, ids.length);
  selection.map(item => {
    ids.push(item.id)
  })
}

const handleInfoDialog = (row : Dept | null) => {
  // 判断是否包含权限
  if (!includesAny(store.getters.perms, ['sys:menu:search', 'sys:menu:edit'])) {
    return;
  }
  
  if (isNull(row)) {
    dialog.value.type = 'add'
    dialog.value.parentId = currentId.value
  } else {
    if (store.getters.perms.includes('sys:menu:edit')) {
      dialog.value.type = 'edit'
    } else {
      dialog.value.type = 'view'
    }
    dialog.value.deptId = row?.id ?? ''
    dialog.value.parentId = row?.pid ?? ''
  }
  dialog.value.visible = true
}

const delDept = () => {
  if (isNull(ids)) {
    alert("请至少选择一条需要删除的数据")
  } else {
    ElMessageBox.confirm('确认删除部门吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      delBatch(ids)
          .catch(()=> {
            ElMessageBox.alert("删除失败！", '提示', {
              confirmButtonText: '确定',
              type: 'warning'
            })
          })
      initDeptList()
    })
  }
}

const resetDialog = () => {
  dialog.value.deptId = undefined
}
</script>

<style lang="scss" scoped>
</style>
