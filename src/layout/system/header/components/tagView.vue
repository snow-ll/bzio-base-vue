<template>
  <div class="tags-view-container">
    <div class="tags-view">
      <div
          class="tags-view-item"
          :class="{ active: activeView === view.name }"
          v-for="(view, index) in viewList"
          :key="view.name"
          @click="onTagClick(view.name)"
          ref="tagItems"
      >
        {{ $t(`menus.${view.name}`) }}
        <el-icon
            class="tags-view-close"
            v-show="viewList.length > 1 && index !== 0"
            @click.stop.prevent="onTagClose(view.name)"
            :key="view.name + '-close'"
            :title="$t('close')"
        >x</el-icon>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { RouteRecordName } from 'vue-router'
import { ElIcon } from 'element-plus'

const store = useStore()
const router = useRouter()
const activeView = computed(() => store.getters.activeView)
const viewList = computed(() => store.getters.viewList)

const onTagClick = (viewName: RouteRecordName) => {
  router.push({ name: viewName })
}

const onTagClose = (viewName: RouteRecordName) => {
  store.commit('router/REMOVE_VIEW', viewName)
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
</style>
