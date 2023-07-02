<template>
  <div class="page-header">
    <div class="page-header-left">
      <div>{{ title }}</div>
      <slot name="pageHeaderLeft"></slot>
    </div>
    <div class="page-header-right">
      <slot name="pageHeaderRight"></slot>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    default: '标题'
  }
});
</script>
<style lang="less" scoped>
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--ant-line);
  padding: 15px 20px;
  box-sizing: border-box;
}
</style>
