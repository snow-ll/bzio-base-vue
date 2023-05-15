<template>
  <div class="hamburger-container" @click="toggleClick">
    <svg-icon :icon="icon" />
  </div>
</template>

<script setup>
import { useStore } from 'vuex'
import { computed } from 'vue'

const store = useStore()
const icon = computed(() => {
  return store.getters.sideType ? 'hamburger-opened' : 'hamburger-closed'
})

const toggleClick = () => {
  store.commit('CHANGE_SIDE_TYPE')
}
</script>

<style lang="scss" scoped>
.hamburger-container {
  margin-right: 16px;
  box-sizing: border-box;
  cursor: pointer;
}
</style>
