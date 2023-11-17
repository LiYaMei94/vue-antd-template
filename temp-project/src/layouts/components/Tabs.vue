<template>
  <div
    class="tabs-box"
    :style="{
      padding: state.global.tabsMenuList?.length
        ? `${contentPadding} ${contentMarginRight} ${contentPadding} ${contentMarginLeft}`
        : `${contentPadding} ${contentMarginRight} 0 ${contentMarginLeft}`
    }"
  >
    <div class="tabs-menu">
      <a-tabs v-model:activeKey="activeKey" hide-add type="editable-card">
        <a-tab-pane v-for="item in state.global.tabsMenuList" :key="item.path">
          <template #tab>
            <span class="tab-text" @click="navigatorChange($event, item.path)">
              {{ item.title }}
            </span>
          </template>
          <template #closeIcon>
            <IconSvg name="tab-cancel" class="tab-cancel" @click="handleRemove($event, item.path)"></IconSvg>
          </template>
        </a-tab-pane>
        <!-- <template #leftExtra>
          <div class="extra-icon-wrap" @click="scrollPrev" :style="{ width: showExtra ? '25px' : '0' }">
            <LeftOutlined v-if="showExtra">左边</LeftOutlined>
          </div>
        </template>
        <template #rightExtra>
          <div class="extra-icon-wrap" @click="scrollNext" :style="{ width: showExtra ? '25px' : '0' }">
            <RightOutlined v-if="showExtra"></RightOutlined>
          </div>
        </template> -->
      </a-tabs>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import _ from 'lodash';
import { CONST_STRING_0 } from '@/utils/const';
import { contentMarginRight, contentMarginLeft, contentPadding } from '@/assets/style/variables.module.less';

const { state, dispatch } = useStore();
const route = useRoute();
const router = useRouter();
const activeKey = ref(route.fullPath);
let navListDom = null;
let tabMenuWidth = ref(900);
let navScroll = 0;

const props = defineProps({
  showScrollButton: {
    type: Boolean,
    default: true
  }
});

// 监听路由的变化（防止浏览器后退/前进不变化 activeKey)
watch(
  () => route.fullPath,
  () => {
    if (route.meta.pageLayout === CONST_STRING_0) return;
    activeKey.value = route.fullPath;
  },
  { immediate: true }
);

onMounted(() => {
  try {
    navListDom = document.getElementsByClassName('ant-tabs-nav-list') && document.getElementsByClassName('ant-tabs-nav-list')[0];
    // 监听元素大小
    const observer = new ResizeObserver(handleResize);
    if (navListDom) {
      observer.observe(navListDom, { box: 'border-box' });
      tabMenuWidth.value = navListDom?.clientWidth;
      const navScrollDom = document.getElementsByClassName('ant-tabs-nav-wrap') && document.getElementsByClassName('ant-tabs-nav-wrap')[0];
      navScroll = navScrollDom?.clientWidth;
    }
  } catch (error) {
    console.error('layouts-Tabs-onMounted', error);
  }
});

// tabMenu元素大小监听
const handleResize = () => {
  tabMenuWidth.value = navListDom?.clientWidth;
};

// 左右两边的切换按钮是否展示、
const showExtra = computed(() => {
  return tabMenuWidth.value > navScroll && props.showScrollButton;
});

const getTranslate = () => {
  const transX = document.defaultView.getComputedStyle(navListDom, null)?.transform;
  return transX.split(',');
};

// 前进
const scrollPrev = () => {
  if (navListDom) {
    const transX = getTranslate();
    const currentOffset = Math.abs(transX[4]);
    const transform = currentOffset > navScroll ? currentOffset - navScroll : 0;
    navListDom.style = `transform: translate(-${transform}px, 0px);`;
  }
};

// 后退
const scrollNext = () => {
  if (navListDom) {
    const transX = getTranslate();
    const currentOffset = Math.abs(transX[4]);
    const transform = tabMenuWidth.value - currentOffset > navScroll * 2 ? currentOffset + navScroll : tabMenuWidth.value - navScroll;
    navListDom.style = `transform: translate(-${transform}px, 0px);`;
  }
};

// 标签进入页面
const navigatorChange = (event, fullPath) => {
  router.push({ path: fullPath });
};

// 删除标签
const handleRemove = (event, fullPath) => {
  let lastIndex = 0;
  const tabsMenuList = _.cloneDeep(state.global?.tabsMenuList);
  _.remove(tabsMenuList, (item, index) => {
    lastIndex = index - 1;
    return item.path === fullPath;
  });
  dispatch('setTabsMenuList', tabsMenuList);
  //   删除当前高亮tab之后
  if (tabsMenuList.length && activeKey.value === fullPath) {
    if (lastIndex >= 0) {
      activeKey.value = tabsMenuList[lastIndex]?.path;
      router.push({ path: tabsMenuList[lastIndex]?.path });
    } else {
      activeKey.value = tabsMenuList[0]?.path;
      router.push({ path: tabsMenuList[0]?.path });
    }
  }
};
</script>

<style scoped lang="less">
.tabs-box {
  width: 100%;
  box-sizing: border-box;
  .tabs-menu {
    width: 100%;
    .tab-text {
      display: inline-block;
      height: 38px;
      line-height: 38px;
      padding-left: 16px;
    }
  }
  .extra-icon-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
}
</style>
