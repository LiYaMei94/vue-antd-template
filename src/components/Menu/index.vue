<template>
  <a-menu v-bind="{ theme, mode, ...options }" v-model:openKeys="openKeys" v-model:selectedKeys="selectedKeys" @openChange="onOpenChange">
    <template v-for="item in menuList" :key="item.name">
      <template v-if="!item.children?.length">
        <a-menu-item :key="item.name" @click="routeChange($event, item)">
          <template #icon v-if="!isNull(item.meta?.icon)">
            <IconFont :type="item.meta?.icon" source="anticonfont"></IconFont>
          </template>
          <template v-if="item.path && !isFrame(item?.meta?.isFrame)">
            <router-link :to="{ path: item.path }">{{ item.meta?.title }}</router-link>
          </template>
          <template v-else-if="item.path && isFrame(item?.meta?.isFrame)">
            <a :href="item.path" target="_blank">{{ item.meta?.title }}</a>
          </template>
          <template v-else>{{ item.meta?.title }}</template>
        </a-menu-item>
      </template>
      <template v-else>
        <CustomSubMenu :mode="mode" :key="item.name" :menuInfo="item" :routeChange="routeChange" />
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
import { isNull, findTreeData } from '@/utils/utils';
import { CONST_STRING_1 } from '@/utils/const';

const { currentRoute, getRoutes } = useRouter();
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

const getOpenKeys = (parentName, openKeys) => {
  const fun = function (parentId) {
    const result = findTreeData(props.menuList, 'name', parentId);
    if (JSON.stringify(result) !== '{}' && result) {
      openKeys.push(result?.meta?.parentName);
      fun(result?.meta?.parentName);
    }
    return;
  };
  fun(parentName);
  return openKeys;
};

const isFrame = (flag) => {
  return flag !== CONST_STRING_1;
};

watch(
  () => currentRoute,
  (val) => {
    const modelName = unref(val).meta?.modelName;
    const name = unref(val)?.name;
    const parentName = unref(val).meta?.parentName;

    dispatch('setMenuModel', modelName);

    // 顶部菜单
    if (isTopMenu.value) {
      selectedKeys.value = modelName ? [modelName] : [name];
    }

    // 侧边栏
    if (!isTopMenu.value) {
      let keys = parentName ? [parentName] : [];
      keys = getOpenKeys(parentName, keys);

      selectedKeys.value = name ? [name] : [];
      openKeys.value = keys;
    }
  },
  { deep: true, immediate: true }
);

const onOpenChange = (keys) => {
  openKeys.value = props.isShowCurrent ? [keys[keys.length - 1]] : keys;
};

const routeChange = (event, to) => {
  if (isTopMenu.value) {
    dispatch('setMenuModel', to?.name);
  }

  if (state.global?.showTabs && !isTopMenu.value) {
    const flag = _.find(state.global.tabsMenuList, (item) => item.path === to.path);
    if (flag) {
      return;
    }
    const tabsMenuList = _.cloneDeep(state.global?.tabsMenuList);
    tabsMenuList.push({
      path: to.path,
      title: to?.meta?.title
    });
    dispatch('setTabsMenuList', tabsMenuList);
  }
};
</script>
