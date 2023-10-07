<template>
  <div>首页</div>
  <Upload v-bind="{ multiple: true }"></Upload>
  <div style="background-color: red">
    <IconSvg name="mode-home-icon" fill="#287DFA"></IconSvg>
    <IconSvg name="message-icon" class="message-icon"></IconSvg>

    <IconSvg name="model-1" fill="red"></IconSvg>
    <IconSvg name="model-2" fill="red"></IconSvg>
    <IconSvg name="model-3" fill="red"></IconSvg>
    <IconSvg name="model-4" fill="red"></IconSvg>
    <IconSvg name="model-5" fill="red"></IconSvg>
    <IconSvg name="model-6" class="model-6"></IconSvg>
    <IconSvg name="user-profile"></IconSvg>
  </div>
</template>
<script setup>
import Upload from '@/components/Upload/index.vue';
</script>
<style lang="less">
#model-6 {
  fill: red;
  path:nth-of-type(3) {
    fill: white;
  }
  path:nth-of-type(4) {
    fill: white;
  }
}
#message-icon {
  fill: red;
  path:nth-of-type(1) {
    fill: white;
  }
  path:nth-of-type(2) {
    stroke: white;
  }
}
</style>
