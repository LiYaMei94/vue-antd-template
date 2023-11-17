<template>
  <div class="list-left-card-container" :style="{ minWidth: !collapsed ? '200px' : '0', maxWidth: !collapsed ? '300px' : '0' }">
    <div class="card-content" v-show="!collapsed"><slot></slot></div>
    <div class="list-left-card-trigger" :style="{ right: !collapsed ? '-17px' : '0' }">
      <div class="list-left-card-trigger-icon" @click="collapsed = !collapsed">
        <component :is="collapsed ? 'RightOutlined' : 'LeftOutlined'"></component>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue';

const collapsed = ref(false);
defineExpose({ listLeftCardCollapsed: collapsed });
</script>
<style lang="less" scoped>
.list-left-card-container {
  position: relative;
  transition: all 0.3s;
  height: 100%;
  .card-content {
    width: 100%;
    height: 100%;
    padding: 20px 16px;
    box-sizing: border-box;
    border-radius: 2px 0px 0px 0px;
    background: var(--private-content-bg);
    border-right: 1px solid var(--private-bg-2);
  }
  .list-left-card-trigger {
    position: absolute;
    bottom: 0;
    .list-left-card-trigger-icon {
      width: 18px;
      height: 56px;
      border-radius: 0px 10px 10px 0px;
      background: rgba(15, 41, 77, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      span {
        color: var(--private-third-text-color);
      }
    }
  }
}
</style>
