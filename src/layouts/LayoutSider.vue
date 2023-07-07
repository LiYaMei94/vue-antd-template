<template>
  <a-layout-sider v-model:collapsed="collapsed" :theme="theme" collapsible>
    <template #trigger>
      <component :is="collapsed ? 'MenuUnfoldOutlined' : 'MenuFoldOutlined'"></component>
    </template>
    <a-menu
      :theme="theme"
      triggerSubMenuAction="click"
      mode="inline"
      :inlineCollapsed="false"
      v-model:openKeys="openKeys"
      v-model:selectedKeys="selectedKeys"
      @openChange="onOpenChange"
    >
      <template v-for="item in sideMenuList" :key="item.key">
        <template v-if="!item.children?.length">
          <a-menu-item :key="item.key">
            <template #icon>
              <component :is="item.meta?.icon"></component>
            </template>
            <template v-if="item.name">
              <router-link :to="{ name: item.name }">{{ item.meta?.title }}</router-link>
            </template>
            <template v-else>{{ item.meta?.title }}</template>
          </a-menu-item>
        </template>
        <template v-else>
          <CustomSubMenu :key="item.key" :menuInfo="item" />
        </template>
      </template>
    </a-menu>
  </a-layout-sider>
</template>

<script setup>
import { computed, ref, unref } from 'vue';
import { LIGHT_THEME } from '@/theme';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

const { currentRoute } = useRouter();
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

const currentRouteKey = unref(currentRoute).meta?.activeMenu;
const openKeys = ref(['1']);
const selectedKeys = ref([currentRouteKey]);
const collapsed = ref(false);
const sideMenuList = computed(() => {
  return state?.user?.sideMenuList;
});

const onOpenChange = (keys) => {
  openKeys.value = props.isShowCurrent ? [keys[keys.length - 1]] : keys;
  selectedKeys.value = [];
};
</script>

<style lang="less" scope></style>
