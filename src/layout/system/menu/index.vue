<template>
<!--  <el-menu-->
<!--      active-text-color="#ffd04b"-->
<!--      background-color="#304156"-->
<!--      class="el-menu-vertical-demo"-->
<!--      text-color="#fff"-->
<!--      router-->
<!--      unique-opened-->
<!--      :collapse="!$store.getters.sideType"-->
<!--  >-->
<!--    <el-sub-menu :index="item.id" v-for="item in menuList" :key="item.id">-->
<!--      <template #title>-->
<!--        <div>-->
<!--          <svg-icon :icon=item.icon />-->
<!--        </div>-->
<!--        <span>-->
<!--          {{ $t(`menus.${item.component}`) }}-->
<!--        </span>-->
<!--      </template>-->
<!--      <el-menu-item :index="it.path" v-for="it in item.children" :key="it.id">-->
<!--        <svg-icon :icon=it.icon />-->
<!--        {{ $t(`menus.${it.component}`) }}-->
<!--      </el-menu-item>-->
<!--    </el-sub-menu>-->
<!--  </el-menu>-->

  <el-menu
      active-text-color="#ffd04b"
      background-color="#304156"
      class="el-menu-vertical-demo"
      text-color="#fff"
      router
      unique-opened
      :collapse="!$store.getters.sideType"
  >
    <SubMenu v-for="item in menuList" :key="item.path" :item="item"></SubMenu>
  </el-menu>
</template>

<script setup>
import { ref } from 'vue'
import { getRouter } from '@/api/system/login'
import { isNull } from '@/util/object'
import SubMenu from './subMenu.vue'
import store from '@/store'

const menuList = ref([])
const initMenuList = async() => {
  if (isNull(store.getters.router)) {
    const res = await getRouter()
    menuList.value = res.data
  } else {
    menuList.value = store.getters.router
  }
}
initMenuList()
</script>

<style scoped>

</style>
