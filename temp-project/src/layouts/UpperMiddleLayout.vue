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
    <a-layout-content><router-view /></a-layout-content>
  </a-layout>
</template>
<script setup>
import LayoutHeader from './LayoutHeader';
import { useStore } from 'vuex';
import { reactive, unref } from 'vue';

const { state } = useStore();
</script>

<style lang="less" scoped>
.header-menu-left {
  margin-left: 30px;
}
.header-menu-right {
  margin-right: 30px;
}
</style>
