<template>
  <div class="theme-modal">
    <a-dropdown :trigger="['click']">
      <div class="header-tool-right-icon">
        <IconFont type="icon-zhuti" style="font-size: 20px; color: var(--private-first-text-color)"></IconFont>
      </div>
      <template #overlay>
        <a-menu @click="changeTheme" v-model:selectedKeys="selectedKeys">
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
import { useStore } from 'vuex';
import { ref } from 'vue';

const { changePrimaryColor, setThemeColor, theme } = useTheme();
const { dispatch, state } = useStore();
const selectedKeys = ref([state?.global?.theme]);

const changeTheme = ({ item, key, keyPath }) => {
  setThemeColor(key);
  selectedKeys.value = [key];
};
</script>

<style scoped lang="less"></style>
