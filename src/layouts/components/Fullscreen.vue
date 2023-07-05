<template>
  <div class="full-screen header-tool-right-icon">
    <component
      style="font-size: 20px; color: var(--ant-body-color)"
      :is="isFullscreen ? 'FullscreenExitOutlined' : 'FullscreenOutlined'"
      @click="toggle"
    ></component>
  </div>
</template>

<script setup>
import { useFullscreen } from '@vueuse/core';
const { toggle, isFullscreen } = useFullscreen();
</script>
<style lang="less" scoped></style>
