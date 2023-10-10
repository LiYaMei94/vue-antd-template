<template>
  <div class="card-header-title">
    <div class="title">{{ title }}</div>
    <slot></slot>
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
.card-header-title {
  margin-bottom: 10px;
  .title {
    color: var(--private-primary-color);
    position: relative;
    padding-left: 14px;
    box-sizing: border-box;
  }
  .title::before {
    position: absolute;
    top: 50%;
    transform: translatey(-50%);
    left: 0;
    content: '';
    width: 4px;
    height: 18px;
    background-color: var(--private-primary-color);
  }
}
</style>
