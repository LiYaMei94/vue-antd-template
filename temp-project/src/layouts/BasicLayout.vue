<template>
  <a-layout style="position: relative">
    <LayoutHeader v-model:theme="state.global.theme" ref="layoutHeaderRef">
      <template #headerMenu>
        <div class="header-menu-left">
          <!-- TODO: 只有施工管理才有-->
          <!-- <Project></Project> -->
        </div>
        <div class="header-menu-right" v-if="topMenuData?.length">
          <CustomMenu v-model:theme="state.global.theme" mode="horizontal" :menuList="topMenuData" type="top-menu"></CustomMenu>
        </div>
      </template>
    </LayoutHeader>
    <a-layout :style="{ 'margin-top': headerHeight }">
      <LayoutSider v-model:theme="state.global.theme" :style="{ 'padding-top': `8px` }" v-if="sideMenuData?.length"></LayoutSider>
      <div
        class="main"
        :style="{
          marginLeft: sideMenuData?.length ? (state?.global?.layoutSiderCollapsed ? siderCollapsedWidth : siderWidth) : 0,
          width: sideMenuData?.length
            ? state?.global?.layoutSiderCollapsed
              ? `calc(100% - ${siderCollapsedWidth})`
              : `calc(100% - ${siderWidth})`
            : '100%'
        }"
      >
        <PageTabs v-if="state.global.showTabs && sideMenuData.length"></PageTabs>
        <a-layout-content style="display: flex; height: calc(100vh - 64px - 16px)"><router-view /></a-layout-content>
      </div>
    </a-layout>
  </a-layout>
</template>
<script setup>
import LayoutSider from './LayoutSider';
import LayoutHeader from './LayoutHeader';
import PageTabs from './components/Tabs';
import { useStore } from 'vuex';
import { computed, ref } from 'vue';
import Project from './components/Project';
import { siderWidth, siderCollapsedWidth, headerHeight } from '@/assets/style/variables.module.less';

const { state } = useStore();
const layoutHeaderRef = ref(null);
const topMenuData = computed(() => {
  return state?.user?.menuData?.top[state?.global?.menuModel] || [];
});
const sideMenuData = computed(() => {
  return state?.user?.menuData?.side[state?.global?.menuTopModel] || [];
});
const modelVisible = computed(() => layoutHeaderRef.value?.modelVisible);
</script>
<style lang="less">
.header-menu-left {
  width: 300px;
}
.header-menu-right {
  width: calc(100% - 300px - 84px);
  text-align: right;
  .ant-menu-horizontal {
    justify-content: flex-end;
  }
  .ant-menu-item .ant-menu-item-icon,
  .ant-menu-item .anticon,
  .ant-menu-submenu-title .ant-menu-item-icon,
  .ant-menu-submenu-title .anticon {
    font-size: 12px;
  }
}
</style>
