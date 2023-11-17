<template>
  <div class="custom-form-item-error">
    <div class="error-border" :style="{ borderColor: isError ? 'var(--ant-error-color)' : 'transparent' }">
      <slot></slot>
    </div>
    <div class="error-text" v-if="isError">{{ errorTip }}</div>
  </div>
</template>
<script setup>
const props = defineProps({
  errorTip: {
    type: String,
    default: ''
  },
  isError: {
    type: Boolean,
    default: false
  }
});
</script>
<style lang="less" scoped>
.custom-form-item-error {
  .error-border {
    border: 1px solid transparent;
  }
  .error-text {
    color: var(--ant-error-color);
  }
}
</style>
