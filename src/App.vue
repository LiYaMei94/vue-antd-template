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
import { onMounted } from 'vue';
import { usePermission } from '@/hooks/usePermission';
import db from '@/utils/db';
import { isNull } from '@/utils/utils';
import { ACCESS_TOKEN } from '@/utils/const';

const DB = new db();

const { dispatch, state } = useStore();
const { getUserData, setDefaultMenu } = usePermission();
// 设置日期组件语言
dayjs.locale('en');

// 初始化主题
const { initTheme } = useTheme();

onMounted(async () => {
  const token = DB.getLocal(ACCESS_TOKEN);
  const isPermission = process.env?.VUE_APP_route_permission === 'true';
  initTheme();
  // TODO:用户信息
  // if (!isNull(token)) {
  //   await getUserData();
  // }

  if (!isPermission) {
    await setDefaultMenu();
  }
});
</script>
<style></style>
