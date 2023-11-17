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
import { onMounted, watch, unref } from 'vue';
import { usePermission } from '@/hooks/usePermission';
import DB from '@/utils/db';
import { isNull } from '@/utils/utils';
import { ACCESS_TOKEN } from '@/utils/const';
import { useRouter } from 'vue-router';

const { currentRoute, getRoutes } = useRouter();
const { dispatch, state } = useStore();
const { getUserData } = usePermission();
// 设置日期组件语言
dayjs.locale('en');

// 初始化主题
const { initTheme } = useTheme();

watch(
  () => currentRoute,
  (val) => {
    const modelName = unref(val).meta?.modelName;
    const topName = unref(val).meta?.topName;

    isNull(state?.global?.menuModel) && !isNull(modelName) && dispatch('setMenuModel', modelName);
    isNull(state?.global?.menuTopModel) && !isNull(topName) && dispatch('setMenuTopModel', topName);
  },
  { deep: true, immediate: true }
);

onMounted(async () => {
  const token = DB.getLocal(ACCESS_TOKEN);
  const isPermission = process.env?.VUE_APP_route_permission === 'true';
  initTheme();
  // 用户信息
  if (!isNull(token)) {
    await getUserData();
  }
});
</script>
<style></style>
