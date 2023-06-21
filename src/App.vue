<template>
  <a-config-provider :locale="{ lang: 'zh-CN' }">
    <router-view />
  </a-config-provider>
</template>

<script setup>
import { useTheme } from '@/hooks/useTheme';

// 初始化主题
const { initTheme } = useTheme();
initTheme();
</script>

<style>
@import url('@/assets/style/common.less');
</style>
