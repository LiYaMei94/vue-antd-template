<template>
  <div>
    <a-dropdown :trigger="['click']">
      <div class="header-tool-right-icon">
        <windows-outlined style="font-size: 20px; color: var(--private-primary-text-color)"></windows-outlined>
      </div>
      <template #overlay>
        <a-menu @click="change" v-model:selectedKeys="selectedKeys">
          <template v-for="(item, index) in sizeEnum" :key="item.value">
            <template v-if="true">
              <a-menu-item :key="item.value">
                <a href="javaScript:;">{{ item.label }}</a>
              </a-menu-item>
              <a-menu-divider v-if="index !== sizeEnum.length - 1" />
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

const { dispatch, state } = useStore();
const selectedKeys = ref([state?.global?.antConfig?.componentSize]);

const sizeEnum = [
  {
    label: 'large',
    value: 'large'
  },
  {
    label: 'middle',
    value: 'middle'
  },
  {
    label: 'small',
    value: 'small'
  }
];
const change = ({ item, key, keyPath }) => {
  dispatch('setAntConfig', { ...state?.global?.antConfig, componentSize: key });
  selectedKeys.value = [key];
};
</script>

<style scoped lang="less"></style>
