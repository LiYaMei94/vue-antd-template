<template>
  <IconFont :type="type" v-if="source === 'iconfont'" v-bind="$attrs"></IconFont>
  <component :is="type" v-else v-bind="$attrs"></component>
</template>
<script setup>
import Icon, { createFromIconfontCN } from '@ant-design/icons-vue';
import Iconfont from '@/assets/iconfonts/iconfont.js';

const props = defineProps({
  type: {
    type: String,
    default: ''
  },
  source: {
    type: String,
    default: 'iconfont' // 可选值：iconfont/anticonfont
  }
});

const IconFont = createFromIconfontCN({
  scriptUrl: Iconfont
});
</script>
