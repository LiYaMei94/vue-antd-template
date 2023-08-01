<template>
  <a-layout>
    <LayoutHeader v-model:theme="state.global.theme">
      <template #headerMenu>
        <div class="header-menu-left"></div>
        <div class="header-menu-right">
          <CustomMenu v-model:theme="state.global.theme" mode="horizontal" :menuList="state.user?.menuData?.top" type="top-menu"></CustomMenu>
        </div>
      </template>
    </LayoutHeader>
    <a-layout>
      <LayoutSider v-model:theme="state.global.theme"></LayoutSider>
      <div class="main">
        <PageTabs v-if="state.global.showTabs"></PageTabs>
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

const { state } = useStore();
</script>
