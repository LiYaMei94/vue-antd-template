<template>
  <a-layout>
    <LayoutSider v-model:theme="state.global.theme"></LayoutSider>
    <a-layout>
      <LayoutHeader v-model:theme="state.global.theme"></LayoutHeader>
      <a-layout-content><router-view /></a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script setup>
import LayoutSider from './LayoutSider';
import LayoutHeader from './LayoutHeader';
import { useStore } from 'vuex';

const { state } = useStore();
</script>
