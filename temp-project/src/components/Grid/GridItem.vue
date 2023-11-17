<template>
  <div v-show="isShow" :style="style">
    <slot></slot>
  </div>
</template>
<script setup>
import { computed, inject, ref, useAttrs, watch } from 'vue';

const props = defineProps({
  offset: {
    type: Number,
    default: 0
  },
  span: {
    type: Number,
    default: 1
  },
  suffix: {
    type: Boolean,
    default: false
  },
  xs: {
    type: Object,
    default: {}
  },
  sm: {
    type: Object,
    default: {}
  },
  md: {
    type: Object,
    default: {}
  },
  lg: {
    type: Object,
    default: {}
  },
  xl: {
    type: Object,
    default: {}
  }
});

const attrs = useAttrs();
const isShow = ref(true);
// 注入响应式断点
const breakPoint = inject('breakPoint', ref('xl'));
// 要开始折叠的index
const shouldHiddenIndex = inject('shouldHiddenIndex', ref(-1));
watch(
  () => [shouldHiddenIndex.value, breakPoint.value],
  (n) => {
    if (!!attrs.index) {
      isShow.value = !(n[0] !== -1 && parseInt(attrs.index) >= Number(n[0]));
    }
  },
  { immediate: true }
);

const gap = inject('gap', 0);
const cols = inject('cols', ref(4));
const style = computed(() => {
  let span = props[breakPoint.value]?.span || props.span;
  let offset = props[breakPoint.value]?.offset || props.offset;
  if (props.suffix) {
    return {
      gridColumnStart: cols.value - span - offset + 1,
      gridColumnEnd: `span ${span + offset}`,
      marginLeft: offset !== 0 ? `calc(((100% + ${gap}px) / ${span + offset}) * ${offset})` : 'unset'
    };
  } else {
    return {
      // gridColumn属性是grid-column-start和grid-column-end的合并简写形式
      gridColumn: `span ${span + offset > cols.value ? cols.value : span + offset}/span ${span + offset > cols.value ? cols.value : span + offset}`,
      marginLeft: offset !== 0 ? `calc(((100% + ${gap}px) / ${span + offset}) * ${offset})` : 'unset'
    };
  }
});
</script>
