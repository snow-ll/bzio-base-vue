<template>
  <el-config-provider :locale="locale">
    <router-view/>
  </el-config-provider>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import en from 'element-plus/dist/locale/en.mjs'

const i18n = useI18n()
const language = computed(() => {
  return i18n.locale.value
})
const locale = computed(() => (language.value.includes('zh-CN') ? zhCn : en))
const _ResizeObserver = window.ResizeObserver;

const debounce = (fn, delay) => {
  let timer = null;
  return function () {
    let context = this;
    let args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function () {
      fn.apply(context, args);
    }, delay);
  }
}

/**
 * 解决ResizeObserver异常
 */
window.ResizeObserver = class ResizeObserver extends _ResizeObserver{
  constructor(callback) {
    callback = debounce(callback, 16);
    super(callback);
  }
}
</script>

<style lang="scss">

</style>
