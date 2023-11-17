<template>
  <a-sub-menu :key="menuInfo.name">
    <template #icon v-if="!isNull(menuInfo.meta?.icon)">
      <component :is="menuInfo.meta?.icon"></component>
    </template>
    <template #title>{{ menuInfo.meta?.title }}</template>
    <template v-for="item in menuInfo.children" :key="item.name">
      <template v-if="!item.children?.length">
        <a-menu-item :key="item.name" @click="handleRouteChange($event, item)">
          <template #icon v-if="!isNull(item.meta?.icon)">
            <IconFont :type="item.meta?.icon" source="anticonfont"></IconFont>
          </template>
          <template v-if="item.path && !isFrame(item?.meta?.isFrame)">
            <router-link :to="{ path: item.path }">{{ item.meta?.title }}</router-link>
          </template>
          <template v-else-if="item.path && isFrame(item?.meta?.isFrame)">
            <a :href="item.path" target="_blank">{{ item.meta?.title }}</a>
          </template>
          <template v-else>{{ item.meta?.title }}</template>
        </a-menu-item>
      </template>
      <template v-else>
        <CustomSubMenu :menu-info="item" :key="item.name" :routeChange="handleRouteChange" />
      </template>
    </template>
  </a-sub-menu>
</template>

<script setup>
import { isNull } from '@/utils/utils/';
import { CONST_STRING_1 } from '@/utils/const';
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

const isFrame = (flag) => {
  return flag === CONST_STRING_1;
};

const handleRouteChange = (event, to) => {
  props.routeChange && props.routeChange(event, to);
};
</script>
