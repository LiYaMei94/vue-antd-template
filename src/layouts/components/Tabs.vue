<template>
  <div class="tabs-box" :style="{ padding: state.global.tabsMenuList?.length > 0 ? '4px 10px' : 0 }">
    <div class="tabs-menu">
      <a-tabs v-model:activeKey="activeKey" hide-add type="editable-card">
        <a-tab-pane v-for="item in state.global.tabsMenuList" :key="item.path">
          <template #tab>
            <MyIcon class="icon" type="icon-dian1"></MyIcon>
            <span @click="navigatorChange($event, item.path)">
              {{ item.title }}
            </span>
          </template>
          <template #closeIcon>
            <CloseOutlined @click="handleRemove($event, item.path)"></CloseOutlined>
          </template>
        </a-tab-pane>
        <template #leftExtra>
          <div class="extra-icon-wrap" @click="scrollPrev">
            <LeftOutlined v-if="showExtra">左边</LeftOutlined>
          </div>
        </template>
        <template #rightExtra>
          <div class="extra-icon-wrap" @click="scrollNext">
            <RightOutlined v-if="showExtra"></RightOutlined>
          </div>
        </template>
      </a-tabs>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import _ from 'lodash';

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
    if (route.meta.isFull) return;
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
      navScroll = document.getElementsByClassName('ant-tabs-nav-wrap') && document.getElementsByClassName('ant-tabs-nav-wrap')[0]?.clientWidth;
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
  const transX = document.defaultView.getComputedStyle(navListDom, null).transform;
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
  background-color: var(--ant-content-bg);
  width: 100%;
  box-sizing: border-box;
  .tabs-menu {
    width: 100%;
    .icon {
      font-size: 16px;
      display: none;
      margin-right: 5px;
      margin-top: 2px;
    }
    .ant-tabs-tab-active {
      .icon {
        display: inline-block;
      }
    }
  }
  .extra-icon-wrap {
    width: 25px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
}
</style>
<style lang="less">
.tabs-box {
  .tabs-menu .ant-tabs-top .ant-tabs-nav {
    margin: 0;
  }
  .ant-tabs-card > .ant-tabs-nav .ant-tabs-tab,
  .ant-tabs-card > div > .ant-tabs-nav .ant-tabs-tab {
    padding: 5px 10px;
  }
  .ant-tabs-tab .anticon.anticon-close {
    margin: 0;
    margin-left: 10px;
    font-size: 12px;
  }
  .ant-tabs > .ant-tabs-nav .ant-tabs-nav-operations,
  .ant-tabs > div > .ant-tabs-nav .ant-tabs-nav-operations {
    display: none;
  }
  .ant-tabs-bottom > .ant-tabs-nav:before,
  .ant-tabs-bottom > div > .ant-tabs-nav:before,
  .ant-tabs-top > .ant-tabs-nav:before,
  .ant-tabs-top > div > .ant-tabs-nav:before {
    border-bottom: 0px solid #f0f0f0;
  }

  .ant-tabs-card.ant-tabs-top > .ant-tabs-nav .ant-tabs-tab-active,
  .ant-tabs-card.ant-tabs-top > div > .ant-tabs-nav .ant-tabs-tab-active {
    border: 1px solid #f0f0f0;
    background-color: var(--ant-primary-color);
    .ant-tabs-tab-remove {
      color: #fff;
    }
  }
  .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
    color: #fff;
  }
  .ant-tabs-tab-remove {
    margin-left: 0;
    padding-left: 0;
  }
  .ant-tabs-tab-btn {
    display: flex;
    align-items: center;
  }
}
</style>
