<template>
  <!-- :trigger="null" -->
  <a-layout-sider v-model:collapsed="collapsed" :theme="theme" collapsible>
    <div class="logo" />
    <a-menu v-model:selectedKeys="selectedKeys" :theme="theme">
      <template v-for="subItem in menuList" :key="subItem.path">
        <a-sub-menu>
          <template #icon></template>
          <template #title>Navigation One</template>
          <a-menu-item-group key="g1">
            <template #title>Item 1</template>
            <a-menu-item key="1">Option 1</a-menu-item>
            <a-menu-item key="2">Option 2</a-menu-item>
          </a-menu-item-group>
          <a-menu-item-group key="g2" title="Item 2">
            <a-menu-item key="3">Option 3</a-menu-item>
            <a-menu-item key="4">Option 4</a-menu-item>
          </a-menu-item-group>
        </a-sub-menu>
      </template>
    </a-menu>
  </a-layout-sider>
</template>

<script setup>
import { defineProps, ref } from 'vue';
import { LIGHT_THEME } from '@/theme';

const props = defineProps({
  theme: {
    type: String,
    default: LIGHT_THEME
  }
});

const menuList = ref([1, 3, 2]);
const selectedKeys = ref([]);

const collapsed = ref(false);
</script>
