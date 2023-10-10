<template>
  <div class="message-icon-wrap" @click="handleClick">
    <IconSvg name="message-icon" class="message-icon"></IconSvg>
    <div class="message-number">
      <div class="number">{{ number > 99 ? '···' : number }}</div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue';
const number = ref(101);

const handleClick = () => {
  alert('功能暂未开发');
};
</script>
<style lang="less" scoped>
.message-icon-wrap {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  position: relative;
  cursor: pointer;
  .message-icon {
    width: 24px;
    height: 24px;
  }
  .message-number {
    position: absolute;
    width: 16px;
    height: 16px;
    border-radius: 10px;
    background-color: var(--private-error-color);
    text-align: center;
    line-height: 16px;
    top: -4px;
    right: -4px;
    border: 1px solid #fff;

    .number {
      transform-origin: 50% 50%;
      font-size: 12px;
      transform: scale(calc(8 / 12));
      color: #fff;
      font-size: 8px;
      font-weight: 500;
      white-space: nowrap;
    }
  }
}
</style>
<style lang="less">
#message-icon {
  fill: var(--private-content-bg);
  path:nth-of-type(1) {
    fill: var(--private-second-text-color);
  }
  path:nth-of-type(2) {
    stroke: var(--private-second-text-color);
  }
}
</style>
