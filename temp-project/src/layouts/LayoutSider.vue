<template>
  <a-layout-sider :collapsed="state?.global?.layoutSiderCollapsed" :theme="theme" collapsible class="layout-sider">
    <template #trigger>
      <div class="ant-layout-sider-trigger-icon" @click="handleCollapsed">
        <component :is="state?.global?.layoutSiderCollapsed ? 'MenuUnfoldOutlined' : 'MenuFoldOutlined'"></component>
      </div>
    </template>
    <CustomMenu :theme="theme" mode="inline" :menuList="menuData" type="side-menu"></CustomMenu>
  </a-layout-sider>
</template>

<script setup>
import { computed, ref, unref, watch } from 'vue';
import { LIGHT_THEME } from '@/config/theme';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

const { state, dispatch } = useStore();

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

const menuData = computed(() => {
  return state?.user?.menuData?.side[state?.global?.menuTopModel] || [];
});

const handleCollapsed = () => {
  dispatch('setLayoutSiderCollapsed', !state?.global?.layoutSiderCollapsed);
};
</script>
<style lang="less" scoped>
.layout-sider {
  overflow: auto;
  height: calc(100vh - @headerHeight);
  position: fixed;
  left: 0px;
  top: @headerHeight;
  bottom: 0;
  z-index: 1;
  flex: 0 0 @siderWidth!important;
  max-width: @siderWidth!important;
  min-width: @siderWidth!important;
  width: @siderWidth!important;
}
</style>
