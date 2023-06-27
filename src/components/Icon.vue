<template>
  <IconFont :type="type"></IconFont>
</template>
<script setup>
import { createFromIconfontCN } from '@ant-design/icons-vue';
import Iconfont from '@/assets/iconfonts/iconfont.js';
const props = defineProps({
  type: {
    type: String,
    default: ''
  }
});

const IconFont = createFromIconfontCN({
  scriptUrl: Iconfont
});
</script>
