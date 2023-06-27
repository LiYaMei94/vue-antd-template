<template>
  <a-layout-header :theme="theme" class="header-container">
    <div class="logo">
      <img src="~@/assets/images/logo.svg" />
      <span>消息平台</span>
    </div>
    <div class="header-menu">
      <slot name="headerMenu"></slot>
    </div>
    <div class="header-right-tool">
      <a-space align="center" size="large">
        <Theme></Theme>
        <Fullscreen></Fullscreen>
        <div class="header-tool-right-icon">
          <SyncOutlined style="font-size: 20px; color: var(--ant-header-icon-bg)" @click="handleRefresh" />
        </div>
        <Avatar></Avatar>
      </a-space>
    </div>
  </a-layout-header>
</template>
<script setup>
import { LIGHT_THEME } from '@/theme';
import Avatar from './components/Avatar.vue';
import Fullscreen from './components/Fullscreen.vue';
import Theme from './components/Theme.vue';

const props = defineProps({
  theme: {
    type: String,
    default: LIGHT_THEME
  },
  isUser: {
    type: Boolean,
    default: true
  }
});

const handleRefresh = () => {
  location.reload();
};
</script>
<style lang="less" scoped>
.header-container {
  display: flex;
  align-items: center;
  .logo {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    img {
      margin-right: 10px;
    }
  }
  .header-menu {
    flex: 1;
  }
  .header-right-tool {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 300px;
  }
}
</style>
