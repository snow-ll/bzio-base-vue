<template>
  <div class="tags-view-container">
    <div class="tags-view">
      <div
          class="tags-view-item"
          :class="{ active: activeView === view.name }"
          v-for="(view, index) in viewList"
          :id="view.name"
          :key="view.name"
          @click="onTagClick(view.path)"
          @contextmenu.prevent.native="handleChange(view, $event)"
          ref="tagItems"
      >
        {{ $t(`menus.${view.name}`) }}
        <el-icon
            class="tags-view-close"
            v-show="viewList.length > 1 && index !== 0"
            @click.stop.prevent="onTagClose(view.name)"
            :key="view.name + '-close'"
            :title="$t('operate.close')"
        >x</el-icon>
      </div>
    </div>


    <div
        v-show="contMenu.isShowContMenu"
        class="operation_right clearfix"
        :style="{left: contMenu.offsetX +'px',top: contMenu.offsetY+'px'}"
        @mouseleave="contMenu.isShowContMenu = false"
    >
      <div class="operation_right_li" @click="onTagClose(activeView)">
        关闭
      </div>
      <div class="operation_right_li" @click="onTagCloseOthers">
        关闭其他
      </div>
      <div class="operation_right_li" @click="onTagCloseAll">
        关闭全部
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { RouteRecordName } from 'vue-router'
import { ElIcon } from 'element-plus'
import { View } from '@/store/modules/router'

const store = useStore()
const router = useRouter()
const activeView = computed(() => store.getters.activeView)
const viewList = computed(() => store.getters.viewList)
const currentView = ref<View>()

let contMenu = ref({
  offsetX: 0,
  offsetY: 0,
  isShowContMenu: false,
})

const handleChange = (v: View, e: any) => {
  if (v.path !== '/') {
    contMenu.value.isShowContMenu = true
    contMenu.value.offsetX = e.clientX
    contMenu.value.offsetY = e.clientY
    currentView.value = v
  }
}

const onTagClick = (viewName: string) => {
  router.push({ path: viewName })
}

const onTagClose = (viewName: RouteRecordName) => {
  store.dispatch('router/removeView', viewName)
  closeContMenu()
}

const onTagCloseOthers = () => {
  store.dispatch('router/removeOthers', currentView.value)
  closeContMenu()
}

const onTagCloseAll = (viewName: RouteRecordName) => {
  store.dispatch('router/revertView', viewName)
  closeContMenu()
}

const closeContMenu = () => {
  contMenu.value.isShowContMenu = false
}
</script>

<style scoped>
.tags-view-container {
  display: flex;
  align-items: center;
  height: 60px;
  background-color: #fff;
  border-bottom: 1px solid #ebeef5;
  padding: 0 20px;
}

.tags-view {
  display: flex;
  align-items: center;
}

.tags-view-item {
  display: flex;
  align-items: center;
  padding: 0 20px;
  height: 40px;
  line-height: 40px;
  background-color: transparent;
  cursor: pointer;
  transition: background-color 0.3s;
  color: #606266;
}

.tags-view-item.active {
  background-color: #f0f2f5;
}

.tags-view-close {
  margin-left: 5px;
  font-size: 14px;
  cursor: pointer;
  color: #909399;
}

/* 右键菜单 */
.operation_right {
    position: fixed;
    background: white;
    z-index: 1700;
    box-shadow: 0 0 5px;
    width: 100px;
    border-radius: 3px;
}
.operation_right_li {
  line-height: 32px;
  text-align: center;
  width: 100%;
  font-size: 13px;
  cursor: pointer;
  text-align: left;
  padding: 0 12px;
}

.operation_right_li:hover {
  color: #1890ff;
}
</style>
