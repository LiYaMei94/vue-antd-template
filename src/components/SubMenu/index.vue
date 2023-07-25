<template>
  <a-sub-menu :key="menuInfo.key">
    <template #icon>
      <component :is="menuInfo.meta?.icon"></component>
    </template>
    <template #title>{{ menuInfo.meta?.title }}</template>
    <template v-for="item in menuInfo.children" :key="item.key">
      <template v-if="!item.children?.length">
        <a-menu-item :key="item.key" v-if="!item?.meta?.isHide" @click="routeChange($event, item)">
          <template #icon>
            <component :is="item.meta?.icon"></component>
          </template>
          <template v-if="item.path && !item?.meta?.isLink">
            <router-link :to="{ path: item.path }">{{ item.meta?.title }}</router-link>
          </template>
          <template v-else-if="item.path && item?.meta?.isLink">
            <a :href="item.path" target="_blank">{{ item.meta?.title }}</a>
          </template>
          <template v-else>{{ item.meta?.title }}</template>
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
  },
  routeChange: {
    type: Function,
    default: null
  }
});
</script>
