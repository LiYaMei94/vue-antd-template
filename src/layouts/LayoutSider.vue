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
      <template v-for="item in list" :key="item.key">
        <template v-if="!item.children">
          <a-menu-item :key="item.key">
            <template #icon>
              <component :is="item.icon"></component>
            </template>
            <template v-if="item.name">
              <router-link :to="{ name: item.name }">{{ item.title }}</router-link>
            </template>
            <template v-else>{{ item.title }}</template>
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
import { ref, unref } from 'vue';
import { LIGHT_THEME } from '@/theme';
import { useRouter } from 'vue-router';

const { currentRoute } = useRouter();

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

const currentRouteKey = unref(currentRoute).meta?.key;
const openKeys = ref(['1']);
const selectedKeys = ref([currentRouteKey]);
const collapsed = ref(false);

const list = [
  {
    key: '1',
    title: '配置管理',
    icon: 'MailOutlined',
    children: [
      {
        key: '1-1',
        title: '渠道账号',
        icon: 'PieChartOutlined',
        name: 'ChannelList'
      },
      {
        key: '1-2',
        title: '消息模板',
        icon: 'PieChartOutlined',
        name: 'MessageMouldList'
      }
    ]
  }
];

const onOpenChange = (keys) => {
  openKeys.value = props.isShowCurrent ? [keys[keys.length - 1]] : keys;
  selectedKeys.value = [];
};
</script>

<style lang="less" scope></style>
