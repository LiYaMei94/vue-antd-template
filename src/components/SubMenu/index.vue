<template>
  <a-sub-menu :key="menuInfo.key">
    <template #icon>
      <component :is="menuInfo.icon"></component>
    </template>
    <template #title>{{ menuInfo.title }}</template>
    <template v-for="item in menuInfo.children" :key="item.key">
      <template v-if="!item.children">
        <a-menu-item :key="item.key">
          <template #icon>
            <component :is="item.icon"></component>
          </template>
          <template v-if="item.name">
            <router-link :to="{ name: item.name }">{{ item.title }}</router-link>
          </template>
          <template v-else>{{ item.title }}</template>
        </a-menu-item>
      </template>
      <template v-else>
        <CustomSubMenu :menu-info="item" :key="item.key" />
      </template>
    </template>
  </a-sub-menu>
</template>

<script setup>
const props = defineProps({
  menuInfo: {
    type: Object,
    default: {}
  },
  key: {
    type: [Number | String],
    default: null
  }
});
</script>
