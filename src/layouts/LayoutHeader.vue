<template>
  <a-layout-header :theme="theme">头部</a-layout-header>
</template>
<script setup>
import { defineProps } from 'vue';
import { LIGHT_THEME } from '@/theme';

const props = defineProps({
  theme: {
    type: String,
    default: LIGHT_THEME
  }
});
</script>
