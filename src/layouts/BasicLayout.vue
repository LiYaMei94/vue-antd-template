<template>
  <a-layout style="position: relative">
    <LayoutHeader v-model:theme="state.global.theme">
      <template #headerMenu>
        <div class="header-menu-left"><Project></Project></div>
        <div class="header-menu-right" v-if="topMenuData?.length">
          <CustomMenu v-model:theme="state.global.theme" mode="horizontal" :menuList="topMenuData" type="top-menu"></CustomMenu>
        </div>
      </template>
    </LayoutHeader>
    <a-layout style="margin-top: 64px">
      <LayoutSider v-model:theme="state.global.theme" v-if="sideMenuData?.length"></LayoutSider>
      <div class="main">
        <PageTabs v-if="state.global.showTabs && sideMenuData.length"></PageTabs>
        <a-layout-content><router-view /></a-layout-content>
      </div>
    </a-layout>
  </a-layout>
</template>
<script setup>
import LayoutSider from './LayoutSider';
import LayoutHeader from './LayoutHeader';
import PageTabs from './components/Tabs';
import { useStore } from 'vuex';
import { computed } from 'vue';
import Project from './components/Project';

const { state } = useStore();
const topMenuData = computed(() => {
  return state?.user?.menuData?.top[state?.global?.menuModel] || [];
});
const sideMenuData = computed(() => {
  return state?.user?.menuData?.side[state?.global?.menuTopModel] || [];
});
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
