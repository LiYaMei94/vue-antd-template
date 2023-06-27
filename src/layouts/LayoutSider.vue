<template>
  <a-layout-sider v-model:collapsed="collapsed" :theme="theme" collapsible>
    <template #trigger>
      <component :is="collapsed ? 'MenuUnfoldOutlined' : 'MenuFoldOutlined'"></component>
    </template>

    <a-menu :theme="theme" triggerSubMenuAction="click" mode="inline">
      <template v-for="item in list" :key="item.key">
        <template v-if="!item.children">
          <a-menu-item :key="item.key">
            <template #icon>
              <component :is="item.icon"></component>
            </template>
            {{ item.title }}
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
import { ref } from 'vue';
import { LIGHT_THEME } from '@/theme';

const props = defineProps({
  theme: {
    type: String,
    default: LIGHT_THEME
  }
});

const selectedKeys = ref([]);
const collapsed = ref(false);

// TODO:权限
const list = [
  {
    key: '1',
    title: 'Option 1',
    icon: 'MailOutlined'
  },
  {
    key: '2',
    title: 'Navigation 2',
    icon: 'PieChartOutlined',
    children: [
      {
        key: '2.1',
        title: 'Navigation 3',
        icon: 'SettingOutlined',
        children: [{ key: '2.1.1', title: 'Option 2.1.1' }]
      }
    ]
  }
];
</script>

<style lang="less" scope></style>
