<template>
  <el-card>
    <el-row :gutter="10">
      <el-col :span="7">
        <el-input v-model="queryParam.menuName" :placeholder="$t('fields.menuName')" clearable ></el-input>
      </el-col>
      <el-button type="primary" :icon="Search" @click="initMenuList">
        {{ $t('operate.search') }}
      </el-button>
    </el-row>
  </el-card>
  
  <br>

  <el-card>
    <el-tooltip content="单选选择一列，在当前级别新建（选中高亮）" placement="top" >
      <el-button type="primary" size="small" @click="handleInfoDialog(null)" v-if="$store.getters.perms.includes('sys:menu:add')">
        {{ $t('operate.add') }}
      </el-button>
    </el-tooltip>
    
    <el-button type="primary" size="small" @click="delMenu()" v-if="$store.getters.perms.includes('sys:user:delete')">
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
  </el-card>
  
  <Info v-model="dialog.visible" :type="dialog.type" :key="dictKey" :menuId="dialog.menuId" :parentId="dialog.parentId" @init="initMenuList" @reset="resetDialog"/>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useStore } from 'vuex'
import { tree, delBatch } from '@/api/system/menu'
import { setDictData } from '@/util/dict'
import { AjaxResponse } from '@/api/request'
import { isNull } from '@/util/object'
import { ElMessageBox } from 'element-plus'
import { includesAny } from '@/util/array'
import Info from './components/info.vue'

export interface Menu {
  id: string,
  pid: string,
  label: string,
  orderNum: string
  status: number
  createDate: Date
}

interface Dialog {
  visible: boolean
  type: string
  menuId: string
  parentId: string
}

const store = useStore()
const queryParam = ref({
  menuName: '',
})
const tableData = ref<Menu[]>([])
const options = [
  {
    label: 'select',
    prop: 'select'
  },
  {
    label: 'menuName',
    prop: 'label'
  },
  {
    label: 'perms',
    prop: 'perms'
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
    label: 'createDate',
    prop: 'createDate'
  },
]
const dialog = ref<Dialog>({
  visible: false,
  type: '',
  menuId: '',
  parentId: ''
})
const ids: string[] = []
const currentId = ref<string>()
const dicts = ['enable_type', 'yes_no_type', 'visible_type']
const dictKey = ref(0);

setDictData(dicts)

const initMenuList = async () => {
  const res : AjaxResponse<Menu[]> = await tree(queryParam.value)
  tableData.value = res.data!

  dictKey.value += 1
}
initMenuList()

const handleCurrentChange = (menu: Menu) => {
  if (!isNull(menu)) {
    currentId.value = menu.id
  }
}

const handleSelectionChange = (selection: Menu[]) => {
  ids.splice(0, ids.length);
  selection.map(item => {
    ids.push(item.id)
  })
}

const delMenu = () => {
  if (isNull(ids)) {
    alert("请至少选择一条需要删除的数据")
  } else {
    ElMessageBox.confirm('确认删除菜单吗？', '提示', {
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
      initMenuList()
    })
  }
}

const handleInfoDialog = (row : Menu | null) => {
  // 判断是否包含权限
  if (!includesAny(store.getters.perms, ['sys:menu:search', 'sys:menu:edit'])) {
    return;
  }
  
  if (isNull(row)) {
    dialog.value.type = 'add'
    dialog.value.parentId = currentId.value ?? ''
  } else {
    if (store.getters.perms.includes('sys:menu:edit')) {
      dialog.value.type = 'edit'
    } else {
      dialog.value.type = 'view'
    }
    dialog.value.menuId = row?.id ?? ''
    dialog.value.parentId = row?.pid ?? ''
  }
  dialog.value.visible = true
}

const resetDialog = () => {
  dialog.value.menuId = ''
  dialog.value.parentId = ''
}
</script>

<style lang="scss" scoped>

</style>
