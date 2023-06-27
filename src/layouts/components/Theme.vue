<template>
  <div class="theme-modal">
    <a-dropdown :trigger="['click']">
      <div class="header-tool-right-icon">
        <MyIcon type="icon-zhuti" style="font-size: 20px; color: var(--ant-header-icon-bg)"></MyIcon>
      </div>
      <template #overlay>
        <a-menu @click="changeTheme">
          <template v-for="(item, index) in theme" :key="item.value">
            <template v-if="true">
              <a-menu-item :key="item.value">
                <a href="javaScript:;">{{ item.label }}</a>
              </a-menu-item>
              <a-menu-divider v-if="index !== theme.length - 1" />
            </template>
          </template>
        </a-menu>
      </template>
    </a-dropdown>
  </div>
</template>

<script setup>
import { useTheme } from '@/hooks/useTheme';
const { changePrimaryColor, setThemeColor, theme } = useTheme();

const changeTheme = ({ item, key, keyPath }) => {
  setThemeColor(key);
};
</script>

<style scoped lang="less"></style>
