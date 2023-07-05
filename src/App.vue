<template>
  <a-config-provider :locale="zhCN" v-bind="{ ...state.global.antConfig }">
    <router-view />
  </a-config-provider>
</template>

<script setup>
import { useTheme } from '@/hooks/useTheme';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import { useStore } from 'vuex';
import { allEnum } from '@/apis';

const { dispatch, state } = useStore();
// 设置日期组件语言
dayjs.locale('en');

// 初始化主题
const { initTheme } = useTheme();
initTheme();

allEnum()
  .then((res) => {
    const allEnumData = res?.data;
    dispatch('setAllEnum', allEnumData);
  })
  .catch((error) => {});
</script>

<style>
@import url('@/assets/style/common.less');
</style>
