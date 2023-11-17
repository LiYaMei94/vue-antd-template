<template>
  <a-drawer v-bind="$attrs" :closable="false">
    <slot></slot>
    <template #extra>
      <IconSvg @click="onCancel" name="close" style="width: 20px; height: 20px; fill: var(--private-first-text-color); cursor: pointer"></IconSvg>
    </template>
    <template #footer>
      <div class="ant-drawer-footer-custom" v-if="customFooterSlot">
        <a-button type="primary" class="drawer-cancel-button" @click="onCancel">{{ cancelText || (!isDetail ? '取消' : '关闭') }}</a-button>
        <a-button v-if="!isDetail" class="margin-left-16" type="primary" @click="onOk">{{ okText }}</a-button>
      </div>
      <slot name="footer" v-else></slot>
    </template>
  </a-drawer>
</template>

<script setup>
import { useSlots, watch, onMounted } from 'vue';
const props = defineProps({
  isDetail: {
    type: Boolean,
    default: false
  },
  cancelText: {
    type: String,
    default: ''
  },
  okText: {
    type: String,
    default: '确定'
  },
  onCancel: {
    type: Function,
    default: null
  },
  onOk: {
    type: Function,
    default: null
  }
});

const customFooterSlot = !useSlots()?.footer;
</script>
