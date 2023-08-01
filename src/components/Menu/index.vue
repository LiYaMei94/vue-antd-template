<template>
  <a-menu
    :mode="mode"
    :theme="theme"
    v-bind="{ ...options }"
    v-model:openKeys="openKeys"
    v-model:selectedKeys="selectedKeys"
    @openChange="onOpenChange"
  >
    <template v-for="item in menuList" :key="item.key">
      <template v-if="!item.children?.length">
        <a-menu-item :key="item.key" @click="routeChange($event, item)">
          <template #icon>
            <component :is="item.meta?.icon"></component>
          </template>
          <template v-if="item.path && !item?.meta?.isLink">
            <router-link :to="{ path: item.path }">{{ item.meta?.title }}</router-link>
          </template>
          <template v-else-if="item.path && item?.meta?.isLink">
            <a :href="item.path" target="_blank">{{ item.meta?.title }}</a>
          </template>
          <template v-else>{{ item.meta?.title }}</template>
        </a-menu-item>
      </template>
      <template v-else>
        <CustomSubMenu :mode="mode" :key="item.key" :menuInfo="item" :routeChange="routeChange" />
      </template>
    </template>
  </a-menu>
</template>
<script setup>
import { defineProps, unref, ref, watch, computed } from 'vue';
import { LIGHT_THEME } from '@/config/theme';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import _ from 'lodash';

const { currentRoute } = useRouter();
const { state, dispatch } = useStore();

const props = defineProps({
  menuList: {
    type: Array,
    default: []
  },
  theme: {
    type: String,
    default: LIGHT_THEME
  },
  mode: {
    type: String,
    default: 'inline'
  },
  type: {
    type: String,
    default: 'side-menu'
  },
  options: {
    type: Object,
    default: {
      triggerSubMenuAction: 'click',
      inlineCollapsed: false
    }
  }
});
const openKeys = ref([]);
const selectedKeys = ref([]);
const isTopMenu = computed(() => props.type === 'top-menu');

watch(
  () => currentRoute,
  (val) => {
    const activeMenu = unref(val).meta?.activeMenu;
    const parentID = unref(val).meta?.parentID;

    // 顶部菜单
    if (isTopMenu.value) {
      selectedKeys.value = parentID ? [parentID] : [activeMenu];
    }

    // 侧边栏
    if (!isTopMenu.value) {
      selectedKeys.value = activeMenu ? [activeMenu] : parentID ? [parentID] : [];
      openKeys.value = parentID ? [parentID] : [activeMenu];
    }
  },
  { deep: true, immediate: true }
);

const onOpenChange = (keys) => {
  openKeys.value = props.isShowCurrent ? [keys[keys.length - 1]] : keys;
};

const routeChange = (event, to) => {
  const isSide = !to.meta?.type?.includes('top');
  if (state.global.showTabs && isSide) {
    const flag = _.find(state.global.tabsMenuList, (item) => item.path === to.path);
    if (flag) {
      return;
    }
    const tabsMenuList = _.cloneDeep(state.global.tabsMenuList);
    tabsMenuList.push({
      path: to.path,
      title: to?.meta?.title
    });
    dispatch('setTabsMenuList', tabsMenuList);
  }
};
</script>
