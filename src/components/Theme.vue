<template>
  <div class="hello">
    <div class="primary-class">测试自定义组件主题颜色</div>
    <div class="theme-class">测试自定义组件跟随主题切换颜色</div>
    <a-button type="primary" @click="changePrimaryColor('blue')">主题颜色-蓝色</a-button>
    <a-button type="primary" @click="changePrimaryColor('red')">主题颜色-红色</a-button>
    <a-button type="primary" @click="setThemeColor('light')">light模式</a-button>
    <a-button type="primary" @click="setThemeColor('dark')">dark主题</a-button>

    <a-menu id="dddddd" v-model:selectedKeys="selectedKeys" style="width: 256px" mode="inline">
      <a-sub-menu key="sub1">
        <template #title>Navigation One</template>
        <a-menu-item-group key="g1">
          <template #title>Item 1</template>
          <a-menu-item key="1">Option 1</a-menu-item>
          <a-menu-item key="2">Option 2</a-menu-item>
        </a-menu-item-group>
        <a-menu-item-group key="g2" title="Item 2">
          <a-menu-item key="3">Option 3</a-menu-item>
          <a-menu-item key="4">Option 4</a-menu-item>
        </a-menu-item-group>
      </a-sub-menu>
      <a-sub-menu key="sub2">
        <template #title>Navigation Two</template>
        <a-menu-item key="5">Option 5</a-menu-item>
        <a-menu-item key="6">Option 6</a-menu-item>
        <a-sub-menu key="sub3" title="a-sub-menu">
          <a-menu-item key="7">Option 7</a-menu-item>
          <a-menu-item key="8">Option 8</a-menu-item>
        </a-sub-menu>
      </a-sub-menu>
      <a-sub-menu key="sub4">
        <template #title>Navigation Three</template>
        <a-menu-item key="9">Option 9</a-menu-item>
        <a-menu-item key="10">Option 10</a-menu-item>
        <a-menu-item key="11">Option 11</a-menu-item>
        <a-menu-item key="12">Option 12</a-menu-item>
      </a-sub-menu>
    </a-menu>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useTheme } from '@/hooks/useTheme';
const { changePrimaryColor, setThemeColor } = useTheme();
const selectedKeys = ref(['1']);
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.primary-class {
  color: var(--ant-primary-color);
  width: 100px;
  height: @height100;
  background-color: blueviolet;
}
</style>
