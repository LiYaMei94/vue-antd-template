<template>
  <a-layout-sider v-model:collapsed="collapsed" :theme="theme" collapsible>
    <template #trigger>
      <component :is="collapsed ? 'MenuUnfoldOutlined' : 'MenuFoldOutlined'"></component>
    </template>
    <CustomMenu :theme="theme" mode="inline" :menuList="state?.user?.menuData?.side" type="side-menu"></CustomMenu>
  </a-layout-sider>
</template>

<script setup>
import { computed, ref, unref } from 'vue';
import { LIGHT_THEME } from '@/config/theme';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

const { state } = useStore();

const props = defineProps({
  theme: {
    type: String,
    default: LIGHT_THEME
  },
  isShowCurrent: {
    type: Boolean,
    default: true
  }
});

const collapsed = ref(false);
</script>

<style lang="less" scope></style>
