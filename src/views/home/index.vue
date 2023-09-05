<template>
  <div>首页</div>
  <Upload v-bind="{ multiple: true }"></Upload>
</template>
<script setup>
import Upload from '@/components/Upload/index.vue';
</script>
