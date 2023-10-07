<template>
  <a-layout-header :theme="theme" class="header-container">
    <div class="header-model">
      <IconSvg
        name="mode-home-icon"
        class="mode-home-icon"
        @click.self="handleOpenModule"
        :fill="visible ? 'var(--private-primary-color-hover)' : ''"
      ></IconSvg>
    </div>
    <div class="logo">
      <img src="~@/assets/images/logo.png" />
      <span>EPCM工程管理平台</span>
    </div>
    <div class="header-menu">
      <slot name="headerMenu"></slot>
    </div>
    <div class="header-right-tool">
      <Message class="margin-r-28"></Message>
      <Avatar></Avatar>
      <!-- <a-space align="center" size="large">
        <PageDensity></PageDensity>
        <Theme></Theme>
        <Fullscreen></Fullscreen>
        <div class="header-tool-right-icon">
          <SyncOutlined style="font-size: 20px; color: var(--private-primary-text-color)" @click="handleRefresh" />
        </div>
      </a-space> -->
    </div>
  </a-layout-header>
  <ModuleModal v-bind="{ visible, close }"></ModuleModal>
</template>
<script setup>
import { LIGHT_THEME } from '@/config/theme';
import Avatar from './components/Avatar';
import Fullscreen from './components/Fullscreen';
import Theme from './components/Theme';
import PageDensity from './components/PageDensity';
import ModuleModal from './components/module';
import Message from './components/Message';
import { ref } from 'vue';

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

const visible = ref(false);

const handleRefresh = () => {
  location.reload();
};

const handleOpenModule = () => {
  visible.value = visible.value ? false : true;
};

const close = () => {
  visible.value = false;
};
</script>
<style lang="less" scoped>
.header-container {
  display: flex;
  align-items: center;
  .header-model {
    display: flex;
    align-items: center;
    .mode-home-icon {
      width: 32px;
      height: 32px;
      cursor: pointer;
    }
    .mode-home-icon:hover {
      fill: var(--ant-primary-color);
    }
    .mode-home-icon:active {
      fill: var(--ant-primary-color);
    }
  }
  .logo {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    margin: 0 16px;
    font-size: 20px;
    font-weight: 500;
    img {
      margin-right: 10px;
      width: 27.36px;
      height: auto;
    }
  }
  .header-menu {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .header-right-tool {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-left: 64px;
  }
}
</style>
