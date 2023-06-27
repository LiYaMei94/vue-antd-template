<template>
  <a-config-provider :locale="zhCN">
    <router-view />
  </a-config-provider>
</template>

<script setup>
import { useTheme } from '@/hooks/useTheme';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';

// 设置日期组件语言
dayjs.locale('en');

// 初始化主题
const { initTheme } = useTheme();
initTheme();
</script>

<style>
@import url('@/assets/style/common.less');
</style>
